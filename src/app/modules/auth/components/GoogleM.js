import React from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import { Descriptions } from 'antd';
import { Form, Button, Row, Col, InputGroup, FormControl } from 'react-bootstrap-v5';
import clsx from 'clsx';
import 'dotenv/config'

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
Geocode.enableDebug();

class GoogleM extends React.Component {

    state = {
        address: '',
        city: '',
        area: '',
        state: '',
        // alphCode: '',
        zoom: 13,
        height: 400,
        mapPosition: {
            lat: 0,
            lng: 0,
        },
        markerPosition: {
            lat: 0,
            lng: 0,
        }
    }


    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                    mapPosition: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    markerPosition: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }
                },
                    () => {
                        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                            response => {
                                // console.log("response", response.results[0].address_components[5].short_name)
                                // const shortCode = (response.results[0].address_components[5].short_name)
                                const address = response.results[0].formatted_address,
                                    addressArray = response.results[0].address_components,
                                    city = this.getCity(addressArray),
                                    area = this.getArea(addressArray),
                                    state = this.getState(addressArray);
                                // console.log('city', city, area, state);
                                const fullAddress = address.split(",")
                                const countryName = fullAddress[fullAddress.length -1]
                                // console.log('address', addressArray);
                                this.setState({
                                    address: (address) ? address : '',
                                    area: (area) ? area : '',
                                    city: (city) ? city : '',
                                    state: (state) ? state : '',
                                    // alphCode: (shortCode) ? shortCode : '',
                                })
                                this.props.mapInformation(this.state.address, position.coords.latitude, position.coords.longitude, countryName)
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
    getCity = (addressArray) => {
        let city = '';
        for (let i = 0; i < addressArray?.length; i++) {
            if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
                city = addressArray[i].long_name;
                return city;
            }
        }
    };

    getArea = (addressArray) => {
        let area = '';
        for (let i = 0; i < addressArray?.length; i++) {
            if (addressArray[i].types[0]) {
                for (let j = 0; j < addressArray[i].types.length; j++) {
                    if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
                        area = addressArray[i].long_name;
                        return area;
                    }
                }
            }
        }
    };

    getState = (addressArray) => {
        let state = '';
        for (let i = 0; i < addressArray?.length; i++) {
            for (let i = 0; i < addressArray.length; i++) {
                if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
                    state = addressArray[i].long_name;
                    return state;
                }
            }
        }
    };

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onInfoWindowClose = (event) => { };

    onMarkerDragEnd = (event) => {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();

        Geocode.fromLatLng(newLat, newLng).then(
            response => {
                // const shortCode = (response.results[0]?.address_components[5]?.short_name)
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    state = this.getState(addressArray);
                    const fullAddress = address.split(",")
                    const countryName = fullAddress[fullAddress.length - 1]
                // console.log("response", countryName)
                this.setState({
                    address: (address) ? address : '',
                    area: (area) ? area : '',
                    city: (city) ? city : '',
                    state: (state) ? state : '',
                    // alphCode: (shortCode) ? shortCode : '',
                    markerPosition: {
                        lat: newLat,
                        lng: newLng
                    },
                    mapPosition: {
                        lat: newLat,
                        lng: newLng
                    },
                })
                this.props.mapInformation(this.state.address, newLat, newLng, countryName)
            },
            error => {
                console.error(error);
            }
        );
    };

    onPlaceSelected = (place) => {
        // console.log('plc', place);
        const address = place?.formatted_address,
            addressArray = place.address_components,
            city = this.getCity(addressArray),
            area = this.getArea(addressArray),
            state = this.getState(addressArray),
            latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();

        // console.log('latvalue', latValue)
        // console.log('lngValue', lngValue)
        const fullAddress = address.split(",")
        const countryName = fullAddress[fullAddress.length - 1]
        // console.log("address", countryName)
        // Set these values in the state.
        this.setState({
            address: (address) ? address : '',
            area: (area) ? area : '',
            city: (city) ? city : '',
            state: (state) ? state : '',
            // alphCode: (alphCode) ? alphCode : '',
            markerPosition: {
                lat: latValue,
                lng: lngValue
            },
            mapPosition: {
                lat: latValue,
                lng: lngValue
            },
        })
        this.props.mapInformation(this.state.address, latValue, lngValue, countryName)
    };
    render() {
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props => (
                    <GoogleMap
                        defaultZoom={this.state.zoom}
                        defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
                    >
                        {/* InfoWindow on top of marker */}

                        {/*Marker*/}
                        <Marker
                            google={this.props.google}
                            name={'Ireland'}
                            draggable={true}
                            onDragEnd={this.onMarkerDragEnd}
                            position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
                        />
                        <InfoWindow
                            onClose={this.onInfoWindowClose}
                            position={{ lat: (this.state.markerPosition.lat + 0.0018), lng: this.state.markerPosition.lng }}
                        >
                            <div>
                                <span style={{ padding: 0, margin: 0 }}>{this.state.address}</span>
                            </div>
                        </InfoWindow>
                        <Marker />
                        {/* For Auto complete Search Box */}
                        <Row className="business-location-wrap">
                            <Form.Group className="" controlId="formGridBusinessLocation">
                                <Form.Label className="b-location-label">Business Location</Form.Label>
                                    <Autocomplete
                                        className={clsx('form-control form-control-md form-control-solid')}
                                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                        placeholder="Search Location"
                                        defaultValue={this.state.address}
                                        onPlaceSelected={this.onPlaceSelected}
                                        types={['(regions)']}
                                    />
                                
                            </Form.Group>
                        </Row>
                    </GoogleMap>
                )
            )
        );

        return (
            <div style={{ margin: '0 auto', maxWidth: 1000 }}>
                {/* <Descriptions bordered>
                    <Descriptions.Item label="City">{this.state.city}</Descriptions.Item>
                    <Descriptions.Item label="Area">{this.state.area}</Descriptions.Item>
                    <Descriptions.Item label="State">{this.state.state}</Descriptions.Item>
                    <Descriptions.Item label="Business Location" style={{}}>
                        <input style={{padding: '10px', width:'350px'}} type="text"  defaultValue={ this.state.address } />
                    </Descriptions.Item>
                </Descriptions> */}

                <AsyncMap
                    // googleMapURL= {`https://maps.googleapis.com/maps/api/js?v=3.26exp&libraries=geometry,drawing,places&key=AIzaSyAX9IFfgZfH0jTzY888Nz-m0ftttvexERw`}
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAX9IFfgZfH0jTzY888Nz-m0ftttvexERw&libraries=geometry,drawing,places`}
                    loadingElement={
                        <div style={{ height: `100%` }} />
                    }
                    containerElement={
                        <div style={{ height: this.state.height }} />
                    }
                    mapElement={
                        <div style={{ height: `100%` }} />
                    }
                />
            </div>
        )
    }

}

export default GoogleM;