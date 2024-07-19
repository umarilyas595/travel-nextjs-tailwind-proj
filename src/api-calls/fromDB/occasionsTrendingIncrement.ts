import axios from "axios"
import { API_URL } from '@/config/constant'

const OccassionsIncrement = async (id:string | number) => {

    return await axios.post(`${API_URL}/top-occasion-search/increment/${id}`)
    .then(async (response) => {
        console.log(response,"increment sucessfully")
        let occasion = response.data
        return occasion
    })
    .catch((error)=>{
        console.log(error,"increment decline")
    })
}

export default OccassionsIncrement