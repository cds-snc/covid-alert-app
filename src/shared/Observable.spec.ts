import {MapObservable, Observable} from './Observable';

describe('Observable', () => {
  it('handles mutiple synchronous calls and ends with the correct values', async () => {
    const handleChange = jest.fn();
    const observableVal = new Observable('off');
    observableVal.observe(handleChange);

    const values = ['on', 'off', 'off', 'on', 'on', 'off'];

    values.forEach(val => {
      observableVal.set(val);
    });

    expect(handleChange).toHaveBeenCalledTimes(values.length);
    expect(observableVal.get()).toStrictEqual(values[values.length - 1]);
  });
});

describe('Map Observable', () => {
  it('handles mutiple synchronous calls and ends with the correct values', async () => {
    // test using mutliple observe handlers
    const handleChange1 = jest.fn();
    const handleChange2 = jest.fn();

    const mapObservableVal = new MapObservable({type: 'status', mode: 'off'});
    mapObservableVal.observe(handleChange1);
    mapObservableVal.observe(handleChange2);

    const values = ['on', 'off', 'off', 'on', 'on', 'off', 'on', 'on'];

    values.forEach(val => {
      mapObservableVal.append({mode: val});
    });

    expect(handleChange1).toHaveBeenCalledTimes(values.length);
    expect(handleChange2).toHaveBeenCalledTimes(values.length);
    expect(mapObservableVal.get().mode).toStrictEqual(values[values.length - 1]);
  });
});
