const html = `{{{htmlToWrite}}}`;
const txt = '{{{scriptText}}}';
function QQupdatePrice() {
  const allQQnonTextVarElements = document.querySelectorAll('#QQ-form .QQ-variable-not-text');
  const src = [];
  for (const element of allQQnonTextVarElements) {
    src.push(`let ${element.getAttribute('data-QQ-varname')} = ${element.getAttribute('data-QQ-vartype') === 'checkbox' ? element.checked : +element.value};`); // + sign in +element.value is needed to convert number zero to string '0'. Otherwise, when number inputs are empty we would have code lines like 'let QQ_kilometers = ;'. This would break the price update calculation when ANY of the fields are zero, even if the calculation does not depend on them
  }
  const FF = new Function (`function QQdoMagic() { ${src.join('\n')} function calc() { ${txt}}  const [whole, decimals] = calc().toString().split(".");document.getElementById('QQ-price-whole-digits').textContent=whole;if (decimals)document.getElementById('QQ-price-decimal-digits').textContent='.'+decimals; } setTimeout(() => QQdoMagic(), 200); document.getElementById('QQ-price').classList.add('animating'); setTimeout(() => document.getElementById('QQ-price').classList.remove('animating'), 1000);`);
  FF();
}
document.write(html);