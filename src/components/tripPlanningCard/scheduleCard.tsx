import React,{useState, useRef,useEffect} from "react";
import CSS from './tripPlanning.module.css'
import { IPlanningCard } from "@/interfaces/TripPlan";
import InputField from "../UIComponents/InputField/InputField";
import { LocationsDurationCall } from "@/api-calls";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveLocation, setDestination, setItineraryDays } from "@/redux/reducers/itinerarySlice";
import SelectField from "../UIComponents/InputField/SelectField";
import { _calculateStartAndEndTime } from "./pricing-cards/functions";
import { useAlertContext } from "@/contextapi/Alert";

interface IScheduleCard extends IPlanningCard {
  distanceObject?: any
  time?: any
  day: string
  variation?: 'list' | 'cards-list'
}

export default function ScheduleCard({day, distanceObject, items, isDropdownButton, onOpen, time, variation = 'list'}:IScheduleCard) {

  const locationRef = useRef<HTMLSpanElement | null>(null)

  const [isShowTooltip, setIsShowTooltip] = useState(false);
  const [editTime, setEditTime] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragOverLocation, setdragOverLocation] = useState<any | null>(null)
  const [deleteTime, setDeleteTime] = useState(false)
  const [addEvent, setAddEvent] = useState(false)
  const [addNewEventValue, setaddNewEventValue] = useState("")

  const initialEditTimeFormValues = {startTime: "", endTime: ""}
  const [editTimeForm, setEditTimeForm] = useState(initialEditTimeFormValues)
  const [suggestedLocation, setSuggestedLocation] = useState('')
  const [duration, setDuration] = useState(null)
  const [destinationLocations, setDestinationLocations] = useState<any[]>([])
  const [newEvent, setNewEvent] = useState<any>({})

  const { itineraryDays, activeLocation } = useAppSelector(state => state.itineraryReducer)

  const editTimeRef = useRef<HTMLDivElement | null>(null)
  const addEventRef = useRef<HTMLDivElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  function formatTime(timeString: string | number) {
    let _timeString = typeof timeString == "number" ? timeString.toString() : timeString
    if(_timeString == "" || _timeString.search('Open') !== -1)
    {
        return _timeString
    }

    // const [hourString, minute] = _timeString.split(":");
    const hourString = _timeString.substring(0,2)
    const minute = _timeString.substring(2,4)

    return (Number(hourString) % 12 || 12) + ":" + (Number(minute.substring(0,2)) < 10 ? '0'+Number(minute.substring(0,2)) : minute) + (Number(hourString) < 12 ? " AM" : " PM");
  }

  const { showAlert } = useAlertContext()
  const dispatch = useAppDispatch()

  const onDropFunc = (e: React.DragEvent<HTMLDivElement>) => {
    let _loc = e.dataTransfer.getData('product')
    _loc = JSON.parse(_loc)
    setdragOverLocation(_loc)
  }

  const replaceConfirm = () => {
    let _itineraryDays = [...itineraryDays]
    let dayIndex = _itineraryDays.findIndex(itinerary => itinerary.day === day)
    let timeIndex = _itineraryDays[dayIndex].times.findIndex(_time => _time.location.name === items.name)
    _itineraryDays[dayIndex] = {..._itineraryDays[dayIndex]}
    _itineraryDays[dayIndex].times = [..._itineraryDays[dayIndex].times]
    _itineraryDays[dayIndex].times[timeIndex] = {..._itineraryDays[dayIndex].times[timeIndex]}
    _itineraryDays[dayIndex].times[timeIndex].location = dragOverLocation

    dispatch(setItineraryDays([..._itineraryDays]))
    clearConfirm()

    showAlert({
      title: `<b>${dragOverLocation.name}</b> replaced successfully`,
      type: "success"
    })
  }

  const clearConfirm = () => {
    setdragOverLocation(null)
    setIsDragOver(false)

    showAlert({
      title: `<b>${dragOverLocation.name}</b> not replaced in itinerary`,
      type: "error"
    })
  }

  const ChangeTimeFunc = () => {

    let _itineraryDays = [...itineraryDays]
    let dayIndex = _itineraryDays.findIndex(itinerary => itinerary.day === day)
    let timeIndex = _itineraryDays[dayIndex].times.findIndex(_time => _time.location.name === items.name)
    _itineraryDays[dayIndex] = {..._itineraryDays[dayIndex]}
    _itineraryDays[dayIndex].times = [..._itineraryDays[dayIndex].times]
    _itineraryDays[dayIndex].times[timeIndex] = {..._itineraryDays[dayIndex].times[timeIndex]}
    _itineraryDays[dayIndex].times[timeIndex].suggestedTime = {..._itineraryDays[dayIndex].times[timeIndex].suggestedTime, startTime: editTimeForm.startTime, endTime: editTimeForm.endTime}

    dispatch(setItineraryDays([..._itineraryDays]))
    setEditTime(false)
    setIsShowTooltip(false)
    setEditTimeForm(initialEditTimeFormValues)
  
  }

  const delEventFunc = () => {
    let _itineraryDays = [...itineraryDays]
    let dayIndex = _itineraryDays.findIndex(itinerary => itinerary.day === day)
    _itineraryDays[dayIndex] = {..._itineraryDays[dayIndex]}
    _itineraryDays[dayIndex].times = _itineraryDays[dayIndex].times.filter(_time => _time.location !== items)
    dispatch(setItineraryDays([..._itineraryDays]))
  }

  const addNewEvent = async () => {
    let _itineraryDays = [...itineraryDays]
    let dayIndex = _itineraryDays.findIndex(itinerary => itinerary.day === day)
    _itineraryDays[dayIndex] = {..._itineraryDays[dayIndex]}
    let locIndex = _itineraryDays[dayIndex].times.findIndex(_time => _time.location === items)

    let newTime = newEvent.current_opening_hours?.weekday_text[0].split(': ')[1]
    _itineraryDays[dayIndex].times = [
      ..._itineraryDays[dayIndex].times.slice(0, locIndex+1), 
      {time: newTime, location: newEvent}, 
      ..._itineraryDays[dayIndex].times.slice(locIndex, _itineraryDays[dayIndex].times.length)
    ]

    let suggestedTime = await _calculateStartAndEndTime(_itineraryDays[dayIndex].times, locIndex+1)
    _itineraryDays[dayIndex].times[locIndex+1] = {..._itineraryDays[dayIndex].times[locIndex+1], suggestedTime: suggestedTime}

    dispatch(setItineraryDays([..._itineraryDays]))
  }

  const onClickItem = () => {
    onOpen(items);
  }

  useEffect(() => {
    const _def = async () => {
      let duration = await LocationsDurationCall(distanceObject.origin, distanceObject.destination)
      if(duration.status == 200 && duration.data.rows[0]?.elements[0]?.duration?.text)
      {
        setDuration(duration.data.rows[0].elements[0].duration.text)
      }
    }
    if(distanceObject.origin && distanceObject.destination && !duration &&  (!time.suggestedTime?.duration_time || time.suggestedTime?.duration_time == ""))
    {
      _def()
    }
  }, [distanceObject])

  useEffect(() => {
    if(cardRef)
    {
      window.addEventListener('click', (e) => {
        if(cardRef.current)
        {
          if(!cardRef.current.contains((e.target as Element)))
          {
            setEditTime(false)
          }
        }
      })
    }
  }, [addEventRef, cardRef])


  useEffect(() => {
    if(editTime)
    {
        editTimeRef.current?.classList.remove('hidden')
        editTimeRef.current?.classList.add('flex')
        setTimeout(() => {
          editTimeRef.current?.classList.remove('opacity-0')
          editTimeRef.current?.classList.remove('-translate-y-5')
        }, 200);
    }
    else
    {
      editTimeRef.current?.classList.add('opacity-0')
      editTimeRef.current?.classList.add('-translate-y-5')
        setTimeout(() => {
          editTimeRef.current?.classList.add('hidden')
          editTimeRef.current?.classList.remove('flex')
        }, 200);
    }
  }, [editTime])

  useEffect(() => {
    if(addEvent)
    {
      if(addEventRef.current?.classList.contains('opacity-0'))
      {
        addEventRef.current?.classList.remove('hidden')
        addEventRef.current?.classList.add('flex')
        setTimeout(() => {
          addEventRef.current?.classList.remove('opacity-0')
          addEventRef.current?.classList.remove('-translate-y-5')
        }, 200);
      }
    }
    else
    {
      if(!addEventRef.current?.classList.contains('opacity-0'))
      {
        addEventRef.current?.classList.add('opacity-0')
        addEventRef.current?.classList.add('-translate-y-5')
        setTimeout(() => {
          addEventRef.current?.classList.add('hidden')
          addEventRef.current?.classList.remove('flex')
        }, 200);
      }
    }
  }, [addEvent])

  useEffect(() => {
    const _defDestinationFunc = async () => {
      let _d : any[] = await itineraryDays.filter(itinerary => itinerary.day !== day).map(itin => itin.times.filter(tim => tim.location != null).map(tim => tim.location))
      
      setDestinationLocations([].concat(..._d))
    }
    _defDestinationFunc()
  }, [itineraryDays])

  // useEffect(() => {
  //   if(activeLocation?.name == time?.location?.name && locationRef && locationRef.current)
  //   {
  //     locationRef?.current.scrollIntoView({block: "center"})
  //   }
  // }, [activeLocation])

  return (
    <>
    {
      (time.suggestedTime?.duration_time || duration) && <span className={`flex rounded-full px-2 h-max bg-[var(--blue)] text-white hover:underline text-[12px] whitespace-nowrap w-max -translate-y-full cursor-pointer select-none shadow-lg`}
      style={{textUnderlinePosition: "under"}}
      onClick={(e) => {
        e.preventDefault()
        dispatch(setDestination({origin: distanceObject.origin, destination: distanceObject.destination}))
      }}
      >{time.suggestedTime?.duration_time ? time.suggestedTime?.duration_time : duration}</span>
    }
    <div ref={cardRef}
      className={`flex gap-x-4 mb-10 h-full ${CSS["pricingCard"]} relative`}

      onDrop={(e) => onDropFunc(e)}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setIsDragOver(false)
      }}
    >
      <div className={`absolute top-[50%] translate-y-[-50%]`}>
        <div>
          <div className="w-[20px] h-[20px] bg-[#AEDCF0] rounded-full flex justify-center items-center">
            <div className="w-[10px] h-[10px] bg-[#009DE2] rounded-full"></div>
          </div>
        </div>
        <div className={`h-full ml-2 ${CSS["divider"]} absolute top-[50%] mt-[1rem]`} />
      </div>
      <span ref={locationRef}
        className={`ml-[2rem] text-[13px] w-max hover:text-[#009DE2] p-4 rounded-lg ${CSS["plan-time-wrapper"]} ${variation === "list" ? '' : 'hover:bg-white ml-2 mr-4'} ${isDragOver || activeLocation?.name == time?.location?.name ? 'bg-white text-[#009DE2] shadow-lg' : ''} cursor-pointer`} 
        onClick={() => {
          dispatch(setActiveLocation(time?.location))
        }}
        >
        <div className="flex items-center gap-2">
          <p className="gilroy text-[11px] font-semibold cursor-pointer" onClick={() => onClickItem()}>{
                !time.suggestedTime?.startTime && !time.suggestedTime?.endTime ? (
                    time.time
                ) : (
                    (time.suggestedTime?.startTime ? (formatTime(time.suggestedTime.startTime)+ ' ') : " ") + (time.suggestedTime?.endTime ? '- '+(formatTime(time.suggestedTime.endTime)) : "")
                )
            } - </p>
          <div className="flex justify-between items-center mr-2">
            <p className="font-medium cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden w-full max-w-[200px] mr-2" title={items.name} onClick={() => onClickItem()}>{suggestedLocation ? suggestedLocation : items.name}</p>
            {isDropdownButton == true ? (
              <div className="relative">
                <span
                  className={`w-[18px] block h-[13px] rounded cursor-pointer ${CSS["svg"]}`}
                  onClick={() => {
                    setIsShowTooltip(!isShowTooltip);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-[14px] h-[12px] mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
                {
                  isShowTooltip === true && (
                    <div className="absolute top-3 right-0 w-[122px] h-[110px] rounded-md shadow-lg border z-10 bg-white flex flex-col justify-between py-3 px-4">
                        <p className="text-black hover:text-[#9AB044] cursor-pointer" onClick={()=>{
                            setEditTime(true)
                        }}>Edit time</p>
                        <p className="text-black hover:text-[#9AB044] cursor-pointer" onClick={()=>{
                            setIsShowTooltip(false)
                            delEventFunc()
                        }}>Delete event</p>
                        <p className="text-black hover:text-[#9AB044] cursor-pointer" onClick={()=>{
                            setAddEvent(true)
                            }}>Add event</p>
                    </div>
                  )
                }

                <div ref={editTimeRef} className="hidden -translate-y-5 transition-all duration-300 absolute top-2 right-0 sm:w-[462px] rounded-md shadow-lg border z-10 bg-white flex-col justify-center py-10 px-8 text-black max-w-[200px]">
                  
                  <InputField type="time" label="Opening Time" className="my-2" placeholder='Which place are you suggesting?' value={editTimeForm.startTime} onChange={(e) => setEditTimeForm({...editTimeForm, startTime: e.target.value})} />

                  <InputField type="time" label="Closing Time" className="my-2" placeholder='Which place are you suggesting?' value={editTimeForm.endTime} onChange={(e) => setEditTimeForm({...editTimeForm, endTime: e.target.value})} />

                  <div className="mt-4 w-full">
                    <button className="w-full font-bold text-[14px] bg-[#009DE2] text-white py-2 rounded-lg" onClick={()=> {
                      ChangeTimeFunc()
                      }}>Change Time</button>
                  </div>
                  
                </div>

                <div ref={addEventRef} className="transition-all duration-300 absolute top-2 right-0 sm:w-[462px] rounded-xl shadow-lg border z-[11] bg-white max-w-[300px]">
                  <div className="flex flex-col justify-center py-5 px-8 text-black w-full relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute top-[-0.5rem] right-[-0.5rem] bg-white rounded-full cursor-pointer"
                    onClick={() =>{
                      setIsShowTooltip(false)
                      setAddEvent(false)
                    }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <SelectField
                      label="Choose Destination"
                      placeholder="Select ..."
                      data={destinationLocations.map(itinerary => {
                          return {
                            id: itinerary.name,
                            name: itinerary.name
                          }
                        })
                      }
                      className={`mr-2 sm:my-2 my-5 w-full`}
                      styling={{
                        shadow: "drop-shadow-xl ",
                        left: "0px",
                        top: "70px",
                      }}
                      value={newEvent.name}
                      onChange={(val) => {
                        setNewEvent(destinationLocations.find(_d => _d.name == val))
                      }}
                      onAdditionalChange={(_data) => {}}
                    />

                    <div className="mt-4 w-full">
                      <button className="w-full font-bold text-[14px] bg-[#009DE2] text-white py-2 rounded-lg" onClick={()=> {addNewEvent()}}>Add Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        {
          dragOverLocation && <div className="border border-dashed p-2 rounded-xl flex justify-between items-center">
            <span>{dragOverLocation.name}</span>
            <div>
              <span className="flex">
              <span className="bg-green-500 h-max w-max rounded-full mr-1 cursor-pointer" onClick={() => replaceConfirm()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#fff" className="w-5 h-5 p-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>

              <span className="bg-red-500 h-max w-max rounded-full cursor-pointer" onClick={() => clearConfirm()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" className="w-5 h-5 p-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>

              </span>
            </div>
          </div>
        }
      </span>
    </div>
    </>
  );
}
