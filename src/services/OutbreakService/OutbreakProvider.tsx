import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useI18nRef, I18n} from 'locale';
import {createCancellableCallbackPromise} from 'shared/cancellablePromise';
import {BackendInterface} from 'services/BackendService';

import {CheckInData} from '../../shared/qr';

import {OutbreakService} from './OutbreakService';

export const createOutbreakService = async (i18n: I18n, backendService: BackendInterface) => {
  const service = new OutbreakService(i18n, backendService);
  await service.init();
  return service;
};

interface OutbreakProviderProps {
  backendService: BackendInterface;
  outbreakService?: OutbreakService;
  children?: React.ReactElement;
}

export const OutbreakContext = React.createContext<OutbreakService | undefined>(undefined);

export const OutbreakProvider = ({backendService, children}: OutbreakProviderProps) => {
  const [outbreakService, setOutbreakService] = useState<OutbreakService>();
  const i18n = useI18nRef();
  useEffect(() => {
    const {callable, cancelable} = createCancellableCallbackPromise(
      () => createOutbreakService(i18n, backendService),
      setOutbreakService,
    );
    callable();
    return cancelable;
  }, [backendService, i18n]);

  return <OutbreakContext.Provider value={outbreakService}>{outbreakService && children}</OutbreakContext.Provider>;
};

export const useOutbreakService = () => {
  const outbreakService = useContext(OutbreakContext)!;
  const [checkInHistory, addCheckInInternal] = useState(outbreakService.checkInHistory.get());
  const [outbreakHistory, setOutbreakHistoryInternal] = useState(outbreakService.outbreakHistory.get());

  const checkForOutbreaks = useMemo(() => outbreakService.checkForOutbreaks, [outbreakService.checkForOutbreaks]);
  const addCheckIn = useMemo(
    () => (newCheckIn: CheckInData) => {
      outbreakService.addCheckIn(newCheckIn);
    },
    [outbreakService],
  );

  const removeCheckIn = useMemo(
    () => () => {
      outbreakService.removeCheckIn();
    },
    [outbreakService],
  );

  const clearOutbreakHistory = useMemo(
    () => () => {
      outbreakService.clearOutbreakHistory();
    },
    [outbreakService],
  );

  useEffect(() => outbreakService.checkInHistory.observe(addCheckInInternal), [outbreakService.checkInHistory]);
  useEffect(() => outbreakService.outbreakHistory.observe(setOutbreakHistoryInternal), [
    outbreakService.outbreakHistory,
  ]);

  return useMemo(
    () => ({
      outbreakHistory,
      clearOutbreakHistory,
      checkForOutbreaks,
      addCheckIn,
      removeCheckIn,
      checkInHistory,
    }),
    [outbreakHistory, clearOutbreakHistory, checkForOutbreaks, addCheckIn, removeCheckIn, checkInHistory],
  );
};
