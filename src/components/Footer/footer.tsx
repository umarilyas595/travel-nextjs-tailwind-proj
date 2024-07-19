"use client";
import React, { useState } from "react";
import Logo from "/public/logo_white.svg";
import DottedMap from "/public/images/dotted_map.png";
import Image from "next/image";
import CSS from "./footer.module.css";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import Link from "next/link";
import Survey from "../Header/survey/survey";
import Modal from './modalForLocation'
import { useAppDispatch } from "@/redux/hooks";
import { setShow } from "@/redux/reducers/surveySlice";

const SocialIcons = [
  { icon: FaFacebookF, name: "Facebook", Link:"" },
  { icon: FaLinkedinIn, name: "Linkedin", Link:"" },
  { icon: FaTwitter, name: "Twitter", Link:"https://twitter.com/weplanai?s=21&t=aoqnaoxxDOcdP5KJdtoLWQ" },
  { icon: FaInstagram, name: "Instagram", Link:"https://www.instagram.com/weplan.ai/?igshid=OGQ5ZDc2ODk2ZA%3D%3D" },
];

export default function Footer() {
  const dispatch = useAppDispatch()
  const [showSurvey, setShowSurvey] = useState(false);
  const [showModal, setShowModal] = useState(false);
  return (
    <div className={`${CSS.footer} sm:h-[430px] pb-14`}>
      <Image src={DottedMap} className="absolute top-0 right-0 -z-10" alt="" />
      <div className="mt-16 pt-12 text-white flex flex-col items-center justify-between h-full w-full">
        <Link href={"/"} className="col-span-4 cursor-pointer">
          <Image src={Logo} alt="logo" />
        </Link>
        <div
          className={`sm:h-[70px] px-6 flex sm:flex-row flex-col items-center sm:gap-y-0 gap-y-4 sm:py-0 py-5 sm:my-0 my-5 ${CSS["border_gradient"]}`}
        >
          <Link
            href={"/results"}
            className="md:w-[180px] sm:w-[130px] w-[80px] sm:px-0 px-3 flex items-center justify-center sm:text-[20px] text-[14px] font-medium sm:border-r-2 border-[#444658] cursor-pointer"
          >
            Inspiration
          </Link>
          <div
            className="md:w-[180px] sm:w-[130px] w-[100px] sm:px-0 px-3 flex items-center justify-center sm:text-[20px] text-[14px] font-medium sm:border-r-2 border-[#444658] cursor-pointer"
            onClick={()=>{
              setShowModal(true)
            }}
          >
            Build a Trip
          </div>
          <Link
            href={"/"}
            className="md:w-[180px] sm:w-[130px] w-[80px] sm:px-0 px-3 flex items-center justify-center sm:text-[20px] text-[14px] font-medium sm:border-r-2 border-[#444658] cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setShow(true))
              // setShowSurvey(true);
            }}
          >
            Survey
          </Link>
          <a
            href={"/#reviews"}
            className="md:w-[180px] sm:w-[130px] w-[80px] sm:px-0 px-3 flex items-center justify-center sm:text-[20px] text-[14px] font-medium cursor-pointer"
          >
            Reviews
          </a>
        </div>
        <div className="flex items-center gap-x-6 sm:my-0 my-5">
          {SocialIcons &&
            SocialIcons.map((social, index) => {
              return (
                <Link
                  href={social?.Link}
                  target="_blank"
                  key={index}
                  className={`${CSS["social_icon"]} rounded-full flex justify-center items-center text-black text-[20px] cursor-pointer`}
                >
                  {<social.icon />}
                </Link>
              );
            })}
        </div>
        {/* <div className="h-[74px] sm:w-[90%] sm:px-0 px-2 border-t-2 border-[#3C3F52] flex justify-center items-center">
          <p
            className={`sm:text-[18px] text-[14px] uppercase tracking-wider ${CSS["copyright"]}`}
          >
            Copyright © 2022 WePLAN. All rights reserved.
          </p>
        </div> */}
      </div>
      {/* <Survey show={showSurvey} onClose={() => setShowSurvey(false)} /> */}
      <Modal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
