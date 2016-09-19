var ReactNative = require('react-native');
var React = require('react');
var {
  Component
} = React;
var Create = require('./Create');
  var Feed = require('./Feed');
//  var Search = require('./Search');
var Home = require('./Home');
var User = require('./User').default;
// var Profile = require('./Profile');

const Firebase = require('firebase')
const config = require('../../config')

import rootRef from '../../newfirebase.js';
const itemsRef = rootRef.ref('items');
// const itemsRef = new Firebase(`${ config.FIREBASE_ROOT }/items`)

var {
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  TouchableHighlight,
  Image,
  ListView,
  NavigatorIOS,
  Navigator,
  AlertIOS,
} = ReactNative;

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
  },
  tabBarStyle: {

  },
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
        barTintColor='#23B090'
        ref='homeRef'
        titleTextColor='white'
        initialRoute={{
          title: 'TREASUREHUNT',
          rightButtonImage: <Image source={'../img/home.png'} /> ,
          component: Home,
          rightButtonTitle: "Logout",
          onRightButtonPress: this.onLogout,
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
        barTintColor="#c5ebe0">

        <Icon.TabBarItemIOS

         icon={require('../img/28reminder.png')}
         selectedIcon={require('../img/w28reminder.png')}
         selected={this.state.selectedTab === TABS.feed}
         onPress={() => {
           this.setState({
             selectedTab: TABS.feed,
           });
        }}>
        {this._renderFeed()}
       </Icon.TabBarItemIOS>


        <Icon.TabBarItemIOS

          selected={this.state.selectedTab === TABS.home}
          icon={require('../img/home.png')}
          selectedIcon={require('../img/w28home.png')}
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

         selected={this.state.selectedTab === TABS.create}
         icon={require('../img/28pencil.png')}
         selectedIcon={require('../img/w28pencil.png')}
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
