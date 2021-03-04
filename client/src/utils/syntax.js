const MAX_SUGGESTION_LENGTH = 1;

//----------- SENTENCE CLASS
// TODO: should reimplement de SentenceGraph as sth with a list of nodes and a list of edges (AND A START NODE, OFC). Maybe, to add the edges, it is good to first have reimplemented COMPONENT to have a name (or give it a name when we add it to a graph, for example)
class SentenceGraph {
  constructor(headComponent = null) {
    this.head = headComponent; // pointer to a component
  }

  validateString(strToSearch) {
    let currentComponent = this.head;
    let history = '';
    strToSearch = ' ' + strToSearch;

    const matches = [];
    for (const option of currentComponent.values) {
      for (const nextComponent of currentComponent.next) {
        exploreOption(option, history, nextComponent); // FINAL: NEED TO HANDLE IF THERE IS NO NEXT NODE... or not?
      }
    }

    // maybe I should return something like [true, suggestions[]] // [false]
    return matches.length > 0 ? [...new Set(matches.map(str => str.slice(strToSearch.length)))] : false; // no node returned true;

    function exploreOption(optionText, history, nextNode) {
      history += optionText ? ' ' + optionText : optionText;
      if (history.length >= strToSearch.length) {
        if (history.toUpperCase().startsWith(strToSearch.toUpperCase())) { // PERFORMANCE: I could remove the .toUpperCase() of strToSearch (already done in preprocessing)
          appendTillTooLong(history, nextNode); // FINAL: NEED TO HANDLE IF THERE IS NO NEXT NODE... or not?
        } else {
          return false;
        }
      } else {
        if (nextNode && strToSearch.toUpperCase().startsWith(history.toUpperCase())) { // this is needed for short-circuiting, right?  // PERFORMANCE: I could remove the .toUpperCase() of strToSearch (already done in preprocessing
          for (const option of nextNode.values) { // option is a string, like 'hello' or 'hola'
            for (const nextComponent of nextNode.next) { // FINAL: NEED TO HANDLE IF THERE IS NO NEXT NODE... or not?
              exploreOption(option, history, nextComponent);
            }
          }
        } else {
          return false; // WTF false, right? Because it means that this path is shorter than the actual strToSearch
        }
      }
    }

    function appendTillTooLong (history, nextNode) {
      if (nextNode === null || history.length >= strToSearch.length + MAX_SUGGESTION_LENGTH) {
        if (nextNode === null && history.length === strToSearch.length) history += '.'; // meeeeh adds consecutive suggestions like ["square meters", "square meters.", "kilometers", "kilometers."]
        matches.push(history);
        return true; // or return false?
      } else {
        for (const option of nextNode.values) {
          const newHistory = option.length ? history + ' ' + option : history +  option;
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
  constructor(values, next = null) {
    this.values = Array.isArray(values) ? values : [values]; // array of strings
    if (next === null) this.next = [null]; // TO REVIEW: should put null in array or not?
    else this.next = Array.isArray(next) ? next : [next]; // array of pointers to other components
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
            if (optionName !== 'name' && optionName !== '_id') {
              this.initialNumericVariables.push(`property ${optionName} of ${variable.name}`);
            }
          });
          break;
        default:
          // do nothing
      }
    });
    this.numericVariables = [...this.initialNumericVariables]; // Is mutated (in place) every time user defines a new variables (with 'This is...') or removes it

    const allNumbers = ["1", "1'1", "1%", "1234"];
    let cEND_OF_LINE = null; // TODO SOLVE issue with space before perior (should actually not add a "period" component, but do it in validate when next is null)


    // #A Sentece ASSIGNMENT (This is...)
    let cNewVarNameA = new Component(['abcd'], cEND_OF_LINE); // possible issue here: how do we deal with new varNames with spaces??
    let cThisIsHeadA = new Component(["This is"], cNewVarNameA);
    let sgThisIs = new SentenceGraph(cThisIsHeadA);

    // #B Sentence CURRENT VALUE SETTING (Take...)
    // TODO: add numbers?
    let cNumericVarsB = new Component(this.numericVariables, cEND_OF_LINE);
    let cTheB = new Component("the", cNumericVarsB);
    let cTakeHeadB = new Component("Take", [cTheB, cNumericVarsB]);
    let sgTake = new SentenceGraph(cTakeHeadB);

    // #C Sentence op. ADD (Add...)
    let cNumericVars2C = new Component(this.numericVariables, cEND_OF_LINE);
    let cThe2C = new Component("the", cNumericVars2C);
    let cItC = new Component("it", cEND_OF_LINE);
    let cToC = new Component("to", [cThe2C, cItC]);
    let cNumericVarsC = new Component(this.numericVariables, [cToC, cEND_OF_LINE]);
    let cTheC = new Component("the", cNumericVarsC);
    let cNumbersC = new Component(allNumbers, [cToC, cEND_OF_LINE]);
    let cAddHeadC = new Component("Add", [cTheC, cNumericVarsC, cNumbersC]);
    let sgAdd = new SentenceGraph(cAddHeadC);


    this.sentenceStructures = [sgThisIs, sgTake, sgAdd];
  }

  validateString(str) { // Gets all text, but validates (and gives suggestions for) only the last sentence.

    // Find the new variable names (defined with 'This is <whatever>.')
    const newVarNames = []; // find them with regexp
    const newVarNamesREGEX = /\.? ?This is (?:the )?([A-Z ]+)\./ig;
    let m;
    do {
        m = newVarNamesREGEX.exec(str);
        if (m) newVarNames.push(m[1].trim()); // 'trim' to allow typos like 'This is part B . Add 23'
    } while (m);

    // modify this.numericVariables array (in place!) to add the new var names (+ the initial ones)
    // This array is the same one that was used to create the sentenceStructures, that's why it needs to be in place
    this.numericVariables.splice(0, this.numericVariables.length);
    this.numericVariables.push(...this.initialNumericVariables, ...newVarNames);

    // if (str[str.length-1] === '.') {
    //   let allSentences = str.split('.');
    //   str = allSentences.pop();
    //   str = allSentences.pop()+'.';
    //   console.log('str to analyze is', str);
    // } else str = str.split('.').pop(); // maybe this should go in preProcess function??
    str = str.split('.').pop();
    str = this.preProcess(str);


    // const endedWithDot = str[str.length-1] === '.';
    // let allSentences = str.split('.');
    // str = endedWithDot ? allSentences[allSentences.length-2]+'.' : allSentences[allSentences.length-1];



    // Validate and find suggestions
    let matches = [];
    for (const sentenceStructure of this.sentenceStructures) {
      const sentenceMatches = sentenceStructure.validateString(str);
      if (sentenceMatches) matches = matches.concat(sentenceMatches);
    }
    return matches.length ? matches : false;
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
}

// const allVariables = [
//   {name: 'Square Meters', type: 'number'},
//   {name: 'kilometers', type: 'number'},
//   {name: 'number of trees', type: 'number'},
//   {name: 'Urgent', type: 'checkbox'},
//   {name: 'On weekend', type: 'checkbox'},
//   {name: 'Floor type', type: 'dropdown', options: [{displayName: 'Posh', cost:23}, {displayName: 'Medium', cost:10}, {displayName: 'Cheapest', cost:2}]},
// ];

// const syntax = new Syntax(allVariables);

// console.log(syntax.validateString("Add 234"));
// console.log(syntax.validateString("Add "));
// console.log(syntax.validateString("This is the Part A. Take "));
// console.log(syntax.validateString("Multiply by two. This is the square meters to inches. Add 3343. This is the Part B . This is x"));



export default Syntax;