import axios from "axios"
import { API_URL } from '@/config/constant'

const SearchLocation = async (query:string) => {

    return await axios.get(`${API_URL}/world-countries-cities/findByText?text=${query}`)
    .then(async (response) => {
        let location_res = response.data
        return location_res
    })
    .catch((error)=>{
        console.log(error,"error")
    })
}

export default SearchLocation