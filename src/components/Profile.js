var ReactNative = require('react-native');
var React = require('react');
var {
  Component
} = React;
var {
    StyleSheet,
    View,
    Text,
} = ReactNative;

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
        backgroundColor: '#009900'
    }
});

class Profile extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Profile page!
                </Text>
            </View>
        );
    }
}

module.exports = Profile;
