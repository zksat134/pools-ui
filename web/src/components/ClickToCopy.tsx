import { CopyIcon } from '@chakra-ui/icons';
import { Tooltip, useClipboard } from '@chakra-ui/react';
import { useState } from 'react';

export const ClickToCopy: React.FC<{ value: string }> = ({ value }) => {
  const { onCopy } = useClipboard(value);
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  const displayTooltip = () => {
    onCopy();
    setIsTooltipDisplayed(true);
    setTimeout(() => {
      setIsTooltipDisplayed(false);
    }, 2000);
  };

  return (
    <Tooltip isOpen={isTooltipDisplayed} label={'Copied!'}>
      <CopyIcon onClick={displayTooltip} cursor="pointer" />
    </Tooltip>
  );
};
