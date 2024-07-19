import React, { useRef, useState, useEffect } from "react";
import Section from "../UIComponents/Section";
import ComponentTitle from "../UIComponents/ComponentTitle";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BlankStar, FilledStar } from "../icons/Stars";
import InputField from "../UIComponents/InputField/InputField";
import TimerOutlined from "../icons/TimerOutlined";
import BlueButton, {
  BlueButtonOutLined,
} from "../UIComponents/Buttons/BlueButton";
import { IProductHorizontalSlide } from "@/interfaces";
import styles from "./style.module.css";
import BlankLocation from "public/images/blank-location.jpg";
import Image from "next/image";
import Link from "next/link";
import DetailModal from "../tripPlanningCard/TripPlanPopup";
import SelectField from "../UIComponents/InputField/SelectField";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setItineraryDays } from "@/redux/reducers/itinerarySlice";
import { reset } from "@/redux/reducers/surveySlice";
import { setItem } from "@/redux/reducers/PlacedetailSlice";

const LocationSlider = ({
  Title,
  Description = "",
  data,
  isAddButton,
  isDesc,
  url,
  locationsState,
  type = "detail-card",
  v_type = "",
  slidesToShow = 4
}: IProductHorizontalSlide) => {

  const skelton = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [openLocation, setOpenLocation] = useState<any | null>(null);
  const [showTripPopup, setShowTripPopup] = useState(false);
  const slideRef = useRef<null | HTMLDivElement>(null);
  const formRef = useRef<null | HTMLDivElement>(null);

  const { itineraryDays } = useAppSelector((state) => state.itineraryReducer);

  useEffect(() => {
    setLocations(locationsState);
  }, [locationsState]);

  useEffect(() => {
    if (locations?.length > 0) {
      setLoading(false);
    }
  }, [locations]);

  const [visible, setVisible] = useState(false);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);
  const reviewArr = new Array(5).fill(1);

  const formInitialField = {
    startTime: "",
    endTime: "",
    day: "",
  };

  function SampleNextArrow(props: any) {
    const { style, onClick } = props;
    return (
    <div
        className={`cursor-pointer select-none  ${styles["activity_arrow_next"]}`}
        style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // top: "-0.5rem"
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
    const { style, onClick } = props;
    return (
    <div
        className={ `cursor-pointer select-none ${styles["activity_arrow_prev"]}`}
        style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // top: "-0.5rem"
        }}
        onClick={onClick}
    >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
    </div>
    );
}

// const afterChange = (prev: number) => {
//     if(prev == 0){
//       setPrevBtnDisabled(true)
//     }else{
//       setPrevBtnDisabled(false)
//     }
//   };

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

  const [formFields, setForlFields] = useState(formInitialField);

  const placeForm = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    formRef.current?.classList.add("hidden");
    setTimeout(() => {
      formRef.current?.classList.remove("hidden");
    }, 300);

    if (slideRef.current) {
      let xposition =
        event.clientX -
        slideRef.current?.offsetLeft -
        slideRef.current?.offsetWidth / 3;
      let yposition =
        event.clientY -
        slideRef.current?.offsetTop -
        slideRef.current?.offsetHeight / 3;

      setXPosition(xposition);
      setYPosition(yposition);
      setVisible(true);
    }
  };

  const dispatch = useAppDispatch();
  const storeLocation = () => {
    if (
      formFields.day &&
      formFields.endTime &&
      formFields.startTime &&
      openLocation
    ) {
      let _startTime = convertTime(formFields.startTime);
      let _endTime = convertTime(formFields.endTime);
      let days: any[] = [...itineraryDays];

      let index = days.findIndex((day) => day.day === formFields.day);

      days[index] = { ...days[index] };

      days[index].times = [
        ...days[index].times,
        {
          time: `${_startTime} - ${_endTime}`,
          location: openLocation,
        },
      ];

      dispatch(setItineraryDays([...days]));

      setForlFields(formInitialField);
      setVisible(false);
    }
  };

  const convertTime = (t: string) => {
    let [h, ...rest] = t.split(":");
    return (
      (h == "12" ? "12" : Number(h) % 12) +
      ":" +
      rest.join(":") +
      (Number(h) < 12 ? " AM" : " PM")
    );
  };

  const dragStartFunc = (e: React.DragEvent<HTMLDivElement>, item: any) => {
    e.dataTransfer?.setData("product", JSON.stringify(item));
    console.log("on drap", e.dataTransfer.getData("product"));
  };

  return (
    <div className="w-full flex justify-center relative mt-20 px-10">
      <div className="sm-width flex flex-col items-center relative">
          <div className="flex flex-col items-center">
            <ComponentTitle title={Title} />
            <p className="text-[var(--gray)] max-w-[650px] my-5 md:px-0 px-2 text-center">
              {Description}
            </p>
          </div>
        
        <div ref={slideRef} id="location-to-visit-slide" className="mt-10 w-[90%] arrow_remove">
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
              : locations?.map((location: any, index) => {
                  let image_path =
                  location.image?.image?.length > 0
                      ? location.image?.image?.length > 1 ? location.image.image[1].url : location.image.image[0].url
                      : BlankLocation.src;
                  let address = location.details.formatted_address
                    ? location.details.formatted_address
                    : location.details.address_components[0].long_name +
                      location.details.address_components[1].long_name;
                  return (
                    <div
                      key={index}
                      className={`px-2 md:max-w-[300px] h-[310px] w-full md:mt-0 mt-10`}
                    >
                      <div
                        className={`rounded-xl border shadow-sm overflow-hidden h-full relative cursor-pointer ${styles["slider_card"]}`}
                      >
                        <div className="h-[310px] bg-gray-100 relative">
                          <Image
                            src={image_path}
                            alt={location.name}
                            fill={true}
                            style={{ objectFit: "cover" }}
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(0deg, rgb(0 0 0 / 70%), transparent)",
                            }}
                          ></div>
                        </div>
                        {location?.details?.address_components?.length > 0 && (
                          <div
                            className={
                              "absolute bottom-4 left-0 text-white font-bold w-full text-[16px] text-center"
                            }
                          >
                            <div className="pr-2">
                              {location?.details?.address_components?.map((address: any, index: number) => {
                                  return(
                                    <span key={index}>
                                      {address?.types[0] == "administrative_area_level_1" && (
                                        `${address.long_name}`
                                      )}
                                    </span>
                                  )
                                }
                              )}
                              {location?.details?.address_components?.map((address: any, index: number) => {
                                  return(
                                    <span key={index}>
                                      {address?.types[0] == "country" && (
                                        <>
                                        <span className="mr-2">,</span>
                                        <span>{address.long_name}</span>
                                        </>
                                      )}
                                    </span>
                                  )
                                }
                              )}
                            </div>
                            <div className="flex items-center gap-x-2 justify-center my-2">
                            {reviewArr &&
                              reviewArr.map((review, index) => {
                                if (index < location?.details?.rating) {
                                  return <FilledStar key={index} />;
                                } else {
                                  return <BlankStar key={index} />;
                                }
                              })}
                              {location.details.rating && (
              <span className="text-white text-sm">{"("}{location?.details?.rating}{")"}</span>
              )}
                              </div>
                          </div>
                        )}
                        {isAddButton == false && (
                          <div
                            className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center ${styles["hover_overlay"]}`}
                          >
                            <Link
                              href={`/trip-plan?address=${JSON.stringify(address)}&location_id=${
                                location.location_id ?? ""
                              }&place_id=${
                                location.place_id ?? ""
                              }&v_type=${v_type}`}
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
                                  locaiton_id: location.location_id,
                                  place_id: location.place_id,
                                  details: location,
                                  title: "Trending Location"
                                }));
                                setShowTripPopup(true);
                              }}
                            >
                              More Info
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
          </Slider>
        </div>

        <div
          ref={formRef}
          id="location-to-visit-form"
          className={`${
            !visible ? "hidden" : "block"
          } absolute max-w-[471px] p-8 bg-white rounded-xl border border-[#EBEBEB] left-1/2} z-10 transition-all duration-300 ${
            styles.visitCard
          }`}
          style={{ top: yPosition, left: xPosition }}
        >
          <div className="relative">
            <span
              className="absolute top-[-2.5em] right-[-2.4rem] w-[30px] h-[30px] bg-[#F9F9F9] flex justify-center items-center rounded-full p-2 cursor-pointer select-none"
              onClick={() => setVisible(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </div>
          <InputField
            type="time"
            label="Start Time"
            className="w-full mb-5"
            placeholder="Choose time"
            value={formFields.startTime}
            onChange={(e) =>
              setForlFields({ ...formFields, startTime: e.target.value })
            }
            icon={<TimerOutlined />}
          />

          <InputField
            type="time"
            label="End time"
            className="w-full mb-5"
            placeholder="Choose time"
            value={formFields.endTime}
            onChange={(e) =>
              setForlFields({ ...formFields, endTime: e.target.value })
            }
            icon={<TimerOutlined />}
          />

          <SelectField
            label="Choose day"
            placeholder="Select ..."
            data={[
              { id: "Monday", name: "Monday" },
              { id: "Tuesday", name: "Tuesday" },
            ]}
            className={`mr-2 sm:my-2 my-5 w-full`}
            styling={{
              shadow: "drop-shadow-xl ",
              left: "0px",
              top: "70px",
            }}
            value={formFields.day}
            onChange={(val) => {
              setForlFields({ ...formFields, day: val });
            }}
            onAdditionalChange={(_data) => {}}
          />

          <div className="flex justify-between">
            <BlueButtonOutLined
              title="Cancel"
              className="w-[150px]"
              onClick={() => setVisible(false)}
            />

            <BlueButton
              title="Save"
              className="w-[150px]"
              onClick={(e) => storeLocation()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSlider;
