import './Header.css'
import { Link } from "react-router-dom";
import {
  useLocation
} from "react-router-dom"
import { toggleZenMode } from '../../actions'
import { useSelector, useDispatch } from 'react-redux'


function Header() {
  const location = useLocation();
  let rightElement;
  const zenMode = useSelector((state) => state.zenMode);
  const dispatch = useDispatch();

  switch (location.pathname) {
    case '/logic':
      rightElement = (
        <label className="switch">
          <input type="checkbox" id="focus-switch" checked={zenMode ? false : true} onChange={() => dispatch(toggleZenMode())}/>
          <span className="slider round"></span>
        </label>
      );
      break;
    case '/':
      rightElement = (
        <Link to="/account">
          <div className="account-wrapper">
            <h4>Account</h4>
            <img id="account" src="assets/images/account_circle-24px.svg" alt="account" />
          </div>
        </Link>
      );
      break;

    case '/fields':
      rightElement = <></>;
      break;

  }
  // useEffect(() => {if (location.pathname !== '/logic') removeSuggestionBox()}, [location]);
  return (
    <div className="header" style={{ left:location.pathname === '/fields' ? '420px' : '25%' }}>
      <Link to="/">
        <div className={zenMode ? "zen-mode logo-wrapper" : "logo-wrapper"}>
          <img id="logo" src="/assets/images/logo.png" alt="logo" />
          <h4>QuickQuotes</h4>
        </div>
      </Link>
      {rightElement}
    </div>
  );
}

export default Header;