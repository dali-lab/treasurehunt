'use strict';

const ReactNative = require('react-native');
const React = require('react');

const {
  StyleSheet,
  Text,
  View,
  MapView,
  TextInput,
  Image,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 85,
    marginBottom: 115,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  questionContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginBottom: 10,
  },
  compass: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  title: {
    fontWeight: '500',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf: 'center',
  },
  miles: {
    fontSize: 25,
    alignSelf: 'center',
  },
  inputLocation: {
    marginLeft: 10,
    width: 140,
    height: 18,
    backgroundColor: 'grey',
  },
  circle: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    backgroundColor: '#23B090',
    borderRadius: 100,
  },
});


class Location extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      initialPosition: [],
      lastPosition: { coords: {
        speed: 3.85,
        longitude: 0,
        latitude: 0,
        accuracy: 10,
        heading: 0,
        altitude: 0,
        altitudeAccuracy: -1 },
        timestamp: 0 },
      latitude: 0,
      longitude: 0,
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const initialPosition = JSON.stringify(position);
        console.log(`position isssss${JSON.stringify(position)}`);
        console.log(`position isssss${JSON.stringify(position.coords)}`);
        this.setState({ initialPosition });
      },
      error => alert(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      console.log(`updaing pos: ${JSON.stringify(position)}`);
      this.setState({ lastPosition: position });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  calculateDistanceKilometers() {
    const radiusKM = 6371;
    const longFP = this.state.longitude * (Math.PI / 180);
    const latFP = this.state.latitude * (Math.PI / 180);
    const latCP = this.state.lastPosition.coords.latitude * (Math.PI / 180);
    const longCP = this.state.lastPosition.coords.longitude * (Math.PI / 180);
    const deltaLong = (longFP - longCP);
    const deltaLat = (latFP - latCP);
    const a = (Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)) +
         (Math.cos(latCP) * Math.cos(latFP) *
        Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const disKM = radiusKM * c;

    return disKM;
  }

  calculateDistanceMiles() {
    const radiusMI = 3959;
    const longFP = this.state.longitude * (Math.PI / 180);
    const latFP = this.state.latitude * (Math.PI / 180);
    const latCP = this.state.lastPosition.coords.latitude * (Math.PI / 180);
    const longCP = this.state.lastPosition.coords.longitude * (Math.PI / 180);
    const deltaLong = (longFP - longCP);
    const deltaLat = (latFP - latCP);
    const a = (Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)) +
        (Math.cos(latCP) * Math.cos(latFP) *
        Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const disMI = radiusMI * c;

    return disMI;
  }

  calculateBearing() {
    const y = Math.sin(this.state.longitude - this.state.lastPosition.coords.longitude) * Math.cos(this.state.latitude);
    const x = (Math.cos(this.state.lastPosition.coords.latitude) * Math.sin(this.state.latitude)) - (Math.sin(this.state.lastPosition.coords.latitude)
     * Math.cos(this.state.latitude) * Math.cos(this.state.longitude - this.state.lastPosition.coords.longitude));
    let brng = Math.atan2(y, x) * (180 / Math.PI);
    if (brng < 0) {
      brng += 360;
    }

    return brng;
  }

  watchID: ?number = null;

  render() {
    const dmile = this.calculateDistanceMiles();
    const bearing = this.calculateBearing();
    const image = '../img/RedArrow.png';
    // I tried using the variable image to replace the picture with the changing color arrows, but it gave me this error and npm install didn't work for me:
    // Requiring unknown module "[object Object]". If you are sure the module is there, try restarting the packager or running "npm install".
    if (dmile >= 5) {
      const image = '../img/RedArrow.png';
    } else if (dmile < 1) {
      const image = '../img/GreenArrow.png';
    } else {
      const image = '../img/YellowArrow.png';
    }

    return (
      <View style={styles.container}>
        <MapView style={{ height: 150, margin: 10 }}
          showsUserLocation
          followUserLocation
        />
        <View>
          <Text>
            <Text style={styles.title}>Current Location: </Text>
            {this.state.lastPosition.coords.longitude}
            <Text style={styles.title}>, </Text>
            {this.state.lastPosition.coords.latitude}
          </Text>
          <View style={styles.compass}>
            <View style={styles.circle}>
              <Image source={require('../img/GreenArrow.png')} style={{ marginTop: 10,
                marginLeft: 10,
                height: 180,
                width: 180,
                transform: [{ rotate: `${this.state.lastPosition.coords.heading - bearing}` + 'deg' }] }}
              />
            </View>
          </View>
          <Text style={styles.miles}>
            <Text style={styles.heading}>Distance Away (Miles): </Text>
            { dmile }
          </Text>
        </View>
      </View>
    );
  }
}

module.exports = Location;
