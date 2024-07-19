import React from "react";
import Section from "../UIComponents/Section";
import TripPlanningHeader from "./Header/Header";
import PricingCard from "./pricingCard";
import DemiData from "@/api/DemiData";
import TripDetail from "./TripDetail";
import ProductHorizontalSlide from "../Products/ProductHorizontalSlide";
import Products from "../Products/Products";
import { useAppSelector } from "@/redux/hooks";


export default function TripPlanningV3() {
  const { locationsState } = useAppSelector((state) => state.locationReducer)
    const { restaurantsState } = useAppSelector((state) => state.restaurantsReducer)
  return (
    <div className="w-full flex justify-center">
        <Section className="relative">
      <div className="my-20">
        <TripPlanningHeader variation="space-arround" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10">
          <div className="lg:col-span-1 lg:block flex flex-wrap justify-center gap-x-3">
            {DemiData.PricingPlans &&
              DemiData.PricingPlans.map((items, index) => {
                return (
                  <PricingCard
                    variation="cards"
                    isDropdownButton={false}
                    rows = "1"
                    key={index}
                    data={items}
                    onOpen={(item) => {}}
                  />
                );
              })}
          </div>
          <div className="lg:col-span-2 mt-10">
                        <div className="large-shadow sm:p-8 py-8 rounded-xl">
                            <TripDetail />

                            <ProductHorizontalSlide 
                            url = 'variation_3'
                                Title='Bali location to visit'
                                Description='Lorem ipsum dolor sit amet, consectetur adipiscing elit.'  
                                isAddButton={false} 
                                isDesc={false} 
                                locationsState={locationsState}
                            />

<Products title="Most popular Restaurants" isAddButton={false} rows="1" />
                        </div>
                    </div>
        </div>
      </div>
    </Section>
    </div>
  );
}
