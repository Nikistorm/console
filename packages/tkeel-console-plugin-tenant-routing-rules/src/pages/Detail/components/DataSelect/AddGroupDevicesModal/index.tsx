import { Box, Flex, Text } from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Modal, SearchInput } from '@tkeel/console-components';
import { BroomFilledIcon } from '@tkeel/console-icons';
import {
  DeviceItem,
  RequestDataCondition,
  useDeviceGroupQuery,
  useDeviceListQuery,
} from '@tkeel/console-request-hooks';
import { getTreeNodeData, TreeNodeData } from '@tkeel/console-utils';

import useAddDevicesMutation from '@/tkeel-console-plugin-tenant-routing-rules/hooks/mutations/useAddDevicesMutation';

// import useRuleDevicesIdArrayQuery from '@/tkeel-console-plugin-tenant-routing-rules/hooks/queries/useRuleDevicesIdArrayQuery';
import DeviceList from '../DeviceList';
import Empty from '../Empty';
import DeviceGroupTree from './DeviceGroupTree';
import SelectedDevices from './SelectedDevices';

export interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline';
  templateName: string;
  parentName: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => unknown;
  refetchData: () => unknown;
};

export default function AddGroupDevicesModal({
  isOpen,
  onClose,
  refetchData,
}: Props) {
  const [deviceGroupKeywords, setDeviceGroupKeywords] = useState('');
  const [treeNodeData, setTreeNodeData] = useState<TreeNodeData[]>([]);
  const [groupId, setGroupId] = useState('');
  const [deviceKeywords, setDeviceKeywords] = useState('');
  const [deviceGroupConditions, setDeviceGroupConditions] = useState<
    RequestDataCondition[]
  >([]);
  const [selectedDevices, setSelectedDevices] = useState<DeviceItem[]>([]);
  const [filteredSelectedDevices, setFilteredSelectedDevices] = useState<
    DeviceItem[]
  >([]);

  const { id: ruleId } = useParams();

  const { isLoading: isDeviceGroupLoading } = useDeviceGroupQuery({
    requestData: {
      condition: deviceGroupConditions,
    },
    onSuccess(data) {
      const groupTree = data?.data?.GroupTree ?? {};
      const groupTreeNodeData = getTreeNodeData({ data: groupTree });
      setTreeNodeData(groupTreeNodeData);
      const key = groupTreeNodeData[0]?.key;
      if (key) {
        setGroupId(key);
      }
    },
  });

  const { deviceList, isLoading: isDeviceListLoading } = useDeviceListQuery({
    requestData: {
      condition: [
        {
          field: 'sysField._spacePath',
          operator: '$wildcard',
          value: groupId,
        },
      ],
    },
    enabled: Boolean(groupId),
  });

  const clearState = () => {
    setGroupId('');
    setDeviceGroupConditions([]);
    setSelectedDevices([]);
    setDeviceKeywords('');
    setFilteredSelectedDevices([]);
  };

  const { mutate, isLoading } = useAddDevicesMutation({
    ruleId: ruleId || '',
    onSuccess() {
      onClose();
      clearState();
      // TODO 添加设备后有延迟，临时处理方案
      setTimeout(() => {
        refetchData();
      }, 500);
    },
  });

  const handleDeviceGroupSearch = () => {
    setDeviceGroupConditions([
      {
        field: 'group.name',
        operator: '$wildcard',
        value: deviceGroupKeywords,
      },
    ]);
  };

  const searchDevicesByKeywords = ({
    devices,
    keywords = deviceKeywords,
  }: {
    devices: DeviceItem[];
    keywords?: string;
  }) => {
    return devices.filter((device) =>
      (device.properties?.basicInfo?.name || '').includes(keywords)
    );
  };

  const handleDeviceSearch = () => {
    const newFilteredSelectedDevices = searchDevicesByKeywords({
      devices: selectedDevices,
    });

    setFilteredSelectedDevices(newFilteredSelectedDevices);
  };

  const handleSetSelectedDevices = (devices: DeviceItem[]) => {
    setSelectedDevices(devices);
    setFilteredSelectedDevices(searchDevicesByKeywords({ devices }));
  };

  const handleAllCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    let newSelectedDevices = [];
    if (checked) {
      const addDevices = deviceList.filter(
        ({ id }) => !selectedDevices.some((device) => device.id === id)
      );
      newSelectedDevices = [...selectedDevices, ...addDevices];
    } else {
      newSelectedDevices = selectedDevices.filter(
        ({ id }) => !deviceList.some((device) => device.id === id)
      );
    }
    handleSetSelectedDevices(newSelectedDevices);
  };

  const getNewDevices = ({
    devices,
    device,
    checked,
  }: {
    devices: DeviceItem[];
    device: DeviceItem;
    checked: boolean;
  }) => {
    return checked
      ? [...devices, device]
      : devices.filter((item) => item.id !== device.id);
  };

  const handleItemCheckBoxChange = ({
    checked,
    device,
  }: {
    checked: boolean;
    device: DeviceItem;
  }) => {
    const newSelectedDevices = getNewDevices({
      devices: selectedDevices,
      device,
      checked,
    });
    handleSetSelectedDevices(newSelectedDevices);
  };

  const handleConfirm = () => {
    const newDevices: Device[] = selectedDevices.map((device) => {
      const { id, properties } = device;
      const { basicInfo, connectInfo } = properties || {};
      const name = basicInfo?.name;
      const templateName = basicInfo?.templateName;
      const parentName = basicInfo?.parentName;
      // eslint-disable-next-line no-underscore-dangle
      const online = connectInfo?._online;
      return {
        id,
        name,
        status: online ? 'online' : 'offline',
        templateName,
        parentName,
      };
    });

    const addDeviceIds = newDevices.map((device) => device.id);

    mutate({
      data: {
        devices_ids: addDeviceIds,
      },
    });

    // const addDeviceIds = newDevices
    //   .filter((device) => !deviceIds.includes(device.id))
    //   .map((device) => device.id);

    // if (addDeviceIds.length > 0) {
    //   mutate({
    //     data: {
    //       devices_ids: addDeviceIds,
    //     },
    //   });
    // } else {
    //   onClose();
    //   clearState();
    // }
  };

  const titleStyle = {
    color: 'gray.800',
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: '600',
  };

  const inputGroupStyle = {
    marginTop: '8px',
    marginBottom: '12px',
    width: '100%',
  };

  const contentStyle = {
    flex: '1',
    padding: '12px 0',
    height: '463px',
    borderRadius: '4px',
    backgroundColor: 'gray.50',
  };

  return (
    <Modal
      title="添加设备"
      width="900px"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      isConfirmButtonLoading={isLoading}
      isConfirmButtonDisabled={selectedDevices.length === 0}
      modalBodyStyle={{ padding: '20px' }}
    >
      <Flex justifyContent="space-between">
        <Flex flexDirection="column" width="540px">
          <Text {...titleStyle}>设备组</Text>
          <SearchInput
            placeholder="支持搜索设备分组名称"
            value={deviceGroupKeywords}
            onChange={(value) => {
              setDeviceGroupKeywords(value);
            }}
            onSearch={handleDeviceGroupSearch}
            inputGroupStyle={inputGroupStyle}
          />
          <Flex justifyContent="space-between">
            <Box {...contentStyle}>
              <DeviceGroupTree
                isLoading={isDeviceGroupLoading}
                treeNodeData={treeNodeData}
                groupId={groupId}
                setGroupId={(key: string) => setGroupId(key)}
              />
            </Box>
            <Flex marginLeft="20px" {...contentStyle}>
              <DeviceList
                isLoading={isDeviceListLoading}
                empty={
                  groupId ? (
                    <Empty
                      text={
                        <Flex flexDirection="column" alignItems="center">
                          <Text>该设备组暂无设备请</Text>
                          <Text>重新选择</Text>
                        </Flex>
                      }
                      styles={{ wrapper: { width: '100%', height: '100%' } }}
                    />
                  ) : null
                }
                deviceList={deviceList}
                selectedDevices={selectedDevices}
                handleAllCheckBoxChange={handleAllCheckBoxChange}
                handleItemCheckBoxChange={handleItemCheckBoxChange}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDirection="column" width="300px">
          <Flex justifyContent="space-between" alignItems="center">
            <Text {...titleStyle}>已选择（{selectedDevices.length}）</Text>
            <Flex
              alignItems="center"
              cursor="pointer"
              onClick={() => {
                handleSetSelectedDevices([]);
                setDeviceKeywords('');
              }}
            >
              <BroomFilledIcon size="14px" color="grayAlternatives.300" />
              <Text
                marginLeft="5px"
                color="gray.700"
                fontSize="12px"
                lineHeight="18px"
              >
                清空
              </Text>
            </Flex>
          </Flex>
          <SearchInput
            placeholder="支持搜索设备名称"
            value={deviceKeywords}
            onChange={(value) => {
              setDeviceKeywords(value);
            }}
            onSearch={handleDeviceSearch}
            inputGroupStyle={inputGroupStyle}
          />
          <Box {...contentStyle}>
            <SelectedDevices
              groupId={groupId}
              devices={filteredSelectedDevices}
              removeDevice={(deviceId) => {
                handleSetSelectedDevices(
                  selectedDevices.filter((device) => device.id !== deviceId)
                );
              }}
              styles={{ wrapper: { height: '439px' } }}
            />
          </Box>
        </Flex>
      </Flex>
    </Modal>
  );
}
