import React, { useState, useEffect } from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { Row, Form } from 'react-bootstrap-v5';
import Geocode from 'react-geocode';
import clsx from 'clsx';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';

const MapContainerEircode = ({ google, mapInformation }) => {
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
    const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                setMapCenter({ lat: latitude, lng: longitude });
                setMarkerPosition({ lat: latitude, lng: longitude });

                Geocode.fromLatLng(latitude, longitude).then(
                    response => {
                        const address = response.results[3].formatted_address;
                        const fullAddress = address.split(',');
                        const countryName = fullAddress[fullAddress.length - 1];
                        setCountry(countryName || '');
                        mapInformation('', latitude, longitude, countryName || '');
                    },
                    error => {
                        console.error(error);
                    }
                );
            });
        } else {
            console.error('Geolocation is not supported by this browser!');
        }
    }, []); // Empty dependency array means this effect runs once on component mount

    const handleChange = address => {
        setAddress(address);
    };

    const handleSelect = address => {
        setAddress(address);
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                setMapCenter({ lat: latLng.lat, lng: latLng.lng });
                setMarkerPosition({ lat: latLng.lat, lng: latLng.lng });
                mapInformation(address, latLng.lat, latLng.lng, country);
            })
            .catch(error => console.error('Error', error));
    };

    return (
        <div id=''>
            <PlacesAutocomplete
                value={address}
                onChange={handleChange}
                onSelect={handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className='mb-6'>
                        {/* For Auto complete Search Box */}
                        <Row className="business-location-wrap">
                            <Form.Group className="" controlId="formGridBusinessLocation">
                                <Form.Label className="required">EIRCODE (Type In & Select from drop-down menu)</Form.Label>
                                <Form.Control
                                    className={clsx('form-control form-control-md form-control-solid')}
                                    type="search"
                                    placeholder="Search by EIR code ..."
                                    {...getInputProps()}
                                />
                            </Form.Group>
                        </Row>
                        <div className="autocomplete-dropdown-container">
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
            <Map
                defaultZoom={20}
                className='map-wrapper'
                google={google}
                initialCenter={{
                    lat: mapCenter.lat,
                    lng: mapCenter.lng
                }}
                center={{
                    lat: mapCenter.lat,
                    lng: mapCenter.lng
                }}
                style={{ height: "100%", width: "100%", position: "absolute" }}
            >
                <Marker
                    position={{
                        lat: mapCenter.lat,
                        lng: mapCenter.lng
                    }}
                />
            </Map>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY
})(MapContainerEircode);
