import "regenerator-runtime/runtime"
import React, { useState } from "react"
import { connect, Provider, useDispatch, useSelector } from 'react-redux'
import ReactDOM, { render } from 'react-dom'
import './styles.css'
import logger from 'redux-logger'
import { applyMiddleware, combineReducers, configureStore, createAction, createSlice, createStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { call, delay, put, takeEvery } from 'redux-saga/effects'

// Reducer
interface ShelterState {
  url: string,
  loading: boolean,
  error: boolean,
}

const initialState: ShelterState = {
  url: '',
  loading: false,
  error: false,
}

const shelter = createSlice({
  name: "@@shelter",
  initialState,
  reducers: {
    requestedDog: (state, action) => {
      return {
        url: '',
        loading: true,
        error: false,
      };
    },
    requestedDogSuccessed: (state, action) => {
      return {
        url: action.payload,
        loading: false,
        error: false,
      };
    },
    requestedDogFail: (state, action) => {
      return {
        url: '',
        loading: false,
        error: true,
      };
    },
  },
})

const fetchDog = createAction('@@shelter/fetchDog')

const { requestedDog, requestedDogSuccessed, requestedDogFail } = shelter.actions

const rootReducer = combineReducers({
  shelter: shelter.reducer
})

type RootState = ReturnType<typeof rootReducer>

// Sagas
function* watchFetchDog() {
  yield takeEvery(fetchDog.type, fetchDogAsync);
}

function* fetchDogAsync() {
  try {
    yield put(requestedDog(''));

    const data: Response = yield fetch('http://localhost:3000/proxy/xcap-root/org.openmobilealliance.xcap-directory/global/directory.xml/~~/xcap-directory/folder%5B@auid=%22org.openmobilealliance.groups%22%5D',
      { method: 'GET' })
    const xml = yield call([data, data.text])

    // const data = yield fetch('https://dog.ceo/api/breeds/image/random')
    //   .then(res => res.json());
    console.log("aaaa", data)
    yield put(requestedDogSuccessed(xml));
  } catch (error) {
    console.log(error)
    yield put(requestedDogFail(''));
  }
}

// Component 
function App() {
  const shelterState = useSelector((state: RootState) => state.shelter)
  const dispatch = useDispatch()
  return (
    <div>
      <button onClick={() => dispatch(fetchDog())}>Show Dog</button>
      {shelterState.loading
        ? <p>Loading...</p>
        : shelterState.error
          ? <p>Error, try again</p>
          //: <p><img src={shelterState.url} /></p>}
          : <p><pre>{shelterState.url}</pre></p>}
    </div>
  )
}

// Store
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware, logger],
  devTools: true
})

sagaMiddleware.run(watchFetchDog);

// Container component
const app = (
  <Provider store={store}>
    <App />
  </Provider>
)

render(app, document.getElementById('root'));
