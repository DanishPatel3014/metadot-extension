import React from 'react';

function authorize({ approve, request }) {
  return (
    <div>
      <button type="button" onClick={() => approve(request.id)}>Authorize</button>
    </div>
  );
}

export default authorize;
