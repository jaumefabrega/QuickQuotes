export default function ListByGroups({elements, groupIdentifier, textareaText}) {
  const upperCaseTextareaText = textareaText.toUpperCase();
  const groups = {};
  elements.forEach(element => {
    const groupName = element[groupIdentifier];
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push({...element, isUsed: upperCaseTextareaText.includes(element.name.toUpperCase())});
  });

  return (
    <>
      { Object.keys(groups).map((groupName, i) => {
        return (
          <div key={i} className="list-group">
            <h3 style={{textTransform:'uppercase'}}>{groupName}</h3>
            <ul>
              {groups[groupName].map((element, j) => <li key={j}><span className={element.isUsed ? "used-field" : ""}>{element.name}</span></li>)}
            </ul>
          </div>
        )
      })}
    </>
  )
}
