const TEST_TEXT = `Take the number of trees. Add 100 to it. Divide it by the property value of type of tree job. Subtract 99%. This is Part 1.

Take the grass square meters. Divide romano di merda by 10'3. Add 20%. If tHe urgent is checked, Add 100. This is Part 2.

Take Part 1. Add Part 2 to it. This is the Final Quote.`;

const operators = {
  'ADD': {sign: '+', separator: 'to'},
  'SUBTRACT': {sign: '-', separator: 'from'},
  'MULTIPLY': {sign: '*', separator: 'by'},
  'DIVIDE': {sign: '/', separator: 'by'},
};

// Gets a text explanation and throws an error if it breaks any rule of the syntax
function validateTextFormat(text) { // TODO add more format tests
  if (text[text.length-1] !== '.') throw new Error('text should end with dot');
  if (text.trim().slice(text.length - 24).toUpperCase() !== 'THIS IS THE FINAL QUOTE.') throw new Error ('final sentence should be \'This is the final quote\' (case insensitive)');
}

// Gets a text explanation and returns an array of its sentences
function getSentences (text) {
  text = text.replace(/\r?\n|\r/g, ''); // remove line breaks
  text = text.replace(/\. /g, '.'); // remove space after dot
  text = text.slice(0, text.length-1);
  const sentences = text.split('.');
  return sentences;
}

function identifySentenceType (sentence) {
  const sentenceUC = sentence.toUpperCase();
  if (sentenceUC.startsWith('TAKE')) {
    return 'TAKE';
  } else if (sentenceUC.startsWith('THIS IS')) {
    return 'THIS IS';
  } else if (sentenceUC.startsWith('MULTIPLY')) {
    return 'MULTIPLY';
  } else if (sentenceUC.startsWith('DIVIDE')) {
    return 'DIVIDE';
  } else if (sentenceUC.startsWith('ADD')) {
    return 'ADD';
  } else if (sentenceUC.startsWith('SUBTRACT')) {
    return 'SUBTRACT';
  } else if (sentenceUC.startsWith('IF')) {
    return 'IF';
  }
  throw new Error(`Parsing Error: cannot identify sentence type of sentence ${sentence}`);
}

function parseVariable (text) {
  let variable = text.toLowerCase().replace(/^the /, '').replace(/\'/g, '.');
  if (variable === 'it') return 'currentValue';
  const isNumber = /^[\d\.%]+$/.test(variable); // FIX dot and % should be only 0 or 1, not more. Use the pipe character or sth to solve it
  if (isNumber) return variable.includes('%') ? +parseFloat(variable)/100+'*currentValue' : parseFloat(variable); // FIX REVIEW review that this then is used correctly in the parseSentence
  if (variable.startsWith('property value of ')) variable = variable.slice(18);
  return 'QQ_'+variable.replace(/ /g, '_');
}

// Gets a text sentence and returns its corresponding line of code, ending with ";"
// variable names will always have the prefix QQ_ and the rest will always be lowercase (replacing spaces with underscores)
function parseSentence (sentence) {
  const sentenceType = identifySentenceType(sentence);
  switch (sentenceType) {
    case 'TAKE':
      const varName = parseVariable(sentence.slice(5));
      return `currentValue = ${varName};`;
    case 'THIS IS':
      const newVarName = parseVariable(sentence.slice(8));
      return `let ${newVarName} = currentValue;`;
    case 'ADD':
    case 'SUBTRACT':
    case 'DIVIDE':
    case 'MULTIPLY': // multiply x by y
      const operatorName = sentenceType;
      const operator = operators[operatorName];
      let swapVariables = false;

      // Special case 'Add/Subtract x', without a y. Behavior is different than the case 'Multiply/Divide by x' without a y.
      if (sentenceType === 'ADD' || sentenceType === 'SUBTRACT') {
        if (!sentence.includes(` ${operator.separator} `)) { // Sentence e.g. 'Add 25' (no y). Process: change to 'Add 25 to it' and, later, switch variables so that it becomes 'currentValue = currentValue; currentValue += 25'
          sentence += ` ${operator.separator} it`;
          swapVariables = true;
        }
      }

      sentence = sentence.slice(operatorName.length+1).toLowerCase();
      if (sentence.startsWith(operator.separator)) sentence = 'it ' + sentence; // it means that it is of the form 'Multiply by Y' (no x, so the following split would not work)
      let [x, y] = sentence.split(` ${operator.separator} `); // FIX: what if a variable name contains ' by ' (or ' from ' or ' to ')??!! FIX FIX
      x = parseVariable(x);
      y = parseVariable(y);
      if (swapVariables) [x, y] = [y, x];
      const cvInitializationCode = x !== 'currentValue' ? `currentValue = ${x};` : '';
      return cvInitializationCode + `currentValue ${operator.sign}= ${y};`;
    case 'IF':
      sentence = sentence.slice(3);
      let [conditionPart, operationPart] = sentence.split(', ');
      const operation = parseSentence(operationPart);
      const variableName = parseVariable(conditionPart.replace(/ is (not )?checked$/i, ''));
      const shouldNegateIt = / is not checked$/i.test(conditionPart);
      return `if (${ shouldNegateIt ? '!' : ''}${variableName}) { ${operation} }`;
    case 'TEST_TEST':
      return sentence;
    default:
      throw new Error (`Cannot parse a sentence of type ${sentenceType}`);
  }
}

// Gets a text explanation and returns its corresponding code
function parseLogic (text) {
  validateTextFormat(text);
  text = text.toUpperCase(); // because, in the logic editor, users can refer to the variables with different camel case each time, as they please
  const sentences = getSentences(text);

  const finalScript = ['let currentValue = 0;'];
  for (const sentence of sentences) {
    finalScript.push(parseSentence(sentence));
  }
  finalScript.push('return Math.round(QQ_final_quote*100)/100;');

  return finalScript.join('');
}

module.exports = {
  parseLogic
}