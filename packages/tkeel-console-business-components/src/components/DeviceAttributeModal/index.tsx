import { Flex, Radio, RadioGroup, Stack, Switch, Text } from '@chakra-ui/react';
import { isArray, isObject } from 'lodash';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  AceEditor,
  FormControl,
  FormField,
  Modal,
  Select,
} from '@tkeel/console-components';

export type ReadWriteType = 'rw' | 'r' | 'w';
export type DeviceAttributeFormFields = {
  name: string;
  id: string;
  type: string;
  define: {
    default_value: string | number | unknown[] | object | boolean;
    rw: ReadWriteType;
  };
};
export const RW_LABELS = {
  rw: '读写',
  r: '只读',
  w: '只写',
};

function isJSON(str: string) {
  if (typeof str === 'string') {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

const { TextField } = FormField;

const TypeOptions = [
  { type: 'int', label: '整型' },
  { type: 'bool', label: '布尔型' },
  { type: 'float', label: '单精度浮点型' },
  { type: 'double', label: '双精度浮点型' },
  { type: 'string', label: '字符串' },
  { type: 'array', label: '数组' },
  { type: 'struct', label: '结构体' },
];
const DEFAULT_VALUES = {
  name: '',
  id: '',
  type: '',
  define: {
    default_value: '',
    rw: 'rw' as ReadWriteType,
  },
};

type Props = {
  isOpen: boolean;
  isEdit: boolean;
  isConfirmButtonLoading?: boolean;
  defaultValues?: DeviceAttributeFormFields;
  onClose: () => unknown;
  onSubmit: (values: DeviceAttributeFormFields) => void;
};

function DeviceAttributeModal({
  isOpen,
  isEdit,
  onClose,
  isConfirmButtonLoading,
  defaultValues = DEFAULT_VALUES,
  onSubmit,
}: Props) {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
    trigger,
    watch,
    reset,
    setError,
    resetField,
  } = useForm<DeviceAttributeFormFields>({
    defaultValues,
  });
  const watchFields = watch();
  const DEFAULT_VALUE_STR = 'define.default_value';
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleConfirm = async () => {
    const result = await trigger();
    if (result) {
      const values = getValues();
      // eslint-disable-next-line no-console
      const define = values?.define ?? {};
      const { type } = values;
      const defaultValue = define.default_value;
      const isJson = isJSON(defaultValue as string);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsedValue = isJson ? JSON.parse(defaultValue as string) : '';
      const isNumberType =
        ['int', 'float', 'double'].includes(type) &&
        !Number.isNaN(Number(defaultValue));
      const isArrayType = type === 'array' && isJson && isArray(parsedValue);
      const isObjectType = type === 'struct' && isJson && isObject(parsedValue);
      const isOtherType = ['string', 'bool'].includes(type);
      if (defaultValue) {
        if (isArrayType || isObjectType) {
          const valuesCopy = {
            ...values,
            define: {
              ...define,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              default_value: JSON.parse(defaultValue as string),
            },
          };
          onSubmit(valuesCopy);
        } else if (isNumberType) {
          const valuesCopy = {
            ...values,
            define: {
              ...define,
              default_value: Number(defaultValue),
            },
          };
          onSubmit(valuesCopy);
        } else if (isOtherType) {
          onSubmit(values);
        } else {
          setError(DEFAULT_VALUE_STR, {
            type: 'focus',
          });
        }
      }
    }
  };
  const getEditorValue = () => {
    try {
      return JSON.stringify(getValues('define.default_value'), null, '\t');
    } catch {
      return '';
    }
  };
  useEffect(() => {
    if (!isEdit) {
      reset();
    } else if (['array', 'struct'].includes(defaultValues.type)) {
      setValue(DEFAULT_VALUE_STR, getEditorValue());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, reset]);

  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}属性`}
      isOpen={isOpen}
      onClose={onClose}
      isConfirmButtonLoading={isConfirmButtonLoading}
      modalBodyStyle={{ padding: '20px 40px' }}
      width="600px"
      onConfirm={handleConfirm}
      footer={null}
    >
      <TextField
        label="属性名称"
        id="name"
        error={errors.name}
        registerReturn={register('name', {
          required: { value: true, message: '请填写属性名称' },
        })}
      />
      <TextField
        label="属性ID"
        id="id"
        error={errors.id}
        registerReturn={register('id', {
          required: { value: true, message: '请填写属性ID' },
        })}
      />
      <FormControl id="type" label="数据类型">
        <Select
          placeholder="请选择数据类型"
          id="type"
          defaultValue={getValues('type') || ''}
          style={{ width: '100%' }}
          {...register('type', {
            required: { value: true, message: '请选择数据类型' },
          })}
          onChange={(value: string) => {
            if (value) {
              setValue('type', value);
              resetField(DEFAULT_VALUE_STR);
            }
          }}
        >
          {TypeOptions.map((val) => {
            return (
              <Select.Option key={val.type} value={val.type}>
                {`${val.type} (${val.label})`}
              </Select.Option>
            );
          })}
        </Select>
        {errors.type && (
          <Text color="red.500" fontSize="sm" mt="8px">
            请选择数据类型
          </Text>
        )}
      </FormControl>
      <FormControl id="default_value" label="默认值">
        <>
          {!['bool', 'struct', 'array'].includes(getValues('type')) && (
            <TextField id="id" registerReturn={register(DEFAULT_VALUE_STR)} />
          )}
          {watchFields.type === 'bool' && (
            <Flex flexDir="row" align="center" justify="flex-start">
              <Switch
                colorScheme="primary"
                size="sm"
                {...register(DEFAULT_VALUE_STR)}
              />
              <Text color="gray.700" fontSize="14px" ml="10px">
                {watchFields.define.default_value === true ? 'true' : 'false'}
              </Text>
            </Flex>
          )}
          {['array', 'struct'].includes(getValues('type')) && (
            <AceEditor
              height="180px"
              readOnly={false}
              theme="light"
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              value={getValues(DEFAULT_VALUE_STR) as string}
              onChange={(value) => {
                setValue(DEFAULT_VALUE_STR, value);
              }}
            />
          )}
          {errors.define?.default_value && (
            <Text
              color="red.500"
              fontSize="sm"
              mt={
                ['array', 'struct'].includes(getValues('type')) ? '8px' : '0px'
              }
            >
              {`请输入${
                ['array', 'struct'].includes(getValues('type'))
                  ? 'JSON'
                  : '正确'
              }格式的数据`}
            </Text>
          )}
        </>
      </FormControl>

      <FormControl id="rw" label="读写类型">
        <RadioGroup
          defaultValue="rw"
          onChange={(value: ReadWriteType) => {
            setValue('define.rw', value);
          }}
        >
          <Stack direction="row" spacing="12px">
            {Object.entries(RW_LABELS).map((item) => (
              <Radio
                key={item[0]}
                size="sm"
                colorScheme="primary"
                value={item[0]}
              >
                {item[1]}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>
    </Modal>
  );
}

export default DeviceAttributeModal;
