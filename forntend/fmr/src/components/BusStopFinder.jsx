import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {MapContainer, TileLayer, Marker, Popup, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";
import RoutingHighlight from "./RoutingHighlight.jsx";
import axios from "axios";
import Header from "./Header/Header.jsx";
const BusStopFinder = () => {
    const [busStopData, setBusStopData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userLatitude, setUserLatitude] = useState(27.704271804504437); // default value
    const [userLongitude, setUserLongitude] = useState(85.32327484559599); // default value
    const [locationFetched, setLocationFetched] = useState(false);

    const [from, setFrom] = useState([27.690366, 85.223447]);
    const [to, setTo] = useState([27.693276, 85.280620]);

    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState([
        // 27.704271804504437, 85.32327484559599,
        27.696221, 85.288498,

    ]);


    const NEPAL_LATITUDE_BOUNDS = { min: 26.3475, max: 30.4474 };
    const NEPAL_LONGITUDE_BOUNDS = { min: 80.0586, max: 88.2015 };

    const [nearestparkings, setNearestparkings] = useState([]);
    const [availableBusStops, setAvailableBusStops] = useState([]);

    // const filterparkingsByStatus = (parkings, status) => {
    //   return parkings.filter((parking) => parking.parking_status === status);
    // };

    // useEffect(() => {
    //   // Filter parkings by status and set available parkings
    //   const desiredStatus = "Available";
    //   const filteredparkings = filterparkingsByStatus(
    //     nearestparkings,
    //     desiredStatus
    //   );
    //   setAvailableparkings(filteredparkings);
    // }, [nearestparkings]);

    const updateMarkerPosition = (latlng) => {
        const [lat, lon] = [latlng.lat, latlng.lng];

        // Check if the marked location is within Nepal bounds
        if (
            lat >= NEPAL_LATITUDE_BOUNDS.min &&
            lat <= NEPAL_LATITUDE_BOUNDS.max &&
            lon >= NEPAL_LONGITUDE_BOUNDS.min &&
            lon <= NEPAL_LONGITUDE_BOUNDS.max
        ) {
            setMarkerPosition([lat, lon]);
            setUserLatitude(lat);
            setUserLongitude(lon);
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                text: "Mark the location inside Nepal Only",
                confirmButtonText: "Okay",
                timer: 5000,
                customclassName: {
                    popup: "custom-swal-popup",
                },
            });
        }
    };


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLatitude(position.coords.latitude);
                    setUserLongitude(position.coords.longitude);
                    setLocationFetched(true);
                },
                (error) => {
                    setError(error.message);
                    setLocationFetched(true);
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
            setLocationFetched(false);
        }
    }, []);

    useEffect(() => {
        if (locationFetched) {
            const fetchBusStopDataMethod = async () => {
                try {
                    const response = await axios.get("http://localhost:8091/bus-stop");
                    calculation(response.data); // perform your logic on the data
                    setBusStopData(response.data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setIsDataLoading(false);
                }
            };

            fetchBusStopDataMethod();
        }
    }, [locationFetched]);


    //Haversine Algorithm implementation
    const calculation = (data)=> {
        if (typeof data !== "undefined") {
            const busStopWithDistance = data.data.map((stop) => {
                if (
                    stop.ltd === undefined ||
                    stop.lng === undefined
                ) {
                    console.error("parking data is missing latitude or longitude.");
                    return stop;
                }
                const busStopLatitude = parseFloat(
                    stop.ltd.replace(",", ".")
                );
                const busStopLongitude = parseFloat(
                    stop.lng.replace(",", ".")
                );

                // const userLatitude = parseFloat(markerPosition[1]);
                // const userLongitude = parseFloat(markerPosition[0]);
                //
                // setUserLatitude(userLatitude);
                // setUserLongitude(userLongitude);
                const distance = calculateHaversineDistance(
                    userLatitude,
                    userLongitude,
                    busStopLatitude,
                    busStopLongitude
                );

                return {
                    ...stop,
                    distance,
                };
            });

            const sortedBusStops = busStopWithDistance.sort(
                (a, b) => a.distance - b.distance
            );

            // Filter parkings by status and set available parkings
            // const desiredStatus = "Available";
            // const filteredparkings = filterparkingsByStatus(
            //   sortedparkings,
            //   desiredStatus
            // );
            setAvailableBusStops(sortedBusStops);
        }
    }

    function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }


    useEffect(() => {
        if(availableBusStops.length > 0) {
            const nearestBusStop = availableBusStops[0];

            setFrom([userLatitude, userLongitude]);
            setTo([nearestBusStop.ltd, nearestBusStop.lng]);
        }
    }, [availableBusStops]);


    if(!locationFetched) {
        return <div>Unable to fetch the current location</div>;

    }

    if(isDataLoading) {
        return (
            <div className="ringcolor">
                <div className="ring">
                    Loading
                    <div className="ringspin"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <Header />
            <div className="w-full">
                <div className="map text-muted">
                    <MapContainer
                        center={markerPosition}
                        zoom={14.5}
                        style={{
                            height: "500px",
                        }}
                        whenCreated={setMap}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* User marker */}
                        <Marker
                            position={markerPosition}
                            draggable={true}
                            eventHandlers={{
                                dragend: (e) => {
                                    updateMarkerPosition(e.target.getLatLng());
                                },
                            }}
                        />

                        {/* Parking area markers */}
                        {
                            busStopData.data.map((stop, index) => (
                                <Marker
                                    key={index}
                                    position={[
                                        parseFloat(stop.ltd),
                                        parseFloat(stop.lng),
                                    ]}
                                    icon={L.icon({
                                        iconUrl: "src/assets/red.png", // Replace 'path/to/red-marker-icon.png' with the path to your red marker icon
                                        iconSize: [45, 45],
                                        iconAnchor: [12, 41],
                                        popupAnchor: [10, -35],
                                    })}
                                >
                                    <Popup>
                                        <div
                                            className=""
                                            style={{ lineHeight: "2px", fontSize: "12px" }}
                                        >
                                            <h5>
                                                <b>{stop.name}</b>
                                            </h5>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))
                        }
                        {<RoutingHighlight from={from} to={to} />}

                        <div
                            className="lonlat"
                            style={{
                                position: "relative",
                                padding: "0 5px",

                                marginTop: "482px",
                                zIndex: "1000",
                                background: "white",
                                color: "black",
                            }}
                        >
                            Lat : {userLatitude} , Lon : {userLongitude}
                        </div>
                    </MapContainer>
                </div>
            </div>

            {/*<div className="album py-1 mt-3">*/}
            {/*  <div className="container">*/}
            {/*    <h4 className="mt-4 mb-4">Parkings Near Me</h4>*/}

            {/*    <div className="row">*/}
            {/*      {isFetchLoading ? (*/}
            {/*        <div className="pl-4 pb-5">Loading</div>*/}
            {/*      ) : parkingError ? (*/}
            {/*        <p>Error: {parkingError}</p>*/}
            {/*      ) : parkingData.data.length > 0 ? (*/}
            {/*        parkingData.data.map((item, index) => (*/}
            {/*          <div className="col-md-4" key={index}>*/}
            {/*            <div className="card mb-4 box-shadow">*/}
            {/*              <p*/}
            {/*                className="m-0"*/}
            {/*                style={{*/}
            {/*                  position: "absolute",*/}
            {/*                  right: "0",*/}
            {/*                  fontSize: "1.05vw",*/}
            {/*                  backgroundColor: "yellow",*/}
            {/*                  color: "black",*/}
            {/*                  top: "1vw",*/}
            {/*                  padding: "0 20px",*/}
            {/*                }}*/}
            {/*              >*/}
            {/*                {item.parking_name}*/}
            {/*              </p>*/}
            {/*              <img*/}
            {/*                className="card-img-top"*/}
            {/*                src="./src/assets/parking.jpg"*/}
            {/*                alt="parking"*/}
            {/*                data-holder-rendered="true"*/}
            {/*              />*/}
            {/*              <div className="card-body">*/}
            {/*                <h5>{item.parking_name}</h5>*/}
            {/*                <p className="">Phone : {item.parking_contact}</p>*/}
            {/*                <div className="d-flex justify-content-between align-items-center">*/}
            {/*                  <div className="text-muted small">*/}
            {/*                    Two Wheeler: {item.parking_twowheel}/*/}
            {/*                    {item.parking_twowheel_capacity} <br />*/}
            {/*                    Four Wheeler: {item.parking_fourwheel}/*/}
            {/*                    {item.parking_fourwheel_capacity}*/}
            {/*                  </div>*/}
            {/*                  <small className="text-muted">*/}
            {/*                    Time: {item.parking_openingTime}-*/}
            {/*                    {item.parking_closingTime}*/}
            {/*                    <br />*/}
            {/*                    Rs {item.parking_price} per hr*/}
            {/*                  </small>*/}
            {/*                </div>*/}
            {/*              </div>*/}
            {/*            </div>*/}
            {/*          </div>*/}
            {/*        ))*/}
            {/*      ) : (*/}
            {/*        <p className="pl-5">No available parkings</p>*/}
            {/*      )}*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
        </>
    );
};

export default BusStopFinder;
