import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';
import {rootReducer} from './reducers/index';
import { persistStore, persistReducer } from 'redux-persist';


const middleware = [thunk];

// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage
};
// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

let store;

if(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()){
  store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(...middleware),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
}else{
  store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(...middleware),
    )
  );
}


let persistor = persistStore(store);

// Exports
export {
  store,
  persistor,
};