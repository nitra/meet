import { AccessToken } from 'livekit-server-sdk'
import { getLiveKitURL } from '../lib/getLiveKitURL.js'
import { getCookieExpirationTime, parseCookies, randomString } from '../lib/utils.js'

const COOKIE_KEY = 'random-participant-postfix'

async function createParticipantToken(apiKey, apiSecret, userInfo, roomName) {
  const at = new AccessToken(apiKey, apiSecret, userInfo)
  at.ttl = '5m'
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true
  })
  return at.toJwt()
}

export async function handleConnectionDetails(req) {
  try {
    const livekitUrl = process.env.LIVEKIT_URL
    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET

    const url = new URL(req.url)
    const roomName = url.searchParams.get('roomName') ?? undefined
    const participantName = url.searchParams.get('participantName') ?? undefined
    const metadata = url.searchParams.get('metadata') ?? ''
    const region = url.searchParams.get('region') ?? undefined

    if (!livekitUrl) {
      throw new Error('LIVEKIT_URL is not defined')
    }
    const livekitServerUrl = region ? getLiveKitURL(livekitUrl, region) : livekitUrl
    const cookies = parseCookies(req.headers.get('Cookie'))
    let randomParticipantPostfix = cookies[COOKIE_KEY]

    if (typeof roomName !== 'string' || roomName.trim() === '') {
      return new Response('Missing required query parameter: roomName', { status: 400 })
    }
    if (!participantName) {
      return new Response('Missing required query parameter: participantName', { status: 400 })
    }

    if (!randomParticipantPostfix) {
      randomParticipantPostfix = randomString(4)
    }
    const participantToken = await createParticipantToken(
      apiKey,
      apiSecret,
      {
        identity: `${participantName}__${randomParticipantPostfix}`,
        name: participantName,
        metadata
      },
      roomName
    )

    const data = {
      serverUrl: livekitServerUrl,
      roomName,
      participantToken,
      participantName
    }

    const setCookie = `${COOKIE_KEY}=${randomParticipantPostfix}; Path=/; HttpOnly; SameSite=Strict; Secure; Expires=${getCookieExpirationTime()}`
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': setCookie
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}
