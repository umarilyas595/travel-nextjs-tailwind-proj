import React from 'react'
import styles from "./reviews.module.css"
import Review from './review'

interface IReviews {
    className?: string
    style?: any,
    show: boolean
    loading: boolean
    data: any[] | null
    isCenterAlign?: boolean
    isboxShadow?: boolean
    textSmall?: boolean
}

const Reviews = ({show, loading, data, className='', style, isCenterAlign = false, isboxShadow = true, textSmall = false}:IReviews) => {

    const skelton = ["1", "2", "3", "4", "5", "6", "7", "8"];

    return (
        show ? <div className={`my-10 md:my-20 ${className}`} style={style}>
            {loading === true
            ? skelton.map((show: any, index: number) => {
                return (
                    <div
                    key={index}
                    role="status"
                    className="w-full animate-pulse p-8 my-10 shadow rounded-xl"
                    >
                        <div className="flex flex-wrap justify-between items-center mb-4">
                            <div className="h-[40px] bg-gray-200 rounded-md dark:bg-gray-700 w-[300px] mb-4"></div>
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                        </div>
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
                                <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                        </div>
                        <span className="sr-only">Loading...</span>
                    </div>
                );
            })
            : data!=null && data.length > 0 ? data.map((client: any, index: number) => {
                return <Review key={index} client={client} isCenterAlign={isCenterAlign} isboxShadow={isboxShadow} textSmall={textSmall} />
            }) : (
                <div className="text-center mt-5">
                    <p className="bg-gray-50 rounded-xl py-2">Reviews not found!</p>
                </div>
            )
            }
        </div> : <></>
    )
}

export default Reviews