import React, { useEffect, useState } from 'react'
import PageBannerImg from "/public/images/page-banner.jpg"
import Ballon from "/public/images/baloon-transparent.png";
import Image from "next/image";
import Map from "/public/images/map-transparent.png";
import MapIcon from "/public/images/google-map-icon.png";
import { _getlocationImages } from '@/api-calls/locations-call';
import { getLocationImagesById } from '@/api-calls/location-details-call';
import Link from 'next/link';
import styles from '../Results/pageBanner.module.css'
import BannerFilter from '../Results/bannerFilter'

interface IPageBanner {
    automateLocation?: any
    survey?:any;
}

const PageBanner = ({automateLocation}: IPageBanner) => {
    
    const [bgImage , setBgImage] = useState<string | null>(null)
    const [Title, setTitle] = useState<string>('')
    

    useEffect(() => {
        const _def = async () => {
            if(automateLocation?.location_id)
            {
                let res: any = await getLocationImagesById(automateLocation.location_id)
                if(res.data.data.length > 0)
                {
                    let _imagesObject = res.data.data[0].images
                    let selectedImage = _imagesObject.original ? _imagesObject.original.url : _imagesObject.large.url
                    setBgImage(selectedImage)
                }
            }
            if(automateLocation?.place_id)
            {
                let res = await _getlocationImages(automateLocation.photos[0].photo_reference, "3000")
                setBgImage(res)
            }

            const city = automateLocation?.address_components.find((adr: any) => adr.types[0] === "administrative_area_level_1")?.long_name ?? ''
            const country = automateLocation?.address_components.find((adr: any) => adr.types[0] === "country")?.long_name ?? ''

            setTitle((country && city) ? `${city}, ${country}` : 'Trip Plan')
        }
        _def()
    }, [automateLocation])

    return (
        <div className="width px-4 relative">
            <Image
                src={Ballon}
                alt="Baloon 1"
                className="absolute left-[-30px] top-[15%] -z-10 select-none md:block hidden"
            />
            <Image
                src={Ballon}
                alt="Baloon 4"
                className="absolute right-[0px] top-[15%] -z-10 select-none md:block hidden"
            />
            <Image
                src={Map}
                alt="Map"
                className="absolute left-[-90px] bottom-[-25%] -z-10 select-none sm:flex w-[13%] md:block hidden"
            />
            <div className="h-full w-full px-4 relative lg:pb-10">
        <div className="h-[405px] w-full rounded-xl flex justify-center items-center relative">
          <Image
            src={bgImage ? bgImage : PageBannerImg.src}
            fill={true}
            alt="Trip-Banner"
            className="mx-auto select-none w-full h-full object-cover overflow-hidden rounded-xl"
          />
          <div className="absolute bottom-0 left-0 top-0 right-0 px-8 flex flex-wrap justify-center items-center xl:my-[4rem] sm-width z-5">
            <h2 className="text-white font-bold text-2xl lg:text-6xl lg:my-5 text-center w-full gilroy">
            {Title}
            </h2>
            {/* <p className="lg:mt-4 lg:mb-8 text-white text-lg max-w-[700px] text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
            </p> */}
            <div
              className={`lg:block hidden mt-4 rounded-xl ${styles["result_banner"]}`}
            >
              <BannerFilter />
            </div>
          </div>
        </div>
        <div className={`block lg:hidden ${styles["result_banner"]}`}>
          <BannerFilter />
        </div>
      </div>
            {/* <div className="h-[405px] w-full rounded-xl flex justify-center items-center relative overflow-hidden">
                <Image src={bgImage ? bgImage : PageBannerImg.src} fill={true} alt='banner' style={{objectFit: "cover"}} className="z-0" />
                <div className="absolute inset-0" style={{background: 'linear-gradient(360deg, #00000069, #00000069, transparent)'}}></div>
                <span className="font-extrabold text-5xl md:text-7xl Poppins text-white text-center z-[1]">{Title}</span>
            </div> */}
            {
                automateLocation?.url && 
                <Link href={automateLocation.url} target="_blank" className="absolute bottom-2 right-5 cursor-pointer select-none w-fit h-max rounded-xl overflow-hidden shadow">
                    <div className="relative">
                        <Image src={MapIcon} alt='Map icon' style={{objectFit: "contain"}} />
                    </div>
                </Link>
            }
        </div>
    )
}

export default PageBanner