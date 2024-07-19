import React from 'react'
import axios from "axios"
import { API_URL } from '@/config/constant'

const ReviewsCall = async () => {

    return await axios.get(`${API_URL}/reviews`)
    .then(async (response) => {
        console.log(response,"reviews res")
        let reviewsData = response.data
        return reviewsData
})
.catch((error)=>{
    console.log(error,"error")
})
}
export default ReviewsCall