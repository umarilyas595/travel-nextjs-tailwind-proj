import axios from "axios"
import { API_URL } from '@/config/constant'

const TopCitiesIncrement = async (id:string | number) => {

    return await axios.post(`${API_URL}/top-capital-search/increment/${id}`)
    .then(async (response) => {
        let location_res = response.data
        return location_res
    })
    .catch((error)=>{
        console.log(error,"error")
    })
}

export default TopCitiesIncrement