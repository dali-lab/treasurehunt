var ReactNative = require('react-native');
var React = require('react');
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
        backgroundColor: '#123456'
    }
});

class Feed extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Feed page!
                </Text>
            </View>
        );
    }
}

module.exports = Feed;
