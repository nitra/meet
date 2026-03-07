import { Request, Response } from 'express';
import { AccessToken, AccessTokenOptions, VideoGrant } from 'livekit-server-sdk';
import { getLiveKitURL } from '../lib/getLiveKitURL.js';
import { ConnectionDetails } from '../lib/types.js';
import { getCookieExpirationTime, randomString } from '../lib/utils.js';

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

export function handleConnectionDetails(req: Request, res: Response): void {
  try {
    const roomName = req.query.roomName as string | undefined;
    const participantName = req.query.participantName as string | undefined;
    const metadata = (req.query.metadata as string) ?? '';
    const region = req.query.region as string | undefined;

    if (!LIVEKIT_URL) {
      throw new Error('LIVEKIT_URL is not defined');
    }
    const livekitServerUrl = region ? getLiveKitURL(LIVEKIT_URL, region) : LIVEKIT_URL;
    let randomParticipantPostfix = req.cookies?.[COOKIE_KEY];

    if (typeof roomName !== 'string') {
      res.status(400).send('Missing required query parameter: roomName');
      return;
    }
    if (!participantName) {
      res.status(400).send('Missing required query parameter: participantName');
      return;
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
    res
      .setHeader(
        'Set-Cookie',
        `${COOKIE_KEY}=${randomParticipantPostfix}; Path=/; HttpOnly; SameSite=Strict; Secure; Expires=${getCookieExpirationTime()}`,
      )
      .status(200)
      .json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
}
