import { useGlobalProps } from '@tkeel/console-business-components';
import {
  UseCustomQueryOptions,
  useNoAuthRedirectPath,
  useQuery as useCustomQuery,
} from '@tkeel/console-hooks';
import { createHandleNoAuth } from '@tkeel/console-utils';
import { merge } from 'lodash';

export default function useQuery<
  TApiData,
  TRequestParams = undefined,
  TRequestBody = undefined
>(options: UseCustomQueryOptions<TApiData, TRequestParams, TRequestBody>) {
  const { navigate } = useGlobalProps();
  const basePath = process.env.BASE_PATH;
  const redirectPath = useNoAuthRedirectPath({ basePath });
  const handleNoAuth = createHandleNoAuth({ navigate, redirectPath });
  const opts = merge({}, { extras: { handleNoAuth } }, options);

  return useCustomQuery<TApiData, TRequestParams, TRequestBody>(opts);
}
