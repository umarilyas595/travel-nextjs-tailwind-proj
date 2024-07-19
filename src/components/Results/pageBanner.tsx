import React, { useState, useEffect } from "react";
import styles from "./pageBanner.module.css";
import HeroBg from "/public/images/results_page_banner.png";
import Ballon from "/public/images/baloon-transparent.png";
import Image from "next/image";
import BannerFilter from "./bannerFilter";

interface ISurvey {
  survey?: any;
}

const Hero = ({ survey }: ISurvey) => {

  return (
    <div className="relative lg:mb-10 mt-10">
      <Image
        src={Ballon}
        alt="Baloon 1"
        className="absolute left-[60px] top-[20%] -z-10 select-none"
      />
      <Image
        src={Ballon}
        alt="Baloon 2"
        className="absolute right-[150px] top-[-25px] -z-10 select-none w-[4%]"
      />
      <Image
        src={Ballon}
        alt="Baloon 3"
        className="absolute left-[150px] top-[-25px] -z-10 select-none w-[3%]"
      />
      <Image
        src={Ballon}
        alt="Baloon 4"
        className="absolute right-[60px] top-[20%] -z-10 select-none"
      />
      <div className="h-full w-full px-4 relative lg:pb-10">
        <div className="relative m-auto width sm:h-auto h-[300px]">
          <Image
            src={HeroBg}
            alt="Trip-Banner"
            className="mx-auto select-none w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 top-0 right-0 px-8 flex flex-wrap justify-center items-center xl:my-[8rem] sm-width">
            <h2 className="text-white font-bold text-2xl lg:text-6xl lg:my-5 text-center w-full gilroy">
              Results
            </h2>
            {/* <p className="lg:mt-4 lg:mb-8 text-white text-lg max-w-[700px] text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
            </p> */}
            <div
              className={`lg:block hidden mt-4 rounded-xl ${styles["result_banner"]}`}
            >
              <BannerFilter />
            </div>
          </div>
        </div>
        <div className={`block lg:hidden ${styles["result_banner"]}`}>
          <BannerFilter />
        </div>
      </div>
    </div>
  );
};

export default Hero;
