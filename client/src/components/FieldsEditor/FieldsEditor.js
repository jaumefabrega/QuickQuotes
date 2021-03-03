import FormEditor from '../FormEditor/FormEditor'
import FormPreviewer from '../FormPreviewer/FormPreviewer'
import './FieldsEditor.css'
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";

function FieldsEditor() {

  return (
    <div className="fields-editor">
      <h1>link to home: <Link to="/">Home</Link></h1>
      <div style={{display:"flex", width:"100%"}}>
        <FormEditor />
        <FormPreviewer />
      </div>
      <h1><Link to="/logic">NEXT</Link></h1>
    </div>
  );
}

export default FieldsEditor;
