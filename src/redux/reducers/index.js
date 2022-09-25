import { combineReducers } from 'redux';
import ContentEditableReducer from './contentEditableReducer';

const combinedReducers = combineReducers({
  ContentEditableReducer,
});

export default combinedReducers;
