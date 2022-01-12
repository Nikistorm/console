/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Select } from '@chakra-ui/react';

import { fieldDefaultProps } from './default-props';
import FormControl, { FormControlProps } from './FormControl';
import { getFocusStyle } from './utils';

type Value = string | number;

type Props = FormControlProps & {
  id: string;
  options: { value: Value; label: Value }[];
  value?: Value;
  placeholder?: string;
  schemas?: UseFormRegisterReturn;
};

const defaultProps = fieldDefaultProps;

function CustomFormControl({
  id,
  placeholder,
  schemas,
  options,
  value: defaultValue,
  ...rest
}: Props) {
  return (
    <FormControl id={id} {...rest}>
      <Select
        defaultValue={defaultValue}
        id={id}
        placeholder={placeholder}
        boxShadow="none!important"
        _focus={getFocusStyle(!!rest.error)}
        {...schemas}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

CustomFormControl.defaultProps = defaultProps;

export default CustomFormControl;
