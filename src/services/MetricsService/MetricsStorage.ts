import PQueue from 'p-queue';
import {log} from 'shared/logging/config';
import {KeyValueStore} from 'services/StorageService/KeyValueStore';

import {Metric} from './Metric';

const MetricsStorageKeyValueUniqueIdentifier = 'AE6AE306-523B-4D92-871E-9D13D5CA9B23';

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
  private keyValueStore: KeyValueStore;
  private serialPromiseQueue: PQueue;

  constructor(keyValueStore: KeyValueStore) {
    this.keyValueStore = keyValueStore;
    this.serialPromiseQueue = new PQueue({concurrency: 1});
  }

  save(metrics: Metric[]): Promise<void> {
    return this.serialPromiseQueue.add(() => {
      log.debug({
        category: 'debug',
        message: 'saving metrics',
        payload: metrics,
      });
      return this.keyValueStore
        .retrieve(MetricsStorageKeyValueUniqueIdentifier)
        .then(existingMetrics => this.serializeNewMetrics(existingMetrics, metrics))
        .then(serializedMetrics => this.keyValueStore.save(MetricsStorageKeyValueUniqueIdentifier, serializedMetrics));
    });
  }

  retrieve(): Promise<Metric[]> {
    return this.serialPromiseQueue.add(() => {
      return this.keyValueStore.retrieve(MetricsStorageKeyValueUniqueIdentifier).then(serializedMetrics => {
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
      return this.keyValueStore
        .retrieve(MetricsStorageKeyValueUniqueIdentifier)
        .then(serializedMetrics => (serializedMetrics ? this.deserializeMetrics(serializedMetrics) : []))
        .then(metrics => metrics.filter(metric => metric.timestamp > timestamp))
        .then(filteredMetrics => this.serializeNewMetrics(null, filteredMetrics))
        .then(filteredMetrics => this.keyValueStore.save(MetricsStorageKeyValueUniqueIdentifier, filteredMetrics));
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
