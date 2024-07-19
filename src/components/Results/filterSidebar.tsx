import React, { useState, useEffect } from "react";
import ReviewFilterBox from './reviewFilterBox'
import Filter_option from '@/api/filters'
import PriceSlider from './priceSlider'
import RankingSlider from './rankingSlider'
import Occasion from '@/data/occasion.json'
import Activities from '@/data/priority.json'
import CardOptionsSearchListing from './filtersOptionsSearch'
import { useAppSelector } from "@/redux/hooks";

export default function FilterSidebar({locations, setFilteredLocations, locationsByFilter, clearFilter, setLoading, generatedResults}:any) {

  const [showFilter, setShowFilter] = useState(false)
  const [Ranking, setRanking] = useState("")
  const [selectedActivities, setSelectedActivities] = useState<any[]>([])
  const [selectedOccasions, setSelectedOccasions] = useState<any[]>([])

  const { surveySlice } = useAppSelector(state => state.surveyReducer)

  const clearAll = () => {
    setRanking("1")
    setSelectedActivities([])
    setSelectedOccasions([])
  }

  useEffect(()=>{
    const defLoad = async () => {

      if(locationsByFilter.length > 0)
      {
        let occassion_arr = await selectedOccasions.map(
          (oc: any) => oc.name
        );
        let priority_arr = await selectedActivities.map((pr: any) => pr.name);

        let arr = occassion_arr.concat(...priority_arr);

        let _locationsByFilter = await locationsByFilter.filter((loc: any) => arr.length > 0 ? arr.includes(loc.type) : true )
        .map((loc: any) => loc.locations)
        
        _locationsByFilter = [].concat(..._locationsByFilter)
        
        _locationsByFilter = await _locationsByFilter.filter((loc: any) => Ranking ? (Number(Ranking) <= Number(loc?.rating)) : true)

        setFilteredLocations([].concat(..._locationsByFilter))
        setLoading(false)
      }
      else
      {
        let _locationsByFilter = await locations.filter((loc: any) => Ranking ? (Number(Ranking) <= Number(loc?.rating) || Number(Ranking) <= Number(loc?.details?.rating)) : true)
        
        setFilteredLocations(_locationsByFilter)
        setLoading(false)
      }

    }
    
    defLoad()
  },[selectedActivities, selectedOccasions, Ranking])

  useEffect(() => {
    if(clearFilter)
    {
      clearAll()
    }
  }, [clearFilter])

  return (
    <>
    <span className="lg:hidden fixed left-0 top-1/2 translate-y-[-50%] flex justify-center items-center text-white w-[40px] h-[40px] bg-[#009ee2] rounded-r-lg  "
      onClick={() => setShowFilter(!showFilter)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    </span>

    <div className={`px-12 fixed inset-0 lg:z-10 z-30 bg-white ${showFilter ? '-translate-x-[0%]' : '-translate-x-[100%]'} lg:relative lg:-translate-x-[0%] transition-all duration-300 overflow-y-auto`}>
      <span
        className="absolute top-2 right-2 lg:hidden"
        onClick={() => setShowFilter(!showFilter)}
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
      
      <div className="border-b border-[#E3E3E3] pb-3">
        <h1 className="text-[30px] font-semibold ">
          Filter By
        </h1>
        <p className="text-[#009de2] mt-4 text-end cursor-pointer" onClick={()=>{
            clearAll()
          }}
        >Clear All</p>
      </div>

      {surveySlice.priority && surveySlice.priority.length > 0 && (
        <CardOptionsSearchListing
          title="Activities"
          categories={
            surveySlice.priority.map((pr: any, index: number) => {
              return {
                id: index,
                name: pr.opt,
                checked: selectedActivities.find(act => act.name == pr.opt) ? true : false
              }
            })
          }
          onChange={async (values: any[]) => {
            console.log('values', values)
            setSelectedActivities(values)
          }}
          clearData={clearFilter}
          disabled={generatedResults.priorities == ""}
          // setClearFilter={setClearFilter}
          // selectedData={selectedActivities}
        />
      )}

      <PriceSlider
        title="Price Per Night"
        clearData={clearFilter}
      />
      
      {
        surveySlice.occassion && surveySlice.occassion.length > 0 && (
          <CardOptionsSearchListing
            title="Occasion"
            categories={surveySlice.occassion.map((oc: any, index: number) => {
                return {
                  id: index,
                  name: oc.opt,
                  checked: selectedOccasions.find(act => act.name == oc.opt) ? true : false
                }
              })
            }
            clearData={clearFilter}
            // setClearFilter={setClearFilter}
            onChange={(values: any[]) => {
              setSelectedOccasions(values)
            }}
            disabled={generatedResults.occassions == ""}
            // selectedData={selectedOccasions}
          />
        )
      }
      <RankingSlider
        title="City Ranking"
        clearData={clearFilter}
        setRanking={setRanking}
        value={Ranking}
      />

      {/* <ReviewFilterBox
        filters={Filter_option.cityRanking}
        title="City Ranking"
        type = "review"
        setRanking={setRanking}
        clearFilter={clearFilter}
        location = {locationArray}
      /> */}
      {/* <ReviewFilterBox
        filters={Filter_option.activityRanking}
        title="Activity Ranking"
        type = "review"
        setRanking={setRanking}
        clearFilter={clearFilter}
      /> */}
    </div>
    </>
  );
}
