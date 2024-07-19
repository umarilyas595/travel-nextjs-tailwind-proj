import React from 'react'
import styles from "./SmallStory.module.css"

interface ISmallStory {
    item?: any
    positioning: any
    className?: string
}

const SmallStory = ({positioning, item, className = ''}:ISmallStory) => {

    const description = item?.location_id ? item?.description : item?.editorial_summary?.overview

    return description && description.trim() !== '' ? (
        <div className={`sm-width`}>
            <div className={`${positioning == "inline" ? "grid grid-cols-12 items-center" : "flex flex-col"} gap-4 my-10 md:my-20 p-10 rounded-xl bg-white ${styles.small_story_wrapper} ${className}`}>
                <p className="gilroy font-bold sm:text-[38px] text-[24px] leading-[45.94px] md:col-span-3 col-span-12 md:text-start text-center">Story Of {item?.name}.</p>
                <div className={`md:col-span-8 col-span-12 text-[#656262] ${positioning == "inline" ? "md:mt-0 mt-10" : "mt-10"}`}>
                    <p className="text-base leading-[24px] md:text-start text-center">{description}</p>
                    {/* <p className="text-base leading-[24px] md:text-start text-center">February is the cheapest month to fly to Bali, has cheaper accommodation and is quieter as a result of the rainy season.</p> */}
                </div>
            </div>
        </div>
    ) :  <></>
}

export default SmallStory