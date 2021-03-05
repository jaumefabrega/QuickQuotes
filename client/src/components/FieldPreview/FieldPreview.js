
export default function FieldPreview({field, settings}) {
  let fieldElement;
  if (field.type === 'dropdown') {
    fieldElement = (
      <div className="field">
        <label>{field.name}</label>
        <select name={field._id} id={field._id} style={{backgroundColor:settings.fieldsColor, fontFamily:'Roboto', fontSize:'1em', color:'black'}}>
            {field.options.map(option => <option key={option._id} value={option.name} style={{backgroundColor:settings.fieldsColor, fontFamily:'Roboto', fontSize:'1em', color:'black'}}>{option.name}</option>)}
        </select>
      </div>
    );
  } else {
    fieldElement = (
      <div className="field">
        <label className={field.type === 'checkbox' ? 'checkbox-label' : '' }>{field.name}</label>
        <input type={field.type} style={{backgroundColor:settings.fieldsColor}} />
      </div>
    );
  }
  return fieldElement;
}