import { useNavigate } from 'react-router-dom';
import {
  UseCustomMutationOptions,
  useMutation as useCustomMutation,
  useNoAuthRedirectPath,
} from '@tkeel/console-hooks';
import { createHandleNoAuth } from '@tkeel/console-utils';
import { merge } from 'lodash';

export default function useMutation<
  TApiData,
  TRequestParams = undefined,
  TRequestData = undefined
>(options: UseCustomMutationOptions<TApiData, TRequestParams, TRequestData>) {
  const navigate = useNavigate();
  const redirectPath = useNoAuthRedirectPath();
  const handleNoAuth = createHandleNoAuth({ navigate, redirectPath });
  const opts = merge({}, { extras: { handleNoAuth } }, options);

  return useCustomMutation<TApiData, TRequestParams, TRequestData>(opts);
}
