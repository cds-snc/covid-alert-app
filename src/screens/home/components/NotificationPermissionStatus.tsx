import React, {useMemo, useState, useEffect, useContext} from 'react';
import {checkNotifications, requestNotifications} from 'react-native-permissions';
import {createCancellableCallbackPromise} from 'shared/cancellablePromise';
import {AppState} from 'react-native';

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
  const [status, setStatus] = useState<NotificationPermissionStatusContextProps['status']>('granted');

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

  useEffect(() => {
    const {callable: onChange, cancelable: onCancel} = createCancellableCallbackPromise<Status>(
      () =>
        checkNotifications()
          .then(({status}) => status)
          .catch(() => 'unavailable'),
      setStatus,
    );
    AppState.addEventListener('change', onChange);
    return () => {
      onCancel();
      AppState.removeEventListener('change', onChange);
    };
  }, []);

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
