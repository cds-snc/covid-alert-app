import React, {useMemo, useState, useEffect, useContext} from 'react';
import {checkNotifications, requestNotifications} from 'react-native-permissions';
import {createCancellableCallbackPromise} from 'shared/cancellablePromise';

type Status = 'denied' | 'granted' | 'unavailable' | 'blocked';

interface NotificationPermissionStatusContextProps {
  status: Status;
  request: () => void;
}

const NotificationPermissionStatusContext = React.createContext<NotificationPermissionStatusContextProps>({} as any);

interface NotificationPermissionStatusProviderProps {
  children: React.ReactNode;
}

export const NotificationPermissionStatusProvider = ({children}: NotificationPermissionStatusProviderProps) => {
  const [status, setStatus] = useState<NotificationPermissionStatusContextProps['status']>('blocked');
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

  const {callable: request, cancelable} = useMemo(() => {
    return createCancellableCallbackPromise<Status>(
      () =>
        requestNotifications(['alert'])
          .then(({status}) => status)
          .catch(() => 'unavailable'),
      setStatus,
    );
  }, []);
  useEffect(() => {
    return cancelable;
  }, [cancelable]);

  const props = useMemo(() => request && {status, request}, [status, request]);

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
