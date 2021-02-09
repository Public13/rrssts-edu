import React from "react";
import { connect } from 'react-redux'
import { RootState } from "../redux/rootReducer";

type Props = ReturnType<typeof mapStateToProps>

const Counter = ({ cnt }: Props) => {
  return (
    <span>
      Счетчик: {cnt}
      <span id="counter" />
    </span>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    cnt: state.counter
  }
}

export default connect(mapStateToProps)(Counter)