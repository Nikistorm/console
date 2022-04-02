import { Box, Flex, Text } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { Cell, Column } from 'react-table';

import {
  CreateTelemetryButton,
  DeleteTelemetryButton,
  TelemetryDetailButton,
  UpdateTelemetryButton,
} from '@tkeel/console-business-components';
import {
  Empty,
  MoreAction,
  PageHeaderToolbar,
  Table,
} from '@tkeel/console-components';
import { DuotoneTwoToneIcon } from '@tkeel/console-icons';
import { TelemetryItem } from '@tkeel/console-types';
import { formatDateTimeByTimestamp } from '@tkeel/console-utils';

import useListTemplateTelemetryQuery from '@/tkeel-console-plugin-tenant-device-templates/hooks/queries/useListTemplateTelemetryQuery';

function Index({ id, title }: { id: string; title: string }) {
  const [keywords, setKeyWords] = useState('');
  const { telemetryList, isLoading, refetch } = useListTemplateTelemetryQuery({
    id,
    onSuccess() {},
  });

  const columns: ReadonlyArray<Column<TelemetryItem>> = [
    {
      Header: '遥测名称',
      accessor: 'name',
      Cell: ({ value }: { value: string }) =>
        useMemo(
          () => (
            <Flex alignItems="center" justifyContent="space-between">
              <DuotoneTwoToneIcon />
              <Text color="gray.800" fontWeight="600" marginLeft="14px">
                {value}
              </Text>
            </Flex>
          ),
          [value]
        ),
    },
    {
      Header: '遥测ID',
      width: 100,
      accessor: 'id',
    },
    {
      Header: '数据类型',
      width: 110,
      accessor: 'type',
    },
    {
      Header: '时间戳',
      accessor: 'last_time',
      width: 200,
      Cell: ({ value }: { value: string }) =>
        useMemo(
          () => (
            <Box>
              {formatDateTimeByTimestamp({
                timestamp: value,
              })}
            </Box>
          ),
          [value]
        ),
    },
    {
      Header: '描述',
      width: 110,
      accessor: 'description',
    },

    {
      Header: '操作',
      width: 80,
      Cell: ({ row }: Cell<TelemetryItem>) =>
        useMemo(() => {
          const { original } = row;
          return (
            <MoreAction
              buttons={[
                <TelemetryDetailButton key="detail" defaultValues={original} />,
                <UpdateTelemetryButton
                  uid={id}
                  key="modify"
                  defaultValues={original}
                  refetch={refetch}
                />,
                <DeleteTelemetryButton
                  key="delete"
                  defaultValues={original}
                  uid={id}
                  refetch={refetch}
                />,
              ]}
            />
          );
        }, [row]),
    },
  ];

  return (
    <Flex flexDirection="column" height="100%">
      <PageHeaderToolbar
        name="遥测模板"
        hasSearchInput
        searchInputProps={{
          onSearch(value) {
            setKeyWords(value.trim());
          },
        }}
        styles={{
          title: { fontSize: '14px' },
          wrapper: { height: '48px', margin: '4px 0' },
        }}
        // eslint-disable-next-line react/no-unstable-nested-components
        buttons={useMemo(() => {
          return [
            <CreateTelemetryButton key="create" uid={id} refetch={refetch} />,
          ];
        }, [id, refetch])}
      />
      <Table
        styles={{
          wrapper: { flex: 1, overflow: 'hidden' },
          bodyTr: { fontSize: '12px' },
        }}
        scroll={{ y: '100%' }}
        columns={columns}
        data={(telemetryList || []).filter((item) => {
          return item.name.includes(keywords);
        })}
        isShowStripe
        isLoading={isLoading}
        hasPagination={false}
        empty={
          <Empty
            description={
              <Box>
                <Box display="inline" color="gray.600" fontWeight="500">
                  [{title}]
                </Box>
                暂无数据
              </Box>
            }
            styles={{
              wrapper: { height: '100%' },
              content: { marginTop: '10px' },
            }}
            title=""
          />
        }
      />
    </Flex>
  );
}

export default Index;
