import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'

import './Dashboard.css'

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if the element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a
  // flash, so some of these are just precautions. However in
  // Internet Explorer the element is visible whilst the popup
  // box asking the user for permission for the web page to
  // copy to the clipboard.
  //

  // Place in the top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of the white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}


export default function Dashboard() {
  let contentElement;
  const formFields = useSelector(state => state.form.fields);
  const formSettings = useSelector(state => state.form.settings);
  const userId = useSelector(state => state._id);
  const analytics = useSelector(state => state.analytics);

  if (formFields.length) {
    contentElement = (
      <div className="main-editor">
        <div className="panel-wrapper">
          <div className="panel-header">
            <div style={{display:'flex'}}>
              <img src="assets/images/content_paste-24px.svg" alt="tbd"/>
              <h3>Forms</h3>
            </div>
            <div><p style={{fontSize:'0.9em'}}>+ CREATE NEW</p></div>
          </div>
          <div className="panel-table-wrapper">
            <table>
              <tbody>
                <tr>
                  <td><Link to="/fields">{formSettings.title}</Link></td>
                  <td className="secondary"><Link to="/fields"><div className="big-icon-button"><span style={{lineHeight:'24px'}}>{formFields.length}</span><span>Fields</span></div></Link></td>
                  <td className="secondary"><Link to="/logic"><div className="big-icon-button"><img src="assets/images/calculate-24px.svg" style={{marginRight:'5px'}} alt="tbd"/><span>Edit Logic</span></div></Link></td>
                  <td className="secondary"><div className="big-icon-button ripple" onClick={() => copyTextToClipboard("<script src='http://localhost:3001/form/"+userId+"'></script>")}><img src="assets/images/code-24px.svg" style={{marginRight:'5px'}} alt="tbd"/><span>Copy Code</span></div></td>
                  <td className="secondary"><div className="big-icon-button"><img src="assets/images/content_copy-24px.svg" style={{marginRight:'5px'}} alt="tbd"/><span>Duplicate</span></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div  className="panel-wrapper">
          <div className="panel-header">
            <div style={{display:'flex'}}>
              <img src="assets/images/bar_chart-24px.svg" alt="tbd"/>
              <h3>Analytics</h3>
            </div>
          </div>
          <div className="panel-table-wrapper">
            <table>
              <tbody>
                <tr>
                  <td>Last 30 days</td>
                  <td className="secondary">{analytics.visits} visits</td>
                  <td className="secondary">{analytics.calculations} calculations</td>
                  <td className="secondary">{analytics.leads.length} leads</td>
                  <td className="secondary" style={{width:'36px'}}><img id="account" src="assets/images/download-24px.svg" style={{height:'70%'}} alt="tbd"/></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  } else {
    contentElement = (
      <div className="empty-dashboard">
        <img src="assets/images/mobile_construction.jpg" width="340px" height="340px" alt="your dashboard is empty"/>
        <p>Create your first form and start getting new clients</p>
        <Link to="/fields">
            <input type="button" value="Get started " className="button primary"  />
        </Link>
      </div>
    )
  }

  return (
    <div className="dashboard center-wrapper">
      {contentElement}
    </div>
  )
}