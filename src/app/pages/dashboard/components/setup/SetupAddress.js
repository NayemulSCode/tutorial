import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
// import { Marker } from "react-google-maps";

import clsx from 'clsx';
import Geocode from "react-geocode";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { Row, Form } from 'react-bootstrap-v5';
import 'dotenv/config'

export class SetupAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // for google map places autocomplete
            address: '',
            geoCoder: null,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            zoom: 20,
            mapCenter: {
                lat: 0,
                lng: 0,
            },
            markerPosition: {
                lat: 0,
                lng: 0,
            },
            // searchOptions:{
            //     location: window.google.maps.LatLng(0,0),
            //     radius: 2000,
            //     types: ['address']
            // }
        };
    }
    handleChange = address => {
        this.setState({ address });
        // console.log(address)
    };
    handleSelect = address => {
        this.setState({
            address: (address) ? address : ''
        })
        console.log(address)
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                console.log('Success', latLng);
                // update center state
                this.setState({
                    mapCenter: {
                        lat: latLng.lat,
                        lng: latLng.lng,
                    },
                    markerPosition: {
                        lat: latLng.lat,
                        lng: latLng.lng,
                    }
                });
                this.props.mapInformation(this.state.address, latLng.lat, latLng.lng)

            })
            .catch(error => console.error('Error', error));
    };

    onMarkerClick = (props, marker, e) => {
        console.log(marker, e, props)
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }
    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                    address: "",
                    mapCenter: {
                        lat: this.props.lati,
                        lng: this.props.longi,
                    },
                    markerPosition: {
                        lat: this.props.lati,
                        lng: this.props.longi,
                    }
                },
                    () => {
                        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                            response => {
                                // console.log("response", response.results[0].address_components[5].short_name)
                                // const shortCode = (response.results[0].address_components[5].short_name)
                                const address = response.results[3].formatted_address;
                                const fullAddress = address.split(",")
                                const countryName = fullAddress[fullAddress.length - 1]
                                this.props.mapInformation(this.state.address, position.coords.latitude, position.coords.longitude)
                            },
                            error => {
                                console.error(error);
                            }
                        );

                    })
            });
        } else {
            console.error("Geolocation is not supported by this browser!");
        }
    };
    render() {
        const lati = this.props.laitu;
        const langi = this.props.longi;
        console.log("info address", lati, langi)
        return (
            <div id=''>
                <PlacesAutocomplete
                    value={this.state.address}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                    defaultValue={this.state.address}
                // searchOptions={this.state.searchOptions}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            {/* For Auto complete Search Box */}
                            <Row className="business-location-wrap">
                                <Form.Group className="" controlId="formGridBusinessLocation">
                                    <Form.Label className="">Business Location</Form.Label>
                                    <Form.Control
                                        // onKeyUp={this.searchOptions}
                                        className={clsx('form-control form-control-md form-control-solid')} type="search" placeholder="Search by Address or EIR Code."
                                        {...getInputProps({
                                            // placeholder: 'Search Places ...',
                                            // className: 'location-search-input',
                                        })}
                                    />
                                </Form.Group>
                            </Row>
                            <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                        ? 'suggestion-item--active'
                                        : 'suggestion-item';
                                    // inline style for demonstration purpose
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
                    defaultZoom={this.state.zoom}
                    // googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAX9IFfgZfH0jTzY888Nz-m0ftttvexERw&libraries=geometry,drawing,places`}
                    className='map-wrapper'
                    google={this.props.google}
                    initialCenter={{
                        lat: this.state.mapCenter.lat ? this.state.mapCenter.lat : lati,
                        lng: this.state.mapCenter.lng ? this.state.mapCenter.lng : langi
                    }}
                    center={{
                        lat: this.state.mapCenter.lat ? this.state.mapCenter.lat : lati,
                        lng: this.state.mapCenter.lng ? this.state.mapCenter.lng : langi
                    }}
                    style={{ height: "100%", width: "100%", position: "absolute" }}
                >
                    <Marker
                        position={{
                            lat: this.state.mapCenter.lat ? this.state.mapCenter.lat : lati,
                            lng: this.state.mapCenter.lng ? this.state.mapCenter.lng : langi
                        }}
                        onClick={this.onMarkerClick}
                    />
                </Map>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
})(SetupAddress)