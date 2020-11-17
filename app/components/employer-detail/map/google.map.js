import React, { useState } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
// import Marker from './marker';
import Geocode from "react-geocode";
Geocode.setApiKey('AIzaSyCBzaQ_VjkDhuXpO3X_U0aRtibpSwqUOuQ');
Geocode.enableDebug();
// const GoogleMap = (props) => {
//     const [center, setCenter] = useState({lat: 45.5043443, lng: -73.5598172});
//     const [zoom, setZoom] = useState(11);
//     return (
//       //   <div style={{ height: '35vh', width: '100%' }}>
//       //   <GoogleMapReact
//       //     bootstrapURLKeys={{ key: 'AIzaSyCBzaQ_VjkDhuXpO3X_U0aRtibpSwqUOuQ' }}
//       //     defaultCenter={center}
//       //     defaultZoom={zoom}
//       //   >
//       //     <Marker
//       //       lat={45.5043443}
//       //       lng={-73.5598172}
//       //       color="red"
//       //     />
//       //   </GoogleMapReact>
//       // </div>
//     );
// }

class GMap extends React.Component {

	render() {
		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
					<GoogleMap google={this.props.google}
						defaultZoom={this.props.zoom}
						defaultCenter={{ lat: this.props.center.lat, lng: this.props.center.lng }}
					>

						{/*Marker*/}
						<Marker google={this.props.google}
							name={'Dolores park'}
							position={{ lat: this.props.center.lat, lng: this.props.center.lng }}
						/>
						<Marker />
					</GoogleMap>
				)
			)
		);
		return (<AsyncMap
			googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCBzaQ_VjkDhuXpO3X_U0aRtibpSwqUOuQ&libraries=places`}
			loadingElement={
				<div style={{ height: `100%` }} />
			}
			containerElement={
				<div style={{ height: this.props.height }} />
			}
			mapElement={
				<div style={{ height: `100%` }} />
			}
		/>)
	}
}
export default GMap