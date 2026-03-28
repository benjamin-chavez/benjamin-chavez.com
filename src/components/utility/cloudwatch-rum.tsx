// src/components/utility/cloudwatch-rum.tsx
'use client';

import { useEffect } from 'react';
import { clientEnv } from '@/clientEnv';

export function CloudWatchRUM() {
  useEffect(() => {
    const appMonitorId = clientEnv.NEXT_PUBLIC_CW_RUM_APP_MONITOR_ID;
    const identityPoolId = clientEnv.NEXT_PUBLIC_CW_RUM_IDENTITY_POOL_ID;
    const region = clientEnv.NEXT_PUBLIC_AWS_REGION;

    if (!appMonitorId || !identityPoolId) return;

    import('aws-rum-web').then(({ AwsRum }) => {
      try {
        new AwsRum(appMonitorId, '1.0.0', region, {
          sessionSampleRate: 1,
          identityPoolId,
          telemetries: ['performance', 'errors', 'http'],
        });
      } catch {
        // Silently fail — RUM is non-critical
        // TODO: Should probably log a warning though
      }
    });
  }, []);

  return null;
}
