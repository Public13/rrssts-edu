import { delay, put, takeEvery } from 'redux-saga/effects'
import { asyncIncrement, disableButtons, enableButtons, increment } from "../redux/rootReducer";

// worker Saga
function* asyncIncr() {
  try {
    yield put(disableButtons())
    yield delay(1500)
    yield put(increment())
    yield put(enableButtons())
  } catch (e) {
    yield put({ type: "FAIL" })
  }
}

export default function* incrementSaga() {
  console.log("start increment saga with action " + asyncIncrement.type)
  yield takeEvery(asyncIncrement.type, asyncIncr)
}
