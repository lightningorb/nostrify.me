import { persisted } from 'svelte-local-storage-store';

// First param `preferences` is the local storage key.
// Second param is the initial value.
export const preferences = persisted('preferences', {
  notes: {},
  theme_name: 'light',
  global_hours: 1,
  public_key: '',
  private_key: '',
  relays: [
    'wss://nostr.lnorb.com',
    'wss://nostream-production-539a.up.railway.app',
    'wss://relay.damus.io',
    'wss://nostr-pub.wellorder.net',
    'wss://nostr.xpersona.net',
    'wss://nostr-relay.freedomnode.com',
    'wss://relay.nostrmoto.xyz',
    'wss://nostrrelay.com',
    'wss://nostr1.tunnelsats.com',
    'wss://nostr.rewardsbunny.com',
    'wss://nostr.lnprivate.network',
    'wss://node01.nostress.cc'
  ]
});
