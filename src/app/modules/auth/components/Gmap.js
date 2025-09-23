import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class Gmap extends Component {
    render() {
        return (
            <>
                <div className="mapWrapper">
                <Map google={this.props.google} zoom={14}>
                    <Marker onClick={this.onMarkerClick}
                            name={'Current location'} />

                    <InfoWindow onClose={this.onInfoWindowClose}>
                    </InfoWindow>
                </Map>
                </div>
            </>
        );
    }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyDCLXe7yMel1u6AV_dOsjqpmGhs8h9KShI")
})(Gmap)

