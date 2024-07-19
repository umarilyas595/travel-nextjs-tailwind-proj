import axios from "axios"
import { API_URL } from '@/config/constant'

const AddCities = async (newLocation:string) => {

    return await axios.post(`${API_URL}/top-capital-search/`,{name: newLocation})
    .then(async (response) => {
        console.log(response,"increment sucessfully")
        let location = response.data
        return location
    })
    .catch((error)=>{
        console.log(error,"increment decline")
    })
}

export default AddCities