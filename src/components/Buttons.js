import React from "react";
import {connect} from 'react-redux';
import {decrement, increment} from "../redux/actions";

const Buttons = ({incrementA, decrementA, disableFlag}) => {

  const handleIncrement = () => {
    incrementA()
  }
  const handleDecrement = () => {
    decrementA()
  }

  return (
    <>
      <button className="btn btn-primary" id="add" disabled={disableFlag} onClick={handleIncrement}>Добавить</button>
      &nbsp;
      <button className="btn btn-danger" id="sub" disabled={disableFlag} onClick={handleDecrement}>Убрать</button>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    disableFlag: state.theme.disabled
  }
}

const mapDispatchToProps = {
  incrementA: increment,
  decrementA: decrement
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons)