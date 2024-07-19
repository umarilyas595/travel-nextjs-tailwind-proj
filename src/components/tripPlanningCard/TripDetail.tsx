import { DetailCall } from '@/api-calls'
import { DetailsCallByGoogle, getLocationImagesById } from '@/api-calls/location-details-call'
import ProductHorizontalSlide from '@/components/Products/ProductHorizontalSlide'
import { _getlocationImages } from '@/api-calls/locations-call'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import MapIcon from "/public/images/google-map-icon.png";
import Link from 'next/link'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CSS from "./TripDetail.module.css"
import TripDetailGoogleMap from './TripDetailGoogleMap'
import { BlankStar, FilledStar } from '../icons/Stars'
import AddInItineraryForm from './add-in-itinerary/add-in-itinerary-form'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Reviews from '../reviews/reviews'
import BlueButton from '../UIComponents/Buttons/BlueButton'
import { useRouter } from 'next/navigation'
import {BsFillTelephoneFill} from 'react-icons/bs'
import {TbWorld} from 'react-icons/tb'
import { useSearchParams } from 'next/navigation'
import LocationApi from '@/api-calls/locations-call'
import { ListItemSecondaryAction } from '@mui/material'
import { reset } from '@/redux/reducers/surveySlice'


interface ITripDetail {
    item?: {
        location_id: string
        place_id: string
        details?:any
        title?:string
    },
    title?:string
    show?:any
}
const PriceLevel = [
    { price_level: 0, value: "",type: "Free" },
    { price_level: 1, value: "$",type: "Inexpensive" },
    { price_level: 2, value: "$$",type: "Moderate" },
    { price_level: 3, value: "$$$",type: "Expensive" },
    { price_level: 4, value: "$$$$",type: "Very Expensive" },
  ];
const TripDetail = ({item,title,show}: ITripDetail) => {

    const slideRef = useRef<HTMLDivElement | null>(null)
    const params = useSearchParams()
    const [params_list, setParamsList] = useState<any>({address: '', location_id: '', place_id: '', v_type: '', restaurants: null, start_day_index: '', days_length: ''})
    const [images, setImages] = useState<any[]>([])
    const [image, setImage] = useState('')
    const [detailLoading, setDetailLoading] = useState(false)
    const [itemDetail, setItemDetail] = useState<any | null>(null)
    const [viewMore, setViewMore] = useState(false)
    const reviewArr = new Array(5).fill(1);
    const [openLocation, setOpenLocation] = useState<any | null>(null)
    const [showInItineraryModel, setShowInItineraryModel] = useState(false)
    const [zoomImage, setZoomImage] = useState(false)
    const [zoomImagePath, setZoomImagePath] = useState("")
    const [selectedImage, setSelectedImage] = useState<number>(0)
    const [showSlide, setShowSlide] = useState(false)
    const [existingActivities, setExistingActivities] = useState([])
    const [exsitingRestaurants, setExsitingRestaurants] = useState([])
    const [postPerPage, setPostPerPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [types, setTypes] = useState("")
  
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPost = itemDetail?.reviews?.slice(indexOfFirstPost, indexOfLastPost);

    const { itineraryDays } = useAppSelector(state => state.itineraryReducer)

    useEffect(() => {
        let _address: any = params.get('address')
        let _location_id: any = params.get('location_id')
        let _place_id: any = params.get('place_id')
        let _v_type: any = params.get('v_type')
        let restaurants: any = params.get('restaurants')
        let start_day_index: any = params.get('start_day_index')
        let days_length: any = params.get('days_length')

        let initialParams = {
            address: _address ?? '',
            location_id: _location_id ?? '',
            place_id: _place_id ?? '',
            v_type: _v_type ? _v_type : '2',
            restaurants: restaurants ?? '',
            start_day_index: start_day_index ?? '',
            days_length: days_length ?? ''
        }
        setParamsList(initialParams)
    }, [params])

    useEffect(() => {
        const _defItemDetail = async () => {
            if(itemDetail?.location_id)
            {
                let res: any = await getLocationImagesById(itemDetail.location_id)
                
                if(res.data.data && res.data.data.length > 0)
                {
                    let _images = []
                    for (let index = 0; index < res.data.data.length; index++) {
                        let _imagesObject = res.data.data[index].images
                        
                        let selectedImage = _imagesObject.original ? _imagesObject.original.url : _imagesObject.medium.url
                        _images.push(selectedImage)
                    }
                    setImages(_images)
                    setImage(_images[0])
                }
            }
            if(itemDetail?.place_id && itemDetail.photos)
            {
                let _images = []
                for (let index = 0; index < itemDetail.photos.length; index++) {
                    _images.push(await _getlocationImages(itemDetail.photos[index].photo_reference))
                }
                setImages(_images)
                setImage(_images[0])
            }
        }

        if(item?.details && item?.details?.image){
            if(typeof item?.details?.image == "string"){
                let res = JSON.parse(item?.details?.image)
                console.log(res,"res")
                if(res?.image?.length > 4){
                    let _images: any = res?.image?.map((image:any)=>{
                        return image.url
                    })
                    setImages(_images)
                        setImage(_images[0])
                }else{
                    _defItemDetail()
                }
            }else{
                if(typeof item?.details?.image == "object"){
                    console.log(item?.details?.image?.image,"res")
                    if(item?.details?.image?.image?.length > 4){
                        let _images: any = item?.details?.image?.image?.map((image:any)=>{
                            return image.url
                        })
                        setImages(_images)
                            setImage(_images[0])
                    }else{
                        _defItemDetail()
                    }
                }
            }
                }else{
                    _defItemDetail()
                }
    }, [itemDetail])

    const _def = async () => {
        setDetailLoading(true)
        setItemDetail(null)
        if(item?.location_id)
        {
            let item_Detail: any = await DetailCall(item?.location_id)
            setItemDetail(item_Detail?.data)
        }
        else if(item?.place_id)
        {
            let item_Detail: any = await DetailsCallByGoogle(`${item.place_id}&fields=`)
            setItemDetail(item_Detail?.data?.result)
            
        }
        setDetailLoading(false) 
    }

    useEffect(() => {
        console.log(item,"item")
        setViewMore(false)
        setImages([])
        setImage('')

            if(item?.details && item?.details?.details){
                setItemDetail(item.details?.details)
            }else{
                _def()
            }
            if(item?.title == "Trending Location" && item?.details?.name){
                _Activities()
                _Restaurants()
            }
        
    }, [item])

    const _Activities = async () => {
        let res = await LocationApi(`best activities for tourists in ${itemDetail?.name} to visit`)
        setExistingActivities(res)
      }

      const _Restaurants = async () => {
        let res = await LocationApi(`best restaurants for tourists in ${itemDetail?.name} for good food`)
        setExsitingRestaurants(res)
      }

//     useEffect(()=>{
// if(title == "Trending Location" && itemDetail?.name){
//     _Activities()
//     _Restaurants()
// }
//     },[itemDetail])

    useEffect(()=>{
if(show == true){
    setExistingActivities([])
    setExsitingRestaurants([])
}
    },[show])

    useEffect(()=>{
        let filteredArray: any = []
itemDetail?.types.map((type:string)=>{
    if(type !== "point_of_interest" && type !== "establishment"){
        filteredArray.push(type)
    }
})
let string = filteredArray.toString()
setTypes(string)
    },[itemDetail])

    const [prevBtnDisabled, setPrevBtnDisabled] = useState(false)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(false)
    function SampleNextArrow(props: any) {
        const { className, style, onClick } = props;
        return (
        <div
            className={nextBtnDisabled == true ? `cursor-pointer select-none ${CSS["activity_arrow_next_disabled"]} `: `cursor-pointer select-none  ${CSS["activity_arrow_next"]}`}
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
            className={prevBtnDisabled == true ? `cursor-pointer select-none ${CSS["activity_arrow_prev_disabled"]}` : `cursor-pointer select-none ${CSS["activity_arrow_prev"]}`}
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
        slidesToShow: 3,
        slidesToScroll: 3,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
        {
            breakpoint: 1200,
            settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
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
            slidesToScroll: 1,
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
        ]
    };

    useEffect(() => {
        if(showSlide)
        {
            slideRef.current?.classList.remove('hidden')
            setTimeout(() => {
                slideRef.current?.classList.remove('opacity-0')
            }, 200);
        }
        else
        {
            slideRef.current?.classList.add('opacity-0')
            setTimeout(() => {
                slideRef.current?.classList.add('hidden')
            }, 200);
        }
    }, [showSlide])

    const router = useRouter()

    const address = itemDetail?.formatted_address ? itemDetail.formatted_address : itemDetail?.address_obj?.address_string;

    let pricelevel = ""

    const dispatch = useAppDispatch()

    return (
        <>
        <div className='w-full sm:px-0 px-4 relative'>
            {zoomImage == true && (
                <div className="w-full h-full absolute top-0 left-0 z-10 flex items-center bg-[rgba(0,0,0,0.8)] overflow-hidden rounded-lg">
                    <div className="w-full h-full relative ">
                    <Image src={zoomImagePath} className="w-full h-full " fill={true} alt={itemDetail?.name ?? ''} style={{objectFit: "cover"}} />
                    <span 
                    className="absolute top-[1rem] right-[0.5rem] w-[30px] h-[30px] bg-[#F9F9F9] flex justify-center items-center rounded-full p-2 cursor-pointer select-none"
                    onClick={() => {
                        setZoomImage(false)
                    }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </span>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                <div className="h-[200px] w-full bg-gray-100 rounded-xl overflow-hidden relative">
                    {
                        (!detailLoading && image) ? 
                            <Image src={image} fill={true} alt={itemDetail?.name} style={{objectFit: "cover"}} blurDataURL={image} className="cursor-pointer" placeholder="blur" onClick={() => {
                                setSelectedImage(0)
                                setShowSlide(true)
                            }} /> : (
                            <div className="animate-pulse flex justify-center items-center h-full">
                                <svg
                                className="w-20 h-20 text-gray-200 dark:text-gray-600"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 16 20"
                                >
                                <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                </svg>
                            </div>
                        )
                    }
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {
                        detailLoading || images.length == 0 ? (
                            <>
                                <div className="h-[98px] max-w-[199px] bg-gray-100 rounded-xl animate-pulse flex justify-center items-center">
                                    <svg
                                    className="w-16 h-16 text-gray-200 dark:text-gray-600"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 16 20"
                                    >
                                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                    </svg>
                                </div>
                                <div className="h-[98px] max-w-[199px] bg-gray-100 rounded-xl animate-pulse flex justify-center items-center">
                                    <svg
                                    className="w-16 h-16 text-gray-200 dark:text-gray-600"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 16 20"
                                    >
                                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                    </svg>
                                </div>
                                <div className="h-[98px] max-w-[199px] bg-gray-100 rounded-xl animate-pulse flex justify-center items-center">
                                    <svg
                                    className="w-16 h-16 text-gray-200 dark:text-gray-600"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 16 20"
                                    >
                                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                    </svg>
                                </div>
                                <div className="h-[98px] max-w-[199px] bg-gray-100 rounded-xl animate-pulse flex justify-center items-center">
                                    <svg
                                    className="w-16 h-16 text-gray-200 dark:text-gray-600"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 16 20"
                                    >
                                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                    </svg>
                                </div>
                            </>
                        ) : (
                            images.slice(0,4).map((img: string, imgIndex: number) => {
                                return <div key={imgIndex} className="h-[98px] bg-gray-100 rounded-xl overflow-hidden relative">
                                    <Image src={img} fill={true} alt={`top - ${itemDetail?.name}`} style={{objectFit: "cover"}} blurDataURL={img} placeholder="blur"
                                    onClick={() => {
                                        setSelectedImage(imgIndex)
                                        setShowSlide(true)
                                    }}
                                    />
                                </div>
                            })
                        )
                    }
                </div>
            </div>
            {
                images.length > 4 && <span className="text-[var(--blue)] text-right ml-auto block cursor-pointer select-none" onClick={() => setViewMore(!viewMore)}>{viewMore ? 'Hide pics' : 'View more pics'}</span>
            }
            <div className="w-[90%] mx-auto arrow_remove mt-4">
                {
                    viewMore && (
                        images.length > 6 ? (
                    <Slider {...settings}>
                        {
                            images.slice(4).map((img: string, imgIndex: number) => {
                                return <div key={imgIndex}  className="px-1">
                                    <div className="h-[98px] w-[100%] bg-gray-100 rounded-xl overflow-hidden relative">
                                        <Image src={img} fill={true} alt={`slider - ${itemDetail?.name}`} style={{objectFit: "cover"}} blurDataURL={img} placeholder="blur"
                                        onClick={() => {
                                            setSelectedImage(imgIndex+4)
                                            setShowSlide(true)
                                        }}
                                        />
                                    </div>
                                </div>
                            })
                        }
                    </Slider>
                    ):(
                        <div className="flex justify-center items-center gap-x-10">
                            {images.slice(4).map((img: string, imgIndex: number) => {
                                return <div key={imgIndex}  className="px-1">
                                    <div className="h-[98px] w-[300px] bg-gray-100 rounded-xl overflow-hidden relative">
                                        <Image src={img} fill={true} alt={`slider - ${itemDetail?.name}`} style={{objectFit: "cover"}} blurDataURL={img} placeholder="blur"
                                        onClick={() => {
                                            setSelectedImage(imgIndex+4)
                                            setShowSlide(true)
                                        }}
                                        />
                                    </div>
                                </div>
                            })}
                        </div>
                    ))
                }
            </div>
            <div className="grid grid-cols-1 mt-10">
                <div className="relative text-center">
                    {
                        (!detailLoading && itemDetail) ? (
                            <>
                            {/* {
                                itemDetail?.url && 
                                <Link href={itemDetail?.url} target="_blank" className="absolute top-0 right-[1rem] shadow-lg rounded-xl overflow-hidden bg-white">
                                    <Image src={MapIcon} alt='map icon' className="p-2" />
                                </Link>
                            } */}
                            
                            <h3 className="font-medium gilroy text-[28px] leading-[32.96px] w-full">
                                {itemDetail?.name} <span className="text-sm text-[var(--gray)]">({
                                    itemDetail?.address_components?.find((adr: any) => adr.types[0] === "locality")?.long_name ?? (itemDetail?.address_components?.find((adr: any) => adr.types[0] === "sublocality_level_1")?.long_name ?? itemDetail?.address_components?.find((adr: any) => adr.types[0] === "postal_town")?.long_name ?? itemDetail?.address_components?.find((adr: any) => adr.types[0] === "country")?.long_name)
                                })</span>
                            </h3>
                            <p>Address: <span className='text-sm text-[var(--gray)]'>{ itemDetail.formatted_address ? itemDetail.formatted_address : itemDetail.address_obj?.address_string }</span> </p>
                            {types !== "" && item?.title !== "Trending Location" &&(
                                <p className="mt-1 capitalize">Types: <span className='text-sm text-[var(--gray)]'>{ types.replaceAll("_"," ").replaceAll(",",", ") }</span> </p>
                            )}
                            <div className="flex flex-wrap justify-center gap-2 items-center my-2">
                                <span>{itemDetail?.rating ? itemDetail?.rating : ""}</span>
                                {
                                    reviewArr &&
                                    reviewArr.map((review, index) => {
                                        if (index < itemDetail?.rating) {
                                            return <FilledStar key={index} />;
                                        } else {
                                            return <BlankStar key={index} />;
                                        }
                                    })
                                }
                                <span className="text-[var(--lite-gray)]">
                                    {itemDetail?.user_ratings_total ? `(${itemDetail?.user_ratings_total})` : ""}
                                </span>
                            </div>
                            {itemDetail?.price_level && item?.title !== "Trending Location" && (
                            PriceLevel.forEach((price:any)=>{
                             if(price.price_level == itemDetail.price_level){
                              pricelevel = price.value
                             }
                            })
                          )}
                          {pricelevel && item?.title !== "Trending Location" &&  <div className="flex items-center gap-x-2 justify-center my-2">
                              <span className="text-black text-sm">
                                Price Level:{" "}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {pricelevel}
                              </span>
                            </div>}
                            <div className="h-[3px] w-[51px] bg-[var(--blue)] my-5 mx-auto"></div>
                            
                            {
                                itemDetail?.formatted_phone_number && item?.title !== "Trending Location" && (
                                    <div className="flex items-center justify-center gap-x-3">
                                    <BsFillTelephoneFill/>
                                        <Link href={`tel:${itemDetail?.formatted_phone_number?.replaceAll('-', '')}`} className="underline hover:text-[var(--blue)]" >
                                            {itemDetail?.formatted_phone_number}
                                            </Link>
                                    </div>
                                )
                            }

                            {
                                itemDetail?.website && item?.title !== "Trending Location" && (
                                    <div className="flex items-center justify-center gap-x-3 mt-4">
                                    <TbWorld/>
                                        <Link href={itemDetail?.website} className="underline hover:text-[var(--blue)]" target="_blank
                                        ">
                                            {itemDetail?.website}
                                            </Link>
                                    </div>
                                )
                            }
                            
                            <BlueButton title="Automate my trip" className="mb-5" onClick={(e) => {
                                e.preventDefault()
                                dispatch(reset())
                                router.push(`/trip-plan?address=${address}&location_id=${itemDetail.location_id ?? ''}&place_id=${itemDetail.place_id ?? ''}&v_type=`)
                            }} />

                            {
                                itineraryDays.length > 0 && item?.title !== "Trending Location" && (
                                    <div
                                        className="flex justify-center items-center gap-2 cursor-pointer"
                                        onClick={(e) => {
                                        setOpenLocation(itemDetail)
                                        setShowInItineraryModel(true)
                                        }}
                                    >
                                        <span className="text-[14px] text-[var(--green)]">
                                        Add in Itinerary
                                        </span>
                                        <span className="w-[35px] h-[35px] rounded-full bg-[var(--lite-green)] hover:bg-[var(--green)] text-[var(--green)] hover:text-white flex justify-center items-center transition-all duration-300">
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
                                )
                            }

                            {
                                itemDetail?.hours?.weekday_text || itemDetail?.opening_hours?.weekday_text && item?.title !== "Trending Location" && (
                                    <>
                                    <h4 className="text-[15px] leading-[18px] font-bold mb-2">Hours:</h4>
                                    <div className="flex flex-wrap justify-center">
                                    {
                                        itemDetail?.location_id ?
                                        itemDetail?.hours?.weekday_text && itemDetail.hours?.weekday_text.map((time: any, index: number) => {
                                            return <div key={index} className="text-[var(--lite-gray)] font-semibold text-[14px] leading-[23px] my-1"> {time} </div>
                                        }) : itemDetail?.opening_hours?.weekday_text && itemDetail.opening_hours?.weekday_text.map((time: any, index: number) => {
                                            return <div key={index} className="text-[var(--blue)] font-semibold text-[14px] leading-[23px] m-1 bg-blue-100 px-1 rounded-full"> {time} </div>
                                        })
                                    }
                                    </div>
                                    </>       
                                )
                            }
                            </>
                        ) : (
                            <div>
                                <div className="h-[15px] max-w-[340px] mx-auto bg-gray-100 rounded-lg animate-pulse mt-3" />
                                <br />
                                <div className="h-[10px] w-[50px] mx-auto bg-gray-100 rounded-lg animate-pulse mb-3" />
                                <div className='w-full flex flex-wrap gap-4 justify-center'>
                                    <div className="h-[20px] w-[150px] bg-gray-100 rounded-lg animate-pulse my-1" />
                                    <div className="h-[20px] w-[150px] bg-gray-100 rounded-lg animate-pulse my-1" />
                                    <div className="h-[20px] w-[150px] bg-gray-100 rounded-lg animate-pulse my-1" />
                                    <div className="h-[20px] w-[150px] bg-gray-100 rounded-lg animate-pulse my-1" />
                                    <div className="h-[20px] w-[150px] bg-gray-100 rounded-lg animate-pulse my-1" />
                                    <div className="h-[20px] w-[150px] bg-gray-100 rounded-lg animate-pulse my-1" />
                                </div>
                            </div>
                        )
                    }
                </div>
                {
                    itemDetail?.url && item?.title !== "Trending Location" && (
                        <div className="w-full my-5">
                            <h4 className="text-[15px] leading-[18px] font-bold my-2 text-center">Map: <Link href={itemDetail?.url} target="_blank" className='text-[var(--blue)] font-normal hover:border-b border-[var(--blue)]'>View location</Link></h4>
                            <div className="relative h-[200px]">
                                <TripDetailGoogleMap location={itemDetail?.geometry?.location} />
                            </div>
                        </div>
                    )
                }

                {
                    !detailLoading ? (
                        (itemDetail?.description || itemDetail?.editorial_summary?.overview) &&  <div className="mt-4 w-full text-center">
                        <span className='text-[15px] leading-[18px] font-bold mb-2'>Description</span>
                        <p className="font-normal text-[15px] leading-[28px] text-[var(--gray)]">{itemDetail?.location_id ? itemDetail?.description : itemDetail?.editorial_summary?.overview}</p>
                        </div>
                    ) : (
                        <>
                        <div className="h-[20px] w-full bg-gray-100 rounded-lg animate-pulse my-2" />
                        <div className="h-[20px] w-full bg-gray-100 rounded-lg animate-pulse my-2" />
                        <div className="h-[20px] w-full bg-gray-100 rounded-lg animate-pulse my-2" />
                        </>
                    )
                }
                {
                    item?.title == "Trending Location" && (
                        <ProductHorizontalSlide 
                            locationsState={existingActivities} 
                            url="variation_2" 
                            Title={`${item?.details?.name} Best Activities`} 
                            route = {item?.title}
                            isDesc={true}
                            isHover={true}
                            v_type={"2"}
                        />
                    )
                }
                {
                    item?.title == "Trending Location" && (
                        <ProductHorizontalSlide 
                            locationsState={exsitingRestaurants} 
                            url="variation_2" 
                            Title={`${item?.details?.name} Best Restaurants`} 
                            route = {item?.title}
                            isDesc={true}
                            isHover={true}
                            v_type={"2"}
                        />
                    )
                }
                {/* Client Reviews */}
                {
                    !detailLoading && itemDetail?.reviews?.length > 0 && (
                        <>
                        <div className="w-full mt-5 text-center">
                            <span className='text-[23px] leading-[18px] font-bold mb-2'>Client Reviews</span>
                            <div className="h-[3px] w-[51px] bg-[var(--blue)] mt-5 mx-auto"></div>
                        </div>
                        <Reviews isCenterAlign={true} textSmall={true} show={true} loading={false} data={currentPost ?? []} style={{margin: "0"}} />
                        {
                            itemDetail?.reviews?.length > postPerPage && (
                                <div className="flex justify-center">
                                    <button className="border-none outline-none bg-[#009DE2] text-white h-[40px] w-[200px] rounded-lg" onClick={() => {
                                        setPostPerPage(postPerPage + 4) 
                                    }}>Load More Reviews</button>
                                </div>
                            )
                        }
                        </>
                    )
                }
                
            </div>

            <AddInItineraryForm show={showInItineraryModel} setShow={setShowInItineraryModel} openLocation={openLocation} />
        </div>

        <div ref={slideRef} className="hidden opacity-0 transition-all duration-300 fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,0.6)]">
            <div className="absolute right-[2rem] top-2 w-max h-max text-white z-[1] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 bg-[rgba(0,0,0,.2)] hover:bg-[rgba(0,0,0,.5)] rounded-full p-1"
                onClick={() => {
                    setShowSlide(false)
                }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <div className="flex flex-wrap flex-col justify-center items-center h-full relative">

                <div className="absolute left-[2rem] top-[50%] -translate-y-1/2 w-max h-max text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 cursor-pointer"
                    onClick={() => {
                        let decrement = selectedImage-1
                        setSelectedImage(decrement < 0 ? (images.length - Math.abs(decrement)) : ((decrement) % images.length))
                    }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </div>
                {
                    images.length > 0 && (
                        <div className="px-1 h-[700px] w-[1000px] mx-auto">
                            <div className="h-[100%] w-[100%] rounded-xl overflow-hidden relative mx-auto">
                                <Image src={images[selectedImage]} fill={true} alt={`slide image - ${itemDetail?.name}`} style={{objectFit: "contain"}} blurDataURL={images[selectedImage]} placeholder="blur" />
                            </div>
                        </div>
                    )
                }

                <div className="absolute right-[2rem] top-[50%] -translate-y-1/2 w-max h-max text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 cursor-pointer"
                    onClick={() => {
                        setSelectedImage((selectedImage+1) % images.length)
                    }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
                
                <div className="flex flex-wrap mt-2">
                {
                    images.map((img: string, imgIndex: number) => {
                        return <span key={imgIndex}  className={`w-[15px] h-[15px] bg-white rounded-full mx-1 cursor-pointer transition-all duration-300 ${imgIndex === selectedImage ? `border-[5px] border-[var(--blue)]` : 'hover:border-[5px] hover:border-[var(--blue)]'}`}
                        // style={{borderColor: imgIndex === selectedImage ? 'var(--blue)' : 'none'}}
                        onClick={() => {
                            setSelectedImage(imgIndex)
                        }}
                        >
                        </span>
                    })
                }
                </div>
            </div>
        </div>
        </>
    )
}

export default TripDetail