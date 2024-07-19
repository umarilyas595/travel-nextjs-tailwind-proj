"use client"

import React from 'react'
import DetailModal from "@/components/tripPlanningCard/TripPlanPopup";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { reset } from '@/redux/reducers/PlacedetailSlice';

const ModelInfo = () => {

    const { show, item } = useAppSelector(state => state.PlacedetailSlice)
    const dispatch = useAppDispatch()
    
    return (
        <div>
            <DetailModal
                item={item}
                show={show}
                onClose={() => {
                    dispatch(reset())
                }}
            />
        </div>
    )
}

export default ModelInfo