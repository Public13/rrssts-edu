import React from "react";
import {connect} from 'react-redux'

const Counter = ({cnt}) => {
  return (
    <span>
      Счетчик: {cnt}
      <span id="counter"/>
    </span>
  );
}

const mapStateToProps = (state) => {
 return  {
   cnt: state.counter
 }
}

export default connect(mapStateToProps)(Counter)