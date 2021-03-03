import FormEditor from '../FormEditor/FormEditor'
import FormPreviewer from '../FormPreviewer/FormPreviewer'
import './FieldsEditor.css'
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";

function FieldsEditor() {

  const MOCK_FIELDS = [
    {_id:"2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d", name:"", type:"", options:[]},
    {_id:"710b962e-041c-11e1-9234-0123456789ab", name:"Square meters", type:"number", options:[]},
    {_id:"710b962e-041c-11e1-9234-0123656789xq", name:"Floor type", type:"dropdown", options:[{name:"posh", value:35, _id:"1"}, {name:"medium", value:25, _id:"2"}, {name:"cheap", value:5, _id:"3"}]},
    {_id:"6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b", name:"kilometers", type:"number", options:[]},
  ];

  const INITIAL_FORM_SETTINGS = {
    title: 'Get a quote in 1 minute',
    backgroundColor: '#e66464',
    fieldsColor: '#f8f9fb'
  };

  const handleFieldChange = ({target}, fieldId) => {
    setFields(prevFields => [...prevFields].map(field => field._id === fieldId ? {...field, [target.name]: target.value} : field));
  };

  const handleFormSettingsChange = ({target}) => {
    setFormSettings(prevFormSettings => {
      return {...prevFormSettings, [target.name]: target.value};
    });
  }

  const handleFieldDelete = (fieldId) => {
    setFields(prevFields => prevFields.filter(field => field._id !== fieldId));
  };

  const handleFieldAdd = () => {
    setFields((prevFields) => [...prevFields, {_id:uuidv4(), name:"", type:"", options:[]}]);
  };

  const handleOptionAdd = (fieldId) => {
    setFields(prevFields => {
      return [...prevFields].map(field => {
        if (field._id === fieldId) return {...field, options: [...field.options, {"_id":uuidv4(), name:"", value:""}]};
        else return field;
      });
    });
  };

  const handleOptionDelete = (fieldId, optionId) => {
    setFields(prevFields => {
      return [...prevFields].map(field => {
        if (field._id === fieldId) return {...field, options: [...field.options].filter(option => option._id !== optionId)};
        else return field;
      });
    });
  };

  const handleOptionInputChange = ({target}, fieldId, optionId) => {
    setFields(prevFields => {
      return [...prevFields].map(field => {
        if (field._id === fieldId) return {...field, options: [...field.options].map(option => option._id === optionId ? {...option, [target.name]: target.value} : option)};
        else return field;
      });
    });
  };

  let [fields, setFields] = useState(MOCK_FIELDS);
  let [formSettings, setFormSettings] = useState(INITIAL_FORM_SETTINGS);

  return (
    <div className="fields-editor">
      <h1>link to home: <Link to="/">Home</Link></h1>
      <div style={{display:"flex", width:"100%"}}>
        <FormEditor fields={fields} onInputChange={handleFieldChange} onFieldDelete={handleFieldDelete} onFieldAdd={handleFieldAdd} formSettings={formSettings} onFormSettingsChange={handleFormSettingsChange} onOptionAdd={handleOptionAdd} onOptionDelete={handleOptionDelete} onOptionInputChange={handleOptionInputChange} />
        <FormPreviewer fields={fields} settings={formSettings} />
      </div>
      <h1><Link to="/logic">NEXT</Link></h1>
    </div>
  );
}

export default FieldsEditor;
