import React,{useState,useEffect} from 'react'
import PopupWithOverlay from '../UIComponents/Popup/PopupWithOverlay'
import TripDetail from './TripDetail'

interface ITripPlanPopup {
    item: any
    show: boolean
    onClose: () => void
    title?: string
}

const TripPlanPopup = ({item, show, onClose, title}: ITripPlanPopup) => {
const [close,setClose] = useState(false)

useEffect(()=>{
if(show == true){
    setClose(false)
}
},[show])
    return (
        <PopupWithOverlay show={show} onClose={() => {
            setClose(true),
            onClose()
        }}  >
            <TripDetail item={item} title={title} show={close} />
        </PopupWithOverlay>
    )
}

export default TripPlanPopup