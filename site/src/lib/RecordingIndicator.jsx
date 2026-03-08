import { useIsRecording } from '@livekit/components-react'
import * as React from 'react'
import { toast } from 'react-hot-toast'

const wasRecordingRef = { current: false }

export function RecordingIndicator() {
  const isRecording = useIsRecording()

  React.useEffect(() => {
    if (isRecording && !wasRecordingRef.current) {
      wasRecordingRef.current = true
      toast('This meeting is being recorded', {
        duration: 3000,
        icon: '🎥',
        position: 'top-center',
        className: 'lk-button',
        style: {
          backgroundColor: 'var(--lk-danger3)',
          color: 'var(--lk-fg)'
        }
      })
    }
    if (!isRecording) wasRecordingRef.current = false
  }, [isRecording])

  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        boxShadow: isRecording ? 'var(--lk-danger3) 0px 0px 0px 3px inset' : 'none',
        pointerEvents: 'none'
      }}
    />
  )
}
