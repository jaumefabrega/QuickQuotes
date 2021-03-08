const html = `{{{htmlToWrite}}}`;
const txt = '{{{scriptText}}}';
function QQupdatePrice() {
  const allQQnonTextVarElements = document.querySelectorAll('#QQ-form .QQ-variable-not-text');
  const src = [];
  for (const element of allQQnonTextVarElements) {
    src.push(`let ${element.getAttribute('data-QQ-varname')} = ${element.getAttribute('data-QQ-vartype') === 'checkbox' ? element.checked : +element.value};`); // + sign in +element.value is needed to convert number zero to string '0'. Otherwise, when number inputs are empty we would have code lines like 'let QQ_kilometers = ;'. This would break the price update calculation when ANY of the fields are zero, even if the calculation does not depend on them
  }
  const FF = new Function (`function QQdoMagic() { document.getElementById('QQ-submit-button').disabled=false;${src.join('\n')} function calc() { ${txt}}  const [whole, decimals] = calc().toString().split(".");document.getElementById('QQ-price-whole-digits').textContent=whole;document.getElementById('QQ-price-decimal-digits').textContent=decimals? '.'+ decimals: '.--'; } setTimeout(() => QQdoMagic(), 200); document.getElementById('QQ-price').classList.add('animating'); setTimeout(() => document.getElementById('QQ-price').classList.remove('animating'), 1000);`);
  FF();
}

function QQrequestService() {
  const formWrapper = document.getElementById("QQ-form-wrapper");
  formWrapper.innerHTML = '';
  formWrapper.innerHTML = '<p style="text-align:center">Your request has been sent.<p style="text-align:center">We will get back to you by email.</p><p style="text-align:center">Thank you.</p>';
}

document.write(html);
