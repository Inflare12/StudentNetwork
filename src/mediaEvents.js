const DEFAULT_MEDIA_ERROR = 'The browser could not decode this video. Try another file format or a shorter clip.';

export function waitForMediaEvent(media, eventName, {
  timeoutMs = 10000,
  timeoutMessage = 'The video operation timed out. Try a shorter clip or a different format.'
} = {}) {
  if (!media?.addEventListener || !media?.removeEventListener) {
    return Promise.reject(new Error('This browser cannot monitor video playback events.'));
  }

  return new Promise((resolve, reject) => {
    let timer;
    const cleanup = () => {
      if (timer !== undefined) clearTimeout(timer);
      media.removeEventListener(eventName, onReady);
      media.removeEventListener('error', onError);
    };
    const onReady = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error(DEFAULT_MEDIA_ERROR)); };

    media.addEventListener(eventName, onReady, { once: true });
    media.addEventListener('error', onError, { once: true });
    timer = setTimeout(() => {
      cleanup();
      reject(new Error(timeoutMessage));
    }, Math.max(0, timeoutMs));
  });
}
