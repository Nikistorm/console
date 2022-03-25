import { Center } from '@chakra-ui/react';
import { merge } from 'lodash';
import RCSelect, { OptGroup, Option } from 'rc-select';

import { CheckFilledIcon } from '@tkeel/console-icons';

import { DEFAULT_PREFIX_CLS, DEFAULT_PROPS } from './defaults';
import SelectStyles from './SelectStyles';
import { SelectProps } from './types';

export default function Select(props: SelectProps) {
  const properties = merge({}, DEFAULT_PROPS, props);
  const { styles } = properties;

  return (
    <>
      <SelectStyles prefixCls={DEFAULT_PREFIX_CLS} styles={styles} />
      <RCSelect
        menuItemSelectedIcon={
          <Center width="30px" height="36px">
            <CheckFilledIcon color="primary" />
          </Center>
        }
        {...properties}
      />
    </>
  );
}

Select.OptGroup = OptGroup;
Select.Option = Option;
