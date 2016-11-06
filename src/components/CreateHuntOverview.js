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

	saveButton() {
		Alert.alert('saving should go here!');
	},

	listenForClues() {
		console.log('running listenForClues');
		if(this.props.hunt.clues.length > 0) {
			for (let i = 0; i < this.props.hunt.clues.length; i += 1) {
				console.log(i);
				let c = this.props.hunt.clues[i];
				console.log(c);
				Data.getClueWithID(c).then((clue) => {
					console.log('current clue retrieved is:' + JSON.stringify(clue));

					const thisIsNew = new ListView.DataSource({
						rowHasChanged: (r1, r2) => r1.guid !== r2.guid,
						sectionHeaderHasChanged: (s1, s2) => s1.guid !== s2.guid,
					});
					const newDataSource = thisIsNew.cloneWithRows(clue);
					this.setState({
						clues: clue,
					});
				});
			} // for
		}  // if
		console.log('finished updating state');
		console.log('state is....' + JSON.stringify(this.state));



/*
		User.getCurrentUser().getCreatedHunts().then((huntsList) => {
			Data.getHuntObjects(huntsList).then((hunts) => {
				console.log(`Loaded hunts: ${hunts}\nSetting the state`);
				console.log('State was: ');

				const thisIsNew = new ListView.DataSource({
					rowHasChanged: (r1, r2) => r1.guid !== r2.guid,
					sectionHeaderHasChanged: (s1, s2) => s1.guid !== s2.guid,
				});
				const newDataSource = thisIsNew.cloneWithRows(hunts);
				console.log('Now it is: ');
				this.setState({
					hunts,
					dataSource: newDataSource,
				});
			});
		});
	},
	*/
},

	componentDidMount() {
    console.log('component did mount.');
    this.listenForClues();
  },

	renderRow(hunt) {

    console.log(`RENDER ROWWWWWW`);
    return (
      <TouchableHighlight onPress={() => this.buttonPressed(hunt)}
        underlayColor="#dddddd"
      >
        <View>
          <View style={styles.textBoxHunt}>

            <View style={styles.textContainer}>
              <View>
                <Text style={styles.title} numberOfLines={1}>{hunt.name.toUpperCase()}</Text>
                <Text style={styles.description}
                  numberOfLines={2}
                >{hunt.desc}</Text>
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

			console.log('value of LISTOVERVIEW: ' + listView);

			console.log('listView IN CREATEHUNTOVERVIEW Done');

		let internalView;

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
        <Text style={styles.heading}>{huntName}</Text>
        <View style={styles.divider} />
        <View style={styles.middleViewStyle}>
          <TextInput style={styles.textBoxHunt} onChangeText={this._updateHuntName} multiline={true} placeholder={huntDescription} />
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
