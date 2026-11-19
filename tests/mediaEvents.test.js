import test from 'node:test';
import assert from 'node:assert/strict';
import { waitForMediaEvent } from '../src/mediaEvents.js';

test('resolves when the requested media event fires', async () => {
  const media = new EventTarget();
  const pending = waitForMediaEvent(media, 'loadedmetadata', { timeoutMs: 100 });
  media.dispatchEvent(new Event('loadedmetadata'));
  await pending;
});

test('rejects when the browser reports a media error', async () => {
  const media = new EventTarget();
  const pending = waitForMediaEvent(media, 'seeked', { timeoutMs: 100 });
  media.dispatchEvent(new Event('error'));
  await assert.rejects(pending, /could not decode this video/i);
});

test('rejects with a readable message when the media event never arrives', async () => {
  const media = new EventTarget();
  await assert.rejects(
    waitForMediaEvent(media, 'seeked', {
      timeoutMs: 5,
      timeoutMessage: 'The video frame timed out.'
    }),
    /video frame timed out/i
  );
});
