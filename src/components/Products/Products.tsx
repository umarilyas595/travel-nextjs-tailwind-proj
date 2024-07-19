import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import React from "react";
import ProductImg from "/public/static/restaurants.jpg";
import LocationIcon from "../icons/Location";
import Map from "/public/images/full-map-transparent.png";
import Link from "next/link";
import ComponentTitle from "../UIComponents/ComponentTitle";
// import Modal from "../Modal";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { setLocationAddress } from "@/redux/reducers/locationSlice";
import BlankLocation from "public/images/blank-location.jpg";
import styles from "./ProductHorizontalSlide.module.css";
import DetailModal from "../tripPlanningCard/TripPlanPopup";
import PopupWithOverlay from "../UIComponents/Popup/PopupWithOverlay";
import InputField from "../UIComponents/InputField/InputField";
import TimerOutlined from "../icons/TimerOutlined";
import AddProductModel from "./AddProductModel";
import Section from "../UIComponents/Section";
import BlueButton from '../UIComponents/Buttons/BlueButton';

interface IProduct {
  title: string;
  isAddButton?: boolean;
  isHover?: boolean
  rows?: string;
  v_type?: string
}

const Products = ({ title = "Title", isAddButton, rows, v_type="", isHover=true }: IProduct) => {
  const skelton = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurant] = useState([]);
  const slideRef = useRef<null | HTMLDivElement>(null);
  const formRef = useRef<null | HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [showTripPopup, setShowTripPopup] = useState(false);
  const [item, setItem] = useState({});
  const [openRestaurant, setOpenRestaurant] = useState(null);
  const [postPerPage, setPostPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPost = restaurantData.slice(indexOfFirstPost, indexOfLastPost);

  const { restaurantsState }: any = useAppSelector(
    (state) => state.restaurantsReducer
  );

  const { itineraryDays } = useAppSelector(state => state.itineraryReducer)

  useEffect(() => {
    setRestaurant(restaurantsState);
  }, [restaurantsState]);

  useEffect(() => {
    if (restaurantData.length > 0) {
      setLoading(false);
    }
  }, [restaurantData]);

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

  const route = useRouter();
  const onSetAddress = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
    link: string
  ) => {
    e.preventDefault();
    route.push(link);
  };

  return (
    <div className="relative">
      <Image
        src={Map}
        alt="Map 1"
        className="absolute left-10 top-[5rem] -z-10 select-none"
      />

      <Image
        src={Map}
        alt="Map 1"
        className="absolute right-10 top-[70%] -z-10 select-none"
      />
      <div className="w-full flex justify-center px-0">
        <Section className="relative">
          <div className="flex flex-col items-center">
          <ComponentTitle title={title} />
          <p className="text-[var(--gray)] sm:max-w-[550px] my-5">
            Great food is the make or break between a good and a great travel
            experience, so never settle with these top restaurants in the entire
            world!
          </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-${rows}`}>
            {loading === true
              ? skelton.map((show: string, index: number) => {
                  return (
                    <div
                      key={index}
                      role="status"
                      className="md:mx-4 md:my-4 my-8 mx-0 rounded shadow animate-pulse"
                    >
                      <div className="rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 h-full w-full">
                        <div className="flex items-center justify-center h-full mb-4 bg-gray-300 rounded dark:bg-gray-700">
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
                        <div className="p-7">
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
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
                              <div className="w-32 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                          </div>
                        </div>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  );
                })
              : currentPost?.map((restaurant: any, index: number) => {
                let City = ""
                let Country = ""
                  let image_path =
                    restaurant.images === ""
                      ? BlankLocation.src
                      : restaurant.images;
                  let address = restaurant.formatted_address
                    ? restaurant.formatted_address
                    : restaurant.address_obj?.address_string;
                  let link = `/trip-plan?address=${JSON.stringify(address)}&location_id=${
                    restaurant.location_id ?? ""
                  }&place_id=${restaurant.place_id ?? ""}&restaurants=true&v_type=${v_type}`;

                  let isExistLocArr: any[] = itineraryDays.map(itinerary => itinerary.times.map(time => time.location.name === restaurant.name))
                  let locArrBoolean: boolean[] = [].concat(...isExistLocArr)
                  let isExistInItinerary = locArrBoolean.includes(true)

                  return (
                    <div key={index} className="md:pr-6 md:my-4 my-8 pr-0">
                      <div
                        className={`rounded-xl overflow-hidden border border-[#C9D2DD] grid grid-cols-1 lg:grid-cols-2 bg-white h-full w-full relative ${styles["slider_card"]}`}
                      >
                        <div className={`absolute top-0 left-0 z-[1] flex sm:justify-center justify-start ${styles.tag} ${isExistInItinerary ? styles.blue : styles.green}`}> {isExistInItinerary ? 'In' : 'Out'} </div>
                        <div className="relative w-full h-full">
                          <img
                            src={image_path}
                            alt={image_path}
                            className="object-cover lg:h-[200px] h-[250px] w-full cursor-pointer "
                          />
                        </div>
                        <div className="p-7">
                          <div className="flex justify-between items-start">
                            <h4 className="text-2xl font-semibold gilroy" title={restaurant.name}>
                              {restaurant.name.substring(0, 30)} {restaurant.name.length > 30 && '...'}
                            </h4>
                            {isAddButton && (
                              <div
                                className="flex justify-end items-center gap-2 cursor-pointer z-10"
                                onClick={() => {
                                  setOpenRestaurant(restaurant);
                                  setOpenModal(true);
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
                          <div className="flex my-2 justify-center">
                            <div className="w-[25px] h-[25px] bg-[#9AB044] rounded-full p-1">
                              <LocationIcon className="h-4 w-4" />
                            </div>
                            <span className="ml-2">
                            {restaurant?.details?.address_components?.forEach((address: any, index: number) => {
                                  if(address?.types[0] == "locality"){
                                    City = address.long_name
                                  }
                                  if(address?.types[0] == "country"){
                                    Country = address.long_name
                                  }
                                }
                              )}
                                <span className="text-center">
                              {`${City}${City !== "" && Country !=="" ? "," : ""} ${Country}`}
                              </span>
                            </span>
                          </div>
                        </div>
                        {isHover && (
                            <div
                              className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center ${styles["hover_overlay"]}`}
                            >
                              <button
                                onClick={(e) => onSetAddress(e, link)}
                                className="h-[40px] rounded-md bg-[#009DE2] text-white hover:bg-transparent border hover:border-[#009DE2] hover:text-white w-[170px]"
                              >
                                Automate My Trip
                              </button>
                              <button
                                className="h-[40px] rounded-md text-white border border-white mt-5 w-[170px] hover:bg-[#009DE2]"
                                onClick={() => {
                                  setItem({
                                    locaiton_id: restaurant.location_id,
                                    place_id: restaurant.place_id,
                                  });
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
          </div>
          {restaurantData.length > postPerPage && (
            <div className="flex justify-center mt-10">
            <BlueButton onClick={() => {
              setPostPerPage(postPerPage + 8) 
            }} title={"Load more"} />
            </div>
      )}
        </Section>
      </div>
      <DetailModal
        item={item}
        show={showTripPopup}
        onClose={() => {
          setShowTripPopup(false);
        }}
      />

      <AddProductModel
        show={openModal}
        restaurant={openRestaurant}
        onClose={() => setOpenModal(false)}
      />
      
    </div>
  );
};

export default Products;
