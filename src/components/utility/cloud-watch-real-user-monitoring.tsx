// src/components/utility/cloudwatch-rum.tsx
'use client';

import { useEffect } from 'react';
import { clientEnv } from '@/clientEnv';

export function CloudWatchRealUserMonitoring() {
  useEffect(() => {
    const appMonitorId = clientEnv.NEXT_PUBLIC_CW_RUM_APP_MONITOR_ID;
    const identityPoolId = clientEnv.NEXT_PUBLIC_CW_RUM_IDENTITY_POOL_ID;
    const region = clientEnv.NEXT_PUBLIC_AWS_REGION;

    if (!appMonitorId || !identityPoolId) return;

    if (!region) {
      console.warn('Region is not set for CloudWatchRealUserMonitoring');
      return;
    }

    import('aws-rum-web').then(({ AwsRum }) => {
      try {
        new AwsRum(appMonitorId, '1.0.0', region, {
          sessionSampleRate: 1,
          identityPoolId,
          telemetries: ['performance', 'errors', 'http'],
        });
      } catch (err) {
        console.warn('[CloudWatch RUM] Failed to initialize:', err);
      }
    });
  }, []);

  return null;
}
