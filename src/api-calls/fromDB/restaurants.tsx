import axios from "axios"
import { API_URL } from '@/config/constant'

// const _getDetails = async (location_id:string | number) => {
//     let detailData:any = await axios.get(`${API_URL}/google/placedetails?name=${location_id}&fields=`)
//     .then((response)=>{
//         return response.data
//     })
//     .catch((error)=>{
//         console.log(error,"error")
//     })
//     return detailData
// }


const RestaurantsCallFromDB = async () => {

    return await axios.get(`${API_URL}/top-restaurants`)
    .then(async (response) => {
        let restaurants_res = response.data
        // let _store_locations: any = []
        // for (let index = 0; index < restaurants_res.length; index++) {
        //         let detail_Data: any = await _getDetails(restaurants_res[index].location_id ? restaurants_res[index].location_id : restaurants_res[index].place_id)
        //         _store_locations.push({
        //             ...restaurants_res[index], details: detail_Data.result
        //         })
            
        // }
        return restaurants_res
    })
    .catch((error)=>{
        console.log(error,"error")
    })
}

export default RestaurantsCallFromDB