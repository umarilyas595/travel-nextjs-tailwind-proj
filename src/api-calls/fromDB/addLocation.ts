import axios from "axios"
import { API_URL } from '@/config/constant'

const AddLocation = async (newLocation:string) => {

    return await axios.post(`${API_URL}/top-country-search/`,{name: newLocation})
    .then(async (response) => {
        console.log(response,"increment sucessfully")
        let location = response.data
        return location
    })
    .catch((error)=>{
        console.log(error,"increment decline")
    })
}

export default AddLocation