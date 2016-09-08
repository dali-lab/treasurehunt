var ReactNative = require('react-native');
var React = require('react');
var PageControl = require('react-native-page-control');
var ClueCompleteModal = require('./ClueCompleteModal');
var RewardModal = require('./RewardModal');
var User = require('./User').default
var dismissKeyboard = require('dismissKeyboard');

var {
	StyleSheet,
	Image,
	View,
	Text,
	TouchableHighlight,
	Alert,
	TextInput,
	Dimensions,
	ScrollView,
	Modal,
	AlertIOS
} = ReactNative;
var {
    Component,
} = React;

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;


var styles = StyleSheet.create({
	container: {
		marginTop: 65,
		paddingRight:30,
		paddingLeft: 30,
		marginBottom: 60,
		flex: 1,
	},
	huntTitle: {
		fontSize: 20,
		margin: 10,
		color: '#656565',
		alignSelf: 'center',
		fontFamily: 'Verlag-Book'
	},
    topSeparator: {
        height: 2,
        backgroundColor: '#5da990'
    },
	separatorSmall: {
		height: 16,
	},
	separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    clueName: {
        fontSize: 20,
        color: '#000000',
        fontStyle: 'italic'
    },
    modal: {
	    height: 300,
	    width: 300,
  	},
  	btn: {
	    margin: 10,
	    backgroundColor: "#3B5998",
	    color: "white",
	    padding: 10,
  	},

  	btnModal: {
	    position: "absolute",
	    top: 0,
	    right: 0,
	    width: 50,
	    height: 50,
	    backgroundColor: "transparent",
  	},
    description: {
        paddingTop: 3,
        paddingBottom: 8,
    },
    buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center',
	  fontWeight: 'bold'
	},
	button: {
	  height: 36,
	  marginTop: 26,
	  flexDirection: 'column',
	  backgroundColor: '#5da990',
	  borderColor: '#5da990',
	  justifyContent: 'center',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  padding:20,
	  marginLeft: 5,
	  marginRight: 5,
	  paddingTop:20,
	},
	hint: {
		textAlign: 'left',
		color: "gray",
		alignSelf: "flex-start",
	},
	imageContainer: {
		flexDirection: "column",
		flex: 1,
	},
	pageControl: {
		alignSelf: 'center',
		bottom: 0
	},
	scrollView: {
		flex: 1,
		marginBottom: 5
	},
	skipButton: {
		marginTop: 5,
		alignSelf: "flex-end",
	},
	skipButtonText: {
		color: "gray"
	}
});

const Firebase = require('firebase')
const config = require('../../config')

import rootRef from '../../newfirebase.js'

const usersRef = rootRef.ref('users');
const cluesRef = rootRef.ref('clues');

// note: these aren't being used currently
const userSolutionsRef = rootRef.ref('user_solutions');
const clueSolutionsRef = rootRef.ref('clue_solutions');

const user = require('./User');
import ClueController from "./ClueController";


/*
const usersRef = new Firebase(`${ config.FIREBASE_ROOT }/users`)
const cluesRef = new Firebase(`${ config.FIREBASE_ROOT }/clues`)
const userSolutionsRef = new Firebase(`${ config.FIREBASE_ROOT }/user_solutions`)
const clueSolutionsRef = new Firebase(`${ config.FIREBASE_ROOT }/clue_solutions`)
*/


var CurrentClueDisplay = React.createClass({
	controller: React.PropTypes.object.isRequired,
	clue: React.PropTypes.object.isRequired,
	rewardRequested: React.PropTypes.func.isRequired,

	getInitialState: function() {

        return {
        	clueSubmission: this.props.controller.getSubmission(this.props.clue),
  			showModal: false,
  			solutionCorrect: false,
  			waitingForSolutions: false,
  			page: 0,
  			scrollViewHeight: null,
            showReward: false
        };

    },

    openModal: function(id) {
    	this.refs.modal.open();
  	},

	onSubmitPressed: function() {
		console.log("Submit Button pressed");

		this.props.controller.setSubmission(this.props.clue, this.state.clueSubmission);

		var correct = this.props.controller.checkSolutions(this.props.clue);
		console.log("The submission " + (correct ? "is" : "isn't") + " correct");

		if (correct) {
			this.props.controller.completeClue(this.props.clue).then((flag) => {
				this.clueIsCompleted();
			});
		}else{
			this.solutionIsWrong();
		}
	},

	solutionIsWrong: function() {
		this.setState({
			showModal: true,
			solutionCorrect: false
		});
	},

	clueIsCompleted: function() {
		this.setState({
			showModal: true,
			solutionCorrect: true
		});
	},

	returnToClueList: function() {
		this.props.navigator.popN(this.props.controller.huntIsComplete() ? 3 : 1);
	},

	getHint: function() {
		Alert.alert(
			'Sorry! Not yet supported.',
			'Check back in the future!',
		);
	},

	onScroll: function(event) {
		var offsetX = event.nativeEvent.contentOffset.x,
		pageWidth = screenWidth - 60;

		dismissKeyboard();
		this.setState({
			page: Math.floor((offsetX - pageWidth / 2) / pageWidth) + 1
		})
	},

	onPagePressed: function(index) {

		pageWidth = screenWidth - 60;
		this.refs.scrollView.scrollTo(0, index * pageWidth)
	},

	renderPages: function() {
		let items = this.props.clue.images.map((r, i) => {
			return <View key={i} style={{width: screenWidth-60}}>
					<Image style={{resizeMode: "contain", height: this.state.scrollViewHeight || (screenWidth-60) * 1.4, width: screenWidth-60}}
					source={{uri: r}}/>
				</View>
		})

		return <View style={{flexDirection: "row"}}>
					{items}
				</View>
	},

	renderPager: function(showSkip) {
		var numImages = this.props.clue.images.length

		return <View style={styles.imageContainer}>
			<View style={styles.scrollView}>
				<ScrollView ref='scrollView'
				pagingEnabled={true}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				automaticallyAdjustContentInsets={false}
				bounces={false}
				directionalLockEnabled={true}
				onScroll={this.onScroll}
				scrollEventThrottle={16}
				onLayout={(event) => {
					var {x, y, width, height} = event.nativeEvent.layout;
					var shouldReload = this.state.scrollViewHeight == null

					this.setState({
						scrollViewHeight: height
					})

					if (shouldReload)
						this.forceUpdate();
				}}>
					{this.renderPages()}
					<View style={{width: screenWidth-60, backgroundColor: "white"}}>
						<TextInput
		    				style={{height: 40, borderColor: 'gray', borderWidth: 1}}
		    				onChangeText={(submission) => this.setState({clueSubmission: submission})}
		    				value={this.state.clueSubmission}/>
	    				{showSkip ? <TouchableHighlight style = {styles.skipButton}
		    					onPress = {this.onSkipPressed}
		    					underlayColor = "gray">
		    					<Text style = {styles.skipButtonText}>Stuck?</Text>
		    			</TouchableHighlight> : null}
						<TouchableHighlight style = {styles.button}
								onPress={this.onSubmitPressed}
								underlayColor='#99d9f4'>
								<Text style = {styles.buttonText}>Submit</Text>
						</TouchableHighlight>
					</View>
				</ScrollView>
			</View>
			<PageControl style={styles.pageControl}
				numberOfPages = {numImages + 1}
				currentPage = {this.state.page}
            	pageIndicatorTintColor='gray'
            	currentPageIndicatorTintColor='black'
            	onPageIndicatorPress={this.onPagePressed}/>
		</View>
	},

	onSkipPressed: function() {
		if (this.props.controller.canSkipClue()) {
			AlertIOS.alert(
				"Skip this clue?",
				"Do you want to skip this clue?",
				[
					{text: "Cancel", onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
					{text: 'Skip', onPress: () => {
						this.props.controller.handleSkip(this.props.clue);
						this.props.navigator.pop();
					}}
				]
			)
		}else{
			if (this.props.controller.hunt.skipsAllowed == 0)
				AlertIOS.alert(
					"Skipping not enabled",
					"This hunt doesn't have skipping enabled"
				)
			else
				AlertIOS.alert(
					"No more skipping",
					"You have reached the maximum number of skips you are allowed. Complete a skipped clue to be able to skip this one"
				)
		}
	},

	render: function() {
		var hunt = this.props.controller.hunt;
		var hasImages = this.props.clue.images != null
		var showSkip = !this.props.controller.hunt.procedural && this.props.clue.status != ClueController.SKIPPED

		const inputSubmitView = <View><TextInput
				    				style={{height: 40, borderColor: 'gray', borderWidth: 1, marginLeft: 5, marginRight: 5}}
				    				onChangeText={(submission) => this.setState({clueSubmission: submission})}
				    				value={this.state.clueSubmission}/>
				    			{showSkip ? <TouchableHighlight style = {styles.skipButton}
			    					onPress = {this.onSkipPressed}
			    					underlayColor = "gray">
			    					<Text style = {styles.skipButtonText}>Stuck?</Text>
				    			</TouchableHighlight> : null}
								<TouchableHighlight style = {styles.button}
										onPress={this.onSubmitPressed}
										underlayColor='#99d9f4'>
										<Text style = {styles.buttonText}>Submit</Text>
								</TouchableHighlight></View>

		var internalView = hasImages ? this.renderPager(showSkip) : inputSubmitView

		var modalView = <ClueCompleteModal
				wrong={!this.state.solutionCorrect}
				huntDone={this.props.controller.huntIsComplete()}
				controller={this.props.controller}
				rewardRequested={() => {
					this.setState({ showModal: false, showReward: true })
				}}
				done={() => {
					this.setState({  showModal: false  });
					if (this.state.solutionCorrect) {
						dismissKeyboard();
						this.returnToClueList();
					}
				}}/>

			return (
				<View style={styles.container}>
					<Modal
						animationType='slide'
						transparent={true}
						visible={this.state.showModal}
						onRequestClose={() => {
							this.setState({  showModal: false  });
							this.returnToClueList();
						}}>
						{modalView}
					</Modal>

					<Modal
	                    animationType='fade'
	                    transparent={true}
	                    visible={this.state.showReward}
	                    onRequestClose={() => {
	                        this.setState({  showReward: false, showModal: false  });
							this.returnToClueList();
	                    }}
	                    >
	                    <RewardModal
	                        done={() => {
	                        	this.setState({ showReward: false, showModal: false })
								this.returnToClueList();
	                        }}
	                        hunt={this.props.controller.hunt}/>
	                </Modal>

					<View style={styles.separatorSmall}/>
					<Text style={styles.huntTitle}>{hunt.name.toUpperCase()}</Text>
                    <View style={styles.topSeparator}/>
                    <View style={styles.separatorSmall}/>
					<Text style={styles.description}>{this.props.clue.description}</Text>
					
					{internalView}
				</View>
			);
	},
});

module.exports = CurrentClueDisplay;
