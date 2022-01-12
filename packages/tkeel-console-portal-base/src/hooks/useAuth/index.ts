import { RequestExtras } from '@tkeel/console-utils';

import useOAuthAuthenticate from '@/tkeel-console-portal-base/hooks/queries/useOAuthAuthenticate';

type Options = {
  extras?: RequestExtras;
};

export default function useAuth(options?: Options) {
  return useOAuthAuthenticate(options);
}
