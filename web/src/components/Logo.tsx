import { Image } from '@chakra-ui/react';
import { uriToHttp } from '../utils';
import React, { useState } from 'react';

const BAD_SRCS: { [src: string]: boolean } = {};

interface LogoProps {
  size?: string
  uri?: string
};

export const Logo: React.FC<LogoProps> = ({ size, uri }) => {
  const [, refresh] = useState(0);

  if (uri) {
    const srcs = uriToHttp(uri);
    const src = srcs.find(s => !BAD_SRCS[s]);

    if (src) {
      return (
        <>
          <Image
            width={size ?? '24px'}
            height={size ?? '24px'}
            src={src}
            alt="img"
            onError={() => {
              if (src) BAD_SRCS[src] = true;
              refresh(i => i + 1);
            }}
          />
        </>
      );
    }
  };

  return <Image width={size ?? '24px'} height={size ?? '24px'} src={"./ETH.png"} alt="img"/>;
};
