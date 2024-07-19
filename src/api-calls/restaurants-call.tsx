import axios from "axios"
import { API_URL } from '@/config/constant'

// const _getlocationImages = async (location_id: string | number) => {
//     let images_Data: any = await axios.get(`${API_URL}/location/photos/${location_id}`).then(img_response => img_response.data.data)
//     return images_Data
// }

const RestaurantsCall = async () => {

    return await axios.get(`${API_URL}/location/search/best resturants`)
    .then(async (response) => {
        let restaurants_res = response.data.data
        // let _store_restaurants: any = []
        // for (let index = 0; index < restaurants_res.length; index++) {
        //     let images_Data: any = await _getlocationImages(restaurants_res[index].location_id)
        //     _store_restaurants.push({
        //         ...restaurants_res[index], images: images_Data,
        //     })
        // }
        return restaurants_res
    })
    .catch((error)=>{
        console.log(error,"error")
    })
}

export default RestaurantsCall