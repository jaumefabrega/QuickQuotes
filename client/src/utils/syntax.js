const MAX_SUGGESTION_LENGTH = 1;

//----------- SENTENCE CLASS
// TODO: should reimplement de SentenceGraph as sth with a list of nodes and a list of edges (AND A START NODE, OFC). Maybe, to add the edges, it is good to first have reimplemented COMPONENT to have a name (or give it a name when we add it to a graph, for example)
class SentenceGraph {
  constructor(headComponent = null) {
    this.head = headComponent; // pointer to a component
  }

  // Returns an array of the form [isValid, matches] (types are: [boolean, Array])
  validateString(strToSearch) {
    let currentComponent = this.head;
    let history = '';
    strToSearch = ' ' + strToSearch;
    let isValid = false; // ADDED
    const matches = [];
    for (const option of currentComponent.values) {
      for (const nextComponent of currentComponent.next) {
        exploreOption(currentComponent.skipPrecedingSpace ? option : ' '+option, history, nextComponent); // FINAL: NEED TO HANDLE IF THERE IS NO NEXT NODE... or not?
      }
    }

    // maybe I should return something like [true, suggestions[]] // [false]
    return [isValid, [...new Set(matches.map(str => str.slice(strToSearch.length)))]]; // used to be: return matches.length > 0 ? [...new Set(matches.map(str => str.slice(strToSearch.length)))] : false; // no node returned true;

    function exploreOption(optionText, history, nextNode) {
      history += optionText ? optionText : optionText; // BEFORE skipPrecedingSpace it was: history += optionText ? ' ' + optionText : optionText;
      if (history.length >= strToSearch.length) {
        if (history.toUpperCase().startsWith(strToSearch.toUpperCase())) { // PERFORMANCE: I could remove the .toUpperCase() of strToSearch (already done in preprocessing)
          isValid = true;
          appendTillTooLong(history, nextNode); // FINAL: NEED TO HANDLE IF THERE IS NO NEXT NODE... or not?
        } else {
          return false;
        }
      } else {
        if (nextNode && strToSearch.toUpperCase().startsWith(history.toUpperCase())) { // this is needed for short-circuiting, right?  // PERFORMANCE: I could remove the .toUpperCase() of strToSearch (already done in preprocessing
          for (const option of nextNode.values) { // option is a string, like 'hello' or 'hola'
            for (const nextComponent of nextNode.next) { // FINAL: NEED TO HANDLE IF THERE IS NO NEXT NODE... or not?
              exploreOption(nextNode.skipPrecedingSpace ? option : ' '+option, history, nextComponent);
            }
          }
        } else {
          return false; // WTF false, right? Because it means that this path is shorter than the actual strToSearch
        }
      }
    }

    function appendTillTooLong (history, nextNode) {
      if (nextNode === null || history.length >= strToSearch.length + MAX_SUGGESTION_LENGTH) { // USED TO BE: if (nextNode === null || history.length >= strToSearch.length + MAX_SUGGESTION_LENGTH) {
        // if (nextNode === null && history.length === strToSearch.length) history += '.'; // meeeeh adds consecutive suggestions like ["square meters", "square meters.", "kilometers", "kilometers."]
        matches.push(history);
        return true; // or return false?
      } else {
        for (const option of nextNode.values) {
          const newHistory = nextNode.skipPrecedingSpace ? history + option : history + ' ' + option;
          for (const nextComponent of nextNode.next) {
            appendTillTooLong(newHistory, nextComponent); // FINAL: NEED TO HANDLE IF THERE IS NO NEXT NODE
          }
        }
        return true;
      }
    }
  }
}

//----------- COMPONENT CLASS
class Component {
  constructor(values, next = null, skipPrecedingSpace = false) {
    this.values = Array.isArray(values) ? values : [values]; // array of strings
    if (next === null) this.next = [null]; // TO REVIEW: should put null in array or not?
    else this.next = Array.isArray(next) ? next : [next]; // array of pointers to other components
    this.skipPrecedingSpace = skipPrecedingSpace;
  }
}

//----------- SYNTAX CLASS
class Syntax {
  constructor(initialVariables) {
    // TODO deep copy initialVariables
    this.initialNumericVariables = [];
    this.checkboxVariables = [];
    initialVariables.forEach(variable => {
      switch (variable.type) {
        case 'number':
          this.initialNumericVariables.push(variable.name);
          break;
        case 'text':
          break;
        case 'checkbox':
          this.checkboxVariables.push(variable.name);
          break;
        case 'dropdown':
          if (variable.options.length) Object.keys(variable.options[0]).forEach(optionName => {
            if (optionName !== 'name' && optionName !== 'id') {
              this.initialNumericVariables.push(`property ${optionName} of ${variable.name}`);
            }
          });
          break;
        default:
          // do nothing
      }
    });
    this.numericVariables = [...this.initialNumericVariables]; // Is mutated (in place) every time user defines a new variables (with 'This is...') or removes it

    const allNumberSufixes = ["1", "'1", "%"];
    const cEND_OF_LINE = new Component(".", null, true);; // TODO SOLVE issue with space before perior (should actually not add a "period" component, but do it in validate when next is null)


    // #A Sentece ASSIGNMENT (This is...)
    const cNewVarNameA = new Component(['a','abcd'], cEND_OF_LINE); // possible issue here: how do we deal with new varNames with spaces??
    const cThisIsHeadA = new Component(["This is"], cNewVarNameA);
    const sgThisIs = new SentenceGraph(cThisIsHeadA);

    // #B Sentence CURRENT VALUE SETTING (Take...)
    // TODO: add numbers?
    const cNumericVarsB = new Component(this.numericVariables, cEND_OF_LINE);
    const cTheB = new Component("the", cNumericVarsB);
    const cTakeHeadB = new Component("Take", [cTheB, cNumericVarsB]);
    const sgTake = new SentenceGraph(cTakeHeadB);

    // #C Sentence op. ADD (Add...)
    const cNumericVars2C = new Component(this.numericVariables, cEND_OF_LINE);
    const cThe2C = new Component("the", cNumericVars2C);
    const cItC = new Component("it", cEND_OF_LINE);
    const cToC = new Component("to", [cThe2C, cItC]);
    const cNumericVarsC = new Component(this.numericVariables, [cToC, cEND_OF_LINE]);
    const cTheC = new Component("the", cNumericVarsC);

    const cNumbersCSufixes = new Component(allNumberSufixes, [cToC, cEND_OF_LINE], true);
    const cNumbersC = new Component("1", [cNumbersCSufixes, cToC, cEND_OF_LINE]);

    const cAddHeadC = new Component("Add", [cTheC, cNumericVarsC, cNumbersC]);
    const sgAdd = new SentenceGraph(cAddHeadC);

    // #D Sentence op. SUBTRACT (Subtract...)
    const cNumericVars2D = new Component(this.numericVariables, cEND_OF_LINE);
    const cThe2D = new Component("the", cNumericVars2D);
    const cItD = new Component("it", cEND_OF_LINE);
    const cFromD = new Component("from", [cThe2D, cItD]);
    const cNumericVarsD = new Component(this.numericVariables, [cFromD, cEND_OF_LINE]);
    const cTheD = new Component("the", cNumericVarsD);

    const cNumbersDSufixes = new Component(allNumberSufixes, [cFromD, cEND_OF_LINE], true);
    const cNumbersD = new Component("1", [cNumbersDSufixes, cFromD, cEND_OF_LINE]);

    const cSubtractHeadD = new Component("Subtract", [cTheD, cNumericVarsD, cNumbersD]);
    const sgSubtract = new SentenceGraph(cSubtractHeadD);

    // #E Sentence op. MULTIPLY+DIVIDE (Multiply... / Divide...)
    const cNumericVars2E = new Component(this.numericVariables, cEND_OF_LINE);
    const cThe2E = new Component("the", cNumericVars2E);

    const cNumbersESufixes = new Component(allNumberSufixes, cEND_OF_LINE, true);
    const cNumbersE = new Component("1", [cNumbersESufixes, cEND_OF_LINE]);

    const cByE = new Component("by", [cNumbersE, cThe2E, cNumericVars2E]);

    const cNumericVarsE = new Component(this.numericVariables, cByE);
    const cTheE = new Component("the", cNumericVarsE);

    const cItE = new Component("it", cByE);

    const cMultiplyHeadE = new Component(["Multiply", "Divide"], [cItE, cTheE, cNumericVarsE]);
    const sgMultiply = new SentenceGraph(cMultiplyHeadE);


    // #F Sentence op. IF x IS CHECKED (If x is checked...)
    const cNumbersFSufixes = new Component(allNumberSufixes, cEND_OF_LINE, true);
    const cNumbersF = new Component("1", [cNumbersFSufixes, cEND_OF_LINE]);
    const cOperationsF = new Component(["add", "subtract", "multiply by", "divide by"], cNumbersF);
    const cCheckedF = new Component("checked,", cOperationsF);
    const cNotF = new Component("not", cCheckedF);

    const cIsF = new Component("is", [cCheckedF, cNotF]);

    const cCheckboxVarsF = new Component(this.checkboxVariables, cIsF);

    const cIfHeadF = new Component("If", [cCheckboxVarsF]);
    const sgIf = new SentenceGraph(cIfHeadF);


    this.sentenceStructures = [sgTake, sgThisIs, sgIf, sgAdd, sgSubtract, sgMultiply];
  }

  validateString(text) { // Gets all text, but validates (and gives suggestions for) only the last sentence.

    // Find the new variable names (defined with 'This is <whatever>.')
    const newVarNames = []; // find them with regexp
    const newVarNamesREGEX = /\.? ?This is (?:the )?([A-Z ]+)\./ig;
    let m;
    do {
        m = newVarNamesREGEX.exec(text);
        if (m) newVarNames.push(m[1].trim()); // 'trim' to allow typos like 'This is part B . Add 23' (extra space between the B and the dot)
    } while (m);

    // modify this.numericVariables array (in place!) to add the new var names (+ the initial ones)
    // This array is the same one that was used to create the sentenceStructures, that's why it needs to be in place
    this.numericVariables.splice(0, this.numericVariables.length);
    this.numericVariables.push(...this.initialNumericVariables, ...newVarNames);

    const endedWithDot = text[text.length-1] === '.';
    let allSentences = text.split('.');



    let str = endedWithDot ? allSentences[allSentences.length-2]+'.' : allSentences[allSentences.length-1];
    const notProcessedStr = str;

    str = this.preProcess(str);

    // Validate and find suggestions
    let isValid = false;
    let matches = [];

    for (const sentenceStructure of this.sentenceStructures) {
      const [thisIsValid, thisMatches] = sentenceStructure.validateString(str);
      matches = matches.concat(thisMatches);
      isValid = isValid || thisIsValid;
    }
    return [isValid, matches, notProcessedStr.trim().toUpperCase() === 'THIS IS THE FINAL QUOTE.' ? true : false]; // USED TO BE: return matches.length ? matches : false;
  }

  preProcess(str) {
    // TODO .toUpperCase should probably go here, so that we do it once and for all -->> PENDING: remove it from the validateString method
    if (str[0] === ' ') str = str.substr(1); // Removing leading space
    str = str.replace(/\r?\n|\r/g, '');
    str = str.toUpperCase();
    str = this.handleThisIs(str);
    str = this.handleNumbers(str);
    return str;
  }

  handleThisIs(str) {
    // Note the space after 'A-Z'
    return str.replace(/^This is [A-Z ]+(\.?)/ig,"This is a$1"); // Maybe should actually only replace the one that is currently being edited (most of the time, the last sentence)
  }

  handleNumbers(str) {
    return str.replace(/[0-9]+/ig,"1"); // Maybe replace only the actual numbers, to allow for varNames to have (but not start with) numbers --> Actually, not sure it needs to be changed here
  }

  // TODO calculate the actual 'wasAllowed' --> need to modify validate string, for this
  handleKeyEvent(event, currentText) {
    const key = event.keyCode || event.charCode;

    if (event.target.selectionStart !== event.target.value.length || event.target.selectionStart !== event.target.selectionEnd) { // Caret is not positioned at the end
      console.log('CARET must be positioned at the end');
      return {wasAllowed: false, suggestions: null};
    }

    if (key === 13 && !([".", "\n", "\r\n", "\r"].includes(currentText.slice(-1)))) { // TODO FIX not working for consecutive linebreaks. Anyway should probably be done in validate
      // if (key === 13 && !(textarea.value.match(/(\r?\n|\r)$|\.$/))) { // TODO FIX not working for consecutive linebreaks. Anyway should probably be done in validate
        console.log('This action is not allowed');
        return {wasAllowed: false, suggestions: null};
    }

    const new_char = String.fromCharCode(event.charCode);
    const possibleNewText = event.type === 'keydown' ? currentText.slice(0, -1) : currentText + new_char;
    const [isValid, suggestions, wholeTextIsValid] = this.validateString(possibleNewText);
    return {wasAllowed: isValid, suggestions: suggestions, wholeTextIsValid};
  }
}

export default Syntax;