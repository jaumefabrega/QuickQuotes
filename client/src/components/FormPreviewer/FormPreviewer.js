import React from 'react'
import FieldPreview from '../FieldPreview/FieldPreview'

export default function FormPreviewer({fields, settings}) {
  return (
    <div style={{backgroundColor:settings.backgroundColor}}>
      <h1>Preview of form</h1>
      <h2>{settings.title}</h2>
      <div className="fields-preview-wrapper">
        { fields.length ? fields.map(field => <FieldPreview field={field} key={field._id} settings={settings} />) : <p className="empty-warning">As you add fields, you'll see a preview here</p> }
      </div>
    </div>
  )
}
