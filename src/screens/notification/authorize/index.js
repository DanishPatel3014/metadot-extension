import React from 'react';

function authorize(props) {
  return (
    <div>
      <button type="button" onClick={props.onclick}>Authorize</button>
    </div>
  );
}

export default authorize;
