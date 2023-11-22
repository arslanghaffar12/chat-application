import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authreducer} from "./reducers/auth"
import { actionTypes } from './constants/action-types';

const combinedReducer = combineReducers({
  auth : authreducer
});

console.log("combinedReducer",combinedReducer)

const rootReducer = (state, action) => {
  console.log('state, action',state, action);
  if (action.type === actionTypes.LOGOUT) {
    state = undefined;
    // storage.clear();

  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
