import React from "react"
import {Provider} from 'react-redux'
import {render} from 'react-dom'
import App from './App'
import './styles.css';
import {rootReducer} from "./redux/rootReducer";
import logger from 'redux-logger'
import {configureStore} from '@reduxjs/toolkit'
import thunk from "redux-thunk";

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk, logger],
  devTools: true
})

// const store = createStore(rootReducer,
//   {},
//   compose(applyMiddleware(thunk, logger), devToolsEnhancer({})))

const app = (
  <Provider store={store}>
    <App/>
  </Provider>
)

render(app, document.getElementById('root'));