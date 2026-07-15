/* =============================================================================
 * Generic mock tracker — stands in for a third-party analytics script that a
 * "script" custom provider would load (e.g. a marketing pixel). It just installs
 * a global (window.mockTracker) and logs. Used to demonstrate that a custom
 * provider can inject an external <script>, forward events to the global it
 * defines, and tear the script back down on destroy().
 * ============================================================================= */
(function () {
  if (window.mockTracker) { return; }

  function log(method, args) {
    // eslint-disable-next-line no-console
    console.log('[script provider → mockTracker.' + method + ']', args);
  }

  window.mockTracker = {
    id: 'mt_' + Math.random().toString(36).slice(2, 8),
    // Simulates an async init the real tracker does after its script loads — a
    // session/consent handshake with its backend. Not usable until this settles.
    // `started` is the flag the provider's ready() reads; `start()` returns a
    // Promise the ready() gate can await. Idempotent: repeated calls share one
    // promise so the handshake runs once.
    started: false,
    start: function () {
      if (!this._startPromise) {
        var self = this;
        this._startPromise = new Promise(function (resolve) {
          log('start', { handshake: 'pending' });
          setTimeout(function () {
            self.started = true;
            log('start', { handshake: 'complete' });
            resolve(true);
          }, 1500);
        });
      }
      return this._startPromise;
    },
    track: function (name, props) { log('track', { name: name, props: props }); },
    identify: function (data) { log('identify', data); },
    destroy: function () { log('destroy', { id: window.mockTracker.id }); window.mockTracker = null; },
  };

  // eslint-disable-next-line no-console
  console.log('[script provider] mock-tracker.js loaded, window.mockTracker ready (call start() to finish handshake)');
})();
