import React from 'react'
import style from "./spin-loader.module.css"
import icon from "/public/fav.png"
import Image from 'next/image'
const Spinloader = () => {
    return (
        <div className="absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 z-[3]">
            <div className="w-[100px] h-[100px] bg-gray-100 rounded-full flex flex-wrap justify-center items-center large-shadow">
                <div id={style.leftborder} className="absolute inset-0 bg-transparent border-8 border-transparent border-l-[var(--blue)] rounded-full"></div>
                <Image src={icon} alt='icon' className="p-[.5rem]" />
            </div>
        </div>
    )
}

export default Spinloader