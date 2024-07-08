import React, { useState, useEffect } from 'react'
import classes from './map.module.css'
import 'leaflet/dist/leaflet.css'
import markerIconPng from '../../../public/marker-icon-2x.png'
import {
    MapContainer,
    TileLayer,
    Marker,         // For adding markers to the map
    Popup,          // For adding popups to markers
    useMapEvents,   // Hook to listen to map events
} from 'react-leaflet'
import { toast } from 'react-toastify'
import * as L from 'leaflet'

const Map = ({ readonly, location, onChange }) => {

    return (
        <div className={classes.container}>
            <MapContainer
                className={classes.map}
                center={[0, 0]}
                zoom={1}
                dragging={!readonly}
                touchZoom={!readonly}
                doubleClickZoom={!readonly}
                boxZoom={!readonly}
                keyboard={!readonly}
                attributionControl={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FindButtonAndMarker
                    readonly={readonly}
                    location={location}
                    onChange={onChange}
                />
            </MapContainer>
        </div>
    )
}

function FindButtonAndMarker({ readonly, location, onChange }) {
    const [position, setPosition] = useState(location)

    useEffect(() => {
        if (readonly) {
            map.setView(position, 13)
            return
        }
        if (position) onChange(position)
    }, [position])

    const map = useMapEvents({
        click(e) {
            !readonly && setPosition(e.latlng)
        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, 13);
        },
        locationerror(e) {
            toast.error(e.message)
        }
    })

    const markerIcon = new L.Icon({
        iconUrl: markerIconPng,
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41],
    });

    return (
        <>
            {!readonly && (
                <button
                    type='button'
                    className={classes.find_location}
                    onClick={() => map.locate()}
                >
                    Find My Location
                </button>
            )}

            {
                position && (
                    <Marker
                        eventHandlers={{
                            dragend: e => {
                                setPosition(e.target.getLatLng())
                            },
                        }}
                        position={position}
                        draggable={!readonly}
                        icon={markerIcon}
                    >
                        <Popup>Shipping location</Popup>
                    </Marker>
                )
            }
        </>
    )
}

export default Map