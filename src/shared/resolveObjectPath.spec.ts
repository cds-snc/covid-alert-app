import {resolveObjectPath} from './resolveObjectPath';

describe('resolveObjectPath', () => {
  it('can pull object values using dot syntax', async () => {
    const myObj = {en: {content: {CTA: 'Get more information'}}};
    expect(resolveObjectPath('en.content.CTA', myObj)).toEqual('Get more information');
  });
});
