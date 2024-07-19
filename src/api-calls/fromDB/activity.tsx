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

const ActivitiesCallFromDB = async () => {

    return await axios.get(`${API_URL}/trending-activities`)
    .then(async (response) => {
        let activity_res = response.data
        // let _store_locations: any = []
        // for (let index = 0; index < activity_res.length; index++) {
        //         let detail_Data: any = await _getDetails(activity_res[index].location_id ? activity_res[index].location_id : activity_res[index].place_id)
        //         _store_locations.push({
        //             ...activity_res[index], details: detail_Data.result
        //         })
            
        // }
        return activity_res
    })
    .catch((error)=>{
        console.log(error,"error")
    })
}

export default ActivitiesCallFromDB