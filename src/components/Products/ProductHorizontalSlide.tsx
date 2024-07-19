import React, { useRef, useState, useEffect } from "react";
import Section from "../UIComponents/Section";
import ComponentTitle from "../UIComponents/ComponentTitle";
import SliderComponent from "../UIComponents/Sliders/Slider";
import ModalSliderComponent from "../UIComponents/Sliders/modalSlider";
import { BlankStar, FilledStar } from "../icons/Stars";
import InputField from "../UIComponents/InputField/InputField";
import TimerOutlined from "../icons/TimerOutlined";
import BlueButton, {
  BlueButtonOutLined,
} from "../UIComponents/Buttons/BlueButton";
import { IProductHorizontalSlide } from "@/interfaces";
import styles from "./ProductHorizontalSlide.module.css";
import BlankLocation from "public/images/blank-location.jpg";
import Image from "next/image";
import Link from "next/link";
import SelectField from "../UIComponents/InputField/SelectField";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setItineraryDays } from "@/redux/reducers/itinerarySlice";
import { useAlertContext } from "@/contextapi/Alert";
import { Tooltip } from "@mui/material";
import { setItem } from "@/redux/reducers/PlacedetailSlice";

const ProductHorizontalSlide = ({
  Title,
  Description = "",
  data,
  isAddButton,
  isHover = true,
  isDesc,
  url,
  locationsState,
  type = "detail-card",
  v_type = "",
  slidesToShow = 4,
  isAutomate = true,
  route
}: IProductHorizontalSlide) => {

  const skelton = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [openLocation, setOpenLocation] = useState<any | null>(null);
  const { show, item } = useAppSelector(state => state.PlacedetailSlice);
  const slideRef = useRef<null | HTMLDivElement>(null);
  const formRef = useRef<null | HTMLDivElement>(null);

  const { itineraryDays } = useAppSelector(state => state.itineraryReducer)

  useEffect(() => {
    if(locationsState.length > 0){
      setLocations(locationsState);
    }else{
      setLocations([])
    }
  }, [locationsState]);

  useEffect(() => {
    console.log(locations,"locations")
    if (locations.length > 0) {
      setLoading(false);
    }else{
      setLoading(true)
    }
  }, [locations]);

  const [visible, setVisible] = useState(false);
  // const [xPosition, setXPosition] = useState(0);
  // const [yPosition, setYPosition] = useState(0);
  const reviewArr = new Array(5).fill(1);

  const formInitialField = {
    startTime: "",
    endTime: "",
    day: ""
  }

  const [formFields, setForlFields] = useState(formInitialField)
  const [formErrors, setFormErrors] = useState(formInitialField)


  const placeForm = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    formRef.current?.classList.add("hidden");
    setTimeout(() => {
      formRef.current?.classList.remove("hidden");
    }, 300);

    if (slideRef.current) {
      // let xposition =
      //   event.clientX -
      //   slideRef.current?.offsetLeft -
      //   slideRef.current?.offsetWidth;
      // let yposition =
      //   event.clientY -
      //   slideRef.current?.offsetTop -
      //   slideRef.current?.offsetHeight;

      // setXPosition(xposition);
      // setYPosition(yposition);
      setVisible(true);
    }
  };

  const { showAlert } = useAlertContext()

  const dispatch = useAppDispatch()
  const storeLocation = () => {

    if(formFields.day && formFields.endTime && formFields.startTime && openLocation)
    {
      let _startTime = convertTime(formFields.startTime)
      let _endTime = convertTime(formFields.endTime)
      let days: any[] = [...itineraryDays]
      
      let index = days.findIndex((day) => day.day === formFields.day)

      days[index] = {...days[index]}

      days[index].times = [...days[index].times, {
        time: `${_startTime} - ${_endTime}`,
        location: openLocation
      }]

      dispatch(setItineraryDays([...days]))

      setForlFields(formInitialField)
      setVisible(false)
      showAlert({title: `<b>${openLocation.name}</b> added in ${formFields.day}`, type: "success"})
    }
    else
    {
      setFormErrors({
        day: formFields.day == "" ? "Day cannot be empty!" : "",
        startTime: formFields.startTime == "" ? "Start time cannot be empty!" : "",
        endTime: formFields.endTime == "" ? "End time cannot be empty!" : ""
      })
    }
  }

  const convertTime = (t: string) =>{
    let [h,...rest]=t.split(":");
    return (h == "12" ? "12" : Number(h)%12) + ":" + rest.join(":") + ( Number(h) < 12 ? " AM": " PM");
  }


  const dragStartFunc = (e: React.DragEvent<HTMLDivElement>, item: any) => {
    e.dataTransfer?.setData("product", JSON.stringify(item));
    console.log("on drap", e.dataTransfer.getData("product"));
  };

  return (
    <Section className="relative mx-auto">
      {!loading ? (
          <div className="flex flex-col items-center">
          <ComponentTitle title={Title} />
        <p className="text-[var(--gray)] max-w-[650px] my-5 md:px-0 px-2 text-center">We keep track of what cities are on the rise and which ones are falling so you can always stay ahead of the curve!</p>
          </div>
        ):(
          <div className="md:px-0 px-5">
          <div className="animate-pulse flex items-center justify-center mb-4 bg-gray-300 rounded dark:bg-gray-700 max-w-[400px] w-full h-[30px]"></div>
        <div className="animate-pulse flex items-center justify-center mb-4 bg-gray-300 rounded dark:bg-gray-700 max-w-[600px] w-full h-[10px]"></div>
        <div className="animate-pulse flex items-center justify-center mb-4 bg-gray-300 rounded dark:bg-gray-700 max-w-[300px] w-full h-[10px]"></div>
        </div>
        )}
      <div ref={slideRef} id="location-to-visit-slide" className="mt-10">
        {route == "Trending Location" ? (
          <ModalSliderComponent>
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
            : locations?.map((location: any, index:number) => {
                let image_path =
                  location.images === "" ? BlankLocation.src : location.images;
                let address = location.formatted_address
                  ? location.formatted_address
                  : location.address_obj?.address_string;

                let isExistLocArr: any[] = itineraryDays.map(itinerary => itinerary.times.map(time => time.location.name === location.name))
                let locArrBoolean: boolean[] = [].concat(...isExistLocArr)
                let isExistInItinerary = locArrBoolean.includes(true)

                return (
                    <div key={index} className={`px-2 md:max-w-[300px] h-[310px] w-full md:mt-0 mt-10 ${v_type == "3" && "cursor-move" }`} >
                      <Tooltip title={(v_type === "3") ? "Dragable in itinerary days." : ""}>
                      <div className={`grid grid-cols-1 ${v_type == "3" ? 'rounded-3xl shadow-lg h-max' : 'rounded-xl shadow-sm h-full'} border overflow-hidden relative ${styles["slider_card"]}`} draggable={(v_type === "3") ? true : false} onDragStart={(e) => dragStartFunc(e, location)} >
                        <div className={`${ type == "title-card" ? 'h-[310px]' : 'h-[178px]'} bg-gray-100 relative`} >
                         {route !== "Trending Location" && (
                           <div className={`absolute top-0 left-0 z-[1] flex sm:justify-center justify-start ${styles.tag} ${isExistInItinerary ? styles.blue : styles.green}`}> {isExistInItinerary ? 'In' : 'Out'} </div>
                         )}
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
                          {
                            (isHover == true) && (
                              <div
                                className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center ${styles["hover_overlay"]}`}
                              >
                                {
                                  isAutomate && (
                                    <Link
                                      href={`/trip-plan?address=${JSON.stringify(address)}&location_id=${location.location_id ?? ''}&place_id=${location.place_id ?? ''}&v_type=${v_type}`}
                                      className="h-[40px] rounded-md bg-[#009DE2] text-white hover:bg-transparent border hover:border-[#009DE2] hover:text-white w-[170px] flex justify-center items-center"
                                    >
                                      Automate My Trip
                                    </Link>
                                  )
                                }
                                <button
                                  className="h-[40px] rounded-md text-white border border-white mt-5 w-[170px] hover:bg-[#009DE2]"
                                  onClick={() => {
                                    console.log("location", location);
                                    dispatch(setItem({
                                      locaiton_id: location.location_id,
                                      place_id: location.place_id,
                                    }));
                                  }}
                                >
                                  More Info
                                </button>
                              </div>
                            )
                          }
                        </div>
                        <div className={`${type == "title-card" ? "absolute bottom-4 left-4 text-white font-bold text-[25px] pe-5" : "p-4"}`}>
                          <div className="flex justify-center items-center mb-2 relative px-5">
                            <div className="w-[90%]">
                              <h4 className={`overflow-hidden overflow-ellipsis whitespace-nowrap w-full text-center`} >
                                {location.name}
                              </h4>
                            </div>
                            
                            {isAddButton && (
                              <div
                                className="flex justify-end items-center gap-2 cursor-pointer"
                                onClick={(e) => {
                                  setOpenLocation(location)
                                  placeForm(e)
                                }}
                              >
                                <span className="text-[11px] text-[var(--green)]">
                                  Add
                                </span>
                                <span className="w-[23px] h-[23px] rounded-full bg-[var(--lite-green)] hover:bg-[var(--green)] text-[var(--green)] hover:text-white flex justify-center items-center transition-all duration-300">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-[15px] h-[15px]"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 4.5v15m7.5-7.5h-15"
                                    />
                                  </svg>
                                </span>
                              </div>
                            )}
                          </div>
                          {
                            url == "variation_2" && (
                              <div className="flex flex-wrap justify-center gap-2 items-center my-2">
                                <span>{location?.rating ? location?.rating : ""}</span>
                                {
                                  reviewArr &&
                                  reviewArr.map((review, index) => {
                                    if (index < location.rating) {
                                      return <FilledStar key={index} />;
                                    } else {
                                      return <BlankStar key={index} />;
                                    }
                                  })
                                }
                                <span className="text-[var(--lite-gray)]">
                                  {location.user_ratings_total ? `(${location.user_ratings_total})` : ""}
                                </span>
                              </div>
                            )
                          }
                          {url == "variation_3" && (
                            <div className="flex gap-2 items-center absolute top-[7px] right-[7px] bg-white px-3 border rounded-lg">
                              <span>{location?.rating}</span>
                              <FilledStar />
                            </div>
                          )}
                          {isDesc && (
                            <p className="text-[15px] text-[var(--gray)]">
                              
                            </p>
                          )}
                        </div>
                      </div>
                      </Tooltip>
                    </div>
                );
              })}
        </ModalSliderComponent>
        ):(
        <SliderComponent slidesToShow={slidesToShow} >
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
            : locations?.map((location: any, index:number) => {
                let image_path =
                  location.images === "" ? BlankLocation.src : location.images;
                let address = location.formatted_address
                  ? location.formatted_address
                  : location.address_obj?.address_string;

                let isExistLocArr: any[] = itineraryDays.map(itinerary => itinerary.times.map(time => time.location.name === location.name))
                let locArrBoolean: boolean[] = [].concat(...isExistLocArr)
                let isExistInItinerary = locArrBoolean.includes(true)

                return (
                    <div key={index} className={`px-2 md:max-w-[300px] h-[310px] w-full md:mt-0 mt-10 ${v_type == "3" && "cursor-move" }`} >
                      <Tooltip title={(v_type === "3") ? "Dragable in itinerary days." : ""}>
                      <div className={`grid grid-cols-1 ${v_type == "3" ? 'rounded-3xl shadow-lg h-max' : 'rounded-xl shadow-sm h-full'} border overflow-hidden relative ${styles["slider_card"]}`} draggable={(v_type === "3") ? true : false} onDragStart={(e) => dragStartFunc(e, location)} >
                        <div className={`${ type == "title-card" ? 'h-[310px]' : 'h-[178px]'} bg-gray-100 relative`} >
                         {route !== "Trending Location" && (
                           <div className={`absolute top-0 left-0 z-[1] flex sm:justify-center justify-start ${styles.tag} ${isExistInItinerary ? styles.blue : styles.green}`}> {isExistInItinerary ? 'In' : 'Out'} </div>
                         )}
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
                          {
                            (isHover == true) && (
                              <div
                                className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center ${styles["hover_overlay"]}`}
                              >
                                {
                                  isAutomate && (
                                    <Link
                                      href={`/trip-plan?address=${JSON.stringify(address)}&location_id=${location.location_id ?? ''}&place_id=${location.place_id ?? ''}&v_type=${v_type}`}
                                      className="h-[40px] rounded-md bg-[#009DE2] text-white hover:bg-transparent border hover:border-[#009DE2] hover:text-white w-[170px] flex justify-center items-center"
                                    >
                                      Automate My Trip
                                    </Link>
                                  )
                                }
                                <button
                                  className="h-[40px] rounded-md text-white border border-white mt-5 w-[170px] hover:bg-[#009DE2]"
                                  onClick={() => {
                                    console.log("location", location);
                                    dispatch(setItem({
                                      locaiton_id: location.location_id,
                                      place_id: location.place_id,
                                    }));
                                  }}
                                >
                                  More Info
                                </button>
                              </div>
                            )
                          }
                        </div>
                        <div className={`${type == "title-card" ? "absolute bottom-4 left-4 text-white font-bold text-[25px] pe-5" : "p-4"}`}>
                          <div className="grid grid-cols-2 justify-center items-center mb-2 relative px-5">
                            <div>
                              <h4 className={`overflow-hidden overflow-ellipsis whitespace-nowrap ${isAddButton ? "col-span-1" : "col-span-2"} `} >
                                {location.name}
                              </h4>
                            </div>
                            
                            {isAddButton && (
                              <div
                                className="flex justify-end items-center gap-2 cursor-pointer"
                                onClick={(e) => {
                                  setOpenLocation(location)
                                  placeForm(e)
                                }}
                              >
                                <span className="text-[11px] text-[var(--green)]">
                                  Add
                                </span>
                                <span className="w-[23px] h-[23px] rounded-full bg-[var(--lite-green)] hover:bg-[var(--green)] text-[var(--green)] hover:text-white flex justify-center items-center transition-all duration-300">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-[15px] h-[15px]"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 4.5v15m7.5-7.5h-15"
                                    />
                                  </svg>
                                </span>
                              </div>
                            )}
                          </div>
                          {
                            url == "variation_2" && (
                              <div className="flex flex-wrap justify-center gap-2 items-center my-2">
                                <span>{location?.rating ? location?.rating : ""}</span>
                                {
                                  reviewArr &&
                                  reviewArr.map((review, index) => {
                                    if (index < location.rating) {
                                      return <FilledStar key={index} />;
                                    } else {
                                      return <BlankStar key={index} />;
                                    }
                                  })
                                }
                                <span className="text-[var(--lite-gray)]">
                                  {location.user_ratings_total ? `(${location.user_ratings_total})` : ""}
                                </span>
                              </div>
                            )
                          }
                          {url == "variation_3" && (
                            <div className="flex gap-2 items-center absolute top-[7px] right-[7px] bg-white px-3 border rounded-lg">
                              <span>{location?.rating}</span>
                              <FilledStar />
                            </div>
                          )}
                          {isDesc && (
                            <p className="text-[15px] text-[var(--gray)]">
                              
                            </p>
                          )}
                        </div>
                      </div>
                      </Tooltip>
                    </div>
                );
              })}
        </SliderComponent>
        )}
      </div>

      <div
        ref={formRef}
        id="location-to-visit-form"
        className={`${
          !visible ? "hidden" : "block"
        } fixed top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[471px] p-8 bg-white rounded-xl border border-[#EBEBEB] z-10 transition-all duration-300 ${
          styles.visitCard
        }`}
      >
        <div className="relative">
          <span
            className="absolute top-[-2.5em] right-[-2.4rem] w-[30px] h-[30px] bg-[#F9F9F9] flex justify-center items-center rounded-full p-2 cursor-pointer select-none"
            onClick={() => {
              setForlFields(formInitialField)
              setVisible(false)
            }}
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

        <div className="mb-5">
          <InputField
            type="time"
            label="Start Time"
            className="w-full"
            placeholder="Choose time"
            value={formFields.startTime}
            onChange={(e) => {
              setFormErrors({
                ...formErrors, startTime: e.target.value == "" ? "Start time cannot be empty!" : ""
              })
              setForlFields({...formFields, startTime: e.target.value})
            }}
            icon={<TimerOutlined />}
          />
          {
            formErrors.startTime && <div className="text-red-500 text-sm">{formErrors.startTime}</div>
          }
        </div>

        <div className="mb-5">
          <InputField
            type="time"
            label="End time"
            className="w-full mb-5"
            placeholder="Choose time"
            value={formFields.endTime}
            onChange={(e) => {
              setFormErrors({
                ...formErrors, endTime: e.target.value == "" ? "End time cannot be empty!" : ""
              })
              setForlFields({...formFields, endTime: e.target.value})
            }}
            icon={<TimerOutlined />}
          />
          {
            formErrors.endTime && <div className="text-red-500 text-sm">{formErrors.endTime}</div>
          }
        </div>

        <div className="mb-5">
          <SelectField
            label="Choose day"
            placeholder="Select ..."
            data={itineraryDays.filter(itin => itin.times.length > 0).map(itinerary => {
                return {
                  id: itinerary.day,
                  name: itinerary.day
                }
              })
            }
            className={`mr-2 sm:my-2 my-5 w-full`}
            styling={{
              shadow: "drop-shadow-xl ",
              left: "0px",
              top: "70px",
            }}
            value={formFields.day}
            onChange={(val) => {
              setFormErrors({
                ...formErrors, day: val == "" ? "Day cannot be empty!" : ""
              })
              setForlFields({...formFields, day: val})
            }}
            onAdditionalChange={(_data) => {}}
          />
          {
            formErrors.day && <div className="text-red-500 text-sm">{formErrors.day}</div>
          }
        </div>

        <div className="flex justify-between">
          <BlueButtonOutLined
            title="Cancel"
            className="w-[150px]"
            onClick={() => {
              setForlFields(formInitialField)
              setVisible(false)
            }}
          />

          <BlueButton title="Save" className="w-[150px]" onClick={(e) => storeLocation()} />
        </div>
      </div>
    </Section>
  );
};

export default ProductHorizontalSlide;
