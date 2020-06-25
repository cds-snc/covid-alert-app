import React, {useMemo, useState, useEffect, useContext} from 'react';
import {checkNotifications, requestNotifications} from 'react-native-permissions';
import {createCancellableCallbackPromise} from 'shared/cancellablePromise';

type Status = 'denied' | 'granted' | 'unavailable' | 'blocked';

interface NotificationPermissionStatusContextProps {
  status: Status;
  request: () => void;
}

const noop: NotificationPermissionStatusContextProps['request'] = () => Promise.resolve('unavailable');

const NotificationPermissionStatusContext = React.createContext<NotificationPermissionStatusContextProps>({} as any);

interface NotificationPermissionStatusProviderProps {
  children: React.ReactNode;
}

export const NotificationPermissionStatusProvider = ({children}: NotificationPermissionStatusProviderProps) => {
  const [status, setStatus] = useState<NotificationPermissionStatusContextProps['status']>('granted');
  const [request, setRequest] = useState<NotificationPermissionStatusContextProps['request']>(noop);

  useEffect(() => {
    const {callable, cancelable} = createCancellableCallbackPromise<Status>(
      () =>
        checkNotifications()
          .then(({status}) => status)
          .catch(() => 'unavailable'),
      setStatus,
    );
    callable();
    return cancelable;
  }, []);

  useEffect(() => {
    const {callable, cancelable} = createCancellableCallbackPromise<Status>(
      () =>
        requestNotifications(['alert'])
          .then(({status}) => status)
          .catch(() => 'unavailable'),
      setStatus,
    );
    setRequest(() => callable);
    return cancelable;
  }, []);

  const props = useMemo(() => ({status, request}), [status, request]);

  return (
    <NotificationPermissionStatusContext.Provider value={props}>
      {children}
    </NotificationPermissionStatusContext.Provider>
  );
};

export const useNotificationPermissionStatus: () => [Status, () => void] = () => {
  const {status, request} = useContext(NotificationPermissionStatusContext);
  return [status, request];
};
