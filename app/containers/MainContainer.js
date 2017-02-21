var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var createStore = Redux.createStore;
var Counter = require('../components/Counter');

function counter(state = 0, action) {
  switch (action.type)  {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

var store = createStore(counter);

var MainContainer = React.createClass({
  handleIncrement: function () {
    store.dispatch({
      type: 'INCREMENT'
    })
  },
  handleDecrement: function () {
    store.dispatch({
      type: 'DECREMENT'
    })
  },
  render: function () {
    return (
      <div>
        <Counter value={store.getState()} onIncrement={this.handleIncrement} onDecrement={this.handleDecrement} />
      </div>
    )
  }
})

store.subscribe(function() {ReactDOM.render(<MainContainer />, document.getElementById('app'))});

module.exports = MainContainer;
