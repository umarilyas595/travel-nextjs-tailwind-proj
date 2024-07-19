import React, { useState, useEffect } from "react";
import InputField from "../UIComponents/InputField/locationInput";
import SimpleLocation from "../icons/SimpleLocation";
import CalenderIcon from "../icons/Calender";
import BlueButton from "../UIComponents/Buttons/BlueButton";
import SelectField from "../UIComponents/InputField/SelectField";
import Occasion from "@/data/occasion.json";
import LocationJson from "@/data/location.json";
import SpendingValue from "@/data/spending.json";
import Travelers from "@/data/travelers.json";
import Priority from "@/data/priority.json";
import DateRangeField from "../UIComponents/InputField/DateRangeField";
import styles from "./hero.module.css";
import { Range } from "react-date-range";
import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSurveyValue } from "@/redux/reducers/surveySlice";
import { setLocations } from "@/redux/reducers/locationSlice";
import MultiSelectDropdown from "@/components/UIComponents/MultiSelectDropdown";
import OccassionsIncrement from "@/api-calls/fromDB/occasionsTrendingIncrement";
import PrioritiesIncrement from "@/api-calls/fromDB/prioritiesTrendingIncrement";
import LocationIncrement from "@/api-calls/fromDB/topCountriesIncrement";
import Occassions from "@/api-calls/fromDB/occassions";
import { setOccasions } from "@/redux/reducers/occasionsSlice";
import Priorities from "@/api-calls/fromDB/priority";
import { setPriorities } from "@/redux/reducers/prioritySlice";
import TopCountries from "@/api-calls/fromDB/topCountries";
import { setTopCountries } from "@/redux/reducers/topCountries";
import { setTopCities } from "@/redux/reducers/topCities";
import AddLocation from "@/api-calls/fromDB/addLocation";
import TopCities from "@/api-calls/fromDB/topCities";
import AddCities from "@/api-calls/fromDB/addCities";
import TopCitiesIncrement from "@/api-calls/fromDB/topCitiesIncrement";
import ContinentLocation from "@/data/continent.json";
import TopCountriesIncrement from "@/api-calls/fromDB/topCountriesIncrement";
import SearchLocation from '@/api-calls/fromDB/searchCities'
import { setAllLocations } from '@/redux/reducers/allLocations'

export default function HeroFilterSection() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [date, setDate] = useState<Range>({
    key: "selection",
  });

  const [startedDayIndex, setStartedDayIndex] = useState<number | null>(null);
  const [daysLength, setDaysLength] = useState<number | null>(null);
  const { surveySlice } = useAppSelector((state) => state.surveyReducer);
  const [saveData, setSaveData] = useState(true);
  const { ocassionsState } = useAppSelector((state) => state.occasionsSlice);
  const { priorityState } = useAppSelector((state) => state.prioritySlice);
  const { topCountriesState } = useAppSelector(
    (state) => state.topCountriesSlice
  );
  const { topCitiesState } = useAppSelector((state) => state.topCitiesSlice);
  const { allLocationsState } = useAppSelector((state) => state.allLocationSlice);
  const [occasions, setOccasionsArray] = useState<any>([]);
  const [prioritiesValue, setPrioritiesValue] = useState<any>([]);
  const [topCountriesValue, setTopCountriesValue] = useState<any>([]);
  const [topCitiesValue, setTopCitiesValue] = useState<any>([]);
  const [allLocation, setAllLocation] = useState<any>([]);
  const [invalidLocation, setInvalidLocation] = useState(false);
  const [locationRequired, setLocationRequired] = useState(false);
  const [locationDropdownValue, setLocationDropdownValue] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [buttonText, setButtonText] = useState("Look For Inspiration");
  const [locationSearch, setLocationSearch] = useState<any>({
    location: "",
    occassion: [],
    priority: [],
    person: "",
    dates: "",
    spending: "",
  });
  const [url_address, setUrlAddress] = useState("");

  useEffect(() => {
    if (ocassionsState?.length > 0) {
      setOccasionsArray(ocassionsState);
    } else {
      setOccasionsArray([]);
    }
  }, [ocassionsState]);

  useEffect(() => {
    if (priorityState?.length > 0) {
      setPrioritiesValue(priorityState);
    } else {
      setPrioritiesValue([]);
    }
  }, [priorityState]);

  useEffect(() => {
    if (topCountriesState?.length > 0) {
      setTopCountriesValue(topCountriesState);
    } else {
      setTopCountriesValue([]);
    }
  }, [topCountriesState]);

  useEffect(() => {
    if (topCitiesState?.length > 0) {
      setTopCitiesValue(topCitiesState);
    } else {
      setTopCitiesValue([]);
    }
  }, [topCitiesState]);

  useEffect(() => {
    const _def = async () => {
      let url = locationSearch.location ? locationSearch.location : "";

      let occassion_arr = await locationSearch.occassion.map(
        (oc: any) => oc.opt
      );
      let priority_arr = await locationSearch.priority.map((pr: any) => pr.opt);
      let arr = occassion_arr.concat(...priority_arr);

      url =
        url.trim() != "" && arr.length > 0 ? `${arr.join(",")} in ${url}` : url;

      setUrlAddress(url);
    };

    _def();
    if(locationSearch.dates.startDate){
      setButtonText("Automate My trip");
    }else{
      setButtonText("Look For Inspiration")
    }
  }, [locationSearch]);

  useEffect(() => {
    let data = {
      location: surveySlice.location,
      occassion:
        surveySlice.occassion && surveySlice.occassion.length > 0
          ? surveySlice.occassion
          : [],
      priority:
        surveySlice.priority && surveySlice.priority.length > 0
          ? surveySlice.priority
          : [],
      person: surveySlice.person ? surveySlice.person : "",
      spending: surveySlice.spending ? surveySlice.spending : "",
      dates: "",
    };
    setSaveData(true);
    setLocationSearch(data);
  }, [surveySlice]);

  useEffect(()=>{
if(allLocationsState?.length > 0){
  setAllLocation(allLocationsState)
}else(
  setAllLocation([])
)
  },[allLocationsState])

  useEffect(() => {
    setLocationSearch({ ...locationSearch, dates: date });

    const calculateDaysRemaining = () => {
      if (date?.endDate && date?.startDate) {
        const endDate = new Date(date?.endDate);
        const startDate = new Date(date?.startDate);
        setStartedDayIndex(startDate.getDay());

        const timeDifference = Math.abs(
          endDate.getTime() - startDate.getTime()
        );
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        setDaysLength(daysRemaining + 1);
      }
    };

    calculateDaysRemaining();
  }, [date]);

  useEffect(() => {
    if (topCitiesValue.length > 0) {
      const newArray: any = topCitiesValue?.map((opt: any) => ({
        ...opt,
        type: "city",
      }));
      setLocationDropdownValue(newArray);
    } else {
      if (topCountriesValue.length > 0) {
        const newArray: any = topCountriesValue?.map((opt: any) => ({
          ...opt,
          type: "country",
        }));
        setLocationDropdownValue(newArray);
      } else {
        const newArray: any = ContinentLocation?.map((opt: any) => ({
          ...opt,
          type: "continent",
        }));
        setLocationDropdownValue(newArray);
      }
    }
  }, [topCitiesValue, topCountriesValue]);

  const ValidateData = async () => {
    if (locationSearch.occassion.length > 0) {
      for (var i = 0; i < locationSearch.occassion.length; i++) {
        let res = await OccassionsIncrement(locationSearch.occassion[i].id);
        if (res) {
          let updatedOccasionsList = await Occassions();
          dispatch(setOccasions(updatedOccasionsList));
        }
      }
    }
    if (locationSearch.priority.length > 0) {
      for (var i = 0; i < locationSearch.priority.length; i++) {
        let res = await PrioritiesIncrement(locationSearch.priority[i].id);
        if (res) {
          let updatedOccasionsList = await Priorities();
          dispatch(setPriorities(updatedOccasionsList));
        }
      }
    }
    if (locationSearch.dates.startDate) {
      router.push(
        `/trip-plan?address=${locationSearch.occassion.length > 0 || locationSearch.priority.length > 0 ? `${JSON.stringify(locationSearch.location)}&occassions=${JSON.stringify(locationSearch.occassion)}&priorities=${JSON.stringify(locationSearch.priority)}` : `${JSON.stringify(url_address)}`}` +
          `&start_day_index=${startedDayIndex}&days_length=${daysLength}`
      );
    } else {
      router.push(`/results?address=${locationSearch.occassion.length > 0 || locationSearch.priority.length > 0 ? `${JSON.stringify(locationSearch.location)}&occassions=${JSON.stringify(locationSearch.occassion)}&priorities=${JSON.stringify(locationSearch.priority)}` : JSON.stringify(`best locations in ${url_address}`)}`);
      dispatch(setSurveyValue(locationSearch));
    }
  };

  const handleRoute = async () => {
    if (locationSearch.location == "") {
      setLocationRequired(true);
    } else {
      dispatch(setSurveyValue(locationSearch));
      ValidateData();
    }
  };

  const _SearchLocation = async () => {
    let res = await SearchLocation(selectedLocation)
    const filteredLocation =  res.filter((country: any) => {
      return (
        country?.city?.toLocaleLowerCase() ==
        selectedLocation.toLocaleLowerCase()
      );
    });
    const response = res?.filter((country:any) => {
      return country?.city?.toLocaleLowerCase().includes(selectedLocation?.toLocaleLowerCase());
    });
    if(response.length > 0){
setAllLocation(response)
    }
    // if(filteredLocation.length > 0){
    //   setButtonText("Automate My trip");
    // }else{
    //   setButtonText("Look For Inspiration")
    // }
    dispatch(setAllLocations(res))
}


useEffect(() => {
if(selectedLocation !== ""){
  const filteredLocation =  allLocation.filter((country: any) => {
    return (
    country?.city?.toLocaleLowerCase() ==
    selectedLocation.toLocaleLowerCase()
    );
    });
    
    const filteredCity = allLocation?.filter((country:any) => {
      return country?.city?.toLocaleLowerCase().includes(selectedLocation?.toLocaleLowerCase());
    });
    if(filteredCity.length > 0){
        setAllLocation(filteredCity)
     }
    if (filteredLocation.length > 0) {
    // setButtonText("Automate My trip");
    } else {
      const delayDebounceFn = setTimeout(() => {
        _SearchLocation()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
    }
}
}, [selectedLocation]);

  return (
    <div
      className={`bg-white p-8 sm:flex block flex-wrap justify-center rounded-xl sm-width gap-y-5`}
    >
      {/* <SelectField
        label="Location"
        placeholder="Select ..."
        data={LocationJson}
        className={`sm:mr-2 sm:my-2 my-5 sm:w-[170px] h-[46px]`}
        styling={{
          shadow: "drop-shadow-xl ",
          left: "0px",
          top: "70px",
        }}
        icon={<SimpleLocation />}
        value={locationSearch.location}
        onChange={(val) =>
          setLocationSearch({ ...locationSearch, location: val })
        }
        onAdditionalChange={(_data) => {}}
      /> */}
      <div className={`sm:mr-2 sm:my-2 my-5 sm:w-[170px]`}>
        <InputField
          className={`sm:w-[170px] h-[46px]`}
          name="location"
          type="text"
          label="Location"
          placeholder="Enter Location"
          // locationList={{
          //   city: topCitiesValue,
          //   country: topCountriesValue,
          //   continent: ContinentLocation,
          // }}
          value={locationSearch?.location}
          items={allLocation}
          icon={<SimpleLocation />}
          onChange={(val: any) => {
            setSelectedLocation(val);
            setLocationSearch({ ...locationSearch, location: val });
          }}
          onFocus={() => {
            setInvalidLocation(false);
            setLocationRequired(false);
          }}
        />
        {invalidLocation == true && (
          <p className="text-[red] text-[14px] mt-3">Invalid Location.</p>
        )}
        {locationRequired == true && (
          <p className="text-[red] text-[14px] mt-3">Location Required.</p>
        )}
      </div>

      <DateRangeField
        label="Travel Date"
        placeholder="Select Date ..."
        className={`sm:mr-2 sm:my-2 my-7 sm:w-[250px] h-[46px] ${styles.inputWrapper}`}
        value={date}
        onChange={(value) => {
          setDate({
            ...date,
            startDate: value.startDate,
            endDate: value.endDate,
          });
        }}
        icon={<CalenderIcon />}
      />

      <MultiSelectDropdown
        key={1}
        // searchBar
        items={occasions}
        Label={"Occasion"}
        heightItemsContainer="300px"
        className={"sm:w-[170px]"}
        SelectedData={
          locationSearch.occassion.length > 0 ? locationSearch.occassion : []
        }
        saveData={saveData}
        setSaveData={setSaveData}
        placeholder="Enter Occasion"
        onChange={(val: any) =>
          setLocationSearch({ ...locationSearch, occassion: val })
        }
        dropdownWidth="sm:w-[300px]"
      />

      <MultiSelectDropdown
        key={2}
        // searchBar
        items={prioritiesValue}
        Label={"Priority"}
        allowSorting={true}
        heightItemsContainer="300px"
        className={"sm:w-[170px]"}
        SelectedData={
          locationSearch.priority.length > 0 ? locationSearch.priority : []
        }
        saveData={saveData}
        setSaveData={setSaveData}
        placeholder="Enter Priority"
        onChange={(val: any) =>
          setLocationSearch({ ...locationSearch, priority: val })
        }
        dropdownWidth="sm:w-[300px]"
      />

      <SelectField
        label="Travelers"
        placeholder="Select ..."
        data={Travelers}
        className={`sm:mr-2 sm:my-2 my-5 sm:w-[170px] h-[46px]`}
        value={locationSearch.person}
        onChange={(val) =>
          setLocationSearch({ ...locationSearch, person: val })
        }
        onAdditionalChange={(_data) => {}}
      />

      <SelectField
        label="Budget"
        placeholder="Select..."
        data={SpendingValue}
        className={`sm:mr-2 sm:my-2 mb-5 mt-7 sm:w-[170px] h-[46px]`}
        value={locationSearch.spending}
        onChange={(val) =>
          setLocationSearch({ ...locationSearch, spending: val })
        }
        onAdditionalChange={(_data) => {}}
      />

      <BlueButton
        title={buttonText}
        className="sm:w-[200px] w-full h-[56px]"
        onClick={handleRoute}
      />
    </div>
  );
}
