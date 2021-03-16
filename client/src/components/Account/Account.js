import './Account.css'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Logout from '../Logout/Logout'

export default function Account() {
  const useremail = useSelector(state => state.email);
  const isAuthenticated = useSelector(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return (<Redirect to='/login'  />)
  } else {
    return (
      <div className="account center-wrapper">
        <div>
          <h1>Hello {useremail}</h1>
          <p>We'll be more than happy to speak with you at</p><p>support@QuickQuotesOnline.com</p>
          <Logout />
        </div>
      </div>
    )
  }
}