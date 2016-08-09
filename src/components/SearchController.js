var React = require('react-native');

var {
    StyleSheet,
    View,
    TouchableHighlight,
    ListView,
    Text,
    Component,
    AlertIOS,
} = React;

var SearchController = React.createClass({
	propTypes: {
		searchText: React.PropTypes.string,
    },

    // getInitialState: function() {
    //     var dataSource = new ListView.DataSource({
    //         rowHasChanged: (r1, r2) => r1.guid !== r2.guid,
    //         sectionHeaderHasChanged: (s1, s2) => s1.guid !== s2.guid
    //     });
    //     return {
    //         dataSource: dataSource,
    //     };
    // },

    // renderRow: function(hunt) {

    // },

	render: function() {
		var searchInstructions = this.props.searchText == "" ? <Text>You can search using a hunt name or by hunt id</Text> : null

		// var searchResults = this.props.searchText != "" ? <ListView
		// 														dataSource={this.state.dataSource}
		// 								                        automaticallyAdjustContentInsets={false}
		// 								                        renderRow={this.renderRow}/> : null;

		return <View>
			{searchInstructions}
		</View>
	}
});

module.exports = SearchController