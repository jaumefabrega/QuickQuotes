import FieldPreview from '../FieldPreview/FieldPreview'
import Header from '../Header/Header'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './FormPreviewer.css'

export default function FormPreviewer() {
  const fields = useSelector((state) => state.form.fields)
  const formSettings = useSelector((state) => state.form.settings)

  return (
    <div className="form-preview center-wrapper">
      <h3>Preview</h3>
      <div className="form-preview-actual-form" style={{backgroundColor:formSettings.backgroundColor}}>
        <h2>{formSettings.title}</h2>
        <div className="fields-preview-wrapper">
          { fields.length ? fields.map(field => <FieldPreview field={field} key={field.id} settings={formSettings} />) : <p className="empty-warning">As you add fields, you'll see a preview here</p> }
        </div>
      </div>
      <Link to="/logic" style={{position:'fixed', bottom:0, right:20}}>
        <div className="wrapper submit">
          <input type="button" value="Go to logic" className="button primary" />
        </div>
      </Link>
    </div>
  )
}
