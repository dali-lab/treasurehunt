var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Component
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
        backgroundColor: '#ff9966'
    }
});

class Create extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Functionality for creating events is unsupported in version 1 of TreasureHunt. Check back soon!
                </Text>
            </View>
        );
    }
}

module.exports = Create;