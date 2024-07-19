import axios from "axios"
import { API_URL } from '@/config/constant'

const TopCountries = async () => {

    return await axios.get(`${API_URL}/top-country-search`)
    .then(async (response) => {
        let location_res = response.data
        return location_res
    })
    .catch((error)=>{
        console.log(error,"error")
    })
}

export default TopCountries