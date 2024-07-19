import React, { useState } from 'react'
import { Rating } from 'react-simple-star-rating'

export default function index({setRating}:any) {
    
    const handleRating1 = (rate: number) => {
        console.log(rate)
        setRating(rate)
    };

    const tooltipArray = [
        "Terrible",
        "Terrible+",
        "Bad",
        "Bad+",
        "Average",
        "Average+",
        "Great",
        "Great+",
        "Awesome",
        "Awesome+"
    ];

    const fillColorArray = [
        "#f17a45",
        "#f17a45",
        "#f19745",
        "#f19745",
        "#f1a545",
        "#f1a545",
        "#f1b345",
        "#f1b345",
        "#f1d045",
        "#f1d045"
    ];

    return (
        <>
        <Rating 
            onClick={handleRating1}
            size={30}
            transition
            allowFraction
            fillColorArray={fillColorArray}
            SVGstyle={ { 'display':'inline' } }
        />
        </>
    )
}
