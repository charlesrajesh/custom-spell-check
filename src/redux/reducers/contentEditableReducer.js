import { SET_SPELLING_ERROR_DATA } from '../constants';

const initialState = {
  spellingErrors: [],
};
// eslint-disable-next-line
const ContentEditableReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_SPELLING_ERROR_DATA:
      return { ...state, spellingErrors: payload };
    default:
      return state;
  }
};

export default ContentEditableReducer;
