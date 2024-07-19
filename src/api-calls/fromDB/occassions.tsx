import axios from "axios"
import { API_URL } from '@/config/constant'

const Occassions = async () => {

    return await axios.get(`${API_URL}/top-occasion-search`)
    .then(async (response) => {
        let occasion = response.data
        return occasion
    })
    .catch((error)=>{
        console.log(error,"error")
    })
}

export default Occassions