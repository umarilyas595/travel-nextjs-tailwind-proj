import React, { useEffect, useState } from 'react'
import styles from "../tripPlanning.module.css"
import { LocationsDurationCall } from '@/api-calls'

interface IPricingCardLocation {
    index: number
    rows?: string
    time: any
    days: any
    distanceObject: any
    onOpen: (value?: any) => void
}

const PricingCardLocation = ({
    index,
    rows,
    time,
    days,
    distanceObject,
    onOpen = () => {},
    }: IPricingCardLocation) => {

    const [duration, setDuration] = useState(null)

    const onDropFunc = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        let detail: any = e.dataTransfer.getData('product')
        let detailEle: HTMLElement | null = document.getElementById(`detail_${days.day + index}`)
        if(detail && detailEle && detailEle !== undefined)
        {
          detail = JSON.parse(detail)
          detailEle.innerHTML = detail.name
        }
    }

    function formatTime(timeString: string) {
        if(timeString == "" || timeString.search('Open') !== -1)
        {
            return timeString
        }

        const [hourString, minute] = timeString.split(":");
        const hour = +hourString % 24;
        return (hour % 12 || 12) + ":" + (Number(minute.substr(0,2)) < 10 ? '0'+minute : minute) + (hour < 12 ? " AM" : " PM");
    }

    useEffect(() => {

        const _def = async () => {
            let duration = await LocationsDurationCall(distanceObject.origin, distanceObject.destination)
            if(duration.status == 200 && duration.data.rows[0]?.elements[0]?.duration?.text)
            {
                let _durationTime = duration.data.rows[0].elements[0].duration.text
                setDuration(_durationTime)
            }
        }
        if(distanceObject.origin && distanceObject.destination && !time.suggestedTime?.duration_time)
        {
            _def()
        }
    }, [distanceObject])

    return (
        <>
        {
            (time.suggestedTime?.duration_time || duration) && <span className="flex rounded-full px-2 h-max bg-[var(--blue)] text-white text-[12px] whitespace-nowrap w-max -translate-y-full">{time.suggestedTime?.duration_time ? time.suggestedTime?.duration_time : duration}</span>
        }
        <div
            className={`flex gap-x-4 mb-10 cursor-pointer h-full ${styles["pricingCard"]}`}
            onDrop={(e) => onDropFunc(e)}
            onDragOver={(e) => {e.preventDefault()}}
        >
            <div>
                <div>
                    <div className="w-[20px] h-[20px] bg-[#AEDCF0] rounded-full flex justify-center items-center">
                        <div className="w-[10px] h-[10px] bg-[#009DE2] rounded-full"></div>
                    </div>
                </div>
                <div className={`h-full ml-2 ${styles["divider"]}`}></div>
            </div>
            <span
            className="text-[13px] text-black hover:text-[#009DE2]"
            onClick={() => {
                onOpen(time.location);
            }}
            >
            <h1 className="gilroy font-semibold">
                {
                    !time.suggestedTime?.startTime && !time.suggestedTime?.endTime ? (
                        time.time
                    ) : (
                        (time.suggestedTime?.startTime ? (formatTime(time.suggestedTime.startTime)+ ' ') : " ") + (time.suggestedTime?.endTime ? '- '+(formatTime(time.suggestedTime.endTime)) : "")
                    )
                } -
            </h1>
            {
                rows == "2" ? <p className="font-medium max-w-[200px] w-full">{time?.location?.name}</p> :<p className="font-medium" id={`detail_${days.day + index}`}>{time?.location?.name}</p>
            }
            </span>
        </div>
        </>
    )
}

export default PricingCardLocation