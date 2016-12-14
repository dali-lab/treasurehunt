const ReactNative = require('react-native');
const React = require('react');
const Location = require('./Location');

const {
  StyleSheet,
  Text,
  View,
  MapView,
  TextInput,
  Image,
  TouchableHighlight,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 85,
    marginBottom: 115,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  button: {
    flex: 1,
    marginTop: 40,
    alignSelf: 'center',
  },
});


class LocationClue extends React.Component {
  state = {
    isFirstLoad: true,
    annotations: [],
    mapRegion: undefined,
  };

  locationPressed(hunt) {
    this.props.navigator.push({
      title: 'Location',
      component: Location,
      passProps: {
        hunt,
      },
    });
  }

  createAnnotation = (longitude, latitude) => {
    return {
      longitude,
      latitude,
      draggable: true,
      onDragStateChange: (event) => {
        if (event.state === 'idle') {
          this.setState({
            annotations: [this.createAnnotation(event.longitude, event.latitude)],
          });
        }
        console.log(`Drag state: ${event.state}`);
      },
    };
  };

  render() {
    /**
    if (this.state.isFirstLoad) {
      const onRegionChangeComplete = (region) => {
        // When the MapView loads for the first time, we can create the annotation at the
        // region that was loaded.
        this.setState({
          isFirstLoad: false,
          annotations: [this.createAnnotation(region.longitude, region.latitude)],
        });
      };
    }
    */

    return (
      <View style={styles.button}>
        <TouchableHighlight style={styles.button}onPress={() => this.locationPressed()} underlayColor="white">
          <Text style={styles.buttonText}>Location</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

module.exports = LocationClue;
