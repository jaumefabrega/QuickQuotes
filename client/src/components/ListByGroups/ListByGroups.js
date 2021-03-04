export default function ListByGroups({elements, groupIdentifier}) {
  const groups = {};
  elements.forEach(element => {
    const groupName = element[groupIdentifier];
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(element);
  });

  // const groupNames = elements.reduce((accm, el) => accm.includes(el[groupIdentifier]) ? accm : accm.concat(el[groupIdentifier]), []);
  return (
    <div>
      {/* {elements.map(field => <li key={field._id}>{field.name} ({field.type})</li>)} */}
      { Object.keys(groups).map((groupName, i) => {
        return (
          <div key={i}>
            <h3 style={{textTransform:'uppercase'}}>{groupName}</h3>
            <div>
              {groups[groupName].map((element, j) => <p key={j}>{element.name}</p>)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
