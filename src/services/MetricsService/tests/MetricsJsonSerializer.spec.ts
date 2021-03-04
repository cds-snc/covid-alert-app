import {Metric} from '../Metric';
import {DefaultMetricsJsonSerializer} from '../MetricsJsonSerializer';

import {MetricFactory} from './MetricFactory';

describe('MetricsJsonSerializer', () => {
  it('can serialize metrics in JSON', async () => {
    const appVersion = '0.0.7';
    const appOs = 'iOS';
    const osVersion = '12.5';
    const manufacturer = 'samsung';
    const androidReleaseVersion = '11';
    const timestamp = 1611324024314;

    const sut = new DefaultMetricsJsonSerializer(appVersion, appOs, osVersion, manufacturer, androidReleaseVersion);

    const metric1 = new Metric(1611324021314, 'MyCustomMetric1', 'MyCustomRegion1', [
      ['MyPayloadKey1', 'MyPayloadValue1'],
    ]);
    const metric2 = new Metric(1611324022314, 'MyCustomMetric2', 'MyCustomRegion2', []);
    const metric3 = new Metric(1611324023314, 'MyCustomMetric3', 'MyCustomRegion3', [
      ['MyPayloadKey1', 'MyPayloadValue1'],
      ['MyPayloadKey2', 'MyPayloadValue2'],
      ['MyPayloadKey3', 'MyPayloadValue3'],
    ]);
    const result = sut.serializeToJson(timestamp, [metric1, metric2, metric3]);

    expect(result).toMatch(
      // eslint-disable-next-line max-len
      `{"metricstimestamp":1611324024314,"appversion":"0.0.7","appos":"iOS","osversion":"12.5","manufacturer":"samsung","androidreleaseversion":"11","payload":[{"identifier":"MyCustomMetric1","region":"MyCustomRegion1","timestamp":1611324021314,"MyPayloadKey1":"MyPayloadValue1"},{"identifier":"MyCustomMetric2","region":"MyCustomRegion2","timestamp":1611324022314},{"identifier":"MyCustomMetric3","region":"MyCustomRegion3","timestamp":1611324023314,"MyPayloadKey1":"MyPayloadValue1","MyPayloadKey2":"MyPayloadValue2","MyPayloadKey3":"MyPayloadValue3"}]}`,
    );
  });
});
