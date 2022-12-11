export default {
  async fetch(request, env) {
    return handleRequest(request, env)
  },
};

/**
 * Get a request from Ghost CMS Webhook.
 * 
 * @param {*} request The HTTP request Object
 * @param {*} env The environment variables 
 * @returns An HTTP Response
 */
async function handleRequest(request, env) {
  const { headers } = request
  const contentType = headers.get("content-type") || ""
  const url = new URL(request.url)
  const apiToken = env.CF_API_TOKEN

  // The URL is formed of ZONE_ID/ACTION
  const path = url.pathname.split("/")
  const zoneID = path[1]
  const action = path[2]

  // Only POST HTTP are allowed.
  if (request.method !== "POST") {
    return new Response(`Method ${request.method} not allowed.`, { status: 405 })
  }

  // Only JSON POST are allowed
  if (!contentType.includes("application/json")) {
    return new Response("Bad Request", { status: 400 })
  }

  // We parse the body request from the WebHook
  const body = await parseWebhookBody(request)
  const postURL = new URL(body.post.current.url)
  var urlToPurge = "";

  // If a new post has been published on Ghost CMS.
  if (action == "postPublished") {
    const rootURL = postURL.protocol + '//' + postURL.host
    urlToPurge = rootURL
  }

  // If a post has been updated.
  else if (action == "postUpdated") {
    urlToPurge = postURL
  }

  // Unkown request action
  else {
    return new Response("Bad Request", { status: 400 })
  }

  // We purge the url in Cloudflare Cache
  const resp = await purgeURL(urlToPurge, zoneID, apiToken)

  // The purge has failed
  if (!resp.ok) {
    console.log(`🧹 Purge Error : ${resp.statusText} - ${zoneID} > ${urlToPurge}`)
    return new Response(resp.statusText, { status: resp.status })
  }

  // Success
  console.log(`🧹 Purged: ${zoneID} > ${urlToPurge}`)
  return new Response("OK", { status: 200 })
}

/**
 * Uses the Cloudflare API to purge a URL from the cache, can't use the Worker Cache API
 * because it only works per datacenter. Using the Cloudflare API ensures global purge.
 * 
 * @param {String} url Url to purge from the cache
 * @returns {Promise<Response>} Response from Cloudflare API
 */
async function purgeURL(url, zoneID, apiToken) {
  const requestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiToken}`
    },
    body: `{"files":["${url}"]}`
  }
  console.log(requestInit);
  console.log(`https://api.cloudflare.com/client/v4/zones/${zoneID}/purge_cache`);

  return await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneID}/purge_cache`, requestInit)
}

/**
 * Parse the body request.
 * 
 * @param {json} request 
 * @returns {Object} The parsed  json request 
 */
async function parseWebhookBody(request) {
  const body = JSON.stringify(await request.json())

  return JSON.parse(body)
}