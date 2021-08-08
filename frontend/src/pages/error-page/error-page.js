import React from 'react';
import { useSelector } from 'react-redux';


function ErrorPage() {
  const { error } = useSelector(state => state.general);

  return (
    <div>
      {error.status}
      {error.text}
    </div>
  );
}

export default ErrorPage;