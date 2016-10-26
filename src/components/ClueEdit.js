const ReactNative = require('react-native');
const React = require('react');

let {
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
	AlertIOS,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    marginTop: 85,
    marginBottom: 50,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  topViewStyle: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 30,
    marginRight: 30,
  },
  bottomViewStyle: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 30,
    marginRight: 30,
  },
  innerViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: 300,
  },
  textBoxName: {
    backgroundColor: '#E1EEEC',
    fontFamily: 'Verlag-Book',
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 7,
    height: 25,
  },
  textBoxClueName: {
    backgroundColor: '#FFFFFF',
    height: 25,
    fontSize: 23,
    fontStyle: 'italic',
    marginBottom: 10,
    fontFamily: 'Verlag-Book',
  },
  textBoxQuestion: {
    height: 100,
    padding: 5,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#E1EEEC',
  },
  questions: {
    fontSize: 23,
    fontFamily: 'Verlag-Book',
  },
  adder: {
    alignSelf: 'center',
  },
  addTexts: {
    fontFamily: 'Verlag-Book',
    color: '#6BC9AF',
  },
  addClueButton: {
    width: 35,
    height: 35,
    borderRadius: 25,
    backgroundColor: '#E1EEEC',
    marginTop: 7,
  },
  addClueButtonText: {
    color: '#6BC9AF',
    fontSize: 25,
    alignSelf: 'center',
    marginTop: 1,
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
});

class ClueEdit extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topViewStyle}>
          <TextInput style={styles.textBoxClueName} placeholderTextColor="black" multiline="false" placeholder="Clue Name" />
          <TextInput style={styles.textBoxName} placeholderTextColor="#6BC9AF" multiline="false" placeholder="add location... (optional)" />
          <Text style={styles.questions}>Question</Text>
          <TextInput style={styles.textBoxQuestion} multiline="true" placeholder="Question" />
          <TouchableHighlight underlayColor="#dddddd" onPress={() => this.onPress}>
            <Text style={styles.addTexts}>add pictures...</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor="#dddddd" onPress={() => this.onPress}>
            <Text style={styles.addTexts}>add hint...</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.bottomViewStyle}>
          <Text style={styles.questions}>Possible Answers</Text>
          <TextInput style={styles.textBoxName} multiline="true" placeholder="Answers" />
          <TextInput style={styles.textBoxName} multiline="true" placeholder="Answers" />
          <TouchableHighlight style={styles.adder} underlayColor="#dddddd" onPress={() => this.onPress}>
            <View style={styles.addClueButton}>
              <Text style={styles.addClueButtonText}>+</Text>
            </View>
          </TouchableHighlight>
          <View style={styles.innerViewStyle}>
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
      </View>
    );
  }
}

module.exports = ClueEdit;
