import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import Syntax from '../../utils/syntax';
import { showPositionMarker, getSelectionArea } from '../../utils/autcompleteBox';
import './LogicEditor.css'
import ListByGroups from '../ListByGroups/ListByGroups'


const INITIAL_LOCAL_STATE = {
  textareaText: '',
  autocompleteSuggestions: [],
  suggestionBoxPosition: [0, 0],
  wholeTextIsValid: false, //
  typedForbiddenChar: false,
  forbiddenCharTimeoutId: false,
  Syntax: null,
};

export default function LogicEditor() {
  const handleTextareaChange = (event) => {
    showPositionMarker(event);
    getSelectionArea(event);
    setLocalState(prevLocalState => {
      return {...prevLocalState, textareaText: event.target.value};
    });
  };

  const handleKeyEvent = (event) => {
    // TODO split logic into keypress and keydown!
    const key = event.keyCode || event.charCode;
    // SHOULD ACTUALLY BE DONE IN THE VALIDATESTRING OF THE SYNTAX. CAREFUL: this is done also in keypress
    if (key === 13 && !([".", "\n", "\r\n", "\r"].includes(localState.textareaText.slice(-1)))) { // TODO FIX not working for consecutive linebreaks. Anyway should probably be done in validate
      // if (key === 13 && !(textarea.value.match(/(\r?\n|\r)$|\.$/))) { // TODO FIX not working for consecutive linebreaks. Anyway should probably be done in validate
        console.log('stop it motherfucker');
        event.preventDefault();
        return true;
      }

      const new_char = String.fromCharCode(event.charCode);
      const current_text = localState.textareaText;
      const suggestions = localState.Syntax.validateString(current_text+new_char);
      if (!suggestions) {
        console.log('NOT ALLOWED');
        event.preventDefault();
        clearTimeout(localState.forbiddenCharTimeoutId);
        setLocalState(prevLocalState => {
          return {...prevLocalState, typedForbiddenChar: true, forbiddenCharTimeoutId: setTimeout(() => setLocalState(prevLS => { return {...prevLS, typedForbiddenChar: false}}), 200)};
        });
      } else {
        const mrkr = document.querySelector('.input__marker');
        if (mrkr) { // This cannot be done dynamically in React because it needs to be in the document level, not inside this component. UNLESS I also add it in location change, just like when i remove it... ahà..
          mrkr.innerHTML ='';
          suggestions.forEach(suggestion => {
            mrkr.innerHTML += '<p>'+suggestion+'</p>';
          });
        }
        setLocalState(prevLocalState => { return {...prevLocalState, autocompleteSuggestions: suggestions}});
      }
  };

  const fields = useSelector((state) => state.formFields);
  let [localState, setLocalState] = useState(INITIAL_LOCAL_STATE);

  // INITIALIZE SYNTAX
  useEffect(() => {
    setLocalState(initialLocalState => {
      return {...initialLocalState, Syntax: new Syntax(fields)}
    });
  }, [fields]); // Second argument should actually be "[]", but react complains because technically it is dependant on fields (but fields should actually not change...)

  // RECALCULATE SUGGESTION BOX POSTIION
  useEffect(() => {});

  return (
    <div>
      <h1>You are in the logic editor</h1>
      <h1><Link to="/">Home</Link></h1>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <div className="side-panel" style={{width:'25%'}}>
          <ListByGroups elements={fields} groupIdentifier='type' />
        </div>
        <div className="main-editor" style={{}}>
          <div id="error_message" className={localState.typedForbiddenChar ? 'shown' : ''}></div>
          {/* <!-- POSITION RELATIVE FOR THE TEXTAREA IS OF VITAL IMPORTANCE--> */}
          <textarea id="the_area" onKeyPress={handleKeyEvent} value={localState.textareaText} onChange={handleTextareaChange} onClick={(event) => showPositionMarker(event)} onMouseUp={(event) => getSelectionArea(event)} className="get-position-textarea get-selection-textarea" placeholder="Start typing..."></textarea>
        </div>
        <div className="side-panel" style={{width:'25%'}}>
          <h3>EXAMPLE</h3>
            <p>Take the number of trees. Multiply it by the property cost of type of tree job. Add 25. This is Part 1.</p>
            <p>Take the grass square meters. Multiply it by 10'3. Add 20%. If urgent is selected, add 100 to it. This is Part 2.</p>
            <p>Take Part 1. Add Part 2. Round it to the nearest 1. This is the Final Quote.</p>
          <h3>SUGGESTIONS</h3>
          <div>
            {localState.autocompleteSuggestions.map((suggestion, idx) => <p key={idx}>{suggestion}</p>)}
          </div>
        </div>
      </div>
    </div>
  )
}
