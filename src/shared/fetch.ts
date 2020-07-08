export function blobFetch(uri: string, method: 'GET' | 'POST', body?: Uint8Array): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status <= 299) {
        resolve(xhr.response);
      } else {
        reject(new Error(`${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = function() {
      // something went wrong
      reject(new Error('uriToBlob failed'));
    };
    // this helps us get a blob
    xhr.responseType = 'arraybuffer';

    xhr.open(method, uri, true);
    xhr.setRequestHeader('Content-Type', 'application/x-protobuf');
    xhr.send(body || null);
  });
}
