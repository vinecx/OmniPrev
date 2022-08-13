import React from 'react';

interface Props {
  condition: boolean;
}

const RenderIf: React.FC<Props> = ({ condition, children }) => {
  return condition ? <>{children}</> : null;
};

export default RenderIf;
