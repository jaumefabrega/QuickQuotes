export default function ListByGroups({elements, groupIdentifier}) {
  const groups = {};
  elements.forEach(element => {
    const groupName = element[groupIdentifier];
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(element);
  });

  // const groupNames = elements.reduce((accm, el) => accm.includes(el[groupIdentifier]) ? accm : accm.concat(el[groupIdentifier]), []);
  return (
    <>
      {/* {elements.map(field => <li key={field._id}>{field.name} ({field.type})</li>)} */}
      { Object.keys(groups).map((groupName, i) => {
        return (
          <div key={i} className="list-group">
            <h3 style={{textTransform:'uppercase'}}>{groupName}</h3>
            <ul>
              {groups[groupName].map((element, j) => <li key={j}>{element.name}</li>)}
            </ul>
          </div>
        )
      })}
    </>
  )
}
