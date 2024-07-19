import React, { useState } from 'react'
import WorldMapImage from "public/images/worldmap.png"
import Image from 'next/image'

interface ICard_skelton {
    type?: 'card' | 'list'
}

export default function Card_skelton({ type = "list" }:ICard_skelton) {
    const skelton = ["1","2","3"]

    const array = ["1","2","3","4","5","6","7"]

    return type == "card" ? skelton.map((list:string,skIndex:number)=>{
        return (
            <div key={skIndex} role="status" className="max-w-sm p-4 rounded-lg border-2 border-dashed border-gray-200 shadow animate-pulse md:p-6 dark:border-gray-700">
                <div className="h-[30px] w-[150px] bg-gray-200 rounded-lg dark:bg-gray-700 mb-2.5"></div>
                <div role="status" className="max-w-sm p-4 rounded-lg border-2 border-dashed border-gray-200 shadow animate-pulse md:p-6 dark:border-gray-700 flex flex-col gap-y-7 mt-10">
                    {array.map((list:string,index:number)=>{
                        return <div key={index} className="h-[30px] bg-gray-200 rounded-lg dark:bg-gray-700 w-48 mb-4"></div>
                    })}
                </div>
                <span className="sr-only">Loading...</span>
            </div>
        )
    })
    : (
        <div className="grid sm:grid-cols-2 grid-cols justify-center w-full">
            <div className="p-2">
            {
                skelton.map((list:string,skIndex:number)=>{
                    return <div key={skIndex} className="mb-10">
                    <div className='h-[20px] min-w-[100px] max-w-[150px] w-full bg-gray-200 rounded-lg dark:bg-gray-700 animate-pulse'></div>
                    {
                        array.slice(0, 3).map((list:string,index:number)=>{
                            return <div key={index} className='p-4 large-shadow min-w-[100px] max-w-[300px] w-full rounded-xl my-5 ml-5 animate-pulse'>
                                <div className="grid grid-cols-2">
                                    <div className='h-[20px] min-w-[100px] max-w-[200px] w-full bg-gray-200 rounded-lg dark:bg-gray-700 mr-2'></div>
                                    <div className='h-[20px] min-w-[100px] max-w-[200px] w-full bg-gray-200 rounded-lg dark:bg-gray-700 ml-2'></div>
                                </div>
                            </div>
                        })
                    }   
                    </div>
                })
            }
            </div>
            <div className="relative">
                <div className="min-h-[300px] max-h-[500px] w-full bg-gray-200 rounded-lg dark:bg-gray-700 animate-pulse sm:sticky sm:top-[130px] select-none">
                    <Image src={WorldMapImage.src} fill={true} alt='world map' className="pointer-events-none" />
                </div>
            </div>
        </div>
    )
}
