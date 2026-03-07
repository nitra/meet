import { AccessToken, AccessTokenOptions, VideoGrant } from 'livekit-server-sdk';
import { getLiveKitURL } from '../lib/getLiveKitURL.js';
import { ConnectionDetails } from '../lib/types.js';
import { getCookieExpirationTime, parseCookies, randomString } from '../lib/utils.js';

const API_KEY = process.env.LIVEKIT_API_KEY!;
const API_SECRET = process.env.LIVEKIT_API_SECRET!;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const COOKIE_KEY = 'random-participant-postfix';

function createParticipantToken(userInfo: AccessTokenOptions, roomName: string): string {
  const at = new AccessToken(API_KEY, API_SECRET, userInfo);
  at.ttl = '5m';
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);
  return at.toJwt();
}

export async function handleConnectionDetails(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const roomName = url.searchParams.get('roomName') ?? undefined;
    const participantName = url.searchParams.get('participantName') ?? undefined;
    const metadata = url.searchParams.get('metadata') ?? '';
    const region = url.searchParams.get('region') ?? undefined;

    if (!LIVEKIT_URL) {
      throw new Error('LIVEKIT_URL is not defined');
    }
    const livekitServerUrl = region ? getLiveKitURL(LIVEKIT_URL, region) : LIVEKIT_URL;
    const cookies = parseCookies(req.headers.get('Cookie'));
    let randomParticipantPostfix = cookies[COOKIE_KEY];

    if (typeof roomName !== 'string') {
      return new Response('Missing required query parameter: roomName', { status: 400 });
    }
    if (!participantName) {
      return new Response('Missing required query parameter: participantName', { status: 400 });
    }

    if (!randomParticipantPostfix) {
      randomParticipantPostfix = randomString(4);
    }
    const participantToken = createParticipantToken(
      {
        identity: `${participantName}__${randomParticipantPostfix}`,
        name: participantName,
        metadata,
      },
      roomName,
    );

    const data: ConnectionDetails = {
      serverUrl: livekitServerUrl,
      roomName,
      participantToken,
      participantName,
    };

    const setCookie = `${COOKIE_KEY}=${randomParticipantPostfix}; Path=/; HttpOnly; SameSite=Strict; Secure; Expires=${getCookieExpirationTime()}`;
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': setCookie,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
