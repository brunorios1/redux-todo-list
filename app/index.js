import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { combineReducers } from 'redux';

// TODO reducer (individual todos)
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
          id: action.id,
          text: action.text,
          completed: false
      };

    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      }
    default:
      return state;
  }
}

// TODOS reducer (array of todos)
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}

const todoApp = combineReducers({
  // the code below is the same as:
  // todos: todos,
  // visibilityFilter: visibilityFilter
  // but we are using the object literal shorthand notation
  // by convention, we always name keys and values the same.
  todos,
  visibilityFilter
})

const store = createStore(todoApp);

const { Component } = React;

let nextTodoId = 0;

class TodoApp extends Component {
  render() {
    return (
      <div>
        <input ref={input => {
          this.todoTextInput = input;
        }} />
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.todoTextInput.value,
            id: nextTodoId++
          });
          this.todoTextInput.value = '';
        }}>
          Add Todo
        </button>
        <ul>
          {this.props.todos.map(todo =>
            <li key={todo.id}
              onClick={() => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                });
              }}
              className={todo.completed ? 'is-completed' : ''}>
              {todo.text}
            </li>
          )}
        </ul>
      </div>
    )
  }
}

const renderTodoApp = () => {
    render(
      <TodoApp todos={store.getState().todos} />,
      document.getElementById('app')
    );
}

store.subscribe(renderTodoApp);
renderTodoApp();


// Testing

// ADD_TODO
console.log("testing ADD_TODO reducer:");
console.log(
  todos(
    [
      {
        id: 0,
        'text': 'old object',
        'completed': true
      }
    ],
    {
      type: 'ADD_TODO',
      id: 1,
      'text': 'Learn Redux'
    }
  )
);

// TOGGLE_TODO
console.log("testing TOGGLE_TODO reducer:");
console.log(
  todos(
    [
      {
        id: 0,
        text: 'Learn Redux',
        completed: false
      },
      {
        id: 1,
        text: 'Go shopping',
        completed: false
      }
    ],
    {
      type: 'TOGGLE_TODO',
      id: 1,
      'completed': true
    }
  )
)
