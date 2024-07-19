import { LocationsDurationCall } from "@/api-calls"

const getTime = async (time: string) => {
    let hours = Number(time.split(':')[0])
    let minutes
    if(time.split(':')[1].search('AM') ==-1 && time.split(':')[1].search('PM') ==-1)
    {
        minutes = Number(time.split(':')[1])
    }
    else
    {
        if(time.split(':')[1].search('PM') !== -1 && hours != 12)
        {
            hours += 12
        }
        else if(time.split(':')[1].search('AM') !== -1 && hours == 12)
        {
            hours = 0
        }
        minutes = Number(time.split(':')[1].substr(0,2))
    }

    let suggestedLastTime = await new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), hours, minutes)
    
    return suggestedLastTime
}

const calculateDuration = async (times: any, i: number, duration: string) => {
    // let _time = times[i].time.replace(' – ', ' - ')
    let _currentStartTime;
    let _ActualEndTime;
    let _currentEndTime;

    if(times[i].time.search('Open') == -1) // if limited time not Open for 24 hours
    {
        _currentStartTime = times[i].time.replace(' – ', ' - ').split(' - ')[0]
        _currentStartTime = await getTime(_currentStartTime)

        _ActualEndTime = times[i].time.replace(' – ', ' - ').split(' - ')[1]
        _ActualEndTime = await getTime(_ActualEndTime)

        _currentEndTime = times[i].time.replace(' – ', ' - ').split(' - ')[0]
        _currentEndTime = await getTime(_currentEndTime)
        _currentEndTime.setHours(_currentEndTime.getHours() + 2)
    }
    else // if time Open for 24 hours
    {
        _currentStartTime = times[i-1].suggestedTime?.endTime
        _currentStartTime = await getTime(_currentStartTime)

        console.log('_currentStartTime', _currentStartTime)

        _ActualEndTime = new Date(_currentStartTime)
        _ActualEndTime.setHours(_ActualEndTime.getHours() + 2)
        console.log('_ActualEndTime', _ActualEndTime)

        _currentEndTime = new Date(_ActualEndTime)
        console.log('_currentEndTime', _currentEndTime)
    }

    let _prevEndTime: any = times[i-1].suggestedTime?.endTime

    if(!_prevEndTime)
    {
        return {
            startTime: `${_currentStartTime.getHours()}:${_currentStartTime.getMinutes()}`,
            endTime: `${_currentEndTime.getHours()}:${_currentEndTime.getMinutes()}`,
        }
    }

    _prevEndTime = await getTime(_prevEndTime)

    if(duration.search('days') !== -1)
    {
        _prevEndTime.setDate(_prevEndTime.getDate() + Number(duration.substring(0,2)))
    }
    else if(duration.search('hours') !== -1)
    {
        _prevEndTime.setHours(_prevEndTime.getHours() + Number(duration.substring(0,2)))
    }
    else if(duration.search('min') !== -1)
    {
        _prevEndTime.setMinutes(_prevEndTime.getMinutes() + Number(duration.substring(0,2)))
    }

    let suggestedStartTime = _currentStartTime
    let blockedStartTime = await getTime('07:00 AM')
    let blockedEndTime = await getTime('10:00 PM')
    if(_prevEndTime.getTime() >= _currentStartTime.getTime() && _prevEndTime.getTime() < _ActualEndTime.getTime())
    {
        suggestedStartTime = _prevEndTime
    }
    let startTime = `${suggestedStartTime.getHours()}:${suggestedStartTime.getMinutes()}`    

    // set end time as after 2 hours of start time
    let suggestedLastTime: any = suggestedStartTime
    suggestedLastTime.setHours(suggestedLastTime.getHours() + 2)

    if(suggestedLastTime.getTime() < suggestedStartTime.getTime() || suggestedLastTime.getTime() > _ActualEndTime.getTime())
    {
        suggestedLastTime = _ActualEndTime
    }

    if(suggestedLastTime.getTime() > blockedEndTime.getTime() || suggestedLastTime.getTime() < blockedStartTime.getTime())
    {
        suggestedLastTime = blockedEndTime
    }

    let endTime = `${suggestedLastTime.getHours()}:${suggestedLastTime.getMinutes()}`

    return {
        startTime: startTime,
        endTime: endTime,
    }
}

const _calculateStartAndEndTime = async (times: any, i: number) => {

    let _currentStartTime: any = times[i].time.replace(' – ', ' - ').split(' - ')[0]
    
    // when found open for 24 hours in first location then return static time
    if(_currentStartTime.search('Open') !== -1 && i == 0)
    {
        return {
            startTime: '7:00',
            endTime: '9:00',
        }
    }

    if(i == 0)
    {
        _currentStartTime = await getTime(_currentStartTime)
        let _currentEndTime: any = times[i].time.replace(' – ', ' - ').split(' - ')[0]
        _currentEndTime = await getTime(_currentEndTime)
        _currentEndTime.setHours(_currentEndTime.getHours() + 2)

        return {
            startTime: `${_currentStartTime.getHours()}:${_currentStartTime.getMinutes()}`,
            endTime: `${_currentEndTime.getHours()}:${_currentEndTime.getMinutes()}`,
        }
    }

    let origin = null
    let destination = null

    origin = times[i - 1].location?.place_id ? times[i - 1].location?.formatted_address : times[i - 1].location.address_obj.address_string
    destination = times[i].location?.place_id ? times[i].location?.formatted_address : times[i].location?.address_obj.address_string

    let duration = await LocationsDurationCall(origin, destination)

    let _durationTime = ""
    if(duration.status == 200 && duration.data.rows[0]?.elements[0]?.duration?.text)
    {
        _durationTime = duration.data.rows[0].elements[0].duration.text
    }

    let returnData = await calculateDuration(times, i, _durationTime)
    return {...returnData, duration_time: _durationTime}

}

export { _calculateStartAndEndTime }