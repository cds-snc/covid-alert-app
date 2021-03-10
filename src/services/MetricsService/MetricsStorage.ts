import PQueue from 'p-queue';
import {StorageService, StorageDirectory} from 'services/StorageService';
import {log} from 'shared/logging/config';

import {Metric} from './Metric';

export interface MetricsStorageWriter {
  save(metrics: Metric[]): Promise<void>;
}

export interface MetricsStorageReader {
  retrieve(): Promise<Metric[]>;
}

export interface MetricsStorageCleaner {
  deleteUntilTimestamp(timestamp: number): Promise<void>;
}

export class DefaultMetricsStorage implements MetricsStorageWriter, MetricsStorageReader, MetricsStorageCleaner {
  private storageService: StorageService;
  private serialPromiseQueue: PQueue;

  constructor(storageService: StorageService) {
    this.storageService = storageService;
    this.serialPromiseQueue = new PQueue({concurrency: 1});
  }

  save(metrics: Metric[]): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      log.debug({
        category: 'debug',
        message: 'saving metrics',
        payload: metrics,
      });
      return this.storageService
        .retrieve(StorageDirectory.MetricsStorageKey)
        .then(existingMetrics => this.serializeNewMetrics(existingMetrics, metrics))
        .then(serializedMetrics => this.storageService.save(StorageDirectory.MetricsStorageKey, serializedMetrics));
    });
  }

  retrieve(): Promise<Metric[]> {
    return this.serialPromiseQueue.add(() => {
      return this.storageService.retrieve(StorageDirectory.MetricsStorageKey).then(serializedMetrics => {
        const metrics = serializedMetrics ? this.deserializeMetrics(serializedMetrics) : [];
        log.debug({
          category: 'debug',
          message: 'retrieving metrics',
          payload: metrics,
        });
        return metrics;
      });
    });
  }

  deleteUntilTimestamp(timestamp: number): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      return this.storageService
        .retrieve(StorageDirectory.MetricsStorageKey)
        .then(serializedMetrics => (serializedMetrics ? this.deserializeMetrics(serializedMetrics) : []))
        .then(metrics => metrics.filter(metric => metric.timestamp > timestamp))
        .then(filteredMetrics => this.serializeNewMetrics(null, filteredMetrics))
        .then(filteredMetrics => this.storageService.save(StorageDirectory.MetricsStorageKey, filteredMetrics));
    });
  }

  private serializeNewMetrics(existingSerializedMetrics: string | null, newMetrics: Metric[]): string {
    return newMetrics.reduce((acc, current) => {
      const serializedMetric = `${current.timestamp};${current.identifier};${current.region};${JSON.stringify(
        current.payload,
      )}`;
      if (acc === '') {
        return serializedMetric;
      } else {
        return acc.concat(`#${serializedMetric}`);
      }
    }, existingSerializedMetrics ?? '');
  }

  private deserializeMetrics(serializedMetrics: string): Metric[] {
    return serializedMetrics.split('#').map(metric => {
      const [timestamp, identifier, region, payload] = metric.split(';');
      const reconstructedPayload: [string, string][] = JSON.parse(payload);
      return new Metric(Number(timestamp), identifier, region, reconstructedPayload);
    });
  }
}
