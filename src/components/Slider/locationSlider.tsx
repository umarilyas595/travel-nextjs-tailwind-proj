import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CSS from "./location.module.css";
import ComponentTitle from "../UIComponents/ComponentTitle";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BlankLocation from "public/images/blank-location.jpg";
import CardSkelton from "../UIComponents/card_skelton";
import DetailModal from '../tripPlanningCard/TripPlanPopup';


export default function LocationSlider() {
  const skelton = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([])
  const { locationsState }: any = useAppSelector((state) => state.locationReducer);
  const [showTripPopup, setShowTripPopup] = useState(false);
  const [item, setItem] = useState({});

  useEffect(() => {
    setLocations(locationsState)
  }, [locationsState]);

  useEffect(()=>{
    if(locations.length > 0){
      setLoading(false)
    }
  },[locations])

  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={CSS["slick-next"]}
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
        className={CSS["slick-prev"]}
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
    infinite: false,
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
        breakpoint: 1160,
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
        breakpoint: 600,
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
  };

  const route = useRouter()

  return (
    <div className="w-full flex justify-center mt-20 relative px-10">
      <div className="sm-width">
        <div className="lg:w-[45%] md:w-[60%] w-[95%] flex flex-col sm:items-start items-center">
          <ComponentTitle title="Trending Locations" />
          <p className="text-[var(--gray)] sm:text-start text-center">
            We keep track of what cities are on the rise and which ones are
            falling so you can stress less and focus more on living your best
            vacation life!
          </p>
        </div>
        <div className="mt-10">
          <Slider {...settings}>
            {loading === true
              ? skelton.map((limit: string, index: number) => {
                  return (
                    <div
                    key={index}
                      role="status"
                      className="max-w-sm rounded animate-pulse h-[350px] relative px-3"
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
              : locations?.map(
                (
                  location: any,
                  index
                ) => {
                  let image_path = location.images === "" ? BlankLocation.src  : location.images
                  let address = location.formatted_address ? location.formatted_address : location.address_obj?.address_string
                  return (
                    <div key={index} className="px-3">
                      <div className={`relative md:mt-0 mt-5 h-[350px] w-full rounded-xl overflow-hidden cursor-pointer ${CSS["slider_card"]}`}>
                        <img src={image_path} alt={image_path} style={{objectFit: "cover"}} />
                        <div className="absolute inset-0" style={{background: 'linear-gradient(0deg, rgb(0 0 0 / 70%), transparent)'}}></div>
                        <h1 className="absolute bottom-4 left-6 text-white font-bold text-[25px] pe-5">{location.name}</h1>
                        <div className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center ${CSS["hover_overlay"]}`}>
                          <Link href={`/trip-plan?address=${address}&location_id=${location.location_id ?? ''}&place_id=${location.place_id ?? ''}`} className="h-[40px] rounded-md bg-[#009DE2] text-white hover:bg-transparent border hover:border-[#009DE2] hover:text-white w-[170px] flex justify-center items-center">
                            Automate My Trip
                          </Link>
                          <button className="h-[40px] rounded-md text-white border border-white mt-5 w-[170px] hover:bg-[#009DE2]" onClick={()=> {
                            setItem({
                              location_id: location.location_id,
                              place_id: location.place_id,
                            })
                            setShowTripPopup(true)
                            }}>
                            More Info
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </Slider>
        </div>
      </div>
      <DetailModal item={item} show={showTripPopup} onClose={() => {
                setShowTripPopup(false)
            }} />
    </div>
  );
}
