import { Request, Response } from 'express';
import { EgressClient } from 'livekit-server-sdk';

/**
 * CAUTION:
 * for simplicity this implementation does not authenticate users and therefore allows anyone with knowledge of a roomName
 * to start/stop recordings for that room.
 * DO NOT USE THIS FOR PRODUCTION PURPOSES AS IS
 */
export async function handleRecordStop(req: Request, res: Response): Promise<void> {
  try {
    const roomName = req.query.roomName as string | undefined;

    if (roomName == null) {
      res.status(403).send('Missing roomName parameter');
      return;
    }

    const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL } = process.env;

    const hostURL = new URL(LIVEKIT_URL!);
    hostURL.protocol = 'https:';

    const egressClient = new EgressClient(hostURL.origin, LIVEKIT_API_KEY!, LIVEKIT_API_SECRET!);
    const activeEgresses = (await egressClient.listEgress({ roomName })).filter(
      (info) => info.status < 2,
    );
    if (activeEgresses.length === 0) {
      res.status(404).send('No active recording found');
      return;
    }
    await Promise.all(activeEgresses.map((info) => egressClient.stopEgress(info.egressId)));

    res.status(200).end();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
}
