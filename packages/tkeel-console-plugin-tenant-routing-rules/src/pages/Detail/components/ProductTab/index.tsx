import { Flex, StyleProps, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  name: string;
  icon: ReactNode;
  disable?: boolean;
  onClick?: () => unknown;
  styles?: {
    wrapper?: StyleProps;
  };
};

export default function ProductTab({
  name,
  icon,
  disable = false,
  onClick,
  styles,
}: Props) {
  return (
    <Flex
      marginRight="8px"
      justifyContent="center"
      alignItems="center"
      width="200px"
      height="44px"
      border="1px"
      borderColor="gray.200"
      borderRadius="4px"
      backgroundColor="white"
      opacity={disable ? '0.5' : '1'}
      cursor={disable ? 'not-allowed' : 'pointer'}
      onClick={() => {
        if (!disable && onClick) {
          onClick();
        }
      }}
      {...styles?.wrapper}
    >
      {icon}
      <Text
        marginLeft="10px"
        color="grayAlternatives.500"
        fontSize="14px"
        fontWeight="500"
        lineHeight="24px"
      >
        {name}
      </Text>
    </Flex>
  );
}
