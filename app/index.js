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

const FilterLink = ({children, active, onClick}) => {
  if (active) {
    return <span>{ children }</span>
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        onClick()
      }}
    >
      { children }
    </a>
  )
}

class FilterLinkContainer extends Component {
  // Currently, we are re-rendering the TodoApp container when the store
  // is updated, so all children components, including this, are re-rerendered
  // as well. But this is not very efficient and we will change that in the future.
  // So, the code below demonstrates how we can force the update for a
  // specific component when the store changes.
  //
  // componentDidMount() {
  //   store.subscribe(() =>
  //     this.forceUpdate()
  //   );
  // }
  //
  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

  render() {
    return (
      <FilterLink
        active={ this.props.filter === store.getState().visibilityFilter }
        onClick={() => store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter: this.props.filter
        })}
      >
        { this.props.children }
      </FilterLink>
    )
  }
}

const Filters = () => {
  return (
    <ul className="list-inline">
      <li><FilterLinkContainer filter="SHOW_ALL">Show All</FilterLinkContainer></li>
      <li><FilterLinkContainer filter="SHOW_ACTIVE">Show Active</FilterLinkContainer></li>
      <li><FilterLinkContainer filter="SHOW_COMPLETED">Show Completed</FilterLinkContainer></li>
    </ul>
  )
}

const Todo = ({onClick, completed, text}) => (
  <li
    onClick={onClick}
    className={completed ? 'list-group-item is-completed' : 'list-group-item'}>
    {text}
  </li>
)

const TodoList = ({todos, onTodoClick}) => {
  return (
    <ul className='list-group'>
      {todos.map(todo =>
        <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
      )}
    </ul>
  )
}

const AddTodo = ({onAddClick}) => {
  let todoTextInput;
  return (
    <div>
      <div className="form-inline">
        <input className="form-control" ref={input => {
          todoTextInput = input;
        }} />
        <button
          className="btn btn-success"
          onClick={() => {
            onAddClick(todoTextInput.value);
            todoTextInput.value = '';
          }}
        >
          Add Todo
        </button>
      </div>
    </div>
  )
}

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

class TodoListContainer extends Component {
  // Currently, we are re-rendering the TodoApp container when the store
  // is updated, so all children components, including this, are re-rerendered
  // as well. But this is not very efficient and we will change that in the future.
  // So, the code below demonstrates how we can force the update for a
  // specific component when the store changes.
  //
  // componentDidMount() {
  //   store.subscribe(() =>
  //     this.forceUpdate()
  //   );
  // }
  //
  // componentWillUnmount() {
  //   this.unsubscribe();
  // }
  render() {
    return (
      <TodoList
        todos={
          getVisibleTodos(
            store.getState().todos,
            store.getState().visibilityFilter
          )
        }
        onTodoClick={id => {
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          });
        }}
      />
    )
  }
}

let nextTodoId = 0;
class AddTodoContainer extends Component {
  render() {
    return (
      <AddTodo
        onAddClick={text =>
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text
          })
        }
      />
    )
  }
}

// let nextTodoId = 0;
class TodoApp extends Component {
  render() {
    return (
      <div className="text-center">
        <AddTodoContainer />
        <TodoListContainer />
        <Filters />
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
