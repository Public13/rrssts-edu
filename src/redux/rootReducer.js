import {combineReducers} from 'redux'
import {createAction, createSlice} from "@reduxjs/toolkit";

export const asyncIncrement = createAction('counter/asyncIncrement')

const counter = createSlice({
  name: 'counter',
  initialState: 42,
  reducers: {
    increment: state => state + 1,
    decrement: (state) => state - 1
  },
})

const theme = createSlice({
  name: "theme",
  initialState: {
    value: 'light',
    disabled: false
  },
  reducers: {
    changeTheme: (state, action) => {
      state.value = action.payload
    },
    enableButtons: state => {
      state.disabled = false
    },
    disableButtons: state => {
      state.disabled = true
    },
  },
})

export const {increment, decrement} = counter.actions
export const {changeTheme, enableButtons, disableButtons} = theme.actions

export const rootReducer = combineReducers({
  counter: counter.reducer,
  theme: theme.reducer
})
