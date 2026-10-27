# Website Security Hardening Review — 2026-10-27

## Scope
Static review of the public Heritage Auto Finance website repository. No production hosting settings or live response headers could be verified from this source review. This is not a penetration test or a certification.

## Changes proposed on this branch
Added a root-level `_headers` file with conservative baseline response headers for Netlify-style static hosting:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000`

These headers do not alter page layout or business content. They only take effect if the deployed host recognizes the `_headers` file (for example, Netlify with the correct publish directory). GitHub Pages does not apply Netlify's `_headers` convention. Confirm the active deployment provider and publish directory before treating this as live protection.

## CSP decision
A strict Content-Security-Policy was not added because the current site includes inline scripts/styles; a strict policy may break interactive features. CSP should be introduced only after inventorying inline scripts/styles and testing a report-only policy.

## Items still requiring verification
1. Check response headers on the actual production host after deployment.
2. Confirm HTTPS redirects and canonical domain behavior.
3. Confirm form/WhatsApp links accept only expected destinations and do not expose sensitive form data in URLs.
4. Review all inline scripts and dynamic DOM insertion for untrusted values.
5. Add a tested CSP after compatibility checks.
6. Protect GitHub and hosting account access with MFA and least privilege.

## Safety
This branch does not modify production. The CRM is a separate repository and is not mixed with this website change. No Firebase rules, CRM login, customer records, or CRM UI were changed.
