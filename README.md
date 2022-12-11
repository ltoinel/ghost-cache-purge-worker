# ghost-cloudflare-cache-purge

[![Deploy to Cloudflare Workers](https://github.com/milgradesec/ghost-cache-purge-worker/actions/workflows/deploy.yml/badge.svg)](https://github.com/milgradesec/ghost-cache-purge-worker/actions/workflows/deploy.yml)

A Cloudflare Worker to purge cached pages when a post is published or updated on Ghost CMS.

## ❓ Why

With this worker you can run your Ghost blog with a `Cache Everything` Page Rule on Cloudflare and serve all content (including HTML pages) from Cloudflare's cache.

When a post is published or updated a Ghost webhook will trigger this worker to purge that page from the Cloudflare cache.

This project is a fork of 'milgradesec/ghost-cache-purge-worker'.
This fork supports multiple Ghost blogs in different Cloudflare Zones ID with a simplify settings.

## 📙 Usage

### 🔑 Create an API token on Cloudflare.

Go to your Cloudflare account and create an API token with the `Zone.Cache Purge` permission.
Do no fix IP filtering, the IP used by Cloudflare for the workers is not clearly describe.

### 📦Install Wrangler

Install the Wrangler command line : 

```shell
npm install -g wrangler
```

Login for the first time with your Cloudflare account :

```shell
wrangler login
```

### 🚀 Deploy Worker

Set the `CF_API_TOKEN` secret with the API token previously created :

```shell
wrangler secret put CF_API_TOKEN
```

Publish the script to Cloudflare:

```shell
wrangler publish
```

### 🪝 Set up Ghost integration

Go to Ghost admin Settings-->Integrations and create a new custom integration named `Cloudflare Cache Purge`.

Now add 2 webhooks for events:

| NAME        | EVENT                  | URL                                                                    | LAST TRIGGERED |
| ----------- | ---------------------- | ---------------------------------------------------------------------- | -------------- |
| Ping Worker | Post published         | <https://YOUR-WORKER-SUBDOMAIN.workers.dev/ZONE_ID/postPublished> | Not triggered  |
| Ping Worker | Published post updated | <https://YOUR-WORKER-SUBDOMAIN.workers.dev/<ZONE_ID/postUpdated>  | Not triggered  |

<!-- ### ⚙️ Configure Ghost caching -->

### ✅ Check that everything works 

Start by updating an existing post with a new content. Check that the content appears on the Webpage.
If you have any issue, you can enable the log with "Begin log Stream" button in the "log" tab.

## 📜 License

MIT License
