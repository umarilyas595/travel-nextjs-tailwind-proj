import React, { useState } from "react";
import HeroBg from "/public/images/hero-section-bg.png";
import Ballon from "/public/images/baloon-transparent.png";
import Map from "/public/images/map-transparent.png";
import Image from "next/image";
import HeroFilterSection from "./heroFilterSection";
import styles from './hero.module.css'
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative">
      <Image
        src={Ballon}
        alt="Baloon 1"
        className="absolute left-5 top-[20%] -z-10 select-none sm:flex hidden"
      />
      <Image
        src={Ballon}
        alt="Baloon 2"
        className="absolute right-[300px] top-[-40px] -z-10 select-none sm:flex hidden"
      />
      <Image
        src={Ballon}
        alt="Baloon 3"
        className="absolute right-[150px] top-[20%] -z-10 select-none sm:flex hidden"
      />
      <Image
        src={Map}
        alt="Map"
        className="absolute left-0 bottom-0 -z-10 select-none sm:flex hidden"
      />
      <div className="h-full w-full px-4 relative">
        <div className="relative m-auto width sm:h-auto h-[300px]">
          <Image
            src={HeroBg}
            alt="Trip-Banner"
            className="mx-auto select-none w-full h-full"
          />
          <div className="absolute bottom-0 left-0 top-0 right-0 px-8 flex flex-col justify-center items-center xl:my-[8rem] sm-width">
            <h1 className="uppercase sm:leading-10 text-white font-normal text-[16px] sm:text-[22px] xl:text-[30px] xl:my-5 sm:my-3 my-0 gilroy plan text-center">
            PLAN YOUR DREAM TRIP IN SECOND WITH
            </h1>
            <h2 className="leading-10 text-white font-bold text-[22px] sm:text-[48px] xl:text-[68px] xl:my-5 sm:my-3 my-0 text-center w-full gilroy">
              <Link href={'/results'}>WePlan</Link>
            </h2>
            <p className="xl:mb-10 mb-2 lg:mt-2 text-white sm:text-[22px] text-[16px] max-w-[720px] text-center lato">
              We take away all the hassle associated with trip planning. Be
              excited about your vacation, we&lsquo;ve got the details covered!
            </p>
            <div className="lg:block hidden">
              <HeroFilterSection />
            </div>
          </div>
        </div>
          <div className={`block lg:hidden ${styles["shadow_box"]}`}>
              <HeroFilterSection />
            </div>
      </div>
    </div>
  );
};

export default Hero;
