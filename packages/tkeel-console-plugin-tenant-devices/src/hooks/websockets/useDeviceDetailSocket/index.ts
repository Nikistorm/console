import { useEffect, useMemo } from 'react';

import { useWebSocket } from '@tkeel/console-hooks';
import {
  AttributeValue,
  CommandValue,
  TelemetryValue,
} from '@tkeel/console-types';

import {
  ConnectInfo,
  RawData,
} from '@/tkeel-console-plugin-tenant-devices/hooks/queries/useDeviceDetailQuery/types';

type Message = {
  rawData: RawData;
  attributes: AttributeValue;
  connectInfo: ConnectInfo;
  telemetry: TelemetryValue;
  commands: CommandValue;
  [propName: string]: unknown;
};

type Props = {
  id: string;
};

function useDeviceDetailSocket({ id }: Props) {
  const options = useMemo(
    () => ({
      shouldReconnect: () => true,
      retryOnError: true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }),
    []
  );
  const { lastJsonMessage, sendJsonMessage, readyState } =
    useWebSocket<Message>({
      url: '',
      ...options,
    });
  useEffect(() => {
    sendJsonMessage({ id });
  }, [sendJsonMessage, id, readyState]);

  const rawData = lastJsonMessage?.rawData || {};
  const connectInfo = lastJsonMessage?.connectInfo;
  const attributes = lastJsonMessage?.attributes || {};
  const telemetry = lastJsonMessage?.telemetry || {};
  const commands = lastJsonMessage?.commands || {};
  return { rawData, connectInfo, attributes, telemetry, readyState, commands };
}

export default useDeviceDetailSocket;
