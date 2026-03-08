'use client';

import { formatChatMessageLinks, RoomContext, VideoConference } from '@livekit/components-react';
import {
  LogLevel,
  Room,
  RoomEvent,
  VideoPresets,
} from 'livekit-client';
import { DebugMode } from '@/lib/Debug';
import { useEffect, useMemo, useState } from 'react';
import { KeyboardShortcuts } from '@/lib/KeyboardShortcuts';
import { SettingsMenu } from '@/lib/SettingsMenu';
import { useLowCPUOptimizer } from '@/lib/usePerfomanceOptimiser';

export function VideoConferenceClientImpl(props) {
  const roomOptions = useMemo(() => {
    return {
      publishDefaults: {
        videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
        red: true,
        videoCodec: 'vp9',
      },
      adaptiveStream: { pixelDensity: 'screen' },
      dynacast: true,
      singlePeerConnection: props.singlePeerConnection,
    };
  }, [props.singlePeerConnection]);

  const room = useMemo(() => new Room(roomOptions), [roomOptions]);

  const connectOptions = useMemo(() => {
    return {
      autoSubscribe: true,
    };
  }, []);

  useEffect(() => {
    const onMediaDevicesError = (error) => {
      console.warn(
        'Помилка доступу до камери/мікрофона:',
        error?.message ?? error,
        '— перевірте дозволи браузера та що пристрій не використовується іншою програмою.',
      );
    };
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    return () => {
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room]);

  useEffect(() => {
    room
      .connect(props.liveKitUrl, props.token, connectOptions)
      .then(() => {
        return room.localParticipant.enableCameraAndMicrophone();
      })
      .catch((error) => {
        if (
          error?.name === 'NotFoundError' ||
          error?.message?.includes('Requested device not found')
        ) {
          room.localParticipant.setCameraEnabled(true).catch((err) => {
            console.warn('Камера недоступна:', err);
          });
          room.localParticipant.setMicrophoneEnabled(true).catch((micError) => {
            console.warn('Мікрофон недоступний:', micError);
          });
          return;
        }
        console.error('Помилка підключення або медіа:', error);
      });
  }, [room, props.liveKitUrl, props.token, connectOptions]);

  useLowCPUOptimizer(room);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="lk-room-container"
        style={{ minHeight: '100%', display: 'grid', placeItems: 'center' }}
      >
        <span>Завантаження…</span>
      </div>
    );
  }

  return (
    <div className="lk-room-container">
      <RoomContext.Provider value={room}>
        <KeyboardShortcuts />
        <VideoConference
          chatMessageFormatter={formatChatMessageLinks}
          SettingsComponent={
            process.env.NEXT_PUBLIC_SHOW_SETTINGS_MENU === 'true' ? SettingsMenu : undefined
          }
        />
        <DebugMode logLevel={LogLevel.debug} />
      </RoomContext.Provider>
    </div>
  );
}
