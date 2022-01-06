import useMutation from '@/tkeel-console-portal/hooks/useMutation';

interface RequestParams {
  grant_type: 'password' | 'authorization_code';
  username: string;
  password: string;
}

export interface ApiData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

const url = '/security/v1/oauth/token';
const method = 'GET';

export default function useOAuthTokenMutation() {
  return useMutation<ApiData, RequestParams>({
    url,
    method,
    extras: {
      isWithToken: false,
    },
  });
}
