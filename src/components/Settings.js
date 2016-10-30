const ReactNative = require('react-native');
const React = require('react');

const {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableHighlight,
  Alert,
  TextInput,
  ListView,
  Dimensions,
  ScrollView,
  Modal,
  Switch,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 85,
    marginBottom: 115,
    marginRight: 30,
    marginLeft: 35,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  innerView: {
    flex: 1,
    backgroundColor: '#E1EEEC',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 30,
    borderRadius: 20,
    width: 300,
    marginTop: 15,
  },
  instructionView: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 14,
    marginRight: 15,
  },
  title: {
    alignSelf: 'center',
    paddingTop: 5,
    fontFamily: 'Verlag-Book',
    color: '#23B090',
    fontSize: 20,
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 20,
    fontFamily: 'Verlag-Book',
    marginTop: 4,
  },
  publicity: {
    width: 50,
    height: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  skipText: {
    width: 50,
    height: 30,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Verlag-Book',
    paddingLeft: 5,
    paddingTop: 2,
    fontSize: 20,
    color: 'grey',
  },
  finishingMessage: {
    height: 60,
    width: 220,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Verlag-Book',
    paddingLeft: 5,
    color: 'grey',
    fontSize: 15,
    alignSelf: 'center',
  },
  deleteButton: {
    width: 130,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F2C6C5',
  },
  deleteText: {
    color: '#EB766C',
    fontFamily: 'Verlag-Book',
    alignSelf: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 20,
  },
  saveButton: {
    width: 130,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E7EEBB',
  },
  saveText: {
    color: '#BCCC5F',
    fontFamily: 'Verlag-Book',
    alignSelf: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 20,
  },
  bottomViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: 300,
  },
});

class Settings extends React.Component {
  state = {
    trueSwitchIsOn: true,
    falseSwitchIsOn: false,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerView}>
          <Text style={styles.title}>Advanced Settings</Text>
          <View style={styles.instructionView}>
            <Text style={styles.instructionText}>Skips Allowed</Text>
            <TextInput style={styles.skipText} multiline="false" />
          </View>
          <View style={styles.instructionView}>
            <Text style={styles.instructionText}>Publicity</Text>
            <TouchableHighlight underlayColor="#dddddd" onPress={() => this.onPress}>
              <View style={styles.publicity} />
            </TouchableHighlight>
          </View>
          <View style={styles.instructionView}>
            <Text style={styles.instructionText}>Procedural Clues</Text>
            <Switch onValueChange={value => this.setState({ falseSwitchIsOn: value })} value={this.state.falseSwitchIsOn} />
          </View>
          <View style={styles.instructionView}>
            <Text style={styles.instructionText}>Prize Distribution</Text>
            <Switch onValueChange={value => this.setState({ trueSwitchIsOn: value })} value={this.state.trueSwitchIsOn} />
          </View>
          <View style={styles.instructionView}>
            <Text style={styles.instructionText}>Enable Map</Text>
            <Switch disabled value={false} />
          </View>
          <View style={styles.instructionView}>
            <Text style={styles.instructionText}>Finishing Message</Text>
          </View>
          <TextInput style={styles.finishingMessage} multiline="true" />
        </View>
        <View style={styles.bottomViewStyle}>
          <TouchableHighlight underlayColor="#dddddd" onPress={() => this.onPress}>
            <View style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor="#dddddd" onPress={() => this.onPress}>
            <View style={styles.saveButton}>
              <Text style={styles.saveText}>Save</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

module.exports = Settings;
