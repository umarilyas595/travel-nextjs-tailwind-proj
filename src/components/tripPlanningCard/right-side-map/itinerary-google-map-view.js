import React, { useEffect, useRef, useState } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveLocation } from '@/redux/reducers/itinerarySlice';
import BlueButton from '@/components/UIComponents/Buttons/BlueButton';
import { setItem } from '@/redux/reducers/PlacedetailSlice';
import WePlanIcon from "public/pin.png"

const ItineraryGoogleMapView = (props) => {

    const mapRef = useRef(null)
    const [allLocations, setAllLocations] = useState([])
    const [insideLoader, setInsideLoader] = useState(false)
    const [infoWindow, setInfoWindow] = useState(null)
    const [map, setMap] = useState(null)
    const [markers, setMarkers] = useState([])
    const { activeLocation } = useAppSelector(state => state.itineraryReducer)
    const dispatch = useAppDispatch()

    const customMarkerIcon = {
        url: WePlanIcon.src,
        scaledSize: new props.google.maps.Size(40, 40)
    };

    const loadMap = () => {
        let map = new props.google.maps.Map(mapRef.current, {
            center: props.locations[0].geometry.location,
            zoom: 12,
        });
        setMap(map)
        
        setInfoWindow(new props.google.maps.InfoWindow())

        let _markerArr = []
        for(let i = 0; i<props.locations.length; i ++)
        {
            let loc = props.locations[i]
            const marker = new props.google.maps.Marker({
                position: loc.geometry.location,
                map: map,
                title: loc.name,
                icon: customMarkerIcon
            });
            _markerArr.push({loc: loc, marker: marker})
        
            marker.addListener('click', function() {
                dispatch(setActiveLocation(loc))
            });
        }
        setMarkers(_markerArr)
    }

    useEffect(() => {

        setAllLocations(props.locations)

    }, [props.locations])

    const viewDetail = () => {
        console.log('there')
        dispatch(setItem({
            locaiton_id: activeLocation?.location_id,
            place_id: activeLocation?.place_id,
        }));
    }

    useEffect(() => {
        if(activeLocation && activeLocation.geometry?.location)
        {
            let marker = markers.find(_marker => _marker.loc.name == activeLocation.name)
            if(marker)
            {
                infoWindow.close()
                infoWindow.setContent(`
                <h3 style="font-weight: 400;"><b>${marker.loc?.name}</b></h3>
                <p style="font-size: 11px;">${marker.loc?.formatted_address}</p>
                `)
                infoWindow.open(map, marker.marker);
            }
            setInsideLoader(false)
        }
    }, [activeLocation])

    useEffect(() => {
        if(mapRef.current)
        {
            setInsideLoader(true)
            let map = new props.google.maps.Map(mapRef.current, {
                center: props.locations[0].geometry.location,
                zoom: 12,
            });
            setMap(map)
            
            setInfoWindow(new props.google.maps.InfoWindow())
    
            let _markerArr = []
            for(let i = 0; i<props.locations.length; i ++)
            {
                let loc = props.locations[i]
                if(loc)
                {
                    const marker = new props.google.maps.Marker({
                        position: loc.geometry.location,
                        map: map,
                        title: loc.name,
                        icon: customMarkerIcon
                    });
                    _markerArr.push({loc: loc, marker: marker})
                
                    marker.addListener('click', function() {
                        setInsideLoader(true)
                        dispatch(setActiveLocation(loc))
                    });
                }
            }
            setMarkers(_markerArr)
            setInsideLoader(false)
        }
    }, [mapRef])

    return <>
        <div ref={mapRef} className="absolute inset-0"></div>
        {
            (allLocations.length == 0 || insideLoader) && (
                <div className='bg-gray-100 opacity-50 animate-pulse w-full h-full absolute inset-0'></div>
            )
        }
        {/* <Map
            google={props.google}
            style={mapStyles}
            zoom={12}
            initialCenter={allLocations[0].geometry.location}
            center={allLocations[0].geometry.location}
        >
            {
                allLocations.map((loc, index) => (
                    <Marker 
                        key={index}
                        position={loc.geometry.location} 
                        onClick={(props, marker, e)=>onMarkerClick(props, marker, e, loc)}
                        name={loc.name}
                        icon={customMarkerIcon}
                    />
                ))
            }

            <GoogleInfoWindow 
                marker={infoWindow.marker ?? null}
                visible={infoWindow.visible ?? false}
                onClose={closeInfoWindow}
            >
                <div className="flex flex-wrap flex-col items-center">
                    {
                        activeLocation && (
                            <>
                                <h3 className="font-semibold text-sm"> {activeLocation?.name} </h3>
                                <p>{activeLocation?.formatted_address}</p>
                                <button className="w-max px-1 py-[0.3rem] mx-auto hover:text-[var(--blue)] large-shadow"
                                onClick={viewDetail}
                                >View detail</button>
                            </>
                        )
                    }
                </div>
            </GoogleInfoWindow>
        </Map> */}
    </>
}

export default GoogleApiWrapper({
    apiKey: process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY ?? ''
})(ItineraryGoogleMapView);
  