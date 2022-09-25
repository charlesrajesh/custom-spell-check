import axios from 'axios';
import { textGearUrl, textGearKey, SET_SPELLING_ERROR_DATA } from './constants';

export const getSpellingErrors = (text, controllerSignal) =>
  function (dispatch) {
    axios
      .get(
        `${textGearUrl}?text=${text}&language=en-GB&whitelist=&dictionary_id=&key=${textGearKey}`,
        {
          signal: controllerSignal,
        },
      )
      .then((res) => {
        dispatch({
          type: SET_SPELLING_ERROR_DATA,
          payload: res.data.response.errors,
        });
      });
  };

export const updateSpellingErrors = (spellingErrors) => ({
  type: SET_SPELLING_ERROR_DATA,
  payload: spellingErrors,
});
