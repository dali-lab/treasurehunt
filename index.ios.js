var React = require('react-native');

var styles = React.StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1
  }
});

class HelloWorld extends React.Component {
  render() {
    return <React.Text style={styles.text}>Hello World!</React.Text>;
  }
}

class treasurehunt extends React.Component {
  render() {
    return (
      <React.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Treasure Hunt',
          component: HelloWorld,
        }}/>
    );
  }
}


React.AppRegistry.registerComponent('treasurehunt', function() { return treasurehunt });
