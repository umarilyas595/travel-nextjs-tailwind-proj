import React from 'react'
import axios from "axios"
import { API_URL } from '@/config/constant'

const DetailsCall = async (query:string) => {

    return await axios.get(`${API_URL}/location/details/${query}/en`)
    .then(async (response) => response)
        .catch((error)=>{
            console.log(error,"error")
        })
}

const DetailsCallByGoogle = async (query:string) => {
    return await axios.get(`${API_URL}/google/placedetails?name=${query}`)
    .then(async (response) => response)
    .catch((error)=>{
        console.log(error,"error")
    })
}

const getLocationImagesById = async (id:string) => {
    return await axios.get(`${API_URL}/location/photos/${id}`)
    .then(async (response) => response)
    .catch((error)=>{
        console.log(error,"error")
    })
}

export {
    DetailsCallByGoogle,
    getLocationImagesById
}


export default DetailsCall