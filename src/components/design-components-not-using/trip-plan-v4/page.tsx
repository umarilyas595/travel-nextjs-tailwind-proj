"use client";
import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";
import TripPlanningV4 from "@/components/tripPlanningCard/tripPlanningV4";
import Section from "@/components/UIComponents/Section";
import ProductHorizontalSlide from "@/components/Products/ProductHorizontalSlide";
import Products from "@/components/Products/Products";
import ClientTestimonials from "@/components/Client-Testimonials/client-testimonials";
import { useAppSelector } from "@/redux/hooks";

export default function Page() {
  const { locationsState } = useAppSelector((state) => state.locationReducer)
  return (
    <div className="w-full flex justify-center">
        <Section className="relative">
      <PageBanner />
      <TripPlanningV4 />
      <ProductHorizontalSlide
        url="variation_2"
        Title="Bali Location To Visit"
        Description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet nulla felis. Duis a dolor condimentum, faucibus lacus ac, ullamcorper metus."
        isAddButton={true}
        isDesc={true}
        locationsState={locationsState}
      />
      <Products title="Most popular Restaurants" isAddButton={true} rows="2" />
      <div className="md:mt-28 mt-20">
      <ClientTestimonials />
      </div>
        
    </Section>
    </div>
  );
}
