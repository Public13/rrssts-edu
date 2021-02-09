import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";

export default () => {
  const counter = useSelector((state: RootState) => state.counter)
  return (
    <span>
      Счетчик: {counter}
      <span id="counter" />
    </span>
  );
}