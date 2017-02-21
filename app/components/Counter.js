var React = require('react');
var ReactDOM = require('react-dom');

function Counter (props) {
  return (
    <div>
      <h1>{props.value}</h1>
      <button onClick={props.onIncrement}>+</button>
      <button onClick={props.onDecrement}>-</button>
    </div>
  )
}

module.exports = Counter;
