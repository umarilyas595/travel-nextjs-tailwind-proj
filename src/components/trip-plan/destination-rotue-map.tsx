import React from 'react'
import PopupWithOverlay from '../UIComponents/Popup/PopupWithOverlay'
import RouteMap from "./route-map"
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearDestinationModel } from '@/redux/reducers/itinerarySlice'

interface IDestinationRotueMap {
    show: boolean
}

const DestinationRotueMap = ({show}: IDestinationRotueMap) => {

    const { destinationDetails } = useAppSelector(state => state.itineraryReducer)

    const dispatch = useAppDispatch()

    return (
        <PopupWithOverlay show={show} onClose={() => {
            dispatch(clearDestinationModel())
        }}  >
            {/* <div className="fixed top-0 right-0 bottom-0 left-0 bg-[rgba(0,0,0,0.6)] z-[20]">
            </div> */}
            <h3 className="font-medium gilroy text-[28px] leading-[32.96px] w-full text-center mb-5">Direction</h3>
            <div className="relative h-[500px]">
                <RouteMap destinationDetails={destinationDetails} />
            </div>
        </PopupWithOverlay>
    )
}

export default DestinationRotueMap