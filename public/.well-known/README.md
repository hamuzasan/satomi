# Digital Asset Links Placeholder

`assetlinks.json` is intentionally not created yet.

It will be added later only if SATOMI uses the Trusted Web Activity fallback
path and the Android app identity is final.

Planned Android package name:

```text
com.satomi.finance
```

Do not guess `assetlinks.json` yet. The file must contain:

- the final Android package name
- the SHA-256 signing certificate fingerprint from the production signing key

Capacitor remote URL mode does not require this file unless SATOMI also ships a
TWA fallback.
