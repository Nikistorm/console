import { Flex, HStack, StyleProps, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Tooltip } from '@tkeel/console-components';
import {
  AutoFilledIcon,
  ClickHouseFilledIcon,
  KafkaFilledIcon,
  MySqlFilledIcon,
  // ObjectStorageFilledIcon,
} from '@tkeel/console-icons';
import { plugin } from '@tkeel/console-utils';

import useCreateRuleTargetMutation from '@/tkeel-console-plugin-tenant-routing-rules/hooks/mutations/useCreateRuleTargetMutation';
import useRuleTargetsQuery from '@/tkeel-console-plugin-tenant-routing-rules/hooks/queries/useRuleTargetsQuery';

import ProductTab from '../ProductTab';
import TitleWrapper from '../TitleWrapper';
import RepublishInfoCard from './RepublishInfoCard';
import RepublishToKafkaModal, {
  FormValues as KafkaRepublishInfo,
} from './RepublishToKafkaModal';
import RepublishToMysqlModal from './RepublishToMysqlModal';

type Props = {
  routeType: string;
  status: number;
  deviceTemplateId: string;
  styles?: { wrapper: StyleProps };
};

export default function DataRepublish({
  styles,
  deviceTemplateId,
  routeType,
  status,
}: Props) {
  const [selectedProductId, setSelectedProductId] = useState('');

  const { id: ruleId } = useParams();
  const toast = plugin.getPortalToast();

  const { targets, refetch } = useRuleTargetsQuery(ruleId || '');
  const { mutate, isLoading } = useCreateRuleTargetMutation({
    ruleId: ruleId || '',
    onSuccess() {
      toast('添加转发成功', { status: 'success' });
      setSelectedProductId('');
      refetch();
    },
  });

  const handleSubmit = ({ address, topic }: KafkaRepublishInfo) => {
    if (ruleId) {
      mutate({
        data: {
          type: 1,
          host: address,
          value: topic,
        },
      });
    }
  };

  const iconColor = 'grayAlternatives.300';
  const baseProducts = [
    {
      id: 'kafka',
      icon: <KafkaFilledIcon size={22} color={iconColor} />,
      name: 'Kafka',
      disable: false,
    },
    // {
    //   id: 'objectStorage',
    //   icon: <ObjectStorageFilledIcon size={22} color={iconColor} />,
    //   name: '对象存储',
    //   disable: true,
    // },
  ];

  const upgradeProducts = [
    {
      id: 'mysql',
      icon: <MySqlFilledIcon size={38} color={iconColor} />,
      name: 'MySQL',
      disable: false,
    },
    {
      id: 'clickHouse',
      icon: <ClickHouseFilledIcon size={22} color={iconColor} />,
      name: 'ClickHouse',
      disable: false,
    },
  ];
  const products =
    routeType === 'msg' ? baseProducts : [...baseProducts, ...upgradeProducts];

  return (
    <Flex flexDirection="column" {...styles?.wrapper}>
      <TitleWrapper
        icon={<AutoFilledIcon color={iconColor} size="20px" />}
        title="选择转发"
        description="选择其它云产品转发处理之后的数据"
      />
      <Flex
        marginTop="20px"
        flexDirection="column"
        padding="20px"
        borderRadius="4px"
        backgroundColor="gray.100"
      >
        <Text color="grayAlternatives.500" fontSize="14px" lineHeight="24px">
          请添加相关产品转发数据
        </Text>
        <HStack marginTop="8px" spacing="8px">
          {products.map((product) => {
            const { id, icon, name, disable } = product;
            return (
              <Tooltip key={id} label={disable ? '敬请期待' : ''}>
                <ProductTab
                  name={name}
                  icon={icon}
                  disable={disable}
                  onClick={() => {
                    setSelectedProductId(id);
                  }}
                />
              </Tooltip>
            );
          })}
        </HStack>
        {targets.map((target) => (
          <RepublishInfoCard
            key={target.id}
            ruleId={ruleId || ''}
            target={target}
            deviceTemplateId={deviceTemplateId}
            status={status}
            refetchData={() => refetch()}
            styles={{ wrapper: { marginTop: '20px' } }}
          />
        ))}
      </Flex>
      {selectedProductId === 'kafka' && (
        <RepublishToKafkaModal
          isOpen
          isLoading={isLoading}
          onClose={() => setSelectedProductId('')}
          handleSubmit={handleSubmit}
        />
      )}
      {selectedProductId === 'mysql' && (
        <RepublishToMysqlModal
          modalKey="create"
          republishType={0}
          ruleId={ruleId || ''}
          deviceTemplateId={deviceTemplateId}
          isOpen
          onClose={() => setSelectedProductId('')}
          refetch={() => refetch()}
        />
      )}
      {selectedProductId === 'clickHouse' && (
        <RepublishToMysqlModal
          modalKey="create"
          republishType={1}
          ruleId={ruleId || ''}
          isOpen
          deviceTemplateId={deviceTemplateId}
          onClose={() => setSelectedProductId('')}
          refetch={() => refetch()}
        />
      )}
    </Flex>
  );
}
