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
    marginTop: 70,
    marginBottom: 50,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  topViewStyle: {
    flex: 2,
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
  textBoxName: {
    backgroundColor: '#E1EEEC',
    fontFamily: 'Verlag-Book',
    borderRadius: 5,
    marginBottom: 10,
    height: 25,
  },
  textBoxClueName: {
    backgroundColor: '#FFFFFF',
    height: 25,
    fontSize: 20,
    marginBottom: 5,
    fontFamily: 'Verlag-Book',
  },
  textBoxQuestion: {
    height: 100,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#E1EEEC',
  },
  questions: {
    fontSize: 18,
  },
  hello: {
    fontSize: 28,
    fontFamily: 'Verlag-Book',
  },
  adder: {
    alignSelf: 'center',
  },
  addClueButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#6BC9AF',
    marginTop: 15,
  },
  addClueButtonText: {
    color: 'black',
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 5,
  },
});

class ClueEdit extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topViewStyle}>
          <TextInput style={styles.textBoxClueName} multiline="false" placeholder="Clue Name" />
          <TextInput style={styles.textBoxName} multiline="false" placeholder="add location... (optional)" />
          <Text style={styles.questions}>Question</Text>
          <TextInput style={styles.textBoxQuestion} multiline="true" placeholder="Question" />
          <TouchableHighlight underlayColor="#dddddd" onPress={() => this.onPress}>
            <Text>add pictures...</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor="#dddddd" onPress={() => this.onPress}>
            <Text>add hint...</Text>
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
        </View>
      </View>
    );
  }
}

module.exports = ClueEdit;
