var React = require('react');
var ReactDOM = require('react-dom');

function HelloWorld (props) {
  return (
    <div onClick={props.onHandlerClick}>{props.value}</div>
  )
}

module.exports = HelloWorld;
