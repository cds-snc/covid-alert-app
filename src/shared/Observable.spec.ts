import {Observable} from './Observable';

const handleChange = jest.fn();

describe('Observable', () => {
  it('handles mutiple calls and ends with the correct values', async () => {
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
