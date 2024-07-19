import axios from "axios"
import { API_URL } from '@/config/constant'

const PrioritiesIncrement = async (id:string | number) => {

    return await axios.post(`${API_URL}/top-priority-search/increment/${id}`)
    .then(async (response) => {
        let occasion = response.data
        return occasion
    })
    .catch((error)=>{
        console.log(error,"increment decline")
    })
}

export default PrioritiesIncrement