import axios from "axios"
import { API_URL } from '@/config/constant'

const LocationsCallFromDB = async () => {

    return await axios.get(`${API_URL}/trending-locations`)
    .then(async (response) => {
        let location_res = response.data
        return location_res
    })
    .catch((error)=>{
        console.log(error,"error")
    })
}

export default LocationsCallFromDB