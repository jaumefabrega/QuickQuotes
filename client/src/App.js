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
import { removeSuggestionBox } from './utils/autcompleteBox';

function App() {
  const location = useLocation();
  useEffect(() => {if (location.pathname !== '/logic') removeSuggestionBox()}, [location]);

  return (
      <div className="App">
         {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
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
      </div>
  );
}

export default App;
