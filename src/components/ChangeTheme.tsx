import React from "react";
import { connect } from "react-redux";
import { changeTheme, RootState } from "../redux/rootReducer";

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const ChangeTheme = ({ changeThemeA, disableFlag, theme }: Props) => {
  const handleChangeTheme = () => {
    if (theme === 'light') {
      changeThemeA('dark')
    } else {
      changeThemeA('light')
    }
  }
  return (
    <button className="btn btn-info" id="theme" disabled={disableFlag} onClick={handleChangeTheme}>Сменить тему</button>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    disableFlag: state.theme.disabled,
    theme: state.theme.value
  }
}

const mapDispatchToProps = {
  changeThemeA: changeTheme
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeTheme)