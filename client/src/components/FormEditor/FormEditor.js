import React from 'react'
import EditableField from '../EditableField/EditableField'
import { useSelector, useDispatch } from 'react-redux'
import { handleFormSettingsChange, handleFieldAdd } from '../../actions'

export default function FormEditor() {
  const fields = useSelector((state) => state.formFields)
  const formSettings = useSelector((state) => state.formSettings)
  const dispatch = useDispatch()

  return (
    <div>
      <h1>General</h1>
        <div className="field">
          <input type="text" placeholder="Title" name="title" value={formSettings.title} onChange={(event) => dispatch(handleFormSettingsChange(event))} />
        </div>
      <h1>Fields</h1>
      <div className="event-list" id="list">
        { fields.length ? fields.map(field => <EditableField key={field._id} field={field} />) : <p className="empty-warning">Go create some fields</p> }
      </div>
      <div className="wrapper submit">
        <input type="button" value="Add field" className="button" onClick={() => dispatch(handleFieldAdd())} />
      </div>
      <h1>Styling</h1>
      <div className="field">
        <div>
          <input type="color" id="backgroundColor" name="backgroundColor" value={formSettings.backgroundColor} onChange={(event) => dispatch(handleFormSettingsChange(event))}/>
          <label htmlFor="backgroundColor">Background</label>
        </div>
        <div>
          <input type="color" id="fieldsColor" name="fieldsColor" value={formSettings.fieldsColor} onChange={(event) => dispatch(handleFormSettingsChange(event))} />
          <label htmlFor="fieldsColor">Fields</label>
        </div>
      </div>
    </div>
  )
}
