import React from 'react'
import EditableField from '../EditableField/EditableField'

export default function FormEditor({fields, onInputChange, onFieldDelete, onFieldAdd, formSettings, onFormSettingsChange, onOptionAdd, onOptionDelete, onOptionInputChange}) {
  return (
    <div>
      <h1>General</h1>
        <div className="field">
          <input type="text" placeholder="Title" name="title" value={formSettings.title} onChange={onFormSettingsChange} />
        </div>
      <h1>Fields</h1>
      <div className="event-list" id="list">
        { fields.length ? fields.map(field => <EditableField key={field._id} field={field} onInputChange={onInputChange} onFieldDelete={onFieldDelete} onOptionAdd={onOptionAdd} onOptionDelete={onOptionDelete} onOptionInputChange={onOptionInputChange} />) : <p className="empty-warning">Go create some fields</p> }
      </div>
      <div className="wrapper submit">
        <input type="button" value="Add field" className="button" onClick={onFieldAdd} />
      </div>
      <h1>Styling</h1>
      <div className="field">
        <div>
          <input type="color" id="backgroundColor" name="backgroundColor" value={formSettings.backgroundColor} onChange={onFormSettingsChange} />
          <label htmlFor="backgroundColor">Background</label>
        </div>
        <div>
          <input type="color" id="fieldsColor" name="fieldsColor" value={formSettings.fieldsColor} onChange={onFormSettingsChange} />
          <label htmlFor="fieldsColor">Fields</label>
        </div>
      </div>
    </div>
  )
}
