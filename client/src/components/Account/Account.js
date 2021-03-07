import { Link } from "react-router-dom";
import './Account.css'
import { useSelector } from 'react-redux'

export default function Account() {
  const useremail = useSelector(state => state.email);
  return (
    <div className="account center-wrapper">
      <h1>Hello {useremail}</h1>
    </div>
  )
}