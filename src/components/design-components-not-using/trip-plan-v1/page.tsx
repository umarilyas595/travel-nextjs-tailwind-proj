"use client"
import ClientTestimonials from '@/components/Client-Testimonials/client-testimonials'
import PageBanner from '@/components/PageBanner/PageBanner'
import Products from '@/components/Products/Products'
import SmallStory from '@/components/Story/SmallStory'
import React from 'react'
import TripPlanningCard from '@/components/tripPlanningCard/tripPlanning'
import ProductHorizontalSlide from '@/components/Products/ProductHorizontalSlide'
import { useAppSelector } from '@/redux/hooks'

const TripPlanPage = () => {
    const { locationsState } = useAppSelector((state) => state.locationReducer)
    return (
        <div>
            <PageBanner />
          
            <TripPlanningCard survey={''} totalOpeningHours={null} />

            <ProductHorizontalSlide url="variation_2" Title='Bali Location To Visit' Description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet nulla felis. Duis a dolor condimentum, faucibus lacus ac, ullamcorper metus.' isAddButton={true} isDesc={true} locationsState={locationsState} />

            <Products title="Most popular Restaurants" isAddButton={true} rows="2" />

            <SmallStory positioning="inline" />

            <ClientTestimonials />
        </div>
    )
}

export default TripPlanPage