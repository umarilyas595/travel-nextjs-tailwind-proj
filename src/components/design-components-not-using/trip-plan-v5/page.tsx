"use client"

import ClientTestimonials from '@/components/Client-Testimonials/client-testimonials'
import PageBanner from '@/components/PageBanner/PageBanner'
import SmallStory from '@/components/Story/SmallStory'
import React from 'react'
import TripPlanningV5 from '@/components/tripPlanningCard/tripPlanningV5'

const TripPlanV5 = () => {
    return (
        <div>
            <PageBanner />

            <TripPlanningV5 />

            <SmallStory positioning="inline" />

            <ClientTestimonials />
        </div>
    )
}

export default TripPlanV5