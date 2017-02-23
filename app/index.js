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

const FilterLink = ({filter, children, currentFilter}) => {
  if (filter === currentFilter) {
    return <span>{ children }</span>
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        })
      }}
    >
      { children }
    </a>
  )
}

const Todo = ({onClick, completed, text}) => (
  <li
    onClick={onClick}
    className={completed ? 'is-completed' : ''}>
    {text}
  </li>
)

const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(todo =>
      <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
    )}
  </ul>
)

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
    // default:
    //   return todos;
  }
}

let nextTodoId = 0;
class TodoApp extends Component {
  render() {
    const visibleTodos = getVisibleTodos(this.props.todos, this.props.visibilityFilter);
    return (
      <div className="text-center">
        <div className="form-inline">
          <input className="form-control" ref={input => {
            this.todoTextInput = input;
          }} />
          <button className="btn btn-success" onClick={() => {
            store.dispatch({
              type: 'ADD_TODO',
              text: this.todoTextInput.value,
              id: nextTodoId++
            });
            this.todoTextInput.value = '';
          }}>
            Add Todo
          </button>
        </div>
        <TodoList
          todos={visibleTodos}
          onTodoClick={id => {
            store.dispatch({
              type: 'TOGGLE_TODO',
              id
            });
          }}
        />
        <ul className="list-inline">
          <li><FilterLink filter="SHOW_ALL" currentFilter={this.props.visibilityFilter}>Show All</FilterLink></li>
          <li><FilterLink filter="SHOW_ACTIVE" currentFilter={this.props.visibilityFilter}>Show Active</FilterLink></li>
          <li><FilterLink filter="SHOW_COMPLETED" currentFilter={this.props.visibilityFilter}>Show Completed</FilterLink></li>
        </ul>
      </div>
    )
  }
}

const renderTodoApp = () => {
    render(
      // explicitly:
      // <TodoApp todos={store.getState().todos} visibilityFilter={store.getState().visibilityFilter} />,
      // all state tree fields using the spread operator:
      <TodoApp {...store.getState()} />,
      document.getElementById('app')
    );
}

store.subscribe(renderTodoApp);
renderTodoApp();



















// Testing

// ADD_TODO
console.log("testing ADD_TODO action:");
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
console.log("testing TOGGLE_TODO action:");
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

// VISIBILITY FILTER
console.log("testing VISIBILITY_FILTER action:");
console.log(
  visibilityFilter(
    'SHOW_ALL',
    {
      type: 'SET_VISIBILITY_FILTER',
      filter: 'SHOW_COMPLETED'
    }
  )
)

console.log(store.getState());
