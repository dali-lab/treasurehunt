var ReactNative = require('react-native');
var React = require('react');
const {
  TouchableHighlight
}=ReactNative;
var Data = require('./Data');
const Firebase = require('firebase')
const config = require('../../config')

import rootRef from '../../newfirebase.js';
const usersRef = rootRef.ref('users');
const huntsRef = rootRef.ref('hunts');

var {
    StyleSheet,
    View,
    Text,
} = ReactNative;
var {
    Component,
} = React;

var styles = StyleSheet.create({
    description: {
        fontSize: 20,
        textAlign: 'center',
        color: '#FFFFFF'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff9966',
        padding: 1
    }
});

class Create extends Component {
    constructor(props) {
        super(props);
        this.makeHunt=this.makeHunt.bind(this);
    }
    makeHunt(description, img, name, priv, procedural, reward, skips) {
    	var newHuntRef = huntsRef.push();
    	// newHuntRef.set({
    	// 	clues: [],
    	// 	desc: description,
    	// 	image: img,
    	// 	name: name,
    	// 	private: priv,
    	// 	procedural: procedural,
    	// 	reward: reward,
    	// 	skipsAllowed: skips
    	// });
      newHuntRef.set({
        clues: [],
        desc:"test",
        image: "http://thesoulworkcompany.com/wp-content/uploads/2016/04/backyard-treasure.jpg",
        name: "testing",
        private: false,
        procedural: false,
        reward: "free pizza",
        skipsAllowed: 2
      });
    }
    render() {
        return (
          <View>
            <View style={styles.container}>
                <Text style={styles.description}>
                    Functionality for creating events is unsupported in version 1 of TreasureHunt. Check back soon!
                </Text>
                <View>
                <TouchableHighlight
                  onPress = {this.makeHunt}>
                  <Text>click to make a hunt!</Text>
                </TouchableHighlight>
                </View>
            </View>
          </View>
        );
    }
}

module.exports = Create;
