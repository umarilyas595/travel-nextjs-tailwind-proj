import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const mapStyles = {
  width: 'auto',
  height: '200px'
};

const TripDetailGoogleMap = (props) => {

    const initLocation = {lat: "", lng: ""}
    const [location, setLocation] = useState(initLocation)

    useEffect(() => {
        
        // const _defAddress = async () => {
        //     setLocation(initLocation)
        //     let res = await fetch(`${process.env.NEXT_PUBLIC_WEB_URL}/google?place_id=${props.place_id}`).then((res) => res.json())
        // }

        setLocation(props.location)

    }, [props.place_id])

    return location.lat && location.lng ? (
        <Map
            google={props.google}
            style={mapStyles}
            zoom={14}
            initialCenter={{ lat: location.lat, lng: location.lng }}
            center={location}
        >
            <Marker 
                position={{ lat: location.lat, lng: location.lng }} 
            />
        </Map>
    ) : (
        <div className='bg-gray-100 animate-pulse w-full h-full absolute inset-0'></div>
    )
}

export default GoogleApiWrapper({
    apiKey: process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY ?? ''
})(TripDetailGoogleMap);
  