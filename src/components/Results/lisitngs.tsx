import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FilledStar,BlankStar } from "../icons/Stars";
import BlankLocation from "public/images/blank-location.jpg";
import Link from "next/link";
import NotFound from 'public/images/data-not-found.jpg'
import CSS from './pageBanner.module.css'
import { useAppDispatch } from "@/redux/hooks";
import { setItem } from "@/redux/reducers/PlacedetailSlice";
import Loader from "../step-loader/loader";
import Spinloader from "../step-loader/spin-loader";
import LoaderSvg from "../icons/loader-svg";

export default function Lisitngs({ locations, setLocations, Filteredlocations, loadData, setClearFilter,setLoadData, locationsByFilter, generatedResults, filterable }: any) {
  const skelton = ["1", "2", "3", "4", "5", "6", "7", "8"];

  // useEffect(() => {
  //   setLoadData(false)
  // }, [locations])

  useEffect(() => {
    const _onChangeLocations = async () => {
      let _locationsByFilter = await locationsByFilter.map((loc: any) => loc.locations)
      setLocations([].concat(..._locationsByFilter))
    }
    _onChangeLocations()
  }, [locationsByFilter])

  const reviewArr = new Array(5).fill(1);

  const dispatch = useAppDispatch()

  return (
    <div className="lg:pl-12 md:pl-12 sm:pl-6 pl-3">
      {
        loadData === false ? (
        <p className="text-[18px] text-[#3F3F3F] flex items-center"> <span className="mr-1">Show listing of {Filteredlocations?.length} Places...</span> { (filterable && (generatedResults.occassions == "" || generatedResults.priorities == "")) && <span> <LoaderSvg /> </span>} </p>
        ):(
          <>
          <p className="text-[18px] text-[#3F3F3F]">Our AI engine is finding best option for you...</p>
          {/* <div className="h-8 bg-gray-200 rounded-md dark:bg-gray-700 mb-2.5 mx-4 w-[30%]"></div> */}
          </>
        )
      }
      <div className="flex flex-wrap itemns-center lg:justify-start justify-center my-8 gap-y-14 gap-x-10 relative">
        {
          (loadData == true && locations.length == 0) && <Spinloader />
        }
        {
          loadData === true && locations.length == 0 && generatedResults.occassions == "" && generatedResults.priorities == ""
          ? skelton.map((show: any, index: number) => {
              return (
                <div
                  key={index}
                  role="status"
                  className="shadow animate-pulse dark:border-gray-700 sm:w-[260px] w-[320px] overflow-hidden rounded-lg flex flex-col justify-between sm:items-start items-center"
                >
                  <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700 w-full relative">
                    <svg
                      className="w-10 h-10 text-gray-200 dark:text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 20"
                    >
                      <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                  <div className="h-[25px] bg-white rounded-full dark:bg-gray-700 w-[50px] absolute top-2 right-2"></div>
                  </div>
                  <div className="w-full pb-4">
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 mx-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 mx-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mx-4"></div>
                  {/* <div className="flex items-center my-4 space-x-3 mx-4">
                  <div className="h-[32px] bg-gray-200 rounded-md dark:bg-gray-700 w-[106px]"></div>
                  <div className="h-[32px] bg-gray-200 rounded-md dark:bg-gray-700 w-[106px]"></div>
                  </div> */}
                  </div>
                  <span className="sr-only">Loading...</span>
                </div>
              );
            })
          : (
            Filteredlocations && Filteredlocations.length > 0 ? Filteredlocations?.map((location: any, index:number) => {
            
              location = location?.details ? {...location, ...location.details} : location
              let image_path = (location.image.image.length > 0 && location.image.image[0].url != "") ? location.image.image[0].url : BlankLocation.src;
                let address = location?.formatted_address
                ? location.formatted_address
                : location?.address_components[0]?.long_name +
                  location?.address_components[1]?.long_name;
                  let City = ""
                  let Place = ""
                  let Country = ""
                return (
                  <div
                    key={index}
                    className="sm:w-[260px] w-[320px] overflow-hidden rounded-lg flex flex-col justify-between items-center"
                  >
                    <div className={`sm:h-[235px] h-[260px] w-full relative cursor-pointer ${CSS["slider_card"]}`}>
                      <img src={image_path} alt={location.name} style={{objectFit: "cover"}} className="h-full w-full" />
                      {location.rating ? (
                        <div className="absolute top-2 right-2 flex items-center gap-x-2 bg-white py-1 px-4 rounded-full">
                          <FilledStar />
                          <p className="text-[#009DE2] font-semibold">{location?.rating}</p>
                        </div>
                      ) : ''}
                      <div className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center ${CSS["hover_overlay"]}`}>
                        <Link href={`/trip-plan?address=${JSON.stringify(address)}&location_id=${location.location_id ?? ''}&place_id=${location.place_id ?? ''}`} className="h-[40px] rounded-md bg-[#009DE2] text-white hover:bg-transparent border hover:border-[#009DE2] hover:text-white w-[170px] flex justify-center items-center">
                          Automate My Trip
                        </Link>
                        <button className="h-[40px] rounded-md text-white border border-white mt-5 w-[170px] hover:bg-[#009DE2]" 
                          onClick={()=> {
                            dispatch(setItem({
                              location_id: location.location_id,
                              place_id: location.place_id,
                              details: location
                            }))
                          }} > More Info </button>
                      </div>
                    </div>
                    <p className="text-[22px] font-semibold text-[#2D2D2D] my-2 flex justify-center">
                      {
                        location?.address_components?.forEach((address: any, index: number) => {
                              if(address?.types[0] == "sublocality_level_1"){
                                Place = address.long_name
                              }
                              if(address?.types[0] == "locality"){
                                City = address.long_name
                              }
                              if(address?.types[0] == "country"){
                                Country = address.long_name
                              }
                            }
                          )
                        }
                        <span className="text-center">
                        {location.name ? location.name : `${Place}${Place !== "" ? "," : ""} ${City !== "" ? City : Country}`}
                        </span>
                    </p>
                    <div className="flex items-center gap-x-2">
                      {
                        reviewArr &&
                        reviewArr.map((review, index) => {
                          if (index < location?.rating) {
                            return <FilledStar key={index} />;
                          } else {
                            return <BlankStar key={index} />;
                          }
                        })
                      }
                      {
                        location.rating && (
                          <span className="text-gray-500 text-sm">{"("}{location?.rating}{")"}</span>
                        )
                      }
                      {/* {
                        location?.details?.reviews && (
                          <span className="text-xs">Reviews {`(${location?.details?.reviews?.length})`}</span>
                        )
                      } */}
                    </div>
                  </div>
                );
            }) : (
              <div className="flex flex-col items-center mt-10 w-full">
                <img className="w-[500px]" src={NotFound.src} alt="not found"/>
                <span className="md:text-[40px] sm:text-[32px] text-[20px] font-bold">Data Not Found</span>
                <p className="mt-2 text-[gray]">Please try with another filter</p>
                <button className="mt-4 w-[200px] py-2 rounded-md bg-[#009de2] text-white font-bold text-[20px]" onClick={()=>{
                  setClearFilter(true)
                }}>Clear All</button>
              </div>
            )
          )
        }
      </div>
    </div>
  );
}
