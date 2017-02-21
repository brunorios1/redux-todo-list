var React = require('react');
var ReactDOM = require('react-dom');
var HelloWorld = require('../components/HelloWorld');
var Redux = require('redux');
var createStore = Redux.createStore;

function HelloWorldReducer(state = 'Hello World!', action) {
  if (action.type === 'CHANGE') {
    return action.text;
  }

  return state;
}

var store = createStore(HelloWorldReducer);

var MainContainer = React.createClass({
  handlerClick: function () {
    store.dispatch({
      type: 'CHANGE',
      text: 'Hello Redux World!'
    })
  },
  render: function () {
    return (
      <div>
        <HelloWorld value={store.getState()} onHandlerClick={this.handlerClick} />
      </div>
    )
  }
})

store.subscribe(function() {console.log(store.getState())});

module.exports = MainContainer;
