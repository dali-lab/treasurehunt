const ReactNative = require('react-native');
const React = require('react');
const Firebase = require('firebase');
const ClueEdit = require('./ClueEdit');

import rootRef from '../../newfirebase.js';

const {
StyleSheet,
View,
Text,
TouchableHighlight,
TextInput,
ListView,
Dimensions,
} = ReactNative;
const {
    Component,
} = React;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    marginBottom: 50,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  heading: {
    marginTop: 15,
    fontSize: 28,
    fontFamily: 'Verlag-Book',
    alignSelf: 'center',
  },
  divider: {
    width: 320,
    height: 2,
    backgroundColor: '#23B090',
    alignSelf: 'center',
    marginBottom: 5,
  },
  topViewStyle: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  middleViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  innerViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
  },
  clueViewStyle: {
    flex: 3,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 100,
  },
  buttonViewBox: {
    width: 80,
    height: 80,
    backgroundColor: 'black',
  },
  addButton: {
    width: 100,
    height: 100,
    backgroundColor: '#22AF8E',
    alignSelf: 'center',
    fontSize: 43,
    paddingLeft: 36,
    paddingTop: 19,
    color: 'white',
    marginRight: 35,
  },
  textBoxHunt: {
    width: 200,
    height: 100,
    backgroundColor: '#E1EEEC',
    marginLeft: 30,
    marginRight: 10,
    padding: 10,
    fontSize: 19,
    fontFamily: 'Verlag-Book',
    alignSelf: 'center',
    borderRadius: 10,
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


const usersRef = rootRef.ref('users');
const huntsRef = rootRef.ref('hunts');

const storage = Firebase.storage();
const storageRef = storage.ref();

/**
 * The Create Hunt view for the app to create hunts
 */
//

const CreateHunt = React.createClass({

	getInitialState() {
    console.log('running getInitialState');

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid,
      sectionHeaderHasChanged: (s1, s2) => s1.guid !== s2.guid,
    });

    return {
      clues: [],
      desc: '',
      image: '',
      name: '',
      private: false,
      procedural: true,
      reward: '',
      skipsAllowed: 0,
			dataSource,
    };
  },
  _updateHuntName(title) {
    this.setState({
      name: title,
    });
    console.log(this.state.name);
  },
  newClue() {
    this.props.navigator.push({
      title: 'Create Clue',
      component: CreateClue,
      passProps: {
      },
    });
  },

  buttonPressed(hunt) {
    this.props.navigator.push({
      title: 'ClueEdit',
      component: ClueEdit,
      passProps: {
      },
    });
  },

	renderRow(hunt) {
    return (
      <TouchableHighlight onPress={() => this.buttonPressed(hunt)}
        underlayColor="#dddddd"
      >
        <View>
          <View style={styles.textBoxHunt}>

            <View style={styles.textContainer}>
              <View>
                <Text> clue 1 </Text>
                <Text style={styles.description}
                  numberOfLines={2}
                >{hunt.desc}</Text>
              </View>
            </View>
					</View>
				</View>
      </TouchableHighlight>
        );
  },

  render() {
    let huntName, huntDescription;
    let huntImage;
    if (this.props.hunt === undefined) {
      huntName = 'Hunt Name';
      huntDescription = 'Hunt description....';
    } else {
      huntName = this.props.hunt.name;
      huntDescription = this.props.hunt.desc;
    }


    var listView = <ListView
      dataSource={this.state.dataSource}
      automaticallyAdjustContentInsets={false}
      renderRow={this.renderRow}/>

		let internalView;

		if (this.state.hunt === undefined) {
			internalView = (<View style={styles.textBoxHunt}>
				<Text>Loading...</Text>
			</View>);
		} else {
			internalView = listView;
		}

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>{huntName}</Text>
        <View style={styles.divider} />
        <View style={styles.middleViewStyle}>
          <TextInput style={styles.textBoxHunt} onChangeText={this._updateHuntName} multiline="true" value={huntDescription} />
          <Text style={styles.addButton}>+</Text>
        </View>
				{internalView}
        <TouchableHighlight underlayColor="#dddddd" onPress={() => this.buttonPressed()}>
          <View style={styles.addClueButton}>
            <Text style={styles.addClueButtonText}>+</Text>
          </View>
        </TouchableHighlight>
        <View style={styles.clueViewStyle} />
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
    );
  },
});

module.exports = CreateHunt;
