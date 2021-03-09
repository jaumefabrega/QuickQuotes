import { v4 as uuidv4 } from 'uuid';
import auth from './utils/auth';

const EMPTY_USER_DATA = {isAuthenticated: auth.isAuthenticated(), loading:true, email: '', password:'', form: {fields:[], settings:{title:'', backgroundColor:'#f3f7f9', fieldsColor:'#ffffff'}, logicText:'', scriptText:''}}; // should actually NOT send password from server either

export default function reducer (state = EMPTY_USER_DATA, action) {

  switch (action.type) {
    case 'SET_IS_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated
      }

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

    case 'TOGGLE_ZEN_MODE':
      return {
        ...state,
        zenMode: !state.zenMode
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




