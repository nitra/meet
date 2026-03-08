import { handleConnectionDetails } from './routes/connection-details.js'
import { handleRecordStart } from './routes/record-start.js'
import { handleRecordStop } from './routes/record-stop.js'

const PORT = parseInt(process.env.PORT ?? '8080', 10)

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)
    const origin = req.headers.get('Origin')

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    let res
    try {
      if (url.pathname === '/api/connection-details' && req.method === 'GET') {
        res = await handleConnectionDetails(req)
      } else if (url.pathname === '/api/record/start' && req.method === 'GET') {
        res = await handleRecordStart(req)
      } else if (url.pathname === '/api/record/stop' && req.method === 'GET') {
        res = await handleRecordStop(req)
      } else {
        res = new Response('Not Found', { status: 404 })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error'
      res = new Response(message, { status: 500 })
    }

    const headers = new Headers(res.headers)
    for (const [k, v] of Object.entries(corsHeaders(origin))) {
      headers.set(k, v)
    }
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
  }
})

console.log(`Backend listening on http://localhost:${PORT}`)
