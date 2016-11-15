const ReactNative = require('react-native');
const React = require('react');
const Firebase = require('firebase');
const ClueEdit = require('./ClueEdit');
const Data = require('./Data');

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
    marginTop: 20,
    marginBottom: 20,
  },
  innerViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
  },
  clueViewStyle: {
    flex: 1,
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
    backgroundColor: '#C5EAE0',
    marginTop: 15,
    marginBottom: 15,
  },
  clueRows: {
    width: 300,
    height: 60,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#C5EAE0',
    padding: 10,
  },
  topContainer: {
    marginBottom: 10,
  },
  addClueButtonText: {
    color: '#6BC9AF',
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 3,
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
  internalViewContainer: {
    flex: 3,
    marginTop: 10,
    marginBottom: 10,
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
      rowHasChanged: (r1, r2) => r1 !== r2,
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

  saveButton() {
    Alert.alert('saving should go here!');
  },

  listenForClues() {
    console.log('running listenForClues');
    if (this.props.hunt && this.props.hunt.clues.length > 0) {
      const promises = [];
      const clues = [];

      for (let i = 0; i < this.props.hunt.clues.length; i += 1) {
        console.log(i);
        const c = this.props.hunt.clues[i];
        console.log(c);
        promises.push(new Promise((success, fail) => {
          Data.getClueWithID(c).then((clue) => {
  					console.log(`current clue retrieved is:${JSON.stringify(clue)}`);


            clues.push(clue);
            success();
  				});
        }));
      } // for


      Promise.all(promises).then(() => {
        const newDataSource = this.state.dataSource.cloneWithRows(clues);

        console.log(`Got all the clues!: ${clues}`);
        console.log(JSON.stringify(newDataSource));
        this.setState({
          dataSource: newDataSource,
          clues,
        });


    		console.log('finished updating state');
    		console.log(`state is....${JSON.stringify(this.state)}`);
      });
    }  // if
  },

  componentDidMount() {
    console.log('createHuntOverview component did mount.');
    this.listenForClues();
  },

  renderRow(clue) {
    console.log(`Render Row with clue: ${JSON.stringify(clue)}`);
    return (
      <TouchableHighlight onPress={() => this.buttonPressed(clue)}
        underlayColor="#dddddd"
      >

        <View>
          <View style={styles.separator} />
          <View style={styles.clueRows}>

            <View style={styles.textContainer}>
              <View>
                <Text style={styles.title} numberOfLines={1}>{clue.description.toUpperCase()}</Text>
              </View>

            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
        );
  },


  render() {
    console.log('running render....');
    let huntName, huntDescription;
    let huntImage, internalView;
    if (this.props.hunt === undefined) {
      huntName = 'Hunt Name';
      huntDescription = 'Hunt description....';
    } else {
      huntName = this.props.hunt.name;
      huntDescription = this.props.hunt.desc;
    }

    const listView = (<ListView
      dataSource={this.state.dataSource}
      automaticallyAdjustContentInsets={false}
      renderRow={this.renderRow}
    />);

    if (this.props.hunt === undefined) {
      console.log('this.props.hunt is undefined here');
      internalView = (<View style={styles.textBoxHunt}>

        <Text>Loading...</Text>
      </View>);
    } else {
      console.log('this.props.hunt is  NOT undefined here');
      internalView = listView;
    }

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.heading}>{huntName.toUpperCase()}</Text>
          <View style={styles.divider} />
        </View>
        <View style={styles.middleViewStyle}>
          <TextInput style={styles.textBoxHunt} onChangeText={this._updateHuntName} multiline placeholder={huntDescription} />
          <Text style={styles.addButton}>+</Text>
        </View>
        <View style={styles.internalViewContainer}>
          {internalView}
        </View>
        <TouchableHighlight underlayColor="#dddddd" onPress={() => this.buttonPressed()}>
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
          <TouchableHighlight underlayColor="#dddddd" onPress={() => this.saveButton}>
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
