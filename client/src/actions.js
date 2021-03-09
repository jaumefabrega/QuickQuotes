import api from './utils/apiClient';

export function setIsAuthenticated(isAuthenticated) {
  return {
    type: 'SET_IS_AUTHENTICATED',
    payload: {
      isAuthenticated
    }
  }
}

export function handleFieldChange({target}, fieldId) {
  return {
    type: 'HANDLE_FIELD_CHANGE',
    payload: {
      fieldId,
      target
    }
  }
}

export function handleFieldDelete(fieldId) {
  return {
    type: 'HANDLE_FIELD_DELETE',
    payload: {
      fieldId
    }
  }
}

export function handleFieldAdd() {
  return {
    type: 'HANDLE_FIELD_ADD',
  }
}

export function handleOptionAdd(fieldId) {
  return {
    type: 'HANDLE_OPTION_ADD',
    payload: {
      fieldId
    }
  }
}

export function handleOptionDelete(fieldId, optionId) {
  return {
    type: 'HANDLE_OPTION_DELETE',
    payload: {
      fieldId,
      optionId
    }
  }
}

export function handleOptionInputChange({target}, fieldId, optionId) {
  return {
    type: 'HANDLE_OPTION_INPUT_CHANGE',
    payload: {
      target,
      fieldId,
      optionId
    }
  }
}

export function handleFormSettingsChange({target}) {
  return {
    type: 'HANDLE_FORM_SETTINGS_CHANGE',
    payload: {
      target
    }
  }
}

export function toggleZenMode() {
  return {
    type: 'TOGGLE_ZEN_MODE'
  }
}

/* async START */

// FETCH USER DATA
export function fetchUserData() {
  return dispatch => {
    dispatch(fetchUserDataBegin());
    return api.getUserData()
      .then(res => {
        dispatch(fetchUserDataSuccess(res));
        return res;
      })
      .catch(error => {console.log('error', error);dispatch(fetchUserDataFailure(error))});
  };
}

export const fetchUserDataBegin = () => ({
  type: 'FETCH_USER_DATA_BEGIN'
});

export const fetchUserDataSuccess = userData => ({
  type: 'FETCH_USER_DATA_SUCCESS',
  payload: userData
});

export const fetchUserDataFailure = error => ({
  type: 'FETCH_USER_DATA_FAILURE',
  payload: { error }
});


// SAVE FORM DATA
export function saveFormData({updateType, payload}) {
  return dispatch => {
    dispatch(saveFormDataBegin());
    return api.saveForm({updateType, payload})
      .then(res => {
        dispatch(saveFormDataSuccess(res));
        return res;
      })
      .catch(error => {console.log('error', error);dispatch(saveFormDataFailure(error))});
  };
}

export const saveFormDataBegin = () => ({
  type: 'SAVE_FORM_DATA_BEGIN'
});

export const saveFormDataSuccess = userData => ({
  type: 'SAVE_FORM_DATA_SUCCESS',
  payload: userData
});

export const saveFormDataFailure = error => ({
  type: 'SAVE_FORM_DATA_FAILURE',
  payload: { error }
});




