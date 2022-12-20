# ghost-cloudflare-cache-purge

A Cloudflare Worker to purge cached pages when a post is published or updated from the Ghost CMS administration pages.

## ❓ Why

With this worker you can run your Ghost blog with a `Cache Everything` Page Rule on Cloudflare and serve all content (including HTML pages) from Cloudflare's cache.

When a post is published or updated a Ghost webhook will trigger this worker to purge that page from the Cloudflare cache.

This project is a fork of 'milgradesec/ghost-cache-purge-worker'.
This fork supports multiple Ghost sites in different Cloudflare Zones ID. 
The only settings to push is the API token to allow this Worker to clean the content cache.

## 📙 Usage

### 🔑 Create an API token on Cloudflare.

Go to your Cloudflare account and create an API token with the `Zone.Cache Purge` permission.

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

Now add 2 webhooks in the bottom on the custom integration page : 

| NAME        | EVENT                  | URL                                                                    | 
| ----------- | ---------------------- | ---------------------------------------------------------------------- |
| Ping Worker | Post published         | <https://YOUR-WORKER-SUBDOMAIN.workers.dev/ZONE_ID/postPublished> | 
| Ping Worker | Published post updated | <https://YOUR-WORKER-SUBDOMAIN.workers.dev/ZONE_ID/postUpdated>  | 

When you publish a new post : The sitemap and the homepage are purged.
When you update a post : The sitemap and the post are purged.

### ⚙️ Configure Ghost caching 

By default Ghost doesn't send any caching header for the frontend pages and the content API.
You can overide this default behaviour by adding a JSON configuration block in the configuration file of Ghost :

```json
"caching": {
    "contentAPI": {
      "maxAge": 86400
    },
    "frontend": {
      "maxAge": 86400
    }
}
```

### ✅ Check that everything works 

Start by updating an existing post with a new content. Check that the content appears on the Webpage.
If you have any issue, you can enable the log with "Begin log Stream" button in the "log" tab.

## 📜 License

MIT License
