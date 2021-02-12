import "regenerator-runtime/runtime"
import React, { useState } from "react"
import { connect, Provider, useDispatch, useSelector } from 'react-redux'
import ReactDOM, { render } from 'react-dom'
import './styles.css'
import logger from 'redux-logger'
import { applyMiddleware, combineReducers, configureStore, createAction, createSlice, createStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { call, delay, put, take, takeEvery } from 'redux-saga/effects'
import { Element, ElementCompact, js2xml, json2xml, xml2js, xml2json } from "xml-js"

// Model
interface McpttGroup {
  _declaration: any
  group: any
}

// Reducer
interface ShelterState {
  data: McpttGroup | undefined,
  loading: boolean,
  error: boolean,
}

const initialState: ShelterState = {
  data: undefined,
  loading: false,
  error: false,
}

const shelter = createSlice({
  name: "@@shelter",
  initialState,
  reducers: {
    loading: (state, action) => {
      return {
        data: undefined,
        loading: true,
        error: false,
      };
    },
    requestSuccessed: (state, action) => {
      return {
        data: action.payload,
        loading: false,
        error: false,
      };
    },
    requestFail: (state, action) => {
      return {
        data: undefined,
        loading: false,
        error: true,
      };
    },
  },
})

const fetchDog = createAction('@@shelter/fetchDog')
const fetchUserGroup = createAction('@@shelter/fetchUserGroup')
const fetchCat = createAction('@@shelter/fetchCat')
const rewriteCat = createAction<McpttGroup>('@@shelter/rewriteCat')

const { loading, requestSuccessed, requestFail } = shelter.actions

const rootReducer = combineReducers({
  shelter: shelter.reducer
})

type RootState = ReturnType<typeof rootReducer>

// Sagas
function* watcher() {
  yield takeEvery(fetchDog.type, fetchDogAsync);
  yield takeEvery(fetchUserGroup.type, fetchUserGroupAsync);
  yield takeEvery(fetchCat.type, fetchCatAsync);
  yield takeEvery(rewriteCat.type, rewriteCatAsync);
}

function* fetchDogAsync() {
  try {
    yield put(loading(''));
    const data: Response = yield fetch('http://localhost:3001/proxy/xcap-root/org.openmobilealliance.xcap-directory/global/directory.xml/~~/xcap-directory/folder%5B@auid=%22org.openmobilealliance.groups%22%5D')
    const xmlData = yield call([data, data.text])
    console.log(xmlData)
    const strJson = xml2json(xmlData, { compact: true, spaces: 2 })
    console.log(strJson)
    const group: McpttGroup = JSON.parse(strJson);
    yield put(requestSuccessed(group));
  } catch (error) {
    console.log(error)
    yield put(requestFail(''));
  }
}

function* fetchUserGroupAsync() {
  try {
    yield put(loading(''));
    const data: Response = yield fetch('http://localhost:3001/proxy/xcap-root/org.openmobilealliance.xcap-directory/users/sip:pelle_test@protei.ru/directory.xml/~~/xcap-directory/folder%5B@auid=%22org.openmobilealliance.groups%22%5D')
    const xmlData = yield call([data, data.text])
    console.log(xmlData)
    const strJson = xml2json(xmlData, { compact: true, spaces: 2 })
    console.log(strJson)
    const group: McpttGroup = JSON.parse(strJson);
    yield put(requestSuccessed(group));
  } catch (error) {
    console.log(error)
    yield put(requestFail(''));
  }
}

function* fetchCatAsync() {
  try {
    yield put(loading(''));
    const data: Response = yield fetch('http://localhost:3001/proxy/xcap-root/org.openmobilealliance.groups/global/sip:GMCproposedMCPTTGroupID@MCPTTSP2.example.com')
    const xmlData = yield call([data, data.text])
    const strJson = xml2json(xmlData, { compact: true, spaces: 2 })
    console.log(strJson)

    const mcpttGroup: McpttGroup = JSON.parse(strJson);
    //Object.freeze(mcpttGroup)

    yield put(requestSuccessed(mcpttGroup));
  } catch (error) {
    console.log(error)
    yield put(requestFail(''));
  }
}

function* rewriteCatAsync(action: ReturnType<typeof rewriteCat>) {
  try {
    yield put(loading(''));
    const dataToSend = json2xml(JSON.stringify(action.payload), { compact: true, spaces: 1 })
    console.log("data to send:", dataToSend)
    const responce: Response = yield fetch('http://localhost:3001/proxy/xcap-root/org.openmobilealliance.groups/users/sip:pelle_test@protei.ru/group_doc13.xml',
      {
        method: "PUT",
        headers: {
          'Content-Type': 'application/vnd.oma.poc.groups+xml; charset="utf-8"'
        },
        body: dataToSend
      })
    const xmlData = yield call([responce, responce.text])
    const jsonData = JSON.parse(xml2json(xmlData, { compact: true, spaces: 2 }));
    yield put(requestSuccessed(jsonData));
  } catch (error) {
    console.log(error)
    yield put(requestFail(''));
  }
}

// Component 
function App() {
  const shelterState = useSelector((state: RootState) => state.shelter)
  const dispatch = useDispatch()
  return (
    <div>
      <button onClick={() => dispatch(fetchDog())}>Groups dir global</button>&nbsp;
      <button onClick={() => dispatch(fetchUserGroup())}>Groups dir users</button>&nbsp;
      <button onClick={() => dispatch(fetchCat())}>Global group fetch</button>&nbsp;
      <button onClick={() => dispatch(rewriteCat(mutator(shelterState.data as McpttGroup)))}>Rewrite global group)</button>
      {shelterState.loading
        ? <p>Loading...</p>
        : shelterState.error
          ? <p>Error, try again</p>
          : <pre>
            {JSON.stringify(shelterState.data, null, 2)}
          </pre>}
    </div>
  )
}

function mutator(mcGroup: McpttGroup) {
  const mcpttGroup = JSON.parse(JSON.stringify(mcGroup))
  console.log("=== mcpttGroup: ", mcpttGroup)
  const newUri = "sip:pelleTestMcpttGroup13@protei.ru"
  mcpttGroup.group['list-service']._attributes.uri = newUri
  console.log("=== after replace", mcpttGroup)
  return mcpttGroup
}


// Store
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware, logger],
  devTools: true
})

sagaMiddleware.run(watcher);

// Container component
const app = (
  <Provider store={store}>
    <App />
  </Provider>
)

render(app, document.getElementById('root'));
