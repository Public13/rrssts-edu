import "regenerator-runtime/runtime";
import React from "react"
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import App from './App'
import './styles.css';
import { rootReducer } from "./redux/rootReducer";
import logger from 'redux-logger'
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import incrementSaga from "./sagas/sagas";

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware, logger],
  devTools: true
})

sagaMiddleware.run(incrementSaga)

const app = (
  <Provider store={store}>
    <App />
  </Provider>
)

render(app, document.getElementById('root'));