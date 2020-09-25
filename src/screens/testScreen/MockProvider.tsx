import React, {useContext, useMemo, useState} from 'react';
import {ExposureNotificationServiceProvider} from 'services/ExposureNotificationService';
import {MOCK_SERVER} from 'env';

import {MockExposureNotification} from './MockExposureNotification';
import MockBackend from './MockBackend';

interface Mock {
  backend: MockBackend;
  exposureNotification: MockExposureNotification;
  enabled: boolean;
  setEnabled(enabled: boolean): void;
}

const MockContext = React.createContext<Mock | undefined>(undefined);

export interface MockProviderProps {
  children?: React.ReactElement;
}

export const MockProvider = ({children}: MockProviderProps) => {
  const [enabled, setEnabled] = useState(MOCK_SERVER);

  const mockBackend = useMemo(() => new MockBackend(), []);
  const mockExposureNotification = useMemo(() => new MockExposureNotification(), []);

  const value: Mock = useMemo(() => {
    return {
      backend: mockBackend,
      exposureNotification: mockExposureNotification,
      enabled,
      setEnabled: enabled => {
        setEnabled(enabled);
      },
    };
  }, [enabled, mockBackend, mockExposureNotification]);

  return (
    <MockContext.Provider value={value}>
      {enabled ? (
        <ExposureNotificationServiceProvider
          backendInterface={mockBackend}
          exposureNotification={mockExposureNotification}
        >
          {children}
        </ExposureNotificationServiceProvider>
      ) : (
        children || null
      )}
    </MockContext.Provider>
  );
};

export const useMock = () => {
  return useContext(MockContext)!!;
};
