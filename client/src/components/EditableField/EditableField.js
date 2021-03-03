import './EditableField.css'

export default function EditableField({field, onInputChange, onFieldDelete, onOptionAdd, onOptionDelete, onOptionInputChange}) {
  return (
    <div>
      <div>
        <input type="text" name="name" value={field.name} onChange={(event) => onInputChange(event, field._id)} placeholder="Field name" className="field-name" />
        <select name="type" id="field-type" value={field.type} onChange={(event) => onInputChange(event, field._id)}>
          <option value="text">&#xe8d2;</option>
          <option value="number">&#xe400;</option>
          <option value="dropdown">&#xe5c6;</option>
          <option value="checkbox">&#xe834;</option>
        </select>
      </div>
        {field.type === 'dropdown'
          ? (<div>
                {field.options.map((option, idx) => {
                  return (
                    <div key={option._id}>
                      <span>{idx+1}.</span>
                      <input type="text" placeholder="Name" name="name" value={option.name} onChange={(event) => onOptionInputChange(event, field._id, option._id)} />
                      <input type="number" placeholder="Value" name="value" value={option.value} onChange={(event) => onOptionInputChange(event, field._id, option._id)} />
                      <svg onClick={() => onOptionDelete(field._id, option._id)} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                      </svg>
                    </div>
                  )
                })}
                <button onClick={() => onOptionAdd(field._id)}>ADD OPTION</button>
            </div>)
          : ''
        }
      <div>
        <img src='/assets/images/trash-can-outline.svg' alt="delete" onClick={() => onFieldDelete(field._id)}/>
      </div>
    </div>
  )
}
