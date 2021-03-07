import { useHistory } from "react-router-dom";
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

  const history = useHistory();

  const saveLogic = () => {
    history.push('/');
  }

  const handleTextareaChange = (event) => {
    showPositionMarker(event);
    getSelectionArea(event);
    setLocalState(prevLocalState => {
      return {...prevLocalState, textareaText: event.target.value};
    });
  };

  const handleKeyEvent = (event) => {
    if (event.type === 'keydown' && !(event.keyCode === 8 || event.keyCode === 46)) {
      return
    }
    let { wasAllowed, suggestions,  wholeTextIsValid } = localState.Syntax.handleKeyEvent(event, localState.textareaText); // 'wholeTextIsValid' does not actually check the whole text, only that it ends with "this is the final quote".
    if (!wasAllowed) {
      event.preventDefault();
      clearTimeout(localState.forbiddenCharTimeoutId);
      setLocalState(prevLocalState => {
        return {...prevLocalState, typedForbiddenChar: true, forbiddenCharTimeoutId: setTimeout(() => setLocalState(prevLS => { return {...prevLS, typedForbiddenChar: false, wholeTextIsValid}}), 200)};
      });
    } else {
      suggestions = suggestions.map(suggestion => suggestion === '.' ? '. (dot)' : suggestion);
      const mrkr = document.querySelector('.input__marker');
      if (mrkr) { // mrkr cannot be added dynamically in React because it needs to be at the document level, not inside this component. UNLESS I also add it in location change, just like when i remove it... ahà..
        mrkr.innerHTML ='';
        suggestions.forEach(suggestion => {
          mrkr.innerHTML += '<p>'+suggestion+'</p>';
        });
      }
      setLocalState(prevLocalState => { return {...prevLocalState, autocompleteSuggestions: suggestions, wholeTextIsValid}});
    }
  };

  const fields = useSelector((state) => state.form.fields);
  const savedLogicText = useSelector(state => state.form.logicText);
  let [localState, setLocalState] = useState({...INITIAL_LOCAL_STATE, textareaText:savedLogicText});

  // INITIALIZE SYNTAX
  useEffect(() => {
    setLocalState(initialLocalState => {
      return {...initialLocalState, Syntax: new Syntax(fields)}
    });
  }, [fields]); // Second argument should actually be "[]", but react complains because technically it is dependant on fields (but fields should actually not change...)

  // RECALCULATE SUGGESTION BOX POSTIION
  useEffect(() => {});

  return (
      <div className="logic-editor">
      {/* <h1><Link to="/">Home</Link></h1> */}
        <div className="side-panel">
          <ListByGroups elements={fields} groupIdentifier='type' />
        </div>
        <div className="main-editor center-wrapper" style={{}}>
          <div>
            <div id="error_message" className={localState.typedForbiddenChar ? 'shown' : ''}></div>
            {/* <!-- 'POSITION: RELATIVE' FOR THE TEXTAREA IS OF VITAL IMPORTANCE--> */}
            <textarea id="the_area" onKeyPress={handleKeyEvent} onKeyDown={handleKeyEvent} value={localState.textareaText} onChange={handleTextareaChange} onClick={(event) => showPositionMarker(event)} onMouseUp={(event) => getSelectionArea(event)} className="get-position-textarea get-selection-textarea" placeholder="Start typing..."></textarea>
            <form onSubmit={saveLogic} className={localState.wholeTextIsValid ? "logic-editor-button-form" : "logic-editor-button-form disabled"}>
              {localState.wholeTextIsValid ? <input type="submit" value="SAVE" className="button primary" /> : <input type="button" value="SAVE" disabled className="button primary" />}
            </form>
          </div>
        </div>
        <div className="side-panel right">
          <h3>EXAMPLE</h3>
            <p><span style={{textDecoration:'underline'}}>Take</span> the number of trees. Multiply it by the property cost of type of tree job. Add 25. This is Part 1.</p>
            <p>Take the grass square meters. Multiply it by 10'3. Add 20%. If urgent is checked, add 100 to it. This is Part 2.</p>
            <p>Take Part 1. Add Part 2. Round it to the nearest 1. <span style={{textDecoration:'underline'}}>This is the Final Quote</span>.</p>
          <h3>ALL SUGGESTIONS</h3>
          <div className="all-suggestions">
            {localState.autocompleteSuggestions.map((suggestion, idx) => <p key={idx}>{suggestion}</p>)}
          </div>
        </div>
        <div className="logic-editor-footer">
        </div>
      </div>
  )
}
