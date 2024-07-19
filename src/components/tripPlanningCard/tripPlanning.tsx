import React, { useState, useRef, useEffect } from "react";
import Section from "../UIComponents/Section";
import TripPlanningHeader from "./Header/Header";
import axios from "axios";
import { APP_MODE, PY_API_URL } from "@/config/constant";
import DetailsCall, { DetailsCallByGoogle } from "@/api-calls/location-details-call";
import PricingCards from "./pricing-cards/PricingCards";
import Card_skelton from '@/components/UIComponents/card_skelton';
import { VariationType } from "@/interfaces/product";
import { LocationsCall } from "@/api-calls";
import { useAppDispatch } from "@/redux/hooks";
import { reset } from "@/redux/reducers/itinerarySlice";
import Spinloader from "../step-loader/spin-loader";
import { ITripPlanParams } from "@/interfaces/TripPlan";
import DummyLocations from "@/data/dummy-locations-list.json"

interface ITripPlanningCard {
    params_list?: ITripPlanParams,
    survey: any,
    totalOpeningHours: number | null
    automateLocation?: any
    v_type?: VariationType
}

export default function TripPlanningCard({params_list, survey, totalOpeningHours, automateLocation}: ITripPlanningCard) {
    
    const ref = useRef<HTMLInputElement>(null);
    const [read, setRead] = useState(false);
    const [loading, setLoading] = useState(true)
    
    const dispatch = useAppDispatch()

    useEffect(() => {
        const handleClickOutside = (event:any) => {
            if (!ref?.current?.contains(event.target)) {
                setRead(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
    }, [ref]);

    const [recommendations, setRecommendations] = useState<any[]>([])
    const [locationDetails, setLocationDetails] = useState<any[]>([])

    const setLocationDetailsByAddress = async (address: string) => {
        let occassion_arr = await survey?.occassion ? survey?.occassion.map((oc: any) => oc.opt) : []
        let priority_arr = await survey?.priority ? survey?.priority.map((pr: any) => pr.opt) : []
        let arr = occassion_arr.concat(...priority_arr)
        let search_string = (arr.length > 0 && address) ? (`${arr.join(',')} in ${address}`) : (`places to visit in ${address ?? params_list?.address} for tourist`)
        let res = await LocationsCall(search_string)
        
        setRecommendations([...res])
    }

    useEffect(() => {
        const _recomendFunc = async () => {
            if(recommendations.length > 0) {
                let _locationDetails: any[] = []
                let _recommendations = recommendations.slice(0,40)
                for (let index = 0; index < _recommendations.length; index++) {
                    if(_recommendations[index].location_id && _recommendations[index].location_id !== '')
                    {
                        let res: any = await DetailsCall(_recommendations[index].location_id)
                        if(res.data)
                        {
                            _locationDetails.push(res.data)
                        }
                    }
                    if(_recommendations[index].place_id && _recommendations[index].place_id !== '')
                    {
                        let res: any = await DetailsCallByGoogle(`${_recommendations[index].place_id}&fields=address_components,place_id,name,formatted_address,geometry,current_opening_hours,opening_hours,rating,reviews,types`)
                        if(res.data?.result && (res.data.result?.current_opening_hours || res.data.result?.opening_hours) && !res.data.result?.types?.includes('lodging'))
                        {
                            let check = await _locationDetails.find((loc:any) => res.data.result.name == loc.name)
                            if(!check)
                            {
                                _locationDetails.push(res.data.result.details ? {...res.data.result, ...res.data.result.details} : res.data.result)
                            }
                        }
                    }
                }

                setLocationDetails([..._locationDetails])
                setLoading(false)
            }
        }
        if(APP_MODE == "Production")
        {
            _recomendFunc()
        }
        else
        {
            setLocationDetails([...DummyLocations.map(loc => loc.details ? {...loc, ...loc.details} : loc).filter(loc => loc.current_opening_hours || loc.opening_hours)])
            setLoading(false)
        }
    }, [recommendations])

    useEffect(() => {
        
        const _defLoadRecommendation = async () => {
            let occassion_arr = await survey?.occassion ? survey?.occassion.map((oc: any) => oc.opt) : []
            let priority_arr = await survey?.priority ? survey?.priority.map((pr: any) => pr.opt) : []
            let arr = occassion_arr.concat(...priority_arr)

            let adrArr = params_list ? params_list.address.split(',') : []
            let body = {input: "", types: ""}
            if(params_list?.place_id && params_list?.place_id != "")
            {
                body = {
                    input: adrArr.length < 2 ? params_list?.address : `${adrArr[adrArr.length - 2].trim()}, ${adrArr[adrArr.length - 1].trim()}`,
                    types: ""
                }
            }
            else if(survey.location)
            {
                body = {
                    input: survey.location,
                    types: arr.length > 0 ? arr.join(',') : ''
                }
            }
            else {
                body = {
                    input: adrArr.length < 2 ? (params_list?.address ?? '') : (`${adrArr[adrArr.length - 2].trim()}, ${adrArr[adrArr.length - 1].trim()}`),
                    types: arr.length > 0 ? arr.join(',') : ''
                }
            }

            // let filterAddress = survey.location ? survey.location : (adrArr.length < 2 ? params_list?.address : `${adrArr[adrArr.length - 2].trim()}, ${adrArr[adrArr.length - 1].trim()}`)
            axios.post(`${PY_API_URL}/get-recommendation`, body).then(response => {
                
                dispatch(reset())
                
                if(response.data.recommendations.length == 0)
                {
                    setLocationDetailsByAddress(body.input)
                }
                else
                {
                    setRecommendations([...response.data.recommendations])
                }
            })
        }
        if(params_list?.address && params_list.address!='')
        {
            _defLoadRecommendation()
        }

    }, [params_list])

    return (
        <Section className="relative mx-auto">
            <div className="w-full flex justify-center relative">
                <div className="flex flex-col sm-width gilroy">
                    <TripPlanningHeader variation="space-between" />
                    <div className="relative">
                        {
                            loading === true && <Spinloader />
                        }
                        {loading === true ? (
                            <Card_skelton />
                        ):(
                            <PricingCards 
                                params_list={params_list}
                                locationDetails={locationDetails} 
                                totalOpeningHours={totalOpeningHours} 
                                automateLocation={automateLocation}
                            />
                        )
                        }
                    </div>
                </div>
            </div>
        </Section>
    );
}
