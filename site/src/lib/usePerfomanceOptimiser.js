import { ParticipantEvent, RoomEvent, VideoQuality, isVideoTrack } from 'livekit-client'
import * as React from 'react'

const defaultOptions = {
  reducePublisherVideoQuality: true,
  reduceSubscriberVideoQuality: true,
  disableVideoProcessing: false
}

/**
 * This hook ensures that on devices with low CPU, the performance is optimised when needed.
 * This is done by primarily reducing the video quality to low when the CPU is constrained.
 * @param {import('livekit-client').Room} room - LiveKit room instance
 * @param {object} [options] - Optimizer options
 * @returns {boolean} Whether low power mode is active
 */
export function useLowCPUOptimizer(room, options = {}) {
  const [lowPowerMode, setLowPowerMode] = React.useState(false)
  const opts = React.useMemo(() => ({ ...defaultOptions, ...options }), [options])
  React.useEffect(() => {
    const handleCpuConstrained = async track => {
      setLowPowerMode(true)
      console.warn('Local track CPU constrained', track)
      if (opts.reducePublisherVideoQuality) {
        track.prioritizePerformance()
      }
      if (opts.disableVideoProcessing && isVideoTrack(track)) {
        track.stopProcessor()
      }
      if (opts.reduceSubscriberVideoQuality) {
        for (const participant of room.remoteParticipants) {
          for (const publication of participant.videoTrackPublications) {
            publication.setVideoQuality(VideoQuality.LOW)
          }
        }
      }
    }

    room.localParticipant.on(ParticipantEvent.LocalTrackCpuConstrained, handleCpuConstrained)
    return () => {
      room.localParticipant.off(ParticipantEvent.LocalTrackCpuConstrained, handleCpuConstrained)
    }
  }, [room, opts.reducePublisherVideoQuality, opts.reduceSubscriberVideoQuality, opts.disableVideoProcessing])

  React.useEffect(() => {
    const lowerQuality = (_, publication) => {
      publication.setVideoQuality(VideoQuality.LOW)
    }
    if (lowPowerMode && opts.reduceSubscriberVideoQuality) {
      room.on(RoomEvent.TrackSubscribed, lowerQuality)
    }

    return () => {
      room.off(RoomEvent.TrackSubscribed, lowerQuality)
    }
  }, [lowPowerMode, room, opts.reduceSubscriberVideoQuality])

  return lowPowerMode
}
