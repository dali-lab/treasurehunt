var React = require('react-native');
var Create = require('./Create');
  var Feed = require('./Feed');
//  var Search = require('./Search');
var Home = require('./Home');
var User = require('./User').default;
// var Profile = require('./Profile');

const Firebase = require('firebase')
const config = require('../../config')
const itemsRef = new Firebase(`${ config.FIREBASE_ROOT }/items`)

var {
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  TouchableHighlight,
  Image,
  ListView,
  NavigatorIOS
} = React;

var TABS = {
/*
  search: 'search',
  create: 'create',
  home: 'home',
  feed: 'feed',
  profile: 'profile'
*/

  // edit by as 7/15/16
  feed: 'feed',
  home: 'home',
  create: 'create'

}

var Icon = require('react-native-vector-icons/Ionicons');

var styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  container:{
    flex: 1
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

var HomePage = React.createClass({
  propTypes: {
    onLogout: React.PropTypes.func,
  },

  componentWillMount: function() {
    Icon.getImageSource('android-arrow-back', 30).then((source) => this.setState({ backIcon: source }));
  },

  getInitialState: function() {
    return {
      selectedTab: TABS.home,
    };
  },

  _renderFeed: function(){
    return(
      <Feed navigator = {this.props.navigator} />
      );
  },

  onLogout: function() {
    User.logout();
    if (typeof this.props.onLogout == 'function') {
      this.props.onLogout();
    }
  },

  _renderHome: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        barTintColor='#5da990'
        ref='homeRef'
        titleTextColor='white'
        initialRoute={{
          title: 'TREASURE HUNT',
          component: Home,
          rightButtonTitle: "Logout",
          onRightButtonPress: this.onLogout.bind(this),
        }} />
      )
  },
/*
  _renderSearch: function(){
    return(
      <Search navigator = {this.props.navigator}  />
    );
  },
*/
  _renderCreate: function(){
    return(
      <Create navigator = {this.props.navigator} />
      );
  },
  /*
  _renderProfile: function(){
    return(
      <Profile navigator = {this.props.navigator} />
      );
  },
  */

  render: function() {
    return (
      <TabBarIOS
        tintColor="white"
        barTintColor="#cee4dc">

        <Icon.TabBarItemIOS
         title="FEED"
         iconName="ios-star"
         selectedIconName="ios-star"
         selected={this.state.selectedTab === TABS.feed}
         onPress={() => {
           this.setState({
             selectedTab: TABS.feed,
           });
        }}>
        {this._renderFeed()}
       </Icon.TabBarItemIOS>


        <Icon.TabBarItemIOS
          title="HOME"
          selected={this.state.selectedTab === TABS.home}
          iconName="ios-home"
          selectedIconName="ios-home"
          onPress={() => {
            if (this.state.selectedTab !== TABS.home) {
                this.setState({
                    selectedTab: TABS.home,
                });
            } else if (this.state.selectedTab === TABS.home) {
                this.refs.homeRef.popToTop();
            }
          }}>
         {this._renderHome()}
        </Icon.TabBarItemIOS>





       <Icon.TabBarItemIOS
         title="CREATE"
         selected={this.state.selectedTab === TABS.create}
         iconName="ios-gear"
         selectedIconName="ios-gear"
         onPress={() => {
           this.setState({
             selectedTab: TABS.create,
           });
         }}>
        {this._renderCreate()}
       </Icon.TabBarItemIOS>

      </TabBarIOS>

    );
  },

});


module.exports = HomePage;
