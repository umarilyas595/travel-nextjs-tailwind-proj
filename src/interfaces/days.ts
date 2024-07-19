interface ISuggestedTime {
    startTime?: string
    endTime?: string
    duration_time?: string
}

export interface ITime {
    time: string
    location: any,
    suggestedTime?: ISuggestedTime
}

interface IDays {
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
    times: ITime[]
}

export default IDays