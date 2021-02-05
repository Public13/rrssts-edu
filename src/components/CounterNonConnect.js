import React from "react";
import {useSelector} from "react-redux";

export default () => {
  const counter = useSelector(state => state.counter)
  return (
    <span>
      Счетчик: {counter}
      <span id="counter"/>
    </span>
  );
}