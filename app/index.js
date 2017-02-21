// import { createStore } from 'redux';

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
            id: action.id,
            text: action.text,
            completed: false
        }
      ];
    default:
      return state;
  }
};

console.log(todos([{id: 0, 'text': 'old object', 'completed': true}], {type: 'ADD_TODO', id: 1, 'text': 'Learn Redux'}));
