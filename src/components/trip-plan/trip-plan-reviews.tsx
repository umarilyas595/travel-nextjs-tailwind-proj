import React, { useEffect, useState } from "react";
import ComponentTitle from "../UIComponents/ComponentTitle";
import { BlankStar, FilledStar } from "../icons/Stars";
import BlueButton from "../UIComponents/Buttons/BlueButton";
import styles from "./client-testimonials.module.css";
// import Modal from "../Modal/index";
import { ReviewsCall } from "@/api-calls";
import { useAppSelector } from "@/redux/hooks";
import Section from "../UIComponents/Section";
import Image from "next/image";
import ReviewFilterBox from "../Results/reviewFilterBox";
import SelectField from "../UIComponents/InputField/SelectField";
import Reviews from "../reviews/reviews";

interface IReviews {
  automateLocation?: any
}
const TripPlanReviews = ({ automateLocation }:IReviews) => {
    
    const [loading, setLoading] = useState(true);
    const [reviewsData, setReviewsData] = useState<any[] | null>(null);

    const { itineraryDays } = useAppSelector((state) => state.itineraryReducer);
    const { locationsState } = useAppSelector((state) => state.locationReducer)

    const [openModal, setOpenModal] = useState(false);
    const [showReviews, setShowReviews] = useState(true)
    const [showFilter, setShowFilter] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<any>({})
    const [locaitonList, setLocationList] = useState<any[]>([])
    const [locaitonOptions, setLocationOptions] = useState<any[]>([])
    const [inSchedule, setInSchedule] = useState<boolean | null>(null)
    const [filterData, setFilterData] = useState({
        locationIndex: "",
        reviews: "All",
    })

    // use Effect for Location and Reviews Filter
    useEffect(() => {
        
        const _defFilter = () => {
            let _selectedLocation = selectedLocation
            if(filterData.locationIndex !== "")
            {
                let index = locaitonList.findIndex(opt => opt.name === filterData.locationIndex)
                _selectedLocation = locaitonList[Number(index)]
                setSelectedLocation(_selectedLocation)
            }
        }
        
        _defFilter()

    }, [filterData]);

    // use Effect for In Schedule Filter
    useEffect(() => {

        const _defInSchedule = async () => {
            let isExistLocArr: any[] = itineraryDays.map(itinerary => itinerary.times.map(time => time.location))
            let itineraryLocations: any[] = [].concat(...isExistLocArr)
            let inScheduleLocations
            if(inSchedule == true)
            {
                inScheduleLocations = await locaitonList.filter(loc => itineraryLocations.filter(itineraryLoc => itineraryLoc.name === loc.name).length > 0)
            }
            else if(inSchedule == false)
            {
                inScheduleLocations = await locaitonList.filter(loc => itineraryLocations.filter(itineraryLoc => itineraryLoc.name === loc.name).length == 0)
            }
            inScheduleLocations = [...new Set(inScheduleLocations)]

            let _list = await inScheduleLocations.map((loc: any, index) => {
                return {
                    id: index+1,
                    name: loc.name
                }
            })

            setLocationOptions([..._list])
            
            

            if(inScheduleLocations.length > 0)
            {
                setSelectedLocation(inScheduleLocations[0])
                setFilterData({
                    locationIndex: inScheduleLocations[0].name,
                    reviews: "All",
                })
                // let reviews = await inScheduleLocations[0].reviews === undefined ? [] : (filterData.reviews !== "All" ? inScheduleLocations[0].reviews.filter((review: any) => review.rating === Number(filterData.reviews)) : inScheduleLocations[0].reviews)
            }
            else
            {
                setSelectedLocation({})
                setFilterData({
                    locationIndex: '',
                    reviews: "All",
                })
            }
        }
        
        _defInSchedule()
    }, [inSchedule])

    // useEffect to set location options from location list
    useEffect(() => {
        const _locationOptionFunc = async () => {
            if(locaitonList.length > 0)
            {
                setFilterData({...filterData, locationIndex: locaitonList[0].name})
                setSelectedLocation(locaitonList[0])

                let _list = await locaitonList.map((loc: any, index) => {
                return {
                    id: index+1,
                    name: loc.name
                }
                })
                setLocationOptions([..._list])
            }
        }

        _locationOptionFunc()
    }, [locaitonList])


    // useEffect to set locations list
    useEffect(() => {
        
        const _def = async () => {
            let _locations = await itineraryDays.map((itin: any) => 
            itin.times.map((time: any) => 
                time.location 
            )
            )
            _locations = await [].concat(..._locations)
            
            let _sortedLocations = await locationsState.map(loc => {
                return {
                    ...loc, ...loc.details
                }
            })

            _locations = _sortedLocations.concat(..._locations)
            _locations = [...new Set(_locations)]

            setLocationList([..._locations])
        }
        _def()

    }, [itineraryDays, locationsState])

    useEffect(() => {
        setSelectedLocation(automateLocation ? {...automateLocation} : (locaitonList.length > 0 ? {...locaitonList[0]} : null))
    }, [automateLocation, locaitonList]);

    useEffect(() => {

        setReviewsData(selectedLocation?.reviews === undefined ? [] : (filterData.reviews !== "All" ? selectedLocation.reviews.filter((review: any) => review.rating === Number(filterData.reviews)) : selectedLocation.reviews));
    
    }, [selectedLocation])

    useEffect(() => {
        
        if (reviewsData!=null && reviewsData.length > 0 && itineraryDays.length > 0) {
            setLoading(false);
        }

    }, [reviewsData, itineraryDays]);

    const reviewArr = new Array(5).fill(1);

    const reviewOptions = [
        {
        id: 'All', name: "All"
        },
        {
        id: 1, name: 1
        },
        {
        id: 2, name: 2
        },
        {
        id: 3, name: 3
        },
        {
        id: 4, name: 4
        },
        {
        id: 5, name: 5
        }
    ]

    return (
        <div className="w-full flex justify-center">
            <Section className="relative">
                <div className="sm-width sm:px-4 px-0">
                    <div className="flex sm:flex-row flex-col sm:justify-between justify-center items-center">
                        <div className="flex flex-col sm:items-start items-center">
                            <ComponentTitle title="Client's Reviews" />
                            <span className="flex flex-wrap gap-2 items-center mt-3">
                                {reviewArr &&
                                reviewArr.map((review, index) => {
                                    if (index < Math.floor(selectedLocation?.rating)) {
                                    return <FilledStar key={index} />;
                                    } else {
                                    return <BlankStar key={index} />;
                                    }
                                })}
                                {selectedLocation?.rating} Reviews
                            </span>
                        </div>
                        {
                            itineraryDays.length > 0 ? (
                                <div className="relative"
                                    onClick={() => {
                                        setOpenModal(!openModal);
                                    }}
                                >
                                    <BlueButton onClick={() => setShowFilter(!showFilter)} title={"Filter Reviews"} />
                                </div>
                            ) : (
                                <div className="animate-pulse w-[200px] h-[50px] my-5 rounded-xl bg-gray-200 dark:bg-gray-700 shadow"></div>
                            )
                        }
                    </div>

                    <div id="rating-filter" className={`transition-all duration-300 ${!openModal ? 'overflow-hidden' : 'pt-8 mt-5'} ${openModal ? "auto" : "h-[0px]"}`}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mx-10">
                            <SelectField
                            label="Locations"
                            placeholder="Select ..."
                            data={locaitonOptions}
                            className={`sm:mr-2 sm:my-2 my-5 w-full`}
                            value={filterData.locationIndex}
                            onChange={async (val) =>{
                            setFilterData({...filterData, locationIndex: val})}
                            }
                            />

                            <SelectField
                            label="Reviews"
                            placeholder="Select ..."
                            data={reviewOptions}
                            className={`sm:mr-2 sm:my-2 my-5 w-full`}
                            value={filterData.reviews}
                            onChange={(val) =>
                            setFilterData({...filterData, reviews: val})
                            }
                            />

                            {/* <SelectField
                                label="Reviews"
                                placeholder="Select ..."
                                data={[
                                    {id: "In-Schedule", name: "In-Schedule"},
                                    {id: "Not In-Schedule", name: "Not In-Schedule"}
                                ]}
                                className={`sm:mr-2 sm:my-2 my-5 w-full`}
                                value={inSchedule ? "In-Schedule" : "Not In-Schedule"}
                                onChange={(val) =>
                                setInSchedule(val == 'In-Schedule' ? true : false)
                            }
                            /> */}

                            <div className="flex items-center">
                                <label htmlFor="in-schedule">
                                    <input type="checkbox" name="in-schedule" id="in-schedule" checked={inSchedule ? true : false} onChange={() => setInSchedule(!inSchedule)} /> In Schedule
                                </label>
                            </div>
                        </div>
                    </div>

                    <Reviews show={showReviews} loading={loading} data={reviewsData} />
                    
                    {
                        reviewsData!=null && reviewsData.length > 0 && (
                        <div className="mt-20 flex justify-center">
                            <button className="w-[150px] border-[var(--blue)] bg-[var(--blue)] text-white py-2 rounded-md" onClick={()=>{setShowReviews(!showReviews)}}>{showReviews == true ? "Hide Reviews" : "Read Reviews"}</button>
                        </div>
                        )
                    }

                </div>
            </Section>
        </div>
    );
};

export default TripPlanReviews;
