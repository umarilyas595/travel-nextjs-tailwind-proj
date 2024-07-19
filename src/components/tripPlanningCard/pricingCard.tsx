import React, { useEffect, useRef, useState } from "react";
import CSS from "./tripPlanning.module.css";
import { FiLock } from "react-icons/fi";
import { IPlanningCard } from "@/interfaces/TripPlan";
import ScheduleCard from "./scheduleCard";
import { LocationsDurationCall } from "@/api-calls";
import PricingCardLocation from "./pricing-cards/pricing-card-location";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDestination, setItineraryDays } from "@/redux/reducers/itinerarySlice";
import { useAlertContext } from "@/contextapi/Alert";

export default function PricingCard({
  data,
  onOpen = () => {},
  variation = "cards",
  rows,
  isDropdownButton
}: IPlanningCard) {

  const pricingCardRef = useRef<any | null>(null)
  const [showDel, setShowDel] = useState<boolean>(false)
  const [days, setDays] = useState<any>({
    day: "Monday",
    times: [],
    locations: []
  })

  const { itineraryDays } = useAppSelector(state => state.itineraryReducer)
  const { showAlert } = useAlertContext()
  
  const dispatch = useAppDispatch()

  const delDay = async () => {
    let _itineraryDayIndex = await itineraryDays.findIndex(itinerary => itinerary.day === data.day)
    let _itineraryDays = [...itineraryDays]
    _itineraryDays[_itineraryDayIndex] = {..._itineraryDays[_itineraryDayIndex]}
    _itineraryDays[_itineraryDayIndex].times = []
    setShowDel(false)
    dispatch(setItineraryDays([..._itineraryDays]))
    showAlert({title: `${data.day} is empty from itinerary`, type: "error"})
  }

  useEffect(() => {
    setDays(data)
  }, [data])

  useEffect(() => {
    if(showDel)
    {
      pricingCardRef.current?.classList.remove('hidden')
        setTimeout(() => {
          pricingCardRef.current?.classList.remove('opacity-0')
          pricingCardRef.current?.classList.remove('-translate-y-full')
          pricingCardRef.current?.classList.add('-translate-y-1/2')
        }, 200);
    }
    else
    {
      pricingCardRef.current?.classList.add('opacity-0')
      pricingCardRef.current?.classList.remove('-translate-y-1/2')
      pricingCardRef.current?.classList.add('-translate-y-full')
        setTimeout(() => {
          pricingCardRef.current?.classList.add('hidden')
        }, 200);
    }
  }, [showDel])

  return <>
    {
      variation === "cards" ? (
        <div className="relative bg-[#F6FDFF] rounded-lg border-2 border-dashed border-[#AEDCF0] px-5 py-8">
          <div className={`${data.loading ? "blur-sm select-none" : ""}`}>
            
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{data.day}</h1>
              {
                days && days.times.length > 0 && (
                  <span className="text-gray-500 cursor-pointer hover:text-red-600 transition-all duration-300" title={`Delete ${data.day} from itinerary`} onClick={() => setShowDel(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </span>
                )
              }
            </div>
            
            <div className="w-full bg-white rounded-lg border border-dashed border-[#AEDCF0] mt-4">
                <div className="p-5 flex flex-col justify-between">
                  {
                    days &&
                    days.times.map((time: any, index: any) => {

                      let origin = null
                      let destination = null
                      if(index > 0 && days.times[index - 1])
                      {
                        origin = days.times[index - 1].location.place_id ? days.times[index - 1].location.formatted_address : days.times[index - 1].location.address_obj.address_string
                        
                        destination = days.times[index].location.place_id ? days.times[index].location.formatted_address : days.times[index].location.address_obj.address_string
                      }

                      const onDropFunc = (e: React.DragEvent<HTMLDivElement>) => {
                        e.preventDefault()
                        let detail: any = e.dataTransfer.getData('product')
                        let detailEle: HTMLElement | null = document.getElementById(`detail_${data.day + index}`)
                        if(detail && detailEle && detailEle !== undefined)
                        {
                          detail = JSON.parse(detail)
                          detailEle.innerHTML = detail.name
                        }
                      }

                      return <PricingCardLocation key={index}
                      distanceObject={{origin: origin, destination: destination}}
                      index={index}
                      days={days}
                      rows={rows}
                      time={time}
                      onOpen={(_item) => onOpen(_item)} />
                    })
                  }

                  {/* <div className="w-full bg-white rounded-lg border border-dashed border-[#AEDCF0] mt-4">
                    <div
                      className={`p-5 flex flex-col justify-between ${CSS["pricing"]}`}
                    >
                      {data.schedule &&
                        data.schedule.map((items: any, index: any) => {
                          return (
                            <ScheduleCard
                              key={index}
                              isDropdownButton={isDropdownButton}
                              onOpen={onOpen}
                              items={items}
                            />
                          );
                        })}
                    </div>
                  </div> */}

                </div>
              </div>
          </div>
          {data && data.active == false ? (
            <div
              className={`absolute top-0 right-0 p-5 w-full h-full flex justify-end items-start select-none ${CSS["overlay"]}`}
            >
              <div className="flex items-center gap-x-3">
                <h1 className="font-medium">Unlock</h1>
                <div className="w-[40px] h-[40px] rounded-full bg-[#009DE2] text-white flex justify-center items-center font-bold">
                  <FiLock />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className={`grid ${ variation === "cards-list" ? 'grid-cols-1 bg-[#F6FDFF] rounded-lg border-2 border-dashed border-[#AEDCF0] py-5' : 'grid-cols-1'} mb-10`}>
          <div className={`${variation === "cards-list" ? 'pl-5' : ''} w-[90px] select-none z-10`}>
            <div className="flex items-center">
              <span className={`cursor-pointer uppercase hover:underline ${variation === "cards-list" ? 'font-semibold' : 'flex flex-col md:flex-row justify-between items-center text-sm md:text-base  bg-[var(--lite-green)] rounded-xl px-3'} h-max w-max`} style={{textUnderlinePosition: "under"}}
              onClick={async (e) => {
                e.preventDefault()
                if(data.times.length > 1)
                {
                  let origin = data.times[0].location.place_id ? data.times[0].location.formatted_address : data.times[0].location.address_obj.address_string
                  let destination = data.times[data.times.length - 1].location.place_id ? data.times[data.times.length - 1].location.formatted_address : data.times[data.times.length - 1].location.address_obj.address_string

                  let waypoints;
                  if(data.times.length > 2)
                  {
                    waypoints = await data.times.slice(1,data.times.length-1).map((tim: any) => {
                      let adr = tim.location.place_id ? tim.location.formatted_address : tim.location.address_obj.address_string
                      return {
                        location: adr
                      }
                    })
                  }

                  dispatch(setDestination({origin: origin, destination: destination, waypoints}))
                }
              }}
              >
                {data.day}
                {/* <span className="w-[38px] h-[29px] text-[var(--green)] bg-[var(--lite-green)] flex justify-center items-center rounded-lg">
                  {data.day}
                </span>{" "} */}
              </span>
              {
                data?.times && data.times.length > 0 && (

                  <span className="text-gray-500 cursor-pointer hover:text-red-600 transition-all duration-300" onClick={() => setShowDel(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </span>

                )
              }
            </div>
          </div>
          <div className={variation === "cards-list" ? '' : ``}>
            <div className={`pl-5 flex flex-col justify-between w-full ${CSS['bottom-border']} relative`}>
              {data.times &&
                data.times.filter((time: any) => time.location !== null).map((time: any, index: any) => {
                  let origin = null
                  let destination = null
                  if(index > 0 && data.times[index - 1] && data.times[index].location && data.times[index - 1].location)
                  {
                    origin = data.times[index - 1].location.place_id ? data.times[index - 1].location.formatted_address : data.times[index - 1].location.address_obj.address_string
                    
                    destination = data.times[index].location.place_id ? data.times[index].location.formatted_address : data.times[index].location.address_obj.address_string
                  }
                    return (
                      <ScheduleCard
                        variation={variation}
                        day={data.day}
                        distanceObject={{origin: origin, destination: destination}}
                        key={index}
                        isDropdownButton={isDropdownButton}
                        onOpen={(_item) => onOpen(_item)}
                        time={time}
                        items={time.location}
                      />
                    );
                })}
            </div>
          </div>
        </div>
      )
    }
    <div ref={pricingCardRef} className="hidden opacity-0 fixed top-[50%] left-[50%] -translate-y-full -translate-x-1/2 rounded-lg bg-white large-shadow p-4 z-10 transition-all duration-300">
      <p className="mb-4 font-medium">Are you sure you want to delete this day?</p>
      <div className="flex justify-end">
        <span className="block rounded-lg px-4 py-2 border border-[var(--green)] bg-white hover:bg-[var(--green)] text-[var(--green)] hover:text-white transition-all duration-300 cursor-pointer select-none" onClick={() => delDay()}>Yes</span>
        <span className="block rounded-lg px-4 py-2 border border-red-500 bg-white hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 cursor-pointer select-none ml-2" onClick={() => setShowDel(false)}>NO</span>
      </div>
    </div>
    </>
}
