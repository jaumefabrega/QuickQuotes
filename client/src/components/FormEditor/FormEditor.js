import React from 'react'
import EditableField from '../EditableField/EditableField'
import { useSelector, useDispatch } from 'react-redux'
import { handleFormSettingsChange, handleFieldAdd } from '../../actions'
import './FormEditor.css'

export default function FormEditor() {
  const fields = useSelector((state) => state.formFields)
  const formSettings = useSelector((state) => state.formSettings)
  const dispatch = useDispatch()

  return (
    <div className="form-editor">
      <h3>General</h3>
        <div className="field">
          <input type="text" placeholder="Title" name="title" value={formSettings.title} onChange={(event) => dispatch(handleFormSettingsChange(event))} />
        </div>
      <h3>Fields</h3>
      <div className="event-list" id="list">
        { fields.length ? fields.map(field => <EditableField key={field._id} field={field} />) : <p className="empty-warning">Go create some fields</p> }
      </div>
      <div className="wrapper submit">
        <input type="button" value="Add field" className="button primary" onClick={() => dispatch(handleFieldAdd())} />
      </div>
      <h3>Styling</h3>
      <div className="field colors-selection">
        <div>
          <input type="color" id="backgroundColor" name="backgroundColor" value={formSettings.backgroundColor} onChange={(event) => dispatch(handleFormSettingsChange(event))} style={{backgroundColor:formSettings.backgroundColor}} />
          <label htmlFor="backgroundColor">Background</label>
        </div>
        <div>
          <input type="color" id="fieldsColor" name="fieldsColor" value={formSettings.fieldsColor} onChange={(event) => dispatch(handleFormSettingsChange(event))}  style={{backgroundColor:formSettings.fieldsColor}} />
          <label htmlFor="fieldsColor">Fields</label>
        </div>
      </div>
    </div>
  )
}
