import BlueButton, { BlueButtonOutLined } from '@/components/UIComponents/Buttons/BlueButton';
import InputField from '@/components/UIComponents/InputField/InputField';
import SelectField from '@/components/UIComponents/InputField/SelectField';
import TimerOutlined from '@/components/icons/TimerOutlined';
import { useAlertContext } from '@/contextapi/Alert';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setItineraryDays } from '@/redux/reducers/itinerarySlice';
import React, { useEffect, useRef, useState } from 'react'

interface IAddInItineraryForm {
    show: boolean
    setShow: (value: boolean) => void
    openLocation: any
}

const AddInItineraryForm = ({show, openLocation, setShow}: IAddInItineraryForm) => {

    const formRef = useRef(null)
    const addInItineraryRef = useRef<HTMLDivElement | null>(null)

    const formInitialField = {
        startTime: "",
        endTime: "",
        day: ""
    }
    const [visible, setVisible] = useState(false);
    const [formFields, setForlFields] = useState(formInitialField)
    const [formErrors, setFormErrors] = useState(formInitialField)

    const { itineraryDays } = useAppSelector(state => state.itineraryReducer)
    const { showAlert } = useAlertContext()
    const dispatch = useAppDispatch()

    const convertTime = (t: string) =>{
        let [h,...rest]=t.split(":");
        return (h == "12" ? "12" : Number(h)%12) + ":" + rest.join(":") + ( Number(h) < 12 ? " AM": " PM");
    }

    const storeLocation = () => {

        if(formFields.day && formFields.endTime && formFields.startTime && openLocation)
        {
            let _startTime = convertTime(formFields.startTime)
            let _endTime = convertTime(formFields.endTime)
            let days: any[] = [...itineraryDays]
            
            let index = days.findIndex((day) => day.day === formFields.day)
        
            days[index] = {...days[index]}
        
            days[index].times = [...days[index].times, {
                time: `${_startTime} - ${_endTime}`,
                location: openLocation
            }]
            console.log('days', days)
            dispatch(setItineraryDays([...days]))
        
            setForlFields(formInitialField)
            setShow(false)
            showAlert({title: `<b>${openLocation.name}</b> added in ${formFields.day}`, type: "success"})
        }
        else
        {
            setFormErrors({
                day: formFields.day == "" ? "Day cannot be empty!" : "",
                startTime: formFields.startTime == "" ? "Start time cannot be empty!" : "",
                endTime: formFields.endTime == "" ? "End time cannot be empty!" : ""
            })
        }
    }

    useEffect(() => {
        if(addInItineraryRef?.current)
        {
            if(show)
            {
                addInItineraryRef.current?.classList.remove('hidden')
                addInItineraryRef.current?.classList.add('flex')
                setTimeout(() => {
                    addInItineraryRef.current?.classList.remove('opacity-0')
                }, 200);
            }
            else
            {
                addInItineraryRef?.current?.classList.add('opacity-0')
                setTimeout(() => {
                    addInItineraryRef?.current?.classList.add('hidden')
                addInItineraryRef?.current?.classList.remove('flex')
                }, 200);
            }
        }
    }, [addInItineraryRef, show])

    return (
        <div ref={addInItineraryRef} className="fixed top-0 right-0 bottom-0 left-0 bg-[rgba(0,0,0,0.5)] z-[10] flex justify-center items-center">
        <div
            ref={formRef}
            id="location-to-visit-form"
            className={`block absolute max-w-[471px] p-8 bg-white rounded-xl border border-[#EBEBEB] left-1/2} z-10 transition-all duration-300`}>
            <div className="relative">
                <span
                    className="absolute top-[-2.5em] right-[-2.4rem] w-[30px] h-[30px] bg-[#F9F9F9] flex justify-center items-center rounded-full p-2 cursor-pointer select-none"
                    onClick={() => {
                    setForlFields(formInitialField)
                    setShow(false)
                    }}
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                    </svg>
                </span>
            </div>

            <div className="mb-5">
                <InputField
                    type="time"
                    label="Start Time"
                    className="w-full"
                    placeholder="Choose time"
                    value={formFields.startTime}
                    onChange={(e) => {
                    setFormErrors({
                        ...formErrors, startTime: e.target.value == "" ? "Start time cannot be empty!" : ""
                    })
                    setForlFields({...formFields, startTime: e.target.value})
                    }}
                    icon={<TimerOutlined />}
                />
                {
                    formErrors.startTime && <div className="text-red-500 text-sm">{formErrors.startTime}</div>
                }
            </div>

            <div className="mb-5">
                <InputField
                    type="time"
                    label="End time"
                    className="w-full mb-5"
                    placeholder="Choose time"
                    value={formFields.endTime}
                    onChange={(e) => {
                    setFormErrors({
                        ...formErrors, endTime: e.target.value == "" ? "End time cannot be empty!" : ""
                    })
                    setForlFields({...formFields, endTime: e.target.value})
                    }}
                    icon={<TimerOutlined />}
                />
                {
                    formErrors.endTime && <div className="text-red-500 text-sm">{formErrors.endTime}</div>
                }
            </div>

            <div className="mb-5">
                <SelectField
                    label="Choose day"
                    placeholder="Select ..."
                    data={
                        itineraryDays.map(itinerary => {
                            return {
                            id: itinerary.day,
                            name: itinerary.day
                            }
                        })
                    }
                    className={`mr-2 sm:my-2 my-5 w-full`}
                    styling={{
                        shadow: "drop-shadow-xl ",
                        left: "0px",
                        top: "70px",
                    }}
                    value={formFields.day}
                    onChange={(val) => {
                    setFormErrors({
                        ...formErrors, day: val == "" ? "Day cannot be empty!" : ""
                    })
                    setForlFields({...formFields, day: val})
                    }}
                    onAdditionalChange={(_data) => {}}
                />
                {
                    formErrors.day && <div className="text-red-500 text-sm">{formErrors.day}</div>
                }
            </div>

            <div className="flex justify-between">
                <BlueButtonOutLined
                    title="Cancel"
                    className="w-[150px]"
                    onClick={() => {
                    setForlFields(formInitialField)
                    setVisible(false)
                    }}
                />

                <BlueButton title="Save" className="w-[150px]" onClick={(e) => storeLocation()} />
            </div>
        </div>
        </div>
    )
}

export default AddInItineraryForm