import { v4 as uuidv4 } from 'uuid';

// const MOCK_FIELDS = [
//   {_id:"2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d", name:"something", type:"number", options:[]},
//   {_id:"710b962e-041c-11e1-9234-0123456789ab", name:"Square meters", type:"number", options:[]},
//   {_id:"710b962e-041c-11e1-9234-0123656789xq", name:"Floor type", type:"dropdown", options:[{name:"posh", value:35, _id:"1"}, {name:"medium", value:25, _id:"2"}, {name:"cheap", value:5, _id:"3"}]},
//   {_id:"6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b", name:"kilometers", type:"number", options:[]},
// ];

const MOCK_FIELDS = [
  {id:"2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d", name: 'Square Meters', type: 'number', options:[]},
  {id:"710b962e-041c-11e1-9234-0123456789ab", name: 'kilometers', type: 'number', options:[]},
  {id:"710b962e-041c-11e1-9234-0123656789xq", name: 'number of trees', type: 'number', options:[]},
  {id:"6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b", name: 'Urgent', type: 'checkbox', options:[]},
  {id:"6ec0bd7f-11c0-43da-975e-2a8ad9ebae23", name: 'On weekend', type: 'checkbox', options:[]},
  {id:"6ec0qr7f-11c0-43da-975e-2a8ad9ebae0b", name: 'Floor type', type: 'dropdown', options: [{name: 'Posh', value:23, id:"1"}, {name: 'Medium', value:10, id:"2"}, {name: 'Cheapest', value:2, id:"3"}]},
]

const INITIAL_FORM_SETTINGS = {
  title: 'Get a quote in 1 minute',
  backgroundColor: '#f3f7f9',
  fieldsColor: '#ffffff'
};

const initialState = {
  formFields: MOCK_FIELDS,
  formSettings: INITIAL_FORM_SETTINGS
};


const EMPTY_USER_DATA = {loading:true, email: '', password:'', form: {fields:[], settings:{title:'', backgroundColor:'', fieldsColor:''}, logicText:'', scriptText:''}}; // should actually NOT send password from server either

export default function reducer (state = EMPTY_USER_DATA, action) {

  switch (action.type) {
    case 'HANDLE_FIELD_CHANGE':
      return {
        ...state,
        form: {...state.form, fields: state.form.fields.map((field) => field.id === action.payload.fieldId ? { ...field, [action.payload.target.name]: action.payload.target.value } : field)}
      }

    case 'HANDLE_FIELD_DELETE':
      return {
        ...state,
        form: {...state.form, fields: state.form.fields.filter(field => field.id !== action.payload.fieldId)}
      }

    case 'HANDLE_FIELD_ADD':
      return {
        ...state,
        form: {...state.form, fields: [...state.form.fields, {id:uuidv4(), name:"", type:"text", options:[]}]}
      }

    case 'HANDLE_OPTION_ADD':
      return {
        ...state,
        form: {
          ...state.form,
          fields: [...state.form.fields].map(field => {
            if (field.id === action.payload.fieldId) return {...field, options: [...field.options, {"id":uuidv4(), name:"", value:""}]}
            else return field;
          })
        }
      }

    case 'HANDLE_OPTION_DELETE':
      return {
        ...state,
        form: {
          ...state.form,
          fields: [...state.form.fields].map(field => {
            if (field.id === action.payload.fieldId) return {...field, options: [...field.options].filter(option => option.id !== action.payload.optionId)}
            else return field;
          })
        }
      }

    case 'HANDLE_OPTION_INPUT_CHANGE':
      return {
        ...state,
        form: {
          ...state.form,
          fields: [...state.form.fields].map(field => {
            if (field.id === action.payload.fieldId) return {...field, options: [...field.options].map(option => option.id === action.payload.optionId ? {...option, [action.payload.target.name]: action.payload.target.value} : option)}
            else return field;
          })
        }
      }

    case 'HANDLE_FORM_SETTINGS_CHANGE':
      return {
        ...state,
        form: {...state.form, settings: {...state.form.settings, [action.payload.target.name]: action.payload.target.value}}
      }

    //------------------------------- THUNK ACTIONS for user data fetching
    case 'FETCH_USER_DATA_BEGIN':
      // Mark the state as "loading" so we can show a spinner or something
      // Also, reset any errors. We're starting fresh.
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'FETCH_USER_DATA_SUCCESS':
      // All done: set loading "false".
      // Also, replace the items with the ones from the server
      // console.log('reducer says:', action.payload);
      return {
        ...state,
        loading: false,
        ...action.payload
      };

    case 'FETCH_USER_DATA_FAILURE':
      // The request failed. It's done. So set loading to "false".
      // Save the error, so we can display it somewhere.
      // Since it failed, we don't have items to display anymore, so set `items` empty.
      //
      // This is all up to you and your app though:
      // maybe you want to keep the items around!
      // Do whatever seems right for your use case.
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        ...EMPTY_USER_DATA
      };

      //------------------------------- THUNK ACTIONS for save form
      case 'SAVE_FORM_DATA_BEGIN':
        // Mark the state as "loading" so we can show a spinner or something
        // Also, reset any errors. We're starting fresh.
        return {
          ...state,
          loading: true,
          error: null
        };

      case 'SAVE_FORM_DATA_SUCCESS':
        // All done: set loading "false".
        // Also, replace the items with the ones from the server
        // console.log('reducer says:', action.payload);
        console.log('success of reducer. Returned userData is', action.payload)
        return {
          ...state,
          loading: false,
          ...action.payload
        };

      case 'SAVE_FORM_DATA_FAILURE':
        // The request failed. It's done. So set loading to "false".
        // Save the error, so we can display it somewhere.
        // Since it failed, we don't have items to display anymore, so set `items` empty.
        //
        // This is all up to you and your app though:
        // maybe you want to keep the items around!
        // Do whatever seems right for your use case.
        return {
          ...state,
          loading: false,
          error: action.payload.error // FIX: should actually display the errors somewhere in the App
        };


    default:
      return state
  }
}




