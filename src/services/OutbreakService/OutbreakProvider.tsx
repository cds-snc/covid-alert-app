import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useI18nRef, I18n} from 'locale';
import {createCancellableCallbackPromise} from 'shared/cancellablePromise';
import {BackendInterface} from 'services/BackendService';
import {log} from 'shared/logging/config';

import {CheckInData} from 'shared/qr';

import {OutbreakService} from './OutbreakService';

export const createOutbreakService = async (i18n: I18n, backendService: BackendInterface) => {
  const service = await OutbreakService.sharedInstance(i18n, backendService);
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

  const deleteScannedPlace = useMemo(
    () => (locationId: string, timestamp: number) => {
      log.debug({message: 'deleteScannedPlace', payload: {locationId, timestamp}});
      outbreakService.removeCheckIn(locationId, timestamp);
    },
    [outbreakService],
  );

  const deleteAllScannedPlaces = useMemo(
    () => () => {
      // @todo
      log.debug({message: 'deleteAllScannedPlaces', payload: {}});
      outbreakService.clearCheckInHistory();
    },
    [outbreakService],
  );

  const removeCheckIn = useMemo(
    () => () => {
      outbreakService.removeCheckIn();
    },
    [outbreakService],
  );

  const ignoreAllOutbreaks = useMemo(
    () => () => {
      outbreakService.ignoreAllOutbreaks();
    },
    [outbreakService],
  );

  const ignoreOutbreak = useMemo(
    () => (outbreakId: string) => {
      outbreakService.ignoreOutbreak(outbreakId);
    },
    [outbreakService],
  );

  const ignoreAllOutbreaksFromHistory = useMemo(
    () => () => {
      outbreakService.ignoreAllOutbreaksFromHistory();
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
      ignoreAllOutbreaks,
      ignoreOutbreak,
      ignoreAllOutbreaksFromHistory,
      checkForOutbreaks,
      addCheckIn,
      removeCheckIn,
      checkInHistory,
      deleteAllScannedPlaces,
      deleteScannedPlace,
    }),
    [
      outbreakHistory,
      ignoreAllOutbreaks,
      ignoreOutbreak,
      ignoreAllOutbreaksFromHistory,
      checkForOutbreaks,
      addCheckIn,
      removeCheckIn,
      checkInHistory,
      deleteAllScannedPlaces,
      deleteScannedPlace,
    ],
  );
};
