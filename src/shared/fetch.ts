export function blobFetch(
  uri: string,
  method: 'GET' | 'POST',
  body?: Uint8Array,
): Promise<{buffer: ArrayBuffer; error: boolean}> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      const error = !(xhr.status >= 200 && xhr.status <= 299);
      resolve({error, buffer: xhr.response});
    };

    xhr.onerror = function() {
      // something went wrong
      reject(new Error('uriToBlob failed'));
    };
    // this helps us get a blob
    xhr.responseType = 'arraybuffer';

    xhr.open(method, uri, true);
    xhr.setRequestHeader('Content-Type', 'application/x-protobuf');
    xhr.setRequestHeader('Cache-Control', 'no-store');
    xhr.send(body || null);
  });
}
