import {
  Switch,
  Route,
  useLocation
} from "react-router-dom"
import { useEffect } from 'react'
import './App.css';
import FieldsEditor from './components/FieldsEditor/FieldsEditor'
import LogicEditor from './components/LogicEditor/LogicEditor'
import Account from './components/Account/Account'
import Dashboard from './components/Dashboard/Dashboard'
import Header from './components/Header/Header'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import { removeSuggestionBox } from './utils/autcompleteBox';
import { fetchUserData } from './actions'
import { useSelector, useDispatch } from 'react-redux'

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading);
  const isAuthenticated = useSelector(state => state.isAuthenticated);

  useEffect(() => {if (location.pathname !== '/logic') removeSuggestionBox()}, [location]);
  useEffect(() => dispatch(fetchUserData()), [isAuthenticated]); // Initial fetching of user data, only when App mounts

  return (
      <div className="App">
         {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Header />
          {loading
            ? (<div className="loader-wrapper"><div className="lds-ripple"><div></div><div></div></div></div>)
            : (<Switch>
                <Route path="/fields">
                  <FieldsEditor />
                </Route>
                <Route path="/logic">
                  <LogicEditor />
                </Route>
                <Route path="/account">
                  <Account />
                </Route>
                <Route path="/register">
                  <Register />
                </Route>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/">
                  <Dashboard />
                </Route>
              </Switch>
            )
          }
      </div>
  );
}

export default App;
