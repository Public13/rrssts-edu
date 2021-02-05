import React from "react";
import {useDispatch} from 'react-redux';
import {asyncIncrement} from "../redux/actions";

export const AsyncButton = () => {

  const dispatch = useDispatch()

  const handleAsync = () => {
    dispatch(asyncIncrement())
  }

  return (
    <span>
      &nbsp;
      <button className="btn btn-success" id="async" onClick={handleAsync}>Async</button>
    </span>
  );
}
