## Start Project

If you have docker installed, just run this command 🚀

```bash
yarn tryitonai
```

Or, just add the envs from the `docker-compose.yml` to `.env.local` and then

```bash
yarn serve
```

\*\* Vercel doesn't allow write access to file on `production`, so had to shift to a third party storage. you can curl this endpoint to see changes in prod.

```
https://api.jsonbin.io/v3/b/642fb904ebd26539d0a61a4d
```

But I'd rather suggest to try it out in the dev env.
