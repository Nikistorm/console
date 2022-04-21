import { useDisclosure } from '@chakra-ui/react';

import { IconButton } from '@tkeel/console-components/src/components/Button';
import { DevopsFilledIcon } from '@tkeel/console-icons';
import { DeviceItem } from '@tkeel/console-request-hooks';

import DeviceMappingModal from '../DeviceMappingModal';

export default function AutoMappingButton() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleConfirm = (device: DeviceItem) => {
    // eslint-disable-next-line no-console
    console.log(device);
  };
  return (
    <>
      <IconButton
        colorScheme="primary"
        style={{ padding: '0 12px' }}
        icon={<DevopsFilledIcon size="18px" color="white" />}
        onClick={onOpen}
      >
        自动映射
      </IconButton>
      <DeviceMappingModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}
