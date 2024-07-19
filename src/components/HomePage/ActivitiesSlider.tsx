import { useEffect, useState } from "react";
import Slider from "react-slick";
import { FilledStar, BlankStar } from "../icons/Stars";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CSS from "./style.module.css";
import Ballon from "/public/images/baloon-transparent.png";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import BlankLocation from "public/images/blank-location.jpg";
import DetailModal from "../tripPlanningCard/TripPlanPopup";
import Link from "next/link";
import ComponentTitle from "../UIComponents/ComponentTitle";
import { reset } from "@/redux/reducers/surveySlice";
import { setItem } from "@/redux/reducers/PlacedetailSlice";

function ActivitiesSlider({ activitiesState }: any) {
  const skelton = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
  ];
  const reviewArr = new Array(5).fill(1);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);
  const [showTripPopup, setShowTripPopup] = useState(false);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
  const [types, setTypes] = useState("");

  useEffect(() => {
    setActivity(activitiesState);
  }, [activitiesState]);

  useEffect(() => {
    if (activity?.length > 0) {
      setLoading(false);
    }
  }, [activity]);

  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={
          nextBtnDisabled == true
            ? `cursor-pointer select-none ${CSS["activity_arrow_next_disabled"]} `
            : `cursor-pointer select-none  ${CSS["activity_arrow_next"]}`
        }
        style={{
          ...style,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    );
  }

  function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={
          prevBtnDisabled == true
            ? `cursor-pointer select-none ${CSS["activity_arrow_prev_disabled"]}`
            : `cursor-pointer select-none ${CSS["activity_arrow_prev"]}`
        }
        style={{
          ...style,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </div>
    );
  }

  // const afterChange = (prev: number) => {
  //   if(prev == 0){
  //     setPrevBtnDisabled(true)
  //   }else{
  //     setPrevBtnDisabled(false)
  //   }
  // };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SamplePrevArrow />,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
          dots: false,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SamplePrevArrow />,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SamplePrevArrow />,
        },
      },
    ],
    // afterChange,
  };

  const dispatch = useAppDispatch()

  return (
    <div className="w-full flex justify-center relative mt-20 bg-[#F9FDFF] py-12 px-10">
      <Image
        src={Ballon}
        alt="Baloon 1"
        className={`absolute left-12 top-[-10%] select-none ${CSS["image_opacity"]}`}
      />
      <Image
        src={Ballon}
        alt="Baloon 1"
        className={`absolute lg:right-24 lg:flex hidden right-18 bottom-[12%] select-none ${CSS["image_opacity"]}`}
      />
      <Image
        src={Ballon}
        alt="Baloon 1"
        className={`absolute right-[13%] md:flex hidden bottom-[-14%] select-none w-[70px]`}
      />
      <div className="sm-width flex flex-col items-center relative">
        <div className="flex flex-col items-center">
          <ComponentTitle title={"Popular Activities For You"} />
          <p className="text-[var(--gray)] max-w-[650px] my-5 md:px-0 px-2 text-center">
            Explore some of the most exciting and trending activities across the
            globe!
          </p>
        </div>
        <div className="mt-10 w-[90%] arrow_remove">
          <Slider {...settings}>
            {loading === true
              ? skelton.map((limit: string, index: number) => {
                  return (
                    <div
                      key={index}
                      role="status"
                      className="max-w-sm rounded animate-pulse h-[350px] md:max-w-[300px] relative px-3 md:mt-0 mt-10"
                    >
                      <div className="flex items-center justify-center mb-4 bg-gray-300 rounded dark:bg-gray-700 h-[350px]">
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
                      </div>
                      <div className="h-[40px] bg-gray-200 rounded-md dark:bg-gray-700 w-[50%] mb-4 absolute bottom-4 left-6 z-10"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  );
                })
              : activity?.map((activities: any, index: number) => {
                  let City = "";
                  let Country = "";
                  let parseImageArray = JSON.parse(activities.image);
                  let image_path =
                    parseImageArray.image.length > 0
                      ? parseImageArray.image[0].url
                      : BlankLocation.src;
                  let address = activities.details.formatted_address
                    ? activities.details.formatted_address
                    : activities.name +
                      " " +
                      activities.details.address_components[0].long_name +
                      " " +
                      activities.details.address_components[1].long_name;
                  let filterTypes: any = "";
                  const filter = activities?.details?.types?.filter((type:string)=>{
                    return type !== "point_of_interest" && type !== "establishment"
                  })
                  if(filter?.length > 0){
                    filterTypes = filter.toString()
                  }
                  return (
                    <div
                      key={index}
                      className={`px-2 md:max-w-[300px] h-[310px] w-full md:mt-0 mt-10`}
                    >
                      <div
                        className={`rounded-xl border shadow-sm overflow-hidden h-full relative cursor-pointer ${CSS["slider_card"]}`}
                      >
                        <div className="h-[310px] bg-gray-100 relative">
                          <Image
                            src={image_path}
                            fill={true}
                            alt={image_path}
                            style={{ objectFit: "cover" }}
                          />
                          <div
                            className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10 ${CSS["hover_overlay"]}`}
                          >
                            <Link
                              href={`/trip-plan?address=${JSON.stringify(address.replace(
                                "#",
                                ""
                              ))}&location_id=${
                                activities.location_id ?? ""
                              }&place_id=${activities.place_id ?? ""}&v_type=`}
                              className="h-[40px] rounded-md bg-[#009DE2] text-white hover:bg-transparent border hover:border-[#009DE2] hover:text-white w-[170px] flex justify-center items-center"
                              onClick={() => {
                                dispatch(reset())
                              }}
                            >
                              Automate My Trip
                            </Link>
                            <button
                              className="h-[40px] rounded-md text-white border border-white mt-5 w-[170px] hover:bg-[#009DE2]"
                              onClick={() => {
                                dispatch(setItem({
                                  location_id: activities.location_id,
                                  place_id: activities.place_id,
                                  details: activities
                                }));
                                setShowTripPopup(true);
                              }}
                            >
                              More Info
                            </button>
                          </div>
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(0deg, rgb(0 0 0 / 70%), transparent)",
                            }}
                          ></div>
                          <div className="absolute bottom-4 left-0 w-full z-2 text-[18px] text-white lato  font-bold">
                            <h1 className=" mt-3 text-center   ">
                              {activities.name}
                            </h1>
                            <div className="ml-2 text-center">
                              {activities?.details?.address_components?.forEach(
                                (address: any, index: number) => {
                                  if (address?.types[0] == "locality") {
                                    City = address.long_name;
                                  }
                                  if (address?.types[0] == "country") {
                                    Country = address.long_name;
                                  }
                                }
                              )}
                              <span className="text-center">
                                {`${City}${
                                  City !== "" && Country !== "" ? "," : ""
                                } ${Country}`}
                              </span>
                            </div>
                            <div className="flex justify-center">
                            {filterTypes &&(
                                <p className="mt-1 capitalize text-center w-[80%]  text-sm flex justify-center">Types: <span className='text-sm ml-2 text-white text-ellipsis overflow-hidden whitespace-nowrap'>{ filterTypes.replaceAll("_"," ").replaceAll(",",", ") }</span> </p>
                            )}
                            </div>
                            <div className="flex items-center gap-x-2 justify-center my-2">
                              {reviewArr &&
                                reviewArr.map((review, index) => {
                                  if (index < activities?.details?.rating) {
                                    return <FilledStar key={index} />;
                                  } else {
                                    return <BlankStar key={index} />;
                                  }
                                })}
                              {activities.details.rating && (
                                <span className="text-white text-sm">
                                  {"("}
                                  {activities?.details?.rating}
                                  {")"}
                                </span>
                              )}
                            </div>
                            {activities.details.user_ratings_total && (
                              <div className="flex items-center gap-x-2 justify-center my-2">
                                <span className="text-white text-sm">
                                  Reviews:{" "}
                                </span>
                                <span className=" text-sm">
                                  {"("}
                                  {activities?.details?.user_ratings_total}
                                  {")"}
                                </span>
                              </div>
                            )}
                            {/* {activities.details.user_ratings_total && (
                              <div className="flex items-center gap-x-2 justify-center my-2">
                              <span className="text-white text-sm">Reviews: </span>
              <span className=" text-sm">{"("}{activities?.details?.user_ratings_total}{")"}</span>
                              </div>
              )} */}
                          </div>
                          <div></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default ActivitiesSlider;
