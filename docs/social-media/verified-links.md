# Verified links

Checked on 2026-10-14. Nothing in this folder may cite a link that is not
on this list.

| What | URL | Checked |
|---|---|---|
| Repository | https://github.com/zps-commits/menuflow | Public, `main`, 9 commits |
| Live demo | https://menuflow-six-gamma.vercel.app | HTTP 200 |

## How the demo was checked

Four routes, each at 1440 px and 390 px, against the deployed instance:

| Route | Status | Overflow | Console | axe (WCAG 2.1 A + AA) |
|---|---|---|---|---|
| `/` | 200 | 0 | clean | 0 violations |
| `/product/bruschetta` | 200 | 0 | clean | 0 violations |
| `/cart` | 200 | 0 | clean | 0 violations |
| a missing route | 404 as intended | 0 | clean | 0 violations |

## Not available

- No custom domain. The `vercel.app` URL is the only one.
- No analytics, so there are no traffic figures to quote. There are none.
