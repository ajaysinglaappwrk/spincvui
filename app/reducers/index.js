import { combineReducers } from 'redux';
import cards from './cards';
import EmployerReducer from './employer-reducers'

const rootReducer = combineReducers({
  cards,
  EmployerReducer
});

export default rootReducer;
