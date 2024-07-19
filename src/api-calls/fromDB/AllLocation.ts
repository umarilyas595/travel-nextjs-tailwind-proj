import axios from "axios"
import { API_URL } from '@/config/constant'

const AllLocation = async () => {

    return await axios.get(`${API_URL}/world-countries-cities/?pageSize=100&page=1`)
    .then(async (response) => {
        let location_res = response.data
        return location_res
    })
    .catch((error)=>{
        console.log(error,"error")
    })
}

export default AllLocation