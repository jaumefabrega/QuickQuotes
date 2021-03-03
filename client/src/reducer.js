import { v4 as uuidv4 } from 'uuid';

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

const initialState = {
  formFields: MOCK_FIELDS,
  formSettings: INITIAL_FORM_SETTINGS
}


export default function reducer (state = initialState, action) {

  switch (action.type) {
    case 'HANDLE_FIELD_CHANGE':// handleFieldChange
      return {
        ...state,
        formFields: state.formFields.map((field) => field._id === action.payload.fieldId ? { ...field, [action.payload.target.name]: action.payload.target.value } : field)
      }

    case 'HANDLE_FIELD_DELETE':// handleFieldDelete
      return {
        ...state,
        formFields: state.formFields.filter(field => field._id !== action.payload.fieldId)
      }

    case 'HANDLE_FIELD_ADD':// handleFieldAdd
      return {
        ...state,
        formFields: [...state.formFields, {_id:uuidv4(), name:"", type:"", options:[]}]
      }

    case 'HANDLE_OPTION_ADD':// handleOptionAdd
      return {
        ...state,
        formFields: [...state.formFields].map(field => {
          if (field._id === action.payload.fieldId) return {...field, options: [...field.options, {"_id":uuidv4(), name:"", value:""}]}
          else return field;
        })
      }

    case 'HANDLE_OPTION_DELETE':// handleOptionDelete
      return {
        ...state,
        formFields: [...state.formFields].map(field => {
          if (field._id === action.payload.fieldId) return {...field, options: [...field.options].filter(option => option._id !== action.payload.optionId)}
          else return field;
        })
      }

    case 'HANDLE_OPTION_INPUT_CHANGE':// handleOptionInputChange
      return {
        ...state,
        formFields: [...state.formFields].map(field => {
          if (field._id === action.payload.fieldId) return {...field, options: [...field.options].map(option => option._id === action.payload.optionId ? {...option, [action.payload.target.name]: action.payload.target.value} : option)}
          else return field;
        })
      }

    case 'HANDLE_FORM_SETTINGS_CHANGE':// handleFormSettingsChange
      return {
        ...state,
        formSettings: {...state.formSettings, [action.payload.target.name]: action.payload.target.value}
      }


    default:
      return state
  }
}




