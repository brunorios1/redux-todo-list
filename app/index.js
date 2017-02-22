import { createStore } from 'redux';
import { combineReducers } from 'redux'

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








// Testing

// ADD_TODO
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
