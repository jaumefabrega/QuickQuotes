import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import FormEditor from '../FormEditor/FormEditor'
import FormPreviewer from '../FormPreviewer/FormPreviewer'
import './FieldsEditor.css'

function FieldsEditor() {
  const isAuthenticated = useSelector(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return (<Redirect to='/login'  />)
  } else {
    return (
      <>
      <div className="fields-editor">
        <FormEditor />
        <FormPreviewer />
      </div>
      </>
    );
  }
}

export default FieldsEditor;
