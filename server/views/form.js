const html = `{{{htmlToWrite}}}`;
const txt = '{{{scriptText}}}';
const QQuserId = '{{userId}}';

function QQupdatePrice() {
  const allQQnonTextVarElements = document.querySelectorAll('#QQ-form .QQ-variable-not-text');
  const src = [];
  for (const element of allQQnonTextVarElements) {
    src.push(`let ${element.getAttribute('data-QQ-varname')} = ${element.getAttribute('data-QQ-vartype') === 'checkbox' ? element.checked : +element.value};`); // + sign in +element.value is needed to convert number zero to string '0'. Otherwise, when number inputs are empty we would have code lines like 'let QQ_kilometers = ;'. This would break the price update calculation when ANY of the fields are zero, even if the calculation does not depend on them
  }
  const FF = new Function (`function QQdoMagic() { document.getElementById('QQ-submit-button').disabled=false;${src.join('\n')} function calc() { ${txt}}  const [whole, decimals] = calc().toString().split(".");document.getElementById('QQ-price-whole-digits').textContent=whole;document.getElementById('QQ-price-decimal-digits').textContent=decimals? '.'+ decimals: '.--'; } setTimeout(() => QQdoMagic(), 200); document.getElementById('QQ-price').classList.add('animating'); setTimeout(() => document.getElementById('QQ-price').classList.remove('animating'), 1000);`);
  FF();
}

function gatherAndSendLead() {
  const allFields = document.querySelectorAll('#QQ-form [data-qq-varname]');
  const payload = {};
  allFields.forEach(field => payload[field.getAttribute('data-qq-unsafe-varname')] = field.type === 'checkbox' ? field.checked : field.value);
  // const toSendBody = JSON.stringify({userId:'6047b3b26b80730be0d24108', analyticType:'lead',payload:{email:"qrqrqr"}});
  let url = new URL('http://localhost:3001/analytics');
  let params = {userId:QQuserId, analyticType:'lead',payload:JSON.stringify(payload)};
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  fetch(url, {
    method: 'GET',
    mode: 'no-cors', // no-cors, *cors, same-origin
    // headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
    // body: toSendBody
  });
  // console.log(toSendBody);

}

function QQrequestService() {
  gatherAndSendLead();
  const formWrapper = document.getElementById("QQ-form-wrapper");
  formWrapper.innerHTML = '';
  formWrapper.innerHTML = '<div id="submit-message"><p style="text-align:center">Your request has been sent.<p style="text-align:center">We will get back to you by email.</p><p style="text-align:center">Thank you.</p></div>';
}

document.write(html);
