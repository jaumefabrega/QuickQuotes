// export function setTodoDone (id, done) {
//   return ({
//     type: 'SET_TODO_DONE',
//     payload: { id, done }
//   })
// }

// export function addTodo(text) {
//   return {
//     type: 'ADD_TODO',
//     payload: {
//       text
//     }
//   }
// }
//////////////////////////////////////

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
