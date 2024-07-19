import { LocationsDurationCall } from "@/api-calls"
import { APP_MODE } from "@/config/constant";

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}
  
function deg2rad(deg: number) {
    return deg * (Math.PI/180)
}

const getLocationsByTime = async (selectedLocations: any[], index: number, locations: any[], dayIndex: number) => {

    let duration: any
    let _durationTime;
    let startTime;
    let endTime;

    let findLocationIndex = await locations.findIndex(loc => {
        let opening_hours = loc.current_opening_hours ? loc.current_opening_hours : loc.opening_hours
        if(index == 0)
        {
            return Number(opening_hours.periods[dayIndex]?.open?.time) > 700 && loc.types.includes('restaurant') && loc.placed == undefined
        }
        else
        {
            let prevStartTime = Number(selectedLocations[index - 1].suggestedTime.endTime)

            // forexample: location time (9:00 AM) < = suggested time (11:00 AM) and location time (9:00 PM) > = suggested time (11:00 AM)
            let returnConditon = Number(opening_hours.periods[dayIndex]?.open?.time) <= prevStartTime && Number(opening_hours.periods[dayIndex]?.close?.time) >= prevStartTime && loc.placed == undefined
            if(index == 4)
            {
                returnConditon = returnConditon && loc.types.includes('restaurant')
            }
            return returnConditon
        }
    })

    if (findLocationIndex == -1)
    {
        // remove already placed field from locations if no location filtered within time
        locations = await locations.map(loc => {
            delete loc.placed
            return loc
        })

        // filter again location after remove placed field
        findLocationIndex = await locations.findIndex(loc => {
            let opening_hours = loc.current_opening_hours ? loc.current_opening_hours : loc.opening_hours
            if(index == 0)
            {
                return Number(opening_hours.periods[dayIndex]?.open?.time) > 700 && loc.placed == undefined
            }
            else
            {
                let prevStartTime = Number(selectedLocations[index - 1].suggestedTime.endTime)
    
                // forexample: location time (9:00 AM) < = suggested time (11:00 AM) and location time (9:00 PM) > = suggested time (11:00 AM)
                return Number(opening_hours.periods[dayIndex]?.open?.time) <= prevStartTime && Number(opening_hours.periods[dayIndex]?.close?.time) >= prevStartTime && loc.placed == undefined
            }
        })
    }

    if (findLocationIndex == -1)
    {
        return null
    }

    if(index > 0)
    {
        if(APP_MODE == "Test")
        {
            // console.log('prev', selectedLocations[index- 1].location)
            // console.log('current', locations[findLocationIndex])
            
            let prevLatLng = selectedLocations[index- 1].location?.geometry.location
            let latLng = locations[findLocationIndex]?.geometry.location

            _durationTime = await getDistanceFromLatLonInKm(prevLatLng.lat, prevLatLng.lng, latLng.lat, latLng.lng)
        }
        else
        {
            let origin = selectedLocations[index - 1].location?.place_id ? selectedLocations[index- 1].location?.formatted_address : selectedLocations[index - 1].location.address_obj.address_string
            let destination = locations[findLocationIndex]?.place_id ? locations[findLocationIndex]?.formatted_address : locations[findLocationIndex]?.address_obj.address_string

            duration = await LocationsDurationCall(origin, destination)

            if(duration.status == 200 && duration.data.rows[0]?.elements[0]?.duration?.text)
            {
                _durationTime = duration.data.rows[0].elements[0].duration.text
            }
        }
        startTime = selectedLocations[index - 1].suggestedTime.endTime
        startTime = Number(startTime)
        endTime = startTime + 200
    }
    else
    {
        startTime = locations[findLocationIndex].current_opening_hours.periods[dayIndex].open.time
        startTime = Number(startTime)
        endTime = startTime + 200
    }

    locations[findLocationIndex] = {...locations[findLocationIndex], placed : true}

    return {
        findLocationIndex,
        startTime,
        endTime,
        durationTime: _durationTime ?? null
    }
}

const timeLoopFunc = async (i:number, foundedLocations: any[]) => {

    let _locations: any[] = []
    for(let j = 0; j < 5; j++)
    {
        let result = await getLocationsByTime(_locations, j, foundedLocations, i)

        if (result == null)
        {
            break;
        }

        let startTime = result.startTime.toString()
        let endTime = result.endTime.toString()

        _locations.push({
            location: foundedLocations[result.findLocationIndex],
            time: `${startTime.substring(0,(startTime.length - 2))}:${startTime.substring((startTime.length - 2), startTime.length)} - ${endTime.substring(0,(endTime.length - 2))}:${endTime.substring((endTime.length - 2),endTime.length)}`,
            suggestedTime: {
                startTime: result.startTime,
                endTime: result.endTime,
                duration_time : result.durationTime
            }
        })
    }

    return _locations

}

const filterDays = async (days: any, locations: any[]) => {
    let _days = days

    console.log('locations', locations)
    
    for (let i = 0; i < _days.length; i++) {

        // filter: only fetch open locations from 7:00 AM to 11:00 PM
        // let foundedLocations = await locations.filter((loc: any) => {
        //     let opening_hours = loc.current_opening_hours ? loc.current_opening_hours : loc.opening_hours
        //     return opening_hours.weekday_text[i].search(":") !== -1 && opening_hours.weekday_text[i].split(': ')[1].toLowerCase().search('closed') == -1 && Number(opening_hours.periods[i]?.open?.time) > 700 && Number(opening_hours.periods[i]?.close?.time) < 2300
        // })

        let time_loop: any[] = await timeLoopFunc(i, locations)

        _days[i] = {..._days[i], times: time_loop}
        
    }

    return _days
}

export {
    filterDays
}