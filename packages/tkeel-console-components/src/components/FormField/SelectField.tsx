import { Center } from '@chakra-ui/react';
import { ReactNode } from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldPathValue,
  Path,
  RegisterOptions,
  UnpackNestedValue,
} from 'react-hook-form';

import { CheckFilledIcon } from '@tkeel/console-icons';

import FormControl, {
  FormControlProps,
} from '@/tkeel-console-components/components/FormControl';

import { Select } from '../Select';
import { SelectStyles } from '../Select/types';
import { fieldDefaultProps } from './default-props';

type Props<TFieldValues> = FormControlProps & {
  id: string;
  name: FieldPath<TFieldValues>;
  options?: { label: ReactNode; value?: string | number; disabled?: boolean }[];
  mode?: 'combobox' | 'multiple' | 'tags';
  showArrow?: boolean;
  allowClear?: boolean;
  loading?: boolean;
  defaultValue?: UnpackNestedValue<
    FieldPathValue<TFieldValues, Path<TFieldValues>>
  >;
  placeholder?: string;
  rules?: Omit<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  control: Control<TFieldValues>;
  selectStyles?: SelectStyles;
  disabled?: boolean;
};

const defaultProps = {
  ...fieldDefaultProps,
  placeholder: '请选择',
};

export default function SelectField<TFieldValues>({
  id,
  name,
  options,
  mode,
  showArrow = true,
  allowClear = false,
  loading = false,
  placeholder,
  defaultValue,
  rules,
  control,
  selectStyles,
  disabled = false,
  ...rest
}: Props<TFieldValues>) {
  return (
    <FormControl id={id} {...rest}>
      <Controller<TFieldValues, FieldPath<TFieldValues>>
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <Select
            disabled={disabled}
            mode={mode}
            placeholder={placeholder}
            showArrow={showArrow}
            allowClear={allowClear}
            loading={loading}
            dropdownStyle={{ boxShadow: 'none' }}
            options={options}
            onChange={onChange}
            value={value}
            menuItemSelectedIcon={
              <Center width="30px" height="32px">
                <CheckFilledIcon color="primary" />
              </Center>
            }
            styles={{ select: 'width: 100%;', ...selectStyles }}
          />
        )}
        defaultValue={defaultValue}
      />
    </FormControl>
  );
}

SelectField.defaultProps = defaultProps;
