// Emitted on FsAnalytics.activity$ so tooling (e.g. the playground) can observe
// what the analytics stack is doing, per provider. Not required for normal use —
// it's an introspection stream.
export interface ProviderActivity {
  // The provider this activity relates to, or null for service-level events
  // (e.g. an app call before fan-out).
  provider: string | null;
  // What happened: an app-level call, a per-provider receipt, or a lifecycle change.
  kind: 'app' | 'received' | 'init' | 'destroy';
  // For app/received: the analytics method or event type. For lifecycle: 'init'/'destroy'.
  action: string;
  data?: any;
}
