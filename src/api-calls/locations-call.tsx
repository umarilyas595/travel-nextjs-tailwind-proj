import React from 'react'
import axios from "axios"
import { API_URL } from '@/config/constant'

const _getlocationImages = async (photo_reference: string | number, max_width="400", cancelToken="") => {

    let config: any = { params: { photo_ref: photo_reference, max_width: max_width } }
    if(cancelToken)
    {
        config.cancelToken = cancelToken
    }

    let images_Data: any = await axios.get(`${API_URL}/google/placephotos/`, config)
    .then(img_response => img_response.data.url)
    .catch((error)=>{
        console.log(error,"photos api failed")
        return ""
    })
    return images_Data
}

const _getDetails = async (location_id:string | number) => {
    let detailData:any = await axios.get(`${API_URL}/google/placedetails?name=${location_id}&fields=`)
    .then((response)=>{
        return response.data
    })
    .catch((error)=>{
        console.log(error,"error")
    })
    return detailData
}

const LocationsCall = async (query:any, isDetail = true) => {

    return await axios.get(`${API_URL}/google/textsearch?place=${query}`)
    .then(async (response) => {
        let location_res = response.data.results
        let _store_locations: any = []
        for (let index = 0; index < location_res.length; index++) {
            if(location_res[index].photos){
                let images_Data: any = await _getlocationImages(location_res[index].photos[0].photo_reference)
                let validCondition = location_res[index].types && location_res[index].types.length > 2 && !location_res[index].types.includes('lodging')

                if(isDetail && validCondition)
                {
                    let detail_Data: any = await _getDetails(location_res[index].location_id ? location_res[index].location_id : location_res[index].place_id)
                    _store_locations.push({
                        ...location_res[index], images: images_Data, image: {image: [{url:images_Data}]}, details: detail_Data.result
                    })
                }
                else if(validCondition)
                {
                    _store_locations.push({
                        ...location_res[index], images: images_Data, image: {image: [{url:images_Data}]}
                    })
                }
            }else{
                _store_locations.push({
                    ...location_res[index], images: "", image: {image: [{url:""}]}
                })
            }
        }
        return _store_locations
    })
    .catch((error)=>{
        console.log(error,"error")
    })
}


const LocationsDurationCall = async (origin:string, destination: string) => {

    return await axios.get(`${API_URL}/google/distancemeasure?origin=${origin}&destination=${destination}`)
    .then(async (response) => {
        return {status: 200, data: response.data}
    })
    .catch((error)=>{
        console.log(error,"error")
        return {status: 404, data: {}}
    })
}

export {
    _getlocationImages,
    LocationsDurationCall
}

export default LocationsCall