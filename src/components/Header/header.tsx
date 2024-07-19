"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Logo from "/public/logo.svg"
import Image from 'next/image'
import SearchPopup from './SearchPopup'
import MobileSearchDrawer from './MobileSearchDrawer'
import Survey from './survey/survey'
import { useAppDispatch } from '@/redux/hooks'
import { useRouter } from "next/navigation";
import Tooltip from '@mui/material/Tooltip';
import { useAppSelector } from '@/redux/hooks'
import { setShow } from '@/redux/reducers/surveySlice'
import Style from './Header.module.css'
import { setSurveyValue } from "@/redux/reducers/surveySlice";

const Header = () => {
    const router = useRouter()
    const [openMobileMenu, setOpenMobileMenu] = useState(false)
    const [openMobileSearch, setOpenMobileSearch] = useState(false)
    const [showPopup, setShowPopup] = useState(false)
    const [showSurvey, setShowSurvey] = useState(false)
    const {show} = useAppSelector(state => state.surveyReducer)

    const dispatch = useAppDispatch()

    useEffect(() => {
        window.addEventListener('scroll', () =>{
            if(window.scrollY > 5)
            {
                if(!document.querySelector('#header')?.classList.contains('shadow'))
                {
                    document.querySelector('#header')?.classList.add('shadow')
                }
            }
            else
            {
                if(document.querySelector('#header')?.classList.contains('shadow'))
                {
                    document.querySelector('#header')?.classList.remove('shadow')
                }
            }
        })
    }, [])

    return (
        <div id={'header'} className="w-full sticky top-0 sm:z-20 z-10 transition-all duration-300 bg-white">
            <div className="sm-width h-[100px] flex items-center">
                <div className="grid grid-cols-12 mx-auto max-w-[500px] md:max-w-full w-full items-center px-4">
                    <div className="col-span-4">

                        {/* Menu Bar for Mobile Responsivness */}
                        <div className={`${Style['navbar-btn']}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"
                            onClick={() => setOpenMobileMenu(!openMobileMenu)}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                            </svg>
                        </div>

                        {/* Menu Bar for Desktop */}
                        <div className={`${Style['navbar-desktop']}`}>
                        <Tooltip title="Click on Inspiration and see all the results.">
                        <Link href={'/results'} className="px-4 lg:px-5 hover:text-[var(--blue)] transition-all duration-300" onClick={()=>{
                            dispatch(setSurveyValue({}));
                        }}>Inspiration</Link>
                        </Tooltip>
                        <Tooltip title="Click on Build a Trip and create your own trip.">
                            <Link href={'/trip-plan'} className="px-4 lg:px-5 hover:text-[var(--blue)] transition-all duration-300" onClick={()=>{
                            dispatch(setSurveyValue({}));
                        }}>Build a Trip</Link>
                            </Tooltip>
                            <Tooltip title="Take a survey to find your dream vacation">
                            <Link href={'/'} 
                            // onMouseEnter={() => dispatch(setShow(true))}
                            onClick={(e) => {
                                e.preventDefault()
                                dispatch(setShow(true))
                                // setShowSurvey(true)
                            }} className="p-4 lg:p-5 hover:text-[var(--blue)] transition-all duration-300">Survey</Link>
                            </Tooltip>
                        </div>
                    </div>
                        
                    {/* WebSite Logo */}
                    <div className="m-auto col-span-4">
                        <Link href={'/'} onClick={()=>{
                            dispatch(setSurveyValue({}));
                        }}>
                            <Image src={Logo} alt='logo' />
                        </Link>
                    </div>

                    {/* Header Right Side */}
                    <div className="col-span-4">
                        <div className="hidden md:flex items-center justify-end border-l md:pl-3 lg:pl-6 xl:pl-16">

                            {/* Desktop Search Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 cursor-pointer"
                            onClick={() => setShowPopup(true)}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>

                            {/* <Link href={'/'} >Login</Link>

                            <button className="bg-black py-3 px-4 lg:px-8 rounded-md text-white">Sign Up</button> */}
                        </div>

                        {/* Search Icon for Mobile Responsivness */}
                        <div className="block md:hidden px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 cursor-pointer ml-auto" 
                            onClick={() => setOpenMobileSearch(!openMobileSearch)}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Popup */}
            <SearchPopup show={showPopup} onClose={() => setShowPopup(false)} />

            {/* Responsive Mobile Menu */}
            <div className={`fixed inset-0 bg-slate-100 z-10 ${!openMobileMenu ? '-translate-x-full' : 'translate-x-0'} duration-500 transition-all`}>
                <div className="absolute top-2 right-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                    onClick={() => setOpenMobileMenu(!openMobileMenu)}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <div className="flex flex-col my-5">
                    <div className="p-4 lg:p-5" onClick={()=>{
                        setOpenMobileMenu(false)
                        dispatch(setSurveyValue({}));
                        router.push('/results')
                    }}>Results</div>
                    <div className="p-4 lg:p-5" onClick={()=>{
                        setOpenMobileMenu(false)
                        dispatch(setSurveyValue({}));
                        router.push('/trip-plan')
                    }}>Itinerary</div>
                    <div className="p-4 lg:p-5" onClick={()=>{
                        setOpenMobileMenu(false)
                        setShowSurvey(true)
                        dispatch(setSurveyValue({}));
                    }}>Survey</div>
                </div>
            </div>

            {/* Mobile Responsive Search Drawer */}
            <MobileSearchDrawer show={openMobileSearch} onClose={()=>setOpenMobileSearch(!openMobileSearch)} />

            <Survey show={show} onClose={() => dispatch(setShow(false))} />
        </div>
    )
}

export default Header