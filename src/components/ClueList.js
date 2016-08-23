var React = require('react-native');
var CurrentClueDisplay = require('./CurrentClueDisplay');
var CompletedClueDisplay = require('./CompletedClueDisplay');
var User = require('./User').default

var {
	StyleSheet,
	Image,
	View,
	Text,
	Component,
	TouchableHighlight,
	ListView,
    Alert
} = React;

var styles = StyleSheet.create({
	container: {
		marginTop: 65,
		paddingRight:30,
		paddingLeft: 30,
		flex: 1,
	},
	separatorSmall: {
		height: 16,
	},
	huntTitle: {
		fontSize: 25,
		marginTop: 20,
		fontFamily: 'Verlag-Book',
		color: '#242021',
		alignSelf: 'center'
	},
    topSeparator: {
        height: 2,
        backgroundColor: '#5da990'
    },
	separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    title: {
        fontSize: 20,
        color: '#000000',
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    description: {
        paddingTop: 3,
        paddingBottom: 8,
        alignSelf: 'center',
				color: '#242021',
    },
    statusDescription: {
        marginTop: 15,
    	alignSelf: 'center',
		fontSize: 16,
		color: '#242021',
    },
    lockedDescription: {
    	textAlign: 'center',
			fontWeight: 'bold',
    	fontSize: 25,
			color: '#242021',
    },
    rowContainer: {
	    flexDirection: 'row',
	    padding: 10,
      paddingTop: 10,
	    height: 90,
	    justifyContent: 'center',
  	},
    completeTextContainer: {
        paddingTop: 10,
    		flex: 1,
        backgroundColor: '#e8f0cd',
				borderRadius: 3
	},
    inProgressTextContainer: {
        paddingTop: 10,
        flex: 1,
        backgroundColor: '#FFFACD',
				borderRadius: 3
    },
    incompleteTextContainer: {
        paddingTop: 10,
	    flex: 1,
	    backgroundColor: '#f6d1d0',
			borderRadius: 3,
    }
});

const Firebase = require('firebase')
const config = require('../../config')
import rootRef from '../../newfirebase.js'


const cluesRef = rootRef.ref('clues');
const huntRef = rootRef.ref('hunts');
const userSolutionsRef = rootRef.ref('user_solutions');

// AES 8/3/16
const usersRef = rootRef.ref('users');


/*
const cluesRef = new Firebase(`${ config.FIREBASE_ROOT }/clues`)
const userSolutionsRef = new Firebase(`${ config.FIREBASE_ROOT }/user_solutions`)
*/

var ClueList = React.createClass({

	getInitialState: function() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid != r2.guid,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
				var nextClueId;
        return {
            dataSource: dataSource,
						nextClueId: nextClueId
        };
    },

    convertCluesArrayToMap: function(clues) {
        var cluesCategoryMap = {};

        for (var i =0; i < clues.length; i++ ) {
            if (!cluesCategoryMap[clues[i].category]) {
                cluesCategoryMap[clues[i].category] = [];
            }
            cluesCategoryMap[clues[i].category].push(clues[i]);
        }
        return cluesCategoryMap;
    },

		// OLD
    populateArray: function(solutionsForThisHunt) {
			console.log(`hunt is: ${JSON.stringify(this.props.hunt)}`);
        var cluesArray = this.props.hunt.clues;
        var clues = [];
        var solutionsToClues = [];
        var userCompletedClues = [];
        var inProgress = -1;
        var toStart;

        // specify which of user's clues are in progress versus completed
        for (var i = 0; i < solutionsForThisHunt.length; i++ ) {
            if (solutionsForThisHunt[i].completed == 0) {
                inProgress = solutionsForThisHunt[i].clue_id;
            }
            else {
                userCompletedClues.push(solutionsForThisHunt[i].clue_id);
            }
        }

        if (solutionsForThisHunt.length == 0) {
            inProgress = cluesArray[0];
        }

        //TODO: fix this calculation since clues won't always have chronological id's
        if (inProgress == -1) {
            inProgress = solutionsForThisHunt[solutionsForThisHunt.length -1].clue_id + 1;
        }


        //for all clues in clueArray
        for (var j = 0; j < cluesArray.length; j++) {
            var clueRef = cluesRef.child(cluesArray[j]);
            clueRef.on('value', (snap) => {
							console.log(`clue's val: ${JSON.stringify(snap.val())}`);
							console.log(`key's val: ${snap.key}`);

                // if a clue is in progress
                if (snap.val().id == inProgress) {
                    clues.push({
                        title:snap.val().title,
                        description: snap.val().description,
                        category: "inProgress",
                        clueId: snap.val().id
                    });
                }

                // completed clue
                else if (userCompletedClues.indexOf(snap.val().id) > -1) {
                    clues.push({
                        title:snap.val().title,
                        description: snap.val().description,
                        category: "complete",
                        clueId: snap.val().id
                    });
                }

                //incomplete clue
                else {
                    clues.push({
                        title:snap.val().title,
                        description: snap.val().description,
                        category: "incomplete",
                        clueId: snap.val().id
                    });
										console.log(`length of clues array rn is: ${clues.length}`);
                }
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertCluesArrayToMap(clues))
                });
            });
        }
				console.log(`solutionsForThisHunt array is: ${solutionsForThisHunt.length} ${solutionsForThisHunt}`);
        if (solutionsForThisHunt.length == cluesArray.length && solutionsForThisHunt[solutionsForThisHunt.length-1].completed ==1) {
            Alert.alert(
                'HUNT COMPLETE',
                "You did it!!!!"
            );
        }
    },

		// 	NEW
		populateArray2: function(huntid, currentClue) {
			// DONE get the array of clues
			// DONE get the current clue
			// find the position of the current Clue in the array. Make that in progress
			// store the id of the clue next to that one. if there isn't one, make it null
			// all before are completed
			// all after are incomplete

			// setting the next clue:
			// grab the index of the current clue
			// if the index is -1, the next index is null
			// if it's the last clue, the next index is null
			// if it's anything before the last clue, the next index is current index + 1

			// determining whether hunt is completed--


			var cluesArray = this.props.hunt.clues;
			var clues = [];
			var nextClueId;

			// if item isn't found (ex null), result will be -1
			var indexCurrentClue = cluesArray.indexOf(currentClue);

			console.log(`indexCurrentClue in populate array is: ${indexCurrentClue}`);
			if (indexCurrentClue === -1 || cluesArray.indexOf(currentClue) === (cluesArray.length - 1)) {
				nextClueId = null;
			} else {
				nextClueId = cluesArray[indexCurrentClue + 1];
			}
			console.log(`nextClueId is: ${nextClueId}`);



			//for all clues in clueArray
			for (var j = 0; j < cluesArray.length; j++) {

					var clueRef = cluesRef.child(cluesArray[j]);
					clueRef.on('value', (snap) => {
						var newJ = cluesArray.indexOf(snap.key);
						console.log(`j's value: ${j}`);
						console.log(`newj's value: ${newJ}`);
						console.log(`indexCurrentClue: ${indexCurrentClue}`);
						console.log(`clue's val: ${JSON.stringify(snap.val())}`);
						console.log(`key's val: ${snap.key}`);
						console.log(`currentClue is: ${currentClue}`);

						let currCategory;

// "sghnfgt4"
						console.log(`right before if else, indexCurrent clue is: ${indexCurrentClue}`);
						console.log(`right before if else, indexCurrent clue is: ${typeof indexCurrentClue}`);
						if (indexCurrentClue == -1 || indexCurrentClue == 'null') {
							console.log('currcategory = completed');
							currCategory = 'completed';
							clues.push({
								title:snap.val().creator,
								description: snap.val().description,
								category: currCategory,
								clueId: snap.key
							});
						} else {
							if (indexCurrentClue === newJ) {
						//		console.log('currcategory = inprogress');
								currCategory = 'inProgress';
							} else if (newJ > indexCurrentClue) {
						//		console.log('currcategory = incomplete');
								currCategory = 'incomplete'
							} else {
						//		console.log('currcategory = completed2');
								currCategory = 'completed';
							}
								console.log(`currCategory is: ${currCategory}`);
							clues.push({
								title:snap.val().creator,
								description: snap.val().description,
								category: currCategory,
								clueId: snap.key
							});
						}  // else

				//	console.log(`currCategory is: ${currCategory}`);



							this.setState({
									dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertCluesArrayToMap(clues)),
									nextClueId: nextClueId
							});
					});
			}

/*
			this.setState({nextClueId: nextClueId}).then(() => {
					console.log(`in populate array, nextClueId is: ${this.state.nextClueId}`);
			});
			*/


			if (indexCurrentClue === -1 || indexCurrentClue === undefined || indexCurrentClue == null) {
				Alert.alert(
						'HUNT COMPLETE',
						"You did it!!!!"
				);
			}
	},

	// NEW
	getCurrentClue: function(huntid) {
		return new Promise((fulfill, reject) => {
			const currentUser = User.getCurrentUser();
			const userRef = usersRef.child(currentUser.uid);
			var currentClueRef = userRef.child('currentHunts').child(huntid).child('currentClue');
			var currentClue;

			currentClueRef.on('value', (snap) => {
				currentClue = snap.val();
				console.log(`1st instance of currentClue = ${currentClue}`);
				fulfill(snap.val());
			});
			if ('q' === 'p') {
				reject();
			}
		});
	},

	// NEW
	listenForItems: function(cluesRef) {

			//get all clues for user in hunt, add them to array
		//  var huntID = this.props.hunt.id;
		var huntID = this.props.hunt.id;

/*
			console.log(`the hunt id rn is: ${huntID}`);
			console.log('dsfbjibgbsbibbnakpabpbaknabnpabpbaknpbanabjnl');
			console.log(`the hunt rn is: ${JSON.stringify(this.props.hunt)}`);
		*/

		this.getCurrentClue(huntID).then((currentClue) => {
			this.populateArray2(huntID, currentClue);
		});
	},

/*
		// NEW-ISH
    listenForItems: function(cluesRef) {

        //get all clues for user in hunt, add them to array
      //  var huntID = this.props.hunt.id;
			var huntID = this.props.hunt.id;

				console.log(`the hunt id rn is: ${huntID}`);
				console.log('dsfbjibgbsbibbnakpabpbaknabnpabpbaknpbanabjnl');
				console.log(`the hunt rn is: ${JSON.stringify(this.props.hunt)}`);

				// for now. just call populate array


        var solutionsForThisHunt = [];
        var currentUser = User.getCurrentUser();
        //TODO: for now there is only user 0 but we don't want this hard-coded for all users
        userSolutionsRef.orderByChild('user_id').startAt(currentUser.uid).endAt(currentUser.uid).once('value', (snap) => {
            var solution = snap.val();
            if (solution) {
                var array = Object.keys(solution).map(key =>({ ...solution[key], id:key}));
                for (var i = 0; i < array.length; i++) {
                    if (array[i].hunt_id == Number(huntID)) {
                        solutionsForThisHunt.push(array[i]);

												console.log(`solutions for this hunt11111 is: ${solutionsForThisHunt}`);
												console.log(`solutions for this hunt1111 is: ${typeof solutionsForThisHunt}`);
                    }
                }
            }
					});  // snap


				//		console.log(`solutions for this hunt is: ${solutionsForThisHunt}`);
				//		console.log(`solutions for this hunt is: ${typeof solutionsForThisHunt}`);
        //    this.populateArray(solutionsForThisHunt);
			//	this.populateArray2(solutionsForThisHunt, huntID);

			this.getCurrentClue(huntID).then((currentClue) => {
				this.populateArray2(solutionsForThisHunt, huntID, currentClue);

			});

    },
		*/

    componentDidMount: function() {
        this.listenForItems(cluesRef);
    },

    rowPressed: function(clueInfo) {
			console.log(`in rowPressed, clueinfo is: ${clueInfo}`);
        //if clue is in progress, load current progress
        if (clueInfo.category === "completed") {
            this.props.navigator.push({
                title: "Hunt",
                component: CompletedClueDisplay,
                passProps: {
                    hunt: this.props.hunt,
                    clueId: clueInfo.clueId,
					nextClueId: this.state.nextClueId
                }
            });
        }
        else {
            this.props.navigator.push({
                title: "Hunt",
                component: CurrentClueDisplay,
                passProps: {
                    hunt: this.props.hunt,
                    clueId: clueInfo.clueId,
					nextClueId: this.state.nextClueId,
                    callback: (cluesRef) => {
                        if (this.state.nextClueId != null) {
                            this.listenForItems(cluesRef);
                        }
                    }
                }
            });
        }
    },

    renderRow: function(rowData, sectionID, rowID) {
			console.log(`rowData is: ${JSON.stringify(rowData)}`);
			//	console.log(`in rowPressed, clueinfo is: ${clueInfo}`);
			console.log(`next Clue id is: ${this.state.nextClueId}`);
    	if (rowData.category === "completed") {
	      	return (
	      		<TouchableHighlight onPress={() => this.rowPressed(rowData)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.completeTextContainer}>
                            <Text style={styles.statusDescription}
                                >- COMPLETED -</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
	      	);
    	}
        else if (rowData.category === "inProgress") {
            return (
                <TouchableHighlight onPress={() => this.rowPressed(rowData)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.inProgressTextContainer}>
                            <Text style={styles.statusDescription}
                                >- IN PROGRESS -</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
            );
        }
        else {
	      	return (
            <TouchableHighlight
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.incompleteTextContainer}>
							<Text style={styles.statusDescription}>- LOCKED -</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        	);
    	}
	},

	render: function() {
		var hunt = this.props.hunt;

		return (
			<View style={styles.container}>
				<View>
					<Text style={styles.huntTitle}>{hunt.title.toUpperCase()}</Text>
                    <View style={styles.topSeparator}/>
				</View>
				<View style={styles.separatorSmall}/>
				<ListView
                    dataSource={this.state.dataSource}
                    automaticallyAdjustContentInsets={false}
                    renderRow={this.renderRow}/>
			</View>
		);
	},
});

module.exports = ClueList;
