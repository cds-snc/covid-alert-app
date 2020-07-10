import React, {useState, useEffect, useMemo, useContext} from 'react';
import {AccessibilityInfo} from 'react-native';

interface AccessibilityServiceContextProps {
  isScreenReaderEnabled: boolean;
}

const AccessibilityServiceContext = React.createContext<AccessibilityServiceContextProps>({} as any);

interface AccessibilityServiceProviderProps {
  children: React.ReactNode;
}

export const AccessibilityServiceProvider = ({children}: AccessibilityServiceProviderProps) => {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState<
    AccessibilityServiceContextProps['isScreenReaderEnabled']
  >(false);

  useEffect(() => {
    const handleScreenReaderToggled = (screenReaderEnabled: any) => {
      setScreenReaderEnabled(screenReaderEnabled);
    };
    const handler = AccessibilityInfo.addEventListener('screenReaderChanged', handleScreenReaderToggled);
    return handler;
  }, []);

  const props = useMemo(() => {
    return {isScreenReaderEnabled: screenReaderEnabled};
  }, [screenReaderEnabled]);

  return <AccessibilityServiceContext.Provider value={props}>{children}</AccessibilityServiceContext.Provider>;
};

export const useAccessibilityService = () => {
  return useContext(AccessibilityServiceContext);
};
