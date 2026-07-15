import { Injector } from "@angular/core";
import { Router } from "@angular/router";

import { CustomProviderConfig, FsAnalyticsConfig } from "../interfaces";
import { Provider } from "./provider";


// A config-driven provider: injects an optional script, then forwards
// trackEvent / setUser / trackPage to the callbacks supplied in config. Calls
// made before the injected script is ready (per config.onReady()) are buffered
// and flushed once it becomes ready — same approach as KlaviyoProvider.
export class CustomProvider extends Provider {

  public readonly name: string;

  private _custom: CustomProviderConfig;
  private _script: HTMLScriptElement | null = null;
  private _ready = false;
  private _preload: Array<() => void> = [];
  // Set in destroy() so a gate promise that resolves after teardown can't fire a
  // buffered call against a torn-down tracker.
  private _destroyed = false;
  // Guards _flush() against re-entry: the gate can be async, so a second trigger
  // (new call, or script onload) must not start a concurrent drain and reorder
  // events. Concurrent triggers just wait for the in-flight drain to finish.
  private _flushing = false;

  public constructor(
    injector: Injector,
    config: FsAnalyticsConfig,
    router: Router,
    custom: CustomProviderConfig,
  ) {
    super(injector, config, router, custom);
    this._custom = custom;
    this.name = custom.name;
  }

  public init(): void {
    if (this._custom.scriptUrl) {
      this.addScript(this._custom.scriptUrl)
        .then(() => this._onReady())
        .catch(() => { /* script failed to load; stays not-ready, calls buffer */ });
    } else {
      // No script to wait on — ready immediately.
      this._onReady();
    }
  }

  public trackEvent(type: string, data?: any): void {
    this._run(() => this._custom.trackEvent?.(type, data));
  }

  public setUser(data: any): void {
    this._run(() => this._custom.setUser?.(data));
  }

  public trackPage(path: string): void {
    this._run(() => this._custom.trackPage?.(path));
  }

  public destroy(): void {
    super.destroy();

    this._destroyed = true;

    this._custom.onDestroy?.();

    // Remove the script tag we injected. Note: this cannot unbind listeners the
    // loaded tracker installed itself — that's what onDestroy() is for.
    if (this._script && this._script.parentNode) {
      this._script.parentNode.removeChild(this._script);
    }
    this._script = null;
    this._preload = [];
  }

  // Capture the injected <script> element so destroy() can remove it. addScript()
  // in the base class appends to <head> but doesn't return the node, so we grab
  // the last matching script by src.
  private _onReady(): void {
    if (this._custom.scriptUrl) {
      const scripts = document.head.querySelectorAll<HTMLScriptElement>(
        `script[src="${this._custom.scriptUrl}"]`,
      );
      this._script = scripts.length ? scripts[scripts.length - 1] : null;
    }

    this._ready = true;
    // Script has loaded; the onReady() gate (which may be async) decides whether
    // buffered calls can fire now or must keep waiting.
    void this._flush();
  }

  // Buffer every forwarded call, then try to drain. Buffering unconditionally (and
  // draining in order) keeps events in call order even though the gate is async —
  // an event never fires ahead of one enqueued before it.
  private _run(fn: () => void): void {
    this._preload.push(fn);
    void this._flush();
  }

  // Drain the buffer in FIFO order while the tracker is ready. Serialized via
  // _flushing so an async gate can't be evaluated by two concurrent drains and
  // reorder events; a trigger that arrives mid-drain is a no-op because the
  // in-flight drain already sees the newly-queued item.
  private async _flush(): Promise<void> {
    if (this._flushing) {
      return;
    }
    this._flushing = true;

    try {
      while (!this._destroyed && this._ready && this._preload.length) {
        // Re-check the gate each pass. onReady may return a boolean or a Promise;
        // await normalizes both (await true === true), so there's no branching on
        // the return type — an async handshake and a sync flag flow through the
        // same path. No onReady configured means always-ready.
        const gate = await Promise.resolve(this._custom.onReady?.() ?? true);

        // destroy() may have run while we awaited the gate; bail without firing.
        if (this._destroyed) {
          break;
        }

        // Not ready yet — stop and leave the queue intact. The next trigger (a new
        // forwarded call, or the script's onload via _onReady) re-runs the drain.
        // We deliberately don't self-reschedule here: with only an onReady() poll
        // and no completion signal, re-looping would busy-poll it until it flips.
        // For a one-shot async handshake, resolve onReady() from a flag the handshake
        // sets (see the async-handshake example in the playground config).
        if (!gate) {
          break;
        }

        // Shift one at a time so items enqueued during a fn() call are picked up
        // by this same drain, preserving order.
        const fn = this._preload.shift();
        fn?.();
      }
    } finally {
      this._flushing = false;
    }
  }
}
