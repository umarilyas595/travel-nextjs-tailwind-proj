import React, { useEffect, useState } from "react";
import ComponentTitle from "../UIComponents/ComponentTitle";
import { BlankStar, FilledStar } from "../icons/Stars";
import BlueButton from "../UIComponents/Buttons/BlueButton";
import styles from "./client-testimonials.module.css";
// import Modal from "../Modal/index";
import { ReviewsCall } from "@/api-calls";
import { useAppSelector } from "@/redux/hooks";
import Section from "../UIComponents/Section";
import Image from "next/image";
import ReviewFilterBox from "../Results/reviewFilterBox";
import SelectField from "../UIComponents/InputField/SelectField";

interface IClientTestimonials {
  automateLocation?: any
}
const ClientTestimonials = ({ automateLocation }:IClientTestimonials) => {
  const skelton = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const [loading, setLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState<any[] | null>(null);

  const { itineraryDays }: any = useAppSelector((state) => state.itineraryReducer);
  const [openModal, setOpenModal] = useState(false);
  const [showReviews, setShowReviews] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<any>({})
  const [locaitonList, setLocationList] = useState<any[]>([])
  const [locaitonOptions, setLocationOptions] = useState<any[]>([])
  const [filterData, setFilterData] = useState({
    locationIndex: "",
    reviews: "All"
  })

  useEffect(() => {
    
    if(filterData.locationIndex !== "")
    {
      let index = locaitonList.findIndex(opt => opt.name === filterData.locationIndex)

      setSelectedLocation(locaitonList[index])
      setReviewsData(locaitonList[Number(index)].reviews === undefined ? [] : (filterData.reviews !== "All" ? locaitonList[Number(index)].reviews.filter((review: any) => review.rating === Number(filterData.reviews)) : locaitonList[Number(index)].reviews));
    }
    else
    {
      if(selectedLocation?.reviews)
      {
        setReviewsData(filterData.reviews !== "All" ? selectedLocation.reviews.filter((review: any) => review.rating === Number(filterData.reviews)) : selectedLocation.reviews);
      }
      else if(locaitonList.length > 0)
      {
        setReviewsData(locaitonList[0].reviews === undefined ? [] : (filterData.reviews !== "All" ? locaitonList[0].reviews.filter((review: any) => review.rating === Number(filterData.reviews)) : locaitonList[0].reviews));
      }
    }
    
  }, [filterData]);

  useEffect(() => {
    const _def = async () => {
      let locations = await itineraryDays.map((itin: any) => 
      itin.times.map((time: any) => 
        time.location 
      )
      )
      locations = await [].concat(...locations)

      setLocationList([...locations])

    }
    _def()
  }, [itineraryDays])

  useEffect(() => {
    const _locationOptionFunc = async () => {
      if(locaitonList.length > 0)
      {
        setReviewsData(locaitonList[0].reviews === undefined ? [] : (filterData.reviews !== "All" ? locaitonList[0].reviews.filter((review: any) => review.rating === Number(filterData.reviews)) : locaitonList[0].reviews));

        let _list = await locaitonList.map((loc: any, index) => {
          return {
            id: index+1,
            name: loc.name
          }
        })
        setLocationOptions([..._list])
      }
    }

    _locationOptionFunc()
  }, [locaitonList])

  useEffect(() => {
    if (reviewsData!=null) {
      setLoading(false);
    }
    console.log('reviewsData', reviewsData, filterData.reviews)
  }, [reviewsData]);

  useEffect(() => {
    setSelectedLocation(automateLocation ? {...automateLocation} : (locaitonList.length > 0 ? {...locaitonList[0]} : null))
  }, [automateLocation, locaitonList]);

  const reviewArr = new Array(5).fill(1);

  const reviewOptions = [
    {
      id: 'All', name: "All"
    },
    {
      id: 1, name: 1
    },
    {
      id: 2, name: 2
    },
    {
      id: 3, name: 3
    },
    {
      id: 4, name: 4
    },
    {
      id: 5, name: 5
    }
  ]

  return (
    <div className="w-full flex justify-center">
        <Section className="relative">
    <div className="sm-width sm:px-4 px-0">
      <div className="flex flex-wrap sm:justify-between justify-center items-center">
        <div>
          <ComponentTitle title="Clients testimonials" />
          <span className="flex flex-wrap gap-2 items-center mt-3">
            {reviewArr &&
              reviewArr.map((review, index) => {
                if (index < Math.floor(selectedLocation?.rating)) {
                  return <FilledStar key={index} />;
                } else {
                  return <BlankStar key={index} />;
                }
              })}
            {selectedLocation?.rating} Reviews
          </span>
        </div>
        <div className="relative"
          onClick={() => {
            setOpenModal(!openModal);
          }}
        >
          <BlueButton onClick={() => setShowFilter(!showFilter)} title={"Filter Reviews"} />

        </div>
      </div>
      <div id="rating-filter" className={`transition-all duration-300 ${!openModal ? 'overflow-hidden' : 'pt-8'}`} style={{height: openModal ? window.innerWidth < 768 ? "200px" : "74px" : "0px"}}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SelectField
            label="Locations"
            placeholder="Select ..."
            data={locaitonOptions}
            className={`sm:mr-2 sm:my-2 my-5 w-full`}
            value={filterData.locationIndex}
            onChange={async (val) =>{
              setFilterData({...filterData, locationIndex: val})}
            }
            />

            <SelectField
            label="Reviews"
            placeholder="Select ..."
            data={reviewOptions}
            className={`sm:mr-2 sm:my-2 my-5 w-full`}
            value={filterData.reviews}
            onChange={(val) =>
              setFilterData({...filterData, reviews: val})
            }
            />
          </div>
          {/* {
            reviewRank && <span className="text-red-500 text-sm cursor-pointer text-right w-full block my-2" onClick={() => setReviewRank('')}>Clear</span>
          }
          {reviewArr &&
          reviewArr.map((review, index) => {
              return <span key={index} className={`flex items-center border rounded-lg p-2 my-2 ${Number(reviewRank) == index+1 ? "text-[#009de2] border-[#009de2]" : "text-[#b1adaa] border-[#b1adaa]" }`}
              onClick={() => setReviewRank(`${index+1}`)}
              >
                <span className="mr-1">{index+1}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.4505 5.63406L11.3543 4.90408L9.07611 0.352135C9.01388 0.227506 8.91152 0.126615 8.78506 0.0652895C8.46793 -0.0890138 8.08254 0.0395723 7.92397 0.352135L5.64581 4.90408L0.549539 5.63406C0.409035 5.65384 0.280575 5.71912 0.182222 5.81803C0.0633192 5.93848 -0.00220171 6.10053 5.64944e-05 6.26856C0.0023147 6.4366 0.0721672 6.59688 0.194265 6.71418L3.88148 10.2572L3.01036 15.2602C2.98993 15.3766 3.003 15.4963 3.04808 15.6057C3.09316 15.7151 3.16845 15.8099 3.26541 15.8793C3.36237 15.9488 3.47713 15.99 3.59666 15.9984C3.7162 16.0068 3.83573 15.982 3.9417 15.9269L8.50004 13.5648L13.0584 15.9269C13.1828 15.9922 13.3273 16.0139 13.4658 15.9902C13.8151 15.9308 14.0499 15.6044 13.9897 15.2602L13.1186 10.2572L16.8058 6.71418C16.9062 6.61724 16.9724 6.49064 16.9925 6.35216C17.0467 6.00597 16.8018 5.68549 16.4505 5.63406Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            })
            } */}
        </div>
      {
      showReviews === true ? (
      <div className="my-10 md:my-20">
        {loading === true
          ? skelton.map((show: any, index: number) => {
              return (
                <div
                key={index}
                  role="status"
                  className="w-full animate-pulse p-8 my-10 shadow rounded-xl"
                >
                    <div className="flex flex-wrap justify-between items-center mb-4">
                    <div className="h-[40px] bg-gray-200 rounded-md dark:bg-gray-700 w-[300px] mb-4"></div>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  </div>
                  <div className="flex items-center mt-4 space-x-3">
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
                    <div>
                      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                      <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                  </div>
                  <span className="sr-only">Loading...</span>
                </div>
              );
            })
          : reviewsData!=null && reviewsData.map((client: any, index: number) => {
            
            return (
              <div
                key={index}
                className={`bg-white rounded-xl p-8 my-10 ${styles.testimonialCard}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-[#333333] italic text-[23px] leading-[52px]">
                    {" "}
                    &ldquo;{client.text}&rdquo;
                  </h5>
                  <span className="text-black font-semibold text-[15px] text-right leading-[18px] min-w-[150px]">
                    {client.relative_time_description}
                  </span>
                </div>
                {/* <p className="text-[#5C5B5B] italic text-[17px] leading-[27px] mb-4">{client.desc}</p> */}

                <div className="flex flex-wrap gap-8 items-center">
                  <div className="gilroy italic font-bold text-xl h-[50px] w-[50px] relative">
                    <Image src={client.profile_photo_url} fill={true} alt={""} />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[22px] leading-[52px] text-[var(--green)] mr-2">{`${client.author_name}`}</span>
                    {reviewArr &&
                      reviewArr.map((review, index) => {
                        if (index < client.rating) {
                          return <FilledStar key={index} />;
                        } else {
                          return <BlankStar key={index} />;
                        }
                      })}
                  </div>
                </div>
              </div>
            );
          })
        }

        {
          reviewsData!=null && reviewsData.length == 0 && (
            <div className="text-center">
                Testimonials not found!
            </div>
          )
        }
      </div>
      ):(
        ""
      )}

      {
        reviewsData!=null && reviewsData.length > 0 && (
          <div className="mt-20 flex justify-center">
            <button className="w-[150px] border-[var(--blue)] bg-[var(--blue)] text-white py-2 rounded-md" onClick={()=>{setShowReviews(!showReviews)}}>{showReviews == true ? "Hide" : "Read"}</button>
          </div>
        )
      }
      
      {/* {openModal == true ? (
        <Modal
          openModal={openModal}
          setOpenModal={setOpenModal}
          modalFor="review"
        />
      ) : (
        ""
      )} */}
    </div>
    </Section>
    </div>
  );
};

export default ClientTestimonials;
