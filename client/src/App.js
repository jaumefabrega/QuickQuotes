import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import './App.css';
import FieldsEditor from './components/FieldsEditor/FieldsEditor'
import LogicEditor from './components/LogicEditor/LogicEditor'
import Account from './components/Account/Account'
import Dashboard from './components/Dashboard/Dashboard'

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
