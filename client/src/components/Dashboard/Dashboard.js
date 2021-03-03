import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1>You are in the DASHBOARDs</h1>
      <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/fields">Fields</Link>
            </li>
            <li>
              <Link to="/logic">Logic</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
          </ul>
        </nav>
    </div>
  )
}