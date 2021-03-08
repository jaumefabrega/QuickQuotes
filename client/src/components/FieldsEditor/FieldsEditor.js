import FormEditor from '../FormEditor/FormEditor'
import FormPreviewer from '../FormPreviewer/FormPreviewer'
import './FieldsEditor.css'

function FieldsEditor() {
  return (
    <>
    <div className="fields-editor">
      <FormEditor />
      <FormPreviewer />
    </div>
    </>
  );
}

export default FieldsEditor;
