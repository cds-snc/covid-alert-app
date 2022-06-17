export default function ExposureCheckSchedulerAdapter(exposureCheckSchedulerAPI: any) {
  return {
    ...exposureCheckSchedulerAPI,
    scheduleExposureCheck: async () => undefined,
    executeExposureCheck: async () => undefined,
    cancelExposureCheck: async () => undefined,
  };
}
