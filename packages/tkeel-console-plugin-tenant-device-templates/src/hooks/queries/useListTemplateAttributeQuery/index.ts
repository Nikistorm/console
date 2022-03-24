import { values } from 'lodash';

import { useQuery } from '@tkeel/console-hooks';
import { RequestResult } from '@tkeel/console-utils';

const method = 'GET';

type RequestParams = {
  page_num?: number;
  page_size?: number;
  order_by?: string;
  is_descending?: boolean;
  key_words?: string;
  id?: string;
};

export interface User {
  tenant_id: string;
  user_id: string;
  external_id?: string;
  username: string;
  email?: string;
  nick_name?: string;
  avatar?: string;
  created_at: string;
  roles: string[];
}

export interface UsefulData {
  name: string;
  id: string;
  type: string;
  description: string;
  last_time: number;
}
interface Telemetry {
  [propName: string]: UsefulData;
}
export interface ApiData {
  '@type': string;
  templateAttrObject: {
    configs: {
      telemetry: {
        define: {
          fields: Telemetry;
        };
      };
    };
  };
}

function getUsefulData(data: Telemetry): UsefulData[] {
  return values(data).map((item) => {
    return {
      name: item.name,
      id: item.id,
      type: item.type,
      description: item.description,
      last_time: item.last_time,
    };
  });
}

export default function useListTemplateAttributeQuery({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess?: (
    data: RequestResult<ApiData, undefined, RequestParams>
  ) => unknown;
}) {
  const url = `/tkeel-device/v1/templates/${id}/attribute`;

  const { data, ...rest } = useQuery<ApiData, undefined, RequestParams>({
    url,
    method,
    // data: {
    //   key_words: params?.key_words,
    //   page_num: params?.page_num,
    //   page_size: params?.page_size,
    // },
    reactQueryOptions: { onSuccess },
  });
  // console.log('data', data);

  const usefulData = getUsefulData(
    data?.templateAttrObject?.configs?.telemetry?.define?.fields as Telemetry
  );

  return { usefulData, data, ...rest };
}
