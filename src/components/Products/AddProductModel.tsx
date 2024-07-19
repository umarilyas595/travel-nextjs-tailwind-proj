import React, { useState } from 'react'
import PopupWithOverlay from '../UIComponents/Popup/PopupWithOverlay'
import InputField from '../UIComponents/InputField/InputField'
import TimerOutlined from '../icons/TimerOutlined'
import SelectField from '../UIComponents/InputField/SelectField'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setItineraryDays } from '@/redux/reducers/itinerarySlice'
import BlueButton from '../UIComponents/Buttons/BlueButton'

interface ITripPlanPopup {
    restaurant: any | null
    show: boolean
    onClose: () => void
}

const AddProductModel = ({restaurant, show, onClose}: ITripPlanPopup) => {

    const { itineraryDays } = useAppSelector(state => state.itineraryReducer)
    const formInitialField = {
        startTime: "",
        endTime: "",
        day: ""
    }
    
    const [formFields, setForlFields] = useState(formInitialField)

    const convertTime = (t: string) =>{
        let [h,...rest]=t.split(":");
        return (h == "12" ? "12" : Number(h)%12) + ":" + rest.join(":") + ( Number(h) < 12 ? " AM": " PM");
    }

    const dispatch = useAppDispatch()
    const storeLocation = () => {

        if(formFields.day && formFields.endTime && formFields.startTime && restaurant)
        {
          let _startTime = convertTime(formFields.startTime)
          let _endTime = convertTime(formFields.endTime)
          let days: any[] = [...itineraryDays]
          
          let index = days.findIndex((day) => day.day === formFields.day)
    
          days[index] = {...days[index]}
    
          days[index].times = [...days[index].times, {
            time: `${_startTime} - ${_endTime}`,
            location: restaurant
          }]
    
          dispatch(setItineraryDays([...days]))
    
          setForlFields(formInitialField)
          onClose()
        }
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    return (
        <PopupWithOverlay show={show} onClose={() => onClose()} wrapperClass="w-max" childrenParentClass="overflow-visible" >  
            <div className="max-h-[900vh] max-w-[500px] h-full"> 
            <InputField
                type="time"
                label="Start Time"
                className="w-full mb-5"
                placeholder="Choose time"
                value={formFields.startTime}
                onChange={(e) => setForlFields({...formFields, startTime: e.target.value})}
                icon={<TimerOutlined />}
            />

            <InputField
                type="time"
                label="End time"
                className="w-full mb-5"
                placeholder="Choose time"
                value={formFields.endTime}
                onChange={(e) => setForlFields({...formFields, endTime: e.target.value})}
                icon={<TimerOutlined />}
            />

            <SelectField
                label="Choose day"
                placeholder="Select ..."
                data={days.map(d => {return {id: d, name: d}})}
                className={`mr-2 sm:my-2 my-5 w-full`}
                styling={{
                    shadow: "drop-shadow-xl ",
                    left: "0px",
                    top: "70px",
                }}
                value={formFields.day}
                onChange={(val) => {
                    setForlFields({...formFields, day: val})
                }}
                onAdditionalChange={(_data) => {}}
            />

            <BlueButton title="Save" className="w-full" onClick={(e) => storeLocation()} />
            </div>
        </PopupWithOverlay>
    )
}

export default AddProductModel