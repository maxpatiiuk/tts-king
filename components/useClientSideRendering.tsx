import React from 'react';

const useClientSideRendering = (): boolean => {
  const [isClientSide, setIsClientSide] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') setIsClientSide(true);
  }, [typeof window]);

  return isClientSide;
};

export default useClientSideRendering;
