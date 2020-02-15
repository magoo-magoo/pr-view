<p align="center">
  <img src="./documentation/icon.svg" data-canonical-src="" width="10%" height="10%" >
</p>

# PRs View

`View GitHub pull requests`

## Built with

-   Next.JS
-   GraphQL
-   TailwindCSS
-   Typescript

## Development

### Install

```sh
npm ci
```

### Run

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Environment variables

Some env vars are required by the app to run.

```sh
export PR_VIEW_GITHUB_AUTHORIZE_BASE_URL="https://github.com/login/oauth"
export PR_VIEW_CLIENT_ID=XXXXXXXXXXXXXX
export PR_VIEW_CLIENT_SECRET=XXXXXXXXXXXXXXX
export PR_VIEW_REDIRECT_URL="https://pr.magoo.dev"
export PR_VIEW_SCOPE="read:org user:email"
```

## Deployment

Push master branch on github or run:

```sh
now
```
