import { EgressClient } from 'livekit-server-sdk'

/**
 * CAUTION:
 * for simplicity this implementation does not authenticate users and therefore allows anyone with knowledge of a roomName
 * to start/stop recordings for that room.
 * DO NOT USE THIS FOR PRODUCTION PURPOSES AS IS
 * @param {Request} req - Incoming request with roomName query param
 * @returns {Promise<Response>} Response with status 200 on success or error details
 */
export async function handleRecordStop(req) {
  try {
    const url = new URL(req.url)
    const roomName = url.searchParams.get('roomName') ?? undefined

    if (roomName === undefined || roomName === null || roomName === '') {
      return new Response('Missing roomName parameter', { status: 403 })
    }

    const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL } = process.env

    const hostURL = new URL(LIVEKIT_URL)
    hostURL.protocol = 'https:'

    const egressClient = new EgressClient(hostURL.origin, LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
    const listResult = await egressClient.listEgress({ roomName })
    const activeEgresses = listResult.filter(info => info.status < 2)
    if (activeEgresses.length === 0) {
      return new Response('No active recording found', { status: 404 })
    }
    await Promise.all(activeEgresses.map(info => egressClient.stopEgress(info.egressId)))

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}
