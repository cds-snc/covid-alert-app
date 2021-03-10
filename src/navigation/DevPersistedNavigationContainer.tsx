import {InitialState, NavigationContainerRef, NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {InteractionManager} from 'react-native';
import {DefaultStorageService, StorageDirectory} from 'services/StorageService';
import {captureException} from 'shared/log';

interface DevPersistedNavigationContainerProps extends React.ComponentProps<typeof NavigationContainer> {}

function DevPersistedNavigationContainerImpl(
  {onStateChange, ...others}: DevPersistedNavigationContainerProps,
  forwardedRef: React.Ref<NavigationContainerRef>,
) {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<InitialState | undefined>();
  const persistInteractionRef = React.useRef<{cancel: () => void} | null>(null);
  const onStateChangeInternal = React.useCallback(
    state => {
      const persistState = async () => {
        persistInteractionRef.current = null;
        try {
          await DefaultStorageService.sharedInstance().save(
            StorageDirectory.DevPersistedNavigationContainerNavigationStateKey,
            JSON.stringify(state),
          );
        } catch (error) {
          captureException(`Failed to persist state.`, error);
        }
      };

      if (persistInteractionRef.current !== null) {
        persistInteractionRef.current.cancel();
      }

      if (state != null) {
        persistInteractionRef.current = InteractionManager.runAfterInteractions(persistState);
      }

      if (onStateChange != null) {
        onStateChange(state);
      }
    },
    [onStateChange],
  );

  React.useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const jsonString = await DefaultStorageService.sharedInstance().retrieve(
          StorageDirectory.DevPersistedNavigationContainerNavigationStateKey,
        );
        if (jsonString != null) {
          setInitialState(JSON.parse(jsonString));
        }
        setIsReady(true);
      } catch (error) {
        captureException(`Failed to load state.`, error);
        setIsReady(true);
      }
    };
    loadPersistedState();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      {...others}
      ref={forwardedRef}
      initialState={initialState}
      onStateChange={onStateChangeInternal}
    />
  );
}

const DevPersistedNavigationContainer = __DEV__
  ? React.forwardRef(DevPersistedNavigationContainerImpl)
  : NavigationContainer;

export default DevPersistedNavigationContainer;
