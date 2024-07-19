import { useAppSelector } from '@/redux/hooks'
import React, { useEffect, useState } from 'react'
import ItineraryGoogleMapView from './itinerary-google-map-view'

const RightSideMap = () => {

    const { itineraryDays } = useAppSelector(state => state.itineraryReducer)

    const [locations, setLocations] = useState<any[]>([])

    useEffect(() => {
        const _def = async () => {
            let _itineraryDays = await itineraryDays.map((itin: any) => itin.times.map((tim: any) => tim.location))
            _itineraryDays = [].concat(..._itineraryDays)
            setLocations(_itineraryDays)
        }
        _def()
    }, [itineraryDays])

    return (
        <div className="w-full h-[700px] relative">
            <ItineraryGoogleMapView locations={locations} />
        </div>
    )
}

export default RightSideMap