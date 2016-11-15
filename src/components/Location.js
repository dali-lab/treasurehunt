'use strict';

const ReactNative = require('react-native');
const React = require('react');

const {
  StyleSheet,
  Text,
  View,
  TextInput,
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
  title: {
    fontWeight: '500',
  },
  inputLocation: {
    marginLeft: 10,
    width: 140,
    height: 18,
    backgroundColor: 'grey',
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
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      console.log(`updaing pos: ${JSON.stringify(position)}`);
      this.setState({ lastPosition: position });
    });
    // console.log(`what is the state?${JSON.stringify(this.state.lastPosition)}`);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  calculateDistanceKilometers() {
    const radiusKM = 6371;
    const longFP = this.state.longitude;
    const latFP = this.state.latitude;
    const latCP = this.state.lastPosition.coords.latitude;
    console.log(`State of lastPosition is:${JSON.stringify(this.state.lastPosition)}`);
    const longCP = this.state.lastPosition.coords.longitude;
    const deltaLong = (longFP - longCP) * (Math.PI / 180);
    const deltaLat = (latFP - latCP) * (Math.PI / 180);
    const a = (Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)) +
        (Math.cos(latCP) * Math.cos(latFP) *
        Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const disKM = radiusKM * c;

    return disKM;
  }

  calculateDistanceMiles() {
    const radiusMI = 3959;
    const longFP = this.state.longitude;
    const latFP = this.state.latitude;
    const latCP = this.state.lastPosition.coords.latitude;
    const longCP = this.state.lastPosition.coords.longitude;
    console.log(`deltaLong: ${(longFP - longCP)}`);
    const deltaLong = (longFP - longCP) * (Math.PI / 180);
    const deltaLat = (latFP - latCP) * (Math.PI / 180);
    const a = (Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)) +
        (Math.cos(latCP) * Math.cos(latFP) *
        Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const disMI = radiusMI * c;

    return disMI;
  }

  watchID: ?number = null;

  render() {
    const dmile = this.calculateDistanceMiles();
    const dkilo = this.calculateDistanceKilometers();

    return (
      <View style={styles.container}>
        <View style={styles.questionContainer}>
          <Text>Enter Longitude You Want to Find:</Text>
          <TextInput style={styles.inputLocation} onChangeText={longitude => this.setState({ longitude })}
            value={this.state.longitude}
          />
        </View>
        <View style={styles.questionContainer}>
          <Text>Enter Latitude You Want to Find:</Text>
          <TextInput style={styles.inputLocation} onChangeText={latitude => this.setState({ latitude })}
            value={this.state.latitude}
          />
        </View>
        <View>
          <Text>
            <Text style={styles.title}>Longitude: </Text>
            {this.state.lastPosition.coords.longitude}
          </Text>
          <Text>
            <Text style={styles.title}>Latitude: </Text>
            {this.state.lastPosition.coords.latitude}
          </Text>
          <Text>
            <Text style={styles.title}>Current heading: </Text>
            {this.state.lastPosition.coords.heading}
          </Text>
          <Text>
            <Text style={styles.title}>Distance in Miles: </Text>
            { dmile }
          </Text>
          <Text>
            <Text style={styles.title}>Direction in Kilometers: </Text>
            { dkilo }
          </Text>
        </View>
      </View>
    );
  }
}

module.exports = Location;
