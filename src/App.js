import React, {useEffect} from 'react'
import './styles.css';
import Counter from "./components/Counter";
import Buttons from "./components/Buttons";
import ChangeTheme from "./components/ChangeTheme";
import CounterNonConnect from "./components/CounterNonConnect";
import {AsyncButton} from "./components/AsyncButton";
import {useSelector} from "react-redux";

function App() {
  const theme = useSelector(state => state.theme.value);
  useEffect(() => {
    document.body.className = theme
  }, [theme])

  return (
    <div className="container pt-5">
      <h1 className="heading">
        <span>Redux</span>
        <ChangeTheme/>
      </h1>

      <hr/>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            <Counter/>
            &nbsp;
            <CounterNonConnect/>
          </h5>
          <div className="buttons-layout">
            <Buttons/>
            <AsyncButton/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App