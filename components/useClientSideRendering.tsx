import React from 'react';

const useClientSideRendering = (): boolean => {
  const [isClientSide, setIsClientSide] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof localStorage !== 'undefined') setIsClientSide(true);
  }, [typeof localStorage]);

  return isClientSide;
};

export default useClientSideRendering;
