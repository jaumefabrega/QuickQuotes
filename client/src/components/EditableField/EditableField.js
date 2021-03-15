import { useDispatch } from 'react-redux'
import './EditableField.css'
import { handleFieldChange, handleFieldDelete, handleOptionInputChange, handleOptionAdd, handleOptionDelete } from '../../actions'

export default function EditableField({field}) {
  const dispatch = useDispatch();

  return (
    <div className="field">
      <div className="field-main-options">
        <input type="text" name="name" value={field.name} onChange={(event) => dispatch(handleFieldChange(event, field.id))} placeholder="Field name" className="field-name" autoComplete="off"/>
        <select name="type" id="field-type" value={field.type} onChange={(event) => dispatch(handleFieldChange(event, field.id))}>
          <option value="text">&#xe8d2;</option>
          <option value="number">&#xe400;</option>
          <option value="dropdown">&#xe5c6;</option>
          <option value="checkbox">&#xe834;</option>
        </select>
      </div>
        {field.type === 'dropdown'
          ? (<div className="dropdown-options-wrapper">
                {field.options.map((option, idx) => {
                  return (
                    <div className="dropdown-option-wrapper" key={option.id}>
                      <span>{idx+1}.</span>
                      <input type="text" placeholder="Name" name="name" value={option.name} onChange={(event) => dispatch(handleOptionInputChange(event, field.id, option.id))} autoComplete="off"/>
                      <input type="number" placeholder="Value" name="value" value={option.value} onChange={(event) => dispatch(handleOptionInputChange(event, field.id, option.id))} autoComplete="off"/>
                      <svg onClick={() => dispatch(handleOptionDelete(field.id, option.id))} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                      </svg>
                    </div>
                  )
                })}
                <input type="button" onClick={() => dispatch(handleOptionAdd(field.id))} className="button secondary" value="ADD OPTION" />
            </div>)
          : ''
        }
      <div className="field-settings">
        <img src='/assets/images/trash-can-outline.svg' alt="delete" onClick={() => dispatch(handleFieldDelete(field.id))}/>
      </div>
    </div>
  )
}
