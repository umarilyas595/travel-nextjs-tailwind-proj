import React, { useEffect, useState } from 'react'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import { height } from '@mui/system';

const RotueMap = (props) => {

    const initLocation = {lat: 41.85, lng: -87.65}

    async function calculateAndDisplayRoute(directionsService, directionsRenderer) {

        let _vals = {
            origin: {
                query: props.destinationDetails.origin,
            },
            destination: {
                query: props.destinationDetails.destination,
            },
            travelMode: props.google.maps.TravelMode.DRIVING,
        }

        if(props.destinationDetails.waypoints)
        {
            _vals.waypoints = props.destinationDetails.waypoints
        }

        directionsService
        .route(_vals)
        .then((response) => {
            directionsRenderer.setDirections(response);
        })
        .catch((e) => window.alert("Directions request failed due to " + status));
    }

    useEffect(() => {

        const _def = () => {
        const directionsService = new props.google.maps.DirectionsService();
        const directionsRenderer = new props.google.maps.DirectionsRenderer();
        const map = new props.google.maps.Map(
            document.getElementById("map"),
            {
            zoom: 7,
            center: initLocation,
            }
        );
        directionsRenderer.setMap(map);

        calculateAndDisplayRoute(directionsService, directionsRenderer);
        }

        if(props.destinationDetails)
        {
            _def()
        }

    }, [props.destinationDetails])

    return <div id='map' style={{height: '500px'}} className="bg-gray-100"></div>
}

export default GoogleApiWrapper({
    apiKey: process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY ?? ''
})(RotueMap)