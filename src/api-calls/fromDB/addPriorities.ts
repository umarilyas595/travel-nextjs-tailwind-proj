import axios from "axios"
import { API_URL } from '@/config/constant'

const AddPriorities = async (newPriority:string) => {

    return await axios.post(`${API_URL}/top-priority-search/`,{name: newPriority})
    .then(async (response) => {
        console.log(response,"increment sucessfully")
        let priorities = response.data
        return priorities
    })
    .catch((error)=>{
        console.log(error,"increment decline")
    })
}

export default AddPriorities