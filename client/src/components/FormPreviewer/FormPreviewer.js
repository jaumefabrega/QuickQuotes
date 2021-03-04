import FieldPreview from '../FieldPreview/FieldPreview'
import { useSelector } from 'react-redux'

export default function FormPreviewer() {
  const fields = useSelector((state) => state.formFields)
  const formSettings = useSelector((state) => state.formSettings)

  return (
    <div style={{backgroundColor:formSettings.backgroundColor}}>
      <h1>Preview of form</h1>
      <h2>{formSettings.title}</h2>
      <div className="fields-preview-wrapper">
        { fields.length ? fields.map(field => <FieldPreview field={field} key={field._id} settings={formSettings} />) : <p className="empty-warning">As you add fields, you'll see a preview here</p> }
      </div>
    </div>
  )
}
