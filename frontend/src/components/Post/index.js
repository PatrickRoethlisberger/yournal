import React from 'react';
import AuthenticatedComponent from '../../helpers/AuthenticatedComponent';

const Post = (props) => {
  const slug = props.match.params.slug;
  return <p></p>;
};

export default AuthenticatedComponent(Post);
