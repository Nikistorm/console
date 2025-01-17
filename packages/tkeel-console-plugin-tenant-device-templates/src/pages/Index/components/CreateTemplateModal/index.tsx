import { Box, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';

import { CreateTemplateBasicModal } from '@tkeel/console-business-components';
import { Empty, Modal } from '@tkeel/console-components';
import { BoxTwoToneIcon } from '@tkeel/console-icons';
import { KeyDataType } from '@tkeel/console-request-hooks';
import useSaveAsOtherTemplateMutation, {
  RequestData as FormValues,
} from '@tkeel/console-request-hooks/src/hooks/mutations/useSaveAsOtherTemplateMutation';

import CustomTemplateButton from '../CustomTemplateButton';

type Props = {
  templateData: KeyDataType[];
  isOpen: boolean;
  onClose: () => unknown;
  handleCreateSuccess: (id: string) => void;
};

export default function CreateTemplateModal({
  isOpen,
  onClose,
  handleCreateSuccess,
  templateData,
}: Props) {
  const [isOpenSaveAs, setIsOpenSaveAs] = useState(false);
  const [templateId, setTemplateId] = useState('');
  const [defaultValues, setDefaultValues] = useState<FormValues>();

  const { mutate } = useSaveAsOtherTemplateMutation({
    id: templateId,
    onSuccess(data) {
      handleCreateSuccess(data?.data?.templateObject?.id ?? '');
    },
  });
  // eslint-disable-next-line react/no-unstable-nested-components
  function Card() {
    return (
      <Flex
        w="100%"
        minHeight="100px"
        p="20px 20px"
        bg="gray.50"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {templateData.map((r: KeyDataType) => {
          return (
            <Flex
              key={r.key}
              flexBasis="400px"
              alignItems="center"
              p="12px 0 13px 16px"
              mb="20px"
              bg="white"
              border="1px"
              borderColor="grayAlternatives.50"
              borderRadius="4px"
              cursor="pointer"
              onClick={() => {
                setIsOpenSaveAs(!isOpenSaveAs);
                setDefaultValues({ ...r, name: r.title });
                setTemplateId(r.id);
              }}
            >
              <BoxTwoToneIcon size="28px" />
              <Box ml="16px">
                <Text fontSize="14px" fontWeight="600" lineHeight="24px">
                  {r.title}
                </Text>
                <Text
                  fontSize="12px"
                  isTruncated
                  maxWidth="280px"
                  lineHeight="1.4"
                >
                  {r.description}
                </Text>
              </Box>
            </Flex>
          );
        })}
      </Flex>
    );
  }

  return (
    <Modal
      title={<Text fontSize="14px">创建模板</Text>}
      isOpen={isOpen}
      hasCancelButton={false}
      hasConfirmButton={false}
      onClose={onClose}
      modalBodyStyle={{ padding: '20px 20px', minWidth: '900px' }}
      width="900px"
      footer={null}
    >
      <Flex w="100%" justifyContent="space-between">
        <CustomTemplateButton onSuccess={handleCreateSuccess} />
      </Flex>
      <Text fontSize="14px" m="20px 0 12px 0" fontWeight="600">
        使用已有模板
      </Text>
      <Box>
        {templateData.length > 0 ? (
          <Card />
        ) : (
          <Empty
            description={<Box>暂无数据</Box>}
            styles={{
              wrapper: { height: '100%' },
              content: { marginTop: '10px' },
            }}
            title=""
          />
        )}

        {isOpenSaveAs && (
          <CreateTemplateBasicModal
            title="另存为模板"
            isOpen={isOpenSaveAs}
            onClose={() => {
              setIsOpenSaveAs(!isOpenSaveAs);
            }}
            defaultValues={defaultValues}
            // isConfirmButtonLoading={isLoading}
            isConfirmButtonLoading={false}
            onConfirm={(formValues: FormValues) => {
              if (formValues) {
                mutate({ data: formValues });
              }
              return null;
            }}
          />
        )}
      </Box>
    </Modal>
  );
}
