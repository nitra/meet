import React from 'react'
import { DebugMode } from '@/lib/Debug'
import { KeyboardShortcuts } from '@/lib/KeyboardShortcuts'
import { RecordingIndicator } from '@/lib/RecordingIndicator'
import { SettingsMenu } from '@/lib/SettingsMenu'
import { formatChatMessageLinks, PreJoin, RoomContext, VideoConference } from '@livekit/components-react'
import { VideoPresets, Room, RoomEvent } from 'livekit-client'
import { useNavigate } from 'react-router-dom'
import { useLowCPUOptimizer } from '@/lib/usePerfomanceOptimiser'

const CONN_DETAILS_ENDPOINT = import.meta.env.VITE_CONN_DETAILS_ENDPOINT ?? '/api/connection-details'
const SHOW_SETTINGS_MENU = import.meta.env.VITE_SHOW_SETTINGS_MENU === 'true'

export function PageClientImpl(props) {
  const [preJoinChoices, setPreJoinChoices] = React.useState(undefined)
  const preJoinDefaults = React.useMemo(() => {
    return {
      username: '',
      videoEnabled: true,
      audioEnabled: true
    }
  }, [])
  const [connectionDetails, setConnectionDetails] = React.useState(undefined)

  const handlePreJoinSubmit = React.useCallback(
    async values => {
      setPreJoinChoices(values)
      const url = new URL(CONN_DETAILS_ENDPOINT, window.location.origin)
      url.searchParams.append('roomName', props.roomName)
      url.searchParams.append('participantName', values.username)
      if (props.region) {
        url.searchParams.append('region', props.region)
      }
      const connectionDetailsResp = await fetch(url.toString())
      const connectionDetailsData = await connectionDetailsResp.json()
      setConnectionDetails(connectionDetailsData)
    },
    [props.roomName, props.region]
  )
  const handlePreJoinError = React.useCallback(e => console.error(e), [])

  return (
    <main data-lk-theme='default' style={{ height: '100%' }}>
      {connectionDetails === undefined || preJoinChoices === undefined ? (
        <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
          <PreJoin defaults={preJoinDefaults} onSubmit={handlePreJoinSubmit} onError={handlePreJoinError} />
        </div>
      ) : (
        <VideoConferenceComponent
          connectionDetails={connectionDetails}
          userChoices={preJoinChoices}
          options={{ hq: props.hq }}
        />
      )}
    </main>
  )
}

function VideoConferenceComponent(props) {
  const roomOptions = React.useMemo(() => {
    const videoCaptureDefaults = {
      deviceId: props.userChoices.videoDeviceId ?? undefined,
      resolution: props.options.hq ? VideoPresets.h2160 : VideoPresets.h720
    }
    const publishDefaults = {
      dtx: false,
      videoSimulcastLayers: props.options.hq
        ? [VideoPresets.h1080, VideoPresets.h720]
        : [VideoPresets.h540, VideoPresets.h216],
      red: true,
      videoCodec: 'vp9'
    }
    return {
      videoCaptureDefaults,
      publishDefaults,
      audioCaptureDefaults: {
        deviceId: props.userChoices.audioDeviceId ?? undefined
      },
      adaptiveStream: true,
      dynacast: true,
      singlePeerConnection: true
    }
  }, [props.userChoices, props.options.hq])

  const room = React.useMemo(() => new Room(roomOptions), [roomOptions])

  const connectOptions = React.useMemo(() => {
    return {
      autoSubscribe: true
    }
  }, [])

  React.useEffect(() => {
    room.on(RoomEvent.Disconnected, handleOnLeave)
    room.on(RoomEvent.MediaDevicesError, handleError)

    room
      .connect(props.connectionDetails.serverUrl, props.connectionDetails.participantToken, connectOptions)
      .catch(error => {
        handleError(error)
      })
    if (props.userChoices.videoEnabled) {
      room.localParticipant.setCameraEnabled(true).catch(error => {
        handleError(error)
      })
    }
    if (props.userChoices.audioEnabled) {
      room.localParticipant.setMicrophoneEnabled(true).catch(error => {
        handleError(error)
      })
    }
    return () => {
      room.off(RoomEvent.Disconnected, handleOnLeave)
      room.off(RoomEvent.MediaDevicesError, handleError)
    }
  }, [room, props.connectionDetails, props.userChoices])

  const lowPowerMode = useLowCPUOptimizer(room)

  const navigate = useNavigate()
  const handleOnLeave = React.useCallback(() => navigate('/'), [navigate])
  const handleError = React.useCallback(error => {
    console.error(error)
    alert(`Encountered an unexpected error, check the console logs for details: ${error.message}`)
  }, [])

  React.useEffect(() => {
    if (lowPowerMode) {
      console.warn('Low power mode enabled')
    }
  }, [lowPowerMode])

  return (
    <div className='lk-room-container'>
      <RoomContext.Provider value={room}>
        <KeyboardShortcuts />
        <VideoConference
          chatMessageFormatter={formatChatMessageLinks}
          SettingsComponent={SHOW_SETTINGS_MENU ? SettingsMenu : undefined}
        />
        <DebugMode />
        <RecordingIndicator />
      </RoomContext.Provider>
    </div>
  )
}
