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
import { removeSuggestionBox } from './utils/autcompleteBox';
import { fetchUserData } from './actions'
import { useSelector, useDispatch } from 'react-redux'

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {if (location.pathname !== '/logic') removeSuggestionBox()}, [location]);
  useEffect(() => dispatch(fetchUserData('604358dd2b586d1e800fb8fd')), []); // Initial fetching of user data, only when App mounts
  const loading = useSelector(state => state.loading);

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
