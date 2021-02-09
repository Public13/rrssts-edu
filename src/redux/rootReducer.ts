import { combineReducers } from 'redux';
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const asyncIncrement = createAction('counter/asyncIncrement')

const counter = createSlice({
  name: 'counter',
  initialState: 42,
  reducers: {
    increment(state) {
      return state + 1
    },
    decrement(state) {
      return state - 1
    }
  },
})

export interface ThemeState {
  value: string,
  disabled: boolean
}

const initialState: ThemeState = {
  value: 'light',
  disabled: false
}

const theme = createSlice({
  name: "theme",
  initialState,
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

export const { increment, decrement } = counter.actions
export const { changeTheme, enableButtons, disableButtons } = theme.actions

export const rootReducer = combineReducers({
  counter: counter.reducer,
  theme: theme.reducer
})

export type RootState = ReturnType<typeof rootReducer> 
