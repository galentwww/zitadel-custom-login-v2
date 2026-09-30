# zitadel-custom-login

Custom ZITADEL Login UI (v2) for https://accounts.xifanacg.com.

Vendored from [zitadel/zitadel](https://github.com/zitadel/zitadel) at tag **v4.19.3**:

| Path | Upstream | License |
| --- | --- | --- |
| `apps/login` | `apps/login` (Next.js login app) | MIT |
| `packages/zitadel-client` | `packages/zitadel-client` | MIT |
| `packages/zitadel-proto` | `packages/zitadel-proto` (generated from `proto/`) | MIT |
| `proto` | `proto` | see `LICENSE.zitadel-AGPL` |

## Setup

Requires Node (see `.nvmrc`) and pnpm 10.

```sh
pnpm install
pnpm prepare:deps          # buf generate protos + build @zitadel/client
cp apps/login/.env.local.example apps/login/.env.local   # then fill in the PAT
pnpm dev                   # http://localhost:3000/ui/v2/login
```

## Connecting to ZITADEL

1. In the console, create a **service user** (e.g. `login-client`), give it the
   instance-level role **IAM Login Client**, create a **PAT**, and put it in
   `ZITADEL_SERVICE_USER_TOKEN` in `apps/login/.env.local`. Also set
   `ZITADEL_SESSION_COOKIE_SECRET` (`openssl rand -base64 32`).
2. Point ZITADEL at this login: *Instance Settings → Features → Login V2*
   → enable and set the base URI to where this app is hosted
   (e.g. `http://localhost:3000/ui/v2/login` for local testing, or your
   production URL). Can also be set per application.
   ⚠️ Changing it at instance level affects every login, including the
   console — prefer a per-app setting or a test app while developing.

## Testing a real OIDC flow locally

The instance has *Login V2 required* enabled at instance level, which overrides
any per-app Login V2 base URI, so ZITADEL always redirects to the built-in login.
To exercise the local login with a real auth request:

```sh
pnpm dev:auth-url            # defaults to the Headscale app
# -> http://localhost:3000/ui/v2/login/login?authRequest=V2_...
```

Open the printed URL in a browser. After login you'll be redirected to the
app's real callback. Note the `state` won't match what the app expects if the
flow wasn't started by the app itself.

## Upstream sync

To pull a newer version, sparse-clone the new tag and diff/merge
`apps/login`, `packages/`, `proto/` and `pnpm-lock.yaml` against this repo.
