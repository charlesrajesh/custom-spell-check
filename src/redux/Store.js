import thunkMiddleware from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import combinedReducers from './reducers/index';

export default configureStore({
  reducer: {
    reducer: combinedReducers,
  },
  middleware: [thunkMiddleware],
});
