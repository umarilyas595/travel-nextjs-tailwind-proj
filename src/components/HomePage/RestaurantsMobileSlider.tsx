import { useState, useRef, useEffect } from "react";
import { FilledStar, BlankStar } from "../icons/Stars";
import Image from "next/image";
import React from "react";
import LocationIcon from "../icons/Location";
import Map from "/public/images/full-map-transparent.png";
import Link from "next/link";
import ComponentTitle from "../UIComponents/ComponentTitle";
import { useRouter } from "next/navigation";
import BlankLocation from "public/images/blank-location.jpg";
import styles from "./style.module.css";
import AddProductModel from "../Products/AddProductModel";
import Section from "../UIComponents/Section";
import Slider from "react-slick";
import { setItem } from "@/redux/reducers/PlacedetailSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface IProduct {
  title: string;
  isAddButton?: boolean;
  rows?: string;
  restaurantsState?: any;
}

const Products = ({
  title = "Title",
  isAddButton,
  rows,
  restaurantsState,
}: IProduct) => {
  const PriceLevel = [
    { price_level: 0, value: "",type: "Free" },
    { price_level: 1, value: "$",type: "Inexpensive" },
    { price_level: 2, value: "$$",type: "Moderate" },
    { price_level: 3, value: "$$$",type: "Expensive" },
    { price_level: 4, value: "$$$$",type: "Very Expensive" },
  ];
  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`cursor-pointer select-none  ${styles["restaurants_arrow_next_mobile"]}`}
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
        className={`cursor-pointer select-none ${styles["restaurants_arrow_prev_mobile"]}`}
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
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    // afterChange,
};
  const reviewArr = new Array(5).fill(1);
  const skelton = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
  ];
  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurant] = useState([]);
  const slideRef = useRef<null | HTMLDivElement>(null);
  const formRef = useRef<null | HTMLDivElement>(null);

  // const [visible, setVisible] = useState(false);
  // const [xPosition, setXPosition] = useState(0);
  // const [yPosition, setYPosition] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [openRestaurant, setOpenRestaurant] = useState(null);
  // const [postPerPage, setPostPerPage] = useState(8);
  // const [currentPage, setCurrentPage] = useState(1);

  // const indexOfLastPost = currentPage * postPerPage;
  // const indexOfFirstPost = indexOfLastPost - postPerPage;
  // const currentPost = restaurantData.slice(indexOfFirstPost, indexOfLastPost);

  const { show, item } = useAppSelector((state) => state.PlacedetailSlice);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setRestaurant(restaurantsState);
  }, [restaurantsState]);

  useEffect(() => {
    if (restaurantData?.length > 0) {
      setLoading(false);
    }
  }, [restaurantData]);

  const placeForm = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    formRef.current?.classList.add("hidden");
    setTimeout(() => {
      formRef.current?.classList.remove("hidden");
    }, 300);

    if (slideRef.current) {
      // let xposition =
      //   event.clientX -
      //   slideRef.current?.offsetLeft -
      //   slideRef.current?.offsetWidth / 3;
      // let yposition =
      //   event.clientY -
      //   slideRef.current?.offsetTop -
      //   slideRef.current?.offsetHeight / 3;
      // setXPosition(xposition);
      // setYPosition(yposition);
      // setVisible(true);
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
    <div className="relative px-14">
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
      <div className="w-full flex justify-center sm:px-0 px-3">
        <Section className="relative">
          <div className="flex flex-col items-center">
            <ComponentTitle title={title} />
            <p className="text-[var(--gray)] sm:max-w-[550px] my-5 text-center">
              Great food is the make or break between a good and a great travel
              experience, so never settle with these top restaurants in the
              entire world!
            </p>
          </div>

          {/* <div className={`grid grid-cols-1 md:grid-cols-${rows}`}> */}
          <Slider {...settings}>
            {loading === true
              ? skelton.map((show: string, index: number) => {
                  return (
                    <div
                      key={index}
                      role="status"
                      className="md:px-6 md:my-4 my-8 px-0 animate-pulse bg-none"
                    >
                      <div className="rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 h-full w-full shadow">
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
              : restaurantData?.slice(0, restaurantData.length - (restaurantData.length % 8)).map((restaurant: any, index: number) => {
                  let City = "";
                  let Country = "";
                  let pricelevel = "";
                  let parseImageArray = JSON.parse(restaurant.image);
                  let image_path =
                    parseImageArray.image.length > 0
                      ? parseImageArray.image[0].url
                      : BlankLocation.src;
                  let address = restaurant.details.formatted_address;
                  let link = `/trip-plan?address=${address}&location_id=${
                    restaurant.location_id ?? ""
                  }&place_id=${restaurant.place_id ?? ""}&restaurants=true`;
                  let filterTypes: any = "";
                  const filter = restaurant?.details?.types?.filter((type:string)=>{
                    return type !== "point_of_interest" && type !== "establishment"
                  })
                  if(filter?.length > 0){
                    filterTypes = filter.toString()
                  }
                  return (
                    <div
                      key={index}
                      className="md:my-4 my-8 sm:px-6 lg:mt-0 mt-14 h-full"
                    >
                      <div
                        className={`rounded-xl overflow-hidden border border-[#C9D2DD] grid grid-cols-1 lg:grid-cols-2 bg-white h-full w-full relative ${styles["slider_card"]}`}
                      >
                        <div className="relative w-full h-full">
                          <img
                            src={image_path}
                            alt={image_path}
                            className="object-cover h-[300px] w-full cursor-pointer "
                          />
                        </div>
                        <div className="p-7">
                          <div className="flex justify-center items-start">
                            <Link href={link}>
                              <h4 className="text-2xl font-semibold gilroy text-center text-ellipsis overflow-hidden whitespace-nowrap max-w-[270px] w-max mx-auto" title={restaurant.name}>
                                {restaurant.name}
                              </h4>
                            </Link>
                            {isAddButton && (
                              <div
                                className="flex justify-end items-center gap-2 cursor-pointer"
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
                            <span className="ml-2 text-center">
                              {restaurant?.details?.address_components?.forEach(
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
                            </span>
                          </div>
                          <div className="flex items-center gap-x-2 justify-center my-2">
                            {reviewArr &&
                              reviewArr.map((review, index) => {
                                if (index < restaurant?.details?.rating) {
                                  return <FilledStar key={index} />;
                                } else {
                                  return <BlankStar key={index} />;
                                }
                              })}
                            {restaurant.details.rating && (
                              <span className="text-gray-500 text-sm">
                                {"("}
                                {restaurant?.details?.rating}
                                {")"}
                              </span>
                            )}
                          </div>
                          {restaurant.details.user_ratings_total && (
                            <div className="flex items-center gap-x-2 justify-center my-2">
                              <span className="text-black text-sm">
                                Reviews:{" "}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {"("}
                                {restaurant?.details?.user_ratings_total}
                                {")"}
                              </span>
                            </div>
                          )}
                          {restaurant.details.price_level && (
                            PriceLevel.forEach((price:any)=>{
                             if(price.price_level == restaurant.details.price_level){
                              pricelevel = price.value
                             }
                            })
                          )}
                          <div className="flex justify-center">
                            {filterTypes !== "" &&(
                                <p className="mt-1 capitalize text-center w-[80%]  text-sm flex justify-center">Types: <span className='text-sm ml-2 text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap'>{ filterTypes.replaceAll("_"," ").replaceAll(",",", ") }</span> </p>
                            )}
                            </div>
                          {pricelevel && <div className="flex items-center gap-x-2 justify-center my-2">
                              <span className="text-black text-sm">
                                Price Level:{" "}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {pricelevel}
                              </span>
                            </div>}
                          <div className="h-[50px]">
                            {restaurant?.details?.editorial_summary
                              ?.overview && (
                              <p className="font-normal text-[15px] leading-[28px] text-[var(--gray)] text-center text-ellipsis overflow-hidden line-clamp-2">
                                {
                                  restaurant?.details?.editorial_summary
                                    ?.overview
                                }
                              </p>
                            )}
                          </div>
                        </div>
                        {!isAddButton && (
                          <div
                            className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center cursor-pointer ${styles["hover_overlay"]}`}
                            title={restaurant.name} >
                            <button
                              onClick={(e) => onSetAddress(e, link)}
                              className="h-[40px] rounded-md bg-[#009DE2] text-white hover:bg-transparent border hover:border-[#009DE2] hover:text-white w-[170px]"
                            >
                              Automate My Trip
                            </button>
                            <button
                              className="h-[40px] rounded-md text-white border border-white mt-5 w-[170px] hover:bg-[#009DE2]"
                              onClick={() => {
                                dispatch(
                                  setItem({
                                    locaiton_id: restaurant.location_id,
                                    place_id: restaurant.place_id,
                                    details: restaurant
                                  })
                                );
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
          {/* </div> */}
          {/* {restaurantData.length > postPerPage && (
            <div className="flex justify-center mt-10">
            <BlueButton onClick={() => {
              setPostPerPage(postPerPage + 8) 
            }} title={"Load more"} />
            </div>
      )} */}
        </Section>
      </div>

      <AddProductModel
        show={openModal}
        restaurant={openRestaurant}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default Products;
