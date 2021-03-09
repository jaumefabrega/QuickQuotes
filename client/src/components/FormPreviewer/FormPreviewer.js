import FieldPreview from '../FieldPreview/FieldPreview'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import './FormPreviewer.css'
import { saveFormData } from '../../actions'


// FIX: input inside of link is weird (+ input onClick is not the best way to handle bc of accessibility, enter key, etc)
export default function FormPreviewer() {
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.form.fields)
  const formSettings = useSelector((state) => state.form.settings)

  const handleButtonClick = () => {
    dispatch(saveFormData({updateType: 'fields', payload:{fields, settings:formSettings}}));
  }

  return (
    <div className="form-preview center-wrapper">
      <h3>Preview</h3>
      <div className="form-preview-actual-form" style={{backgroundColor:formSettings.backgroundColor}}>
        <h2>{formSettings.title}</h2>
        <div className="fields-preview-wrapper">
          { fields.length ? fields.map(field => <FieldPreview field={field} key={field.id} settings={formSettings} />) : <p className="empty-warning">As you add fields, you'll see a preview here</p> }
        </div>
        <div style={{display:'flex',justifyContent: 'space-between',alignItems: 'center',padding:'10px 0'}}>
          <p id="QQ-price"><span id="QQ-price-dollar-sign">$</span><span id="QQ-price-whole-digits">99</span><span id="QQ-price-decimal-digits">.99</span></p>
          <input type="button" id="QQ-submit-button" className="QQ-button primary" value="I want it!" disabled />
        </div>
      </div>
      <Link to="/logic" style={{position:'fixed', bottom:0, right:20}}>
        <div className="wrapper submit">
          <input type="button" onClick={handleButtonClick} value="Go to logic" className="button primary" />
        </div>
      </Link>
    </div>
  )
}
