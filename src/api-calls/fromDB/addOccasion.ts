import axios from "axios"
import { API_URL } from '@/config/constant'

const AddOccasions = async (newOccasion:string) => {

    return await axios.post(`${API_URL}/top-occasion-search/`,{name: newOccasion})
    .then(async (response) => {
        console.log(response,"increment sucessfully")
        let occasion = response.data
        return occasion
    })
    .catch((error)=>{
        console.log(error,"increment decline")
    })
}

export default AddOccasions