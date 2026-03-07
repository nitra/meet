import { Request, Response } from 'express';
import { EgressClient, EncodedFileOutput, S3Upload } from 'livekit-server-sdk';

/**
 * CAUTION:
 * for simplicity this implementation does not authenticate users and therefore allows anyone with knowledge of a roomName
 * to start/stop recordings for that room.
 * DO NOT USE THIS FOR PRODUCTION PURPOSES AS IS
 */
export async function handleRecordStart(req: Request, res: Response): Promise<void> {
  try {
    const roomName = req.query.roomName as string | undefined;

    if (roomName == null) {
      res.status(403).send('Missing roomName parameter');
      return;
    }

    const {
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
      LIVEKIT_URL,
      S3_KEY_ID,
      S3_KEY_SECRET,
      S3_BUCKET,
      S3_ENDPOINT,
      S3_REGION,
    } = process.env;

    const hostURL = new URL(LIVEKIT_URL!);
    hostURL.protocol = 'https:';

    const egressClient = new EgressClient(hostURL.origin, LIVEKIT_API_KEY!, LIVEKIT_API_SECRET!);

    const existingEgresses = await egressClient.listEgress({ roomName });
    if (existingEgresses.length > 0 && existingEgresses.some((e) => e.status < 2)) {
      res.status(409).send('Meeting is already being recorded');
      return;
    }

    const fileOutput = new EncodedFileOutput({
      filepath: `${new Date(Date.now()).toISOString()}-${roomName}.mp4`,
      output: {
        case: 's3',
        value: new S3Upload({
          endpoint: S3_ENDPOINT,
          accessKey: S3_KEY_ID,
          secret: S3_KEY_SECRET,
          region: S3_REGION,
          bucket: S3_BUCKET,
        }),
      },
    });

    await egressClient.startRoomCompositeEgress(
      roomName,
      {
        file: fileOutput,
      },
      {
        layout: 'speaker',
      },
    );

    res.status(200).end();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
}
