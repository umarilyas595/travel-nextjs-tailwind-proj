"use client";
import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";
import Section from "@/components/UIComponents/Section";
import TripPlanningV3 from "@/components/tripPlanningCard/tripPlanningV3";
import SmallStory from "@/components/Story/SmallStory";
import ClientTestimonials from "@/components/Client-Testimonials/client-testimonials";

export default function page() {
  return (
    <div className="w-full flex justify-center">
        <Section className="relative">
      <PageBanner />
      <TripPlanningV3 />
      <SmallStory positioning="inline" />
      <ClientTestimonials />
    </Section>
    </div>
  );
}
