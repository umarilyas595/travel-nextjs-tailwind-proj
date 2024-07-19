import React, { useEffect, useState } from 'react'
import DemiData from "@/api/DemiData";
import PricingCard from "../pricingCard";
import location_testing from "./test.json"
import SmallStory from '@/components/Story/SmallStory';
import { VariationType } from '@/interfaces/product';
import ProductHorizontalSlide from '@/components/Products/ProductHorizontalSlide';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import styles from "./pricing-cards.module.css"
import { setItineraryDays } from '@/redux/reducers/itinerarySlice';
import { IDays } from '@/interfaces';
import { _calculateStartAndEndTime } from './functions';
import Card_skelton from '@/components/UIComponents/card_skelton';
import Spinloader from '@/components/step-loader/spin-loader';
import RightSideMap from '../right-side-map/right-side-map';
import { setItem } from '@/redux/reducers/PlacedetailSlice';
import { LocationsCall } from '@/api-calls';
import { APP_MODE } from '@/config/constant';
import { filterDays } from './days-functions';

interface IPricingCards {
    params_list?: any
    locationDetails: any
    totalOpeningHours?: number | null
    automateLocation?: any
    v_type?: VariationType
}

const PricingCards = ({params_list, locationDetails, automateLocation}: IPricingCards) => {

    const [LocationDetails, setLocationDetails] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [restaurants, setRestaurants] = useState<any[]>([])
    const { locationsState } = useAppSelector((state) => state.locationReducer)
    const { restaurantsState }:any = useAppSelector((state) => state.restaurantsReducer)
    const { itineraryDays, itineraryLoading } = useAppSelector((state) => state.itineraryReducer)
    const { surveySlice } = useAppSelector((state) => state.surveyReducer)

    const daysLength = Number(params_list.days_length) ?? 7

    const dispatch = useAppDispatch()
    const [days, setDays] = useState<any[]>([
        {
            day: "Monday",
            times: []
        },
        {
            day: "Tuesday",
            times: []
        },
        {
            day: "Wednesday",
            times: []
        },
        {
            day: "Thursday",
            times: []
        },
        {
            day: "Friday",
            times: []
        },
        {
            day: "Saturday",
            times: []
        },
        {
            day: "Sunday",
            times: []
        }
    ])

    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

    useEffect(() => {

        const _defDays = async () => {
            // let _days = []

            // for (let i = 0; i < days.length; i++) {
            //     _days.push({...days[i]})
            //     if(_days[i].times.length > 0)
            //     {
            //         for (let j = 0; j < _days[i].times.length; j++) {
            //             _days[i].times = [..._days[i].times]
                        
            //             let _times = [..._days[i].times]
            //             // console.log('_times', _times)
            //             if(_days[i].times[j].location)
            //             {
            //                 let suggestedTime = await _calculateStartAndEndTime(_times, j)
                        
            //                 _days[i].times[j] = {..._times[j], suggestedTime: suggestedTime}
            //             }

            //         }
            //     }
            // }
            console.log('days', days)
            dispatch(setItineraryDays( [...days.filter((_day: any) => _day.times.length > 0)] ))
        }
        _defDays()

    }, [days])

    useEffect(() => {

        const timeLoopFunc = async (i:number) => {
            let start = i * 5
            let end = start + 5
            let result: any[] = []
            
            let _LocationDetails = await LocationDetails.filter((loc: any) => loc.current_opening_hours.weekday_text[i].search(":") !== -1 && loc.current_opening_hours.weekday_text[i].split(': ')[1].toLowerCase().search('closed') == -1)

            if(_LocationDetails.length <= start)
            {
                return result
            }
            
            result = await _LocationDetails?.slice(start, end).map((loc: any) => {
                if (loc.place_id && loc.place_id != "")
                {
                    return loc.current_opening_hours?.weekday_text[i].split(': ')[1]
                } 
                else
                {
                    return loc.hours?.weekday_text.filter((_weekd: any) => _weekd.split(': ')[1].toLowerCase().search('closed') == -1 ).map((weekd: any) => weekd.split(': ')[1])
                }
            })

            let time = result.map (tim => { return {time: tim, location: null} })
            return time
        }

        const storePlace = async (_days: any[], dayIndex: number, timeIndex: number, _LocationDetails: any[], sameTimeLocations: any[]) => {
            let _LocationIndex = await _LocationDetails.findIndex((loc: any) => loc.name === sameTimeLocations[0].name)
            _LocationDetails[_LocationIndex] = {..._LocationDetails[_LocationIndex], placed: true}
            _days[dayIndex].times[timeIndex].location = _LocationDetails[_LocationIndex]

            console.log('location used', _LocationDetails[_LocationIndex])

            return _days
        }

        const filterLocationByTime = async (_days: any[], dayIndex: number, timeIndex: number, locationDetails: any[]) => {

            let sameTimeLocations = await locationDetails.filter( (loc: any) => loc.placed != true && loc.current_opening_hours?.weekday_text[dayIndex]?.trim().toLowerCase().search('closed') == -1 )

            return storePlace(_days, dayIndex, timeIndex, locationDetails, sameTimeLocations)

            // return await locationDetails.filter((loc: any) => {
            //     return (loc.place_id && loc.place_id != "") ? 
            //         loc.current_opening_hours?.weekday_text.filter((weekd: any) => {
            //             return weekd.split(': ')[1] == time}
            //         ) :
            //         loc.hours?.weekday_text.filter((weekd: any) => weekd.split(': ')[1] == time)
            // })
        }

        const timeLocaitonLoopFunc = async (_days: any[], index: number) => {
            let time: any[] = []
            let _LocationDetails = LocationDetails

            for (let i = 0; i < _days[index].times.length; i++) {
                
                if(i == 0 && restaurants.length > 0) // display restaurant in start of day which restaurant open in current day
                {
                    let _randNum = Math.floor(Math.random() * 9)
                    let foundRestaurant = restaurants.filter((loc: any) => {
                        return (loc.place_id && loc.place_id != "") ? 
                            loc.current_opening_hours?.weekday_text[index].split(': ')[1] !== 'Closed' :
                            loc.hours?.weekday_text[0].split(': ')[1] !== 'Closed'
                    })[_randNum < restaurants.length ? _randNum : 0]
                    
                    if(foundRestaurant)
                    {
                        _days[index].times[i].location = foundRestaurant
                        continue;
                    }
                }

                // when restaurant available in priority
                let restaurantInPriority = await surveySlice?.priority ? surveySlice?.priority.find((p: any) => p.opt === "Restaurants") : null
                if(i == 2 && restaurantInPriority && restaurants.length > 0) // display restaurant in between of day which restaurant open in monday
                {
                    let _randNum = Math.floor(Math.random() * 10)
                    let foundRestaurant = restaurants.filter((loc: any) => {
                        return (loc.place_id && loc.place_id != "") ? 
                            loc.current_opening_hours?.weekday_text[index].split(': ')[1] !== 'Closed' :
                            loc.hours?.weekday_text[0].split(': ')[1] !== 'Closed'
                    })[_randNum < restaurants.length ? _randNum : 4]
                    
                    if(foundRestaurant)
                    {
                        _days[index].times[i].location = foundRestaurant
                        continue;
                    }
                }

                if(i == _days[index].times.length-1  && restaurants.length > 0) // display restaurant in end of day which restaurant open in monday
                {
                    let _randNum = Math.floor(Math.random() * 5)
                    let foundRestaurant = restaurants.filter((loc: any) => {
                        return (loc.place_id && loc.place_id != "") ? 
                            loc.current_opening_hours?.weekday_text[0].split(': ')[1] !== 'Closed' :
                            loc.hours?.weekday_text[0].split(': ')[1] !== 'Closed'
                    })[_randNum < restaurants.length ? _randNum : 2]

                    if(foundRestaurant)
                    {
                        _days[index].times[i].location = foundRestaurant
                        continue;
                    }
                }

                // found same day locations
                let found = false
                for (let j = 0; j <=_LocationDetails.length; j++)
                {
                    if(_LocationDetails[j].placed != true && _LocationDetails[j].current_opening_hours?.weekday_text[index]?.trim().toLowerCase().search('closed') == -1)
                    {
                        found = true
                        _LocationDetails[j] = {..._LocationDetails[j], placed: true}
                        _days[index].times[i].location = _LocationDetails[j]

                        break
                    }
                }

                // let sameTimeLocations = await filterLocationByTime(_days, index, i, _LocationDetails)

                // if(sameTimeLocations.length > 0)
                // {
                //     console.log('sameTimeLocations', sameTimeLocations)
                //     let _LocationIndex = await _LocationDetails.findIndex((loc: any) => loc.name === sameTimeLocations[0].name)
                //     _LocationDetails[_LocationIndex] = {..._LocationDetails[_LocationIndex], placed: true}
                //     _days[index].times[i].location = _LocationDetails[_LocationIndex]
                // }

                // let availableLocation = false
                // // loop upto current loop days
                
                // for(let m = 0; m < sameTimeLocations.length; m++)
                // {
                //     let found = false;

                //     // check if exist then make "found" variable true
                //     for(let j = 0; j <= index; j++)
                //     {
                //         for(let k = 0; k < _days[j].times.length; k++)
                //         {
                //             if(_days[j].times[k]?.location?.name == sameTimeLocations[m].name)
                //             {
                //                 found = true
                //                 break
                //             }
                //         }

                //         if(found === true)
                //         {
                //             break
                //         }
                //     }

                //     // if location not found then add in current time slot i.e. if "found" variable is false
                //     if(found === false)
                //     {
                //         _days[index].times[i].location = sameTimeLocations[m]
                        
                //         availableLocation = true
                //         break
                //     }
                // }

                // if(availableLocation == false)
                // {
                //     _days[index].times[i].location = sameTimeLocations[random(0, sameTimeLocations.length-1)]
                // }

            }
            return time
        }

        let _localDays: any[] = []
        let startIndex = params_list.start_day_index
        let _daysLength = (daysLength > 0 && daysLength < 8) ? daysLength : days.length

        for (let index = 0; index < _daysLength; index++) {
            if(daysLength !== 0 && daysLength < 7)
            {
                let dayIndex = ((Number(startIndex)-1)+index) % 7
                
                _localDays.push({...days[dayIndex]})
            }
            else
            {
                _localDays.push({...days[index]})
            }
        }

        const _loadDays = async () => {
            // let _days = _localDays

            // for (let i = 0; i < _days.length; i++) {
                
            //     let time_loop: any[] = await timeLoopFunc(i)

            //     _days[i] = {..._days[i], times: time_loop}

            //     await timeLocaitonLoopFunc(_days, i)
            
            // }
            // setDays([..._days])
            
            let _days = await filterDays(_localDays, LocationDetails)
            setDays([..._days])

            setLoading(false)
        }
        
        if(LocationDetails.length > 0) {
            _loadDays()
        }

    }, [LocationDetails])

    const _loadLocations = async () => {
        let locations: any = []
        for (let i = 0; i < days.length; i++) {
            
            let filter_locaiton: any[] = await locationDetails.filter((loc: any) => 
                loc.current_opening_hours?.weekday_text || loc?.hours?.weekday_text ?
                (typeof loc?.place_id !== undefined && loc?.place_id && loc?.place_id != "") ? 
                loc.current_opening_hours?.weekday_text.filter( (weekd: any) => {
                    return weekd.split(': ')[0] == days[i].day && weekd.toLowerCase().search('closed') == -1
                }) : loc?.hours?.weekday_text.filter( (weekd: any) => {
                    return weekd.split(': ')[0] == days[i].day && weekd.toLowerCase().search('closed') == -1
                }) : false
            )

            locations.push(filter_locaiton)
        }
        locations = [].concat(...locations)
        locations = [...new Set(locations)];
        console.log('filter_locaiton', locations)
        setLocationDetails([...locations])
    }

    useEffect(() => {
        
        if(APP_MODE == "Production")
        {
            _loadLocations()
        }
        else
        {
            setLocationDetails([...locationDetails])
        }
        
    }, [locationDetails])

    // useEffect(() => {
    //     const _defRestaurants = async () => {
    //         let address = params_list.address.replace(/\b[a-zA-Z]*\d+(?:-\d+)?, \b/g, '')
    //         address = address.split(', ')
    //         let _restaurants = await LocationsCall(`restaurants in ${address.length > 2 ? `${address[address.length - 2]}, ${address[address.length - 1]}` : params_list.address}`)
    //         setRestaurants(_restaurants)
    //     }

    //     if(locationDetails && APP_MODE == "Production")
    //     {
    //         _defRestaurants()
    //     }

    // }, [locationDetails])
    

    // useEffect(() => {
        
    //     if(automateLocation || (itineraryDays.length > 0 && itineraryDays[0].times && itineraryDays[0].times.length > 0))
    //     {
    //         dispatch(setItem(automateLocation ? {...automateLocation} : {...itineraryDays[0].times[0].location}))
    //     }
    
    // }, [automateLocation, itineraryDays])

    return (
        <>
        {
            (itineraryLoading || itineraryDays.length == 0) && <Spinloader />
        }
        {
            (itineraryLoading || itineraryDays.length == 0) ? 
                <Card_skelton /> : (
                (params_list.v_type === '1' || params_list.v_type === '') && itineraryDays && itineraryDays.length > 4) ? (
                    <>
                    {
                        (!loading && itineraryDays) &&
                        itineraryDays.map((_item, index) => {
                            return (
                                <PricingCard key={index} 
                                isDropdownButton={false} 
                                variation="cards" 
                                rows = "2"
                                data={_item} 
                                onOpen={(item) => {
                                    dispatch(setItem(item))
                                }} />
                            );
                        })
                    }

                    </>       
                ) : (
                <>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-3 ${styles.tripPlanning}`}>
                    <div className={`lg:col-span-1 flex flex-wrap flex-col w-full h-full overflow-auto`} 
                    // style={{maxHeight: document.querySelector('#second-wrapped-locations')?.scrollHeight ? `${Number(document.querySelector('#second-wrapped-locations')?.scrollHeight) - 30}px` : '1550px'}} 
                    >
                        {
                        (!loading && itineraryDays) &&
                        itineraryDays.map((_item, index) => {
                            return (
                            <PricingCard
                                variation={'list'}
                                isDropdownButton={true}
                                rows="1"
                                key={index}
                                data={_item}
                                onOpen={(item) => {
                                    dispatch(setItem(item))
                                }}
                            />
                            );
                        })}
                    </div>
                    <div className="lg:col-span-1 w-full" id='second-wrapped-locations'>
                        <div className="w-full sticky top-[130px]">
                            <div className="large-shadow rounded-xl overflow-hidden">
                                {/* <TripDetail item={item} /> */}
                                <RightSideMap />
                            </div>
                        </div>
                        {/* <div className="sticky top-0">there</div> */}
                    </div>
                </div>

                {
                    (params_list.v_type === '2' || params_list.v_type === '3') && (
                        <>
                        <ProductHorizontalSlide 
                            url = {params_list.v_type === "2" ? 'variation_2' : "variation_3"}
                            Title={`${automateLocation?.name ? automateLocation?.name : params_list.address} Location To Visit`} 
                            Description={automateLocation?.location_id ? automateLocation?.description : (automateLocation?.editorial_summary?.overview ?? '')} 
                            isAddButton={true} 
                            isHover={params_list.v_type === "2" ? true : false}
                            isDesc={false} 
                            locationsState = {locationsState}
                            slidesToShow={4}
                            v_type={"3"}
                            isAutomate={false}
                        />

                        <ProductHorizontalSlide 
                            url = {params_list.v_type === "2" ? 'variation_2' : "variation_3"}
                            Title={`Most popular restaurants`} 
                            isAddButton={true} 
                            isHover={params_list.v_type === "2" ? true : false}
                            isDesc={false} 
                            locationsState = {restaurantsState}
                            slidesToShow={4}
                            v_type={"3"}
                            isAutomate={false}
                        />
                        </>
                    )
                } 
                </>
            )
        }
        </>
    )
}

export default PricingCards