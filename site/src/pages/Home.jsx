import { useNavigate, useSearchParams } from 'react-router-dom'
import React, { Suspense } from 'react'
import { generateRoomId } from '@/lib/client-utils'
import styles from '@/styles/Home.module.css'

function Tabs(props) {
  const [searchParams] = useSearchParams()
  const tabIndex = searchParams?.get('tab') === 'custom' ? 1 : 0

  const navigate = useNavigate()
  function onTabSelected(index) {
    const tab = index === 1 ? 'custom' : 'demo'
    navigate(`/?tab=${tab}`)
  }

  const tabs = React.Children.map(props.children, (child, index) => {
    return (
      <button
        className='lk-button'
        onClick={() => {
          if (onTabSelected) {
            onTabSelected(index)
          }
        }}
        aria-pressed={tabIndex === index}>
        {child?.props?.label}
      </button>
    )
  })

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabSelect}>{tabs}</div>
      {props.children?.[tabIndex]}
    </div>
  )
}

function DemoMeetingTab() {
  const navigate = useNavigate()
  const startMeeting = () => {
    navigate(`/rooms/${generateRoomId()}`)
  }
  return (
    <div className={styles.tabContent}>
      <p style={{ margin: 0 }}>Try LiveKit Meet for free with our live demo project.</p>
      <button style={{ marginTop: '1rem' }} className='lk-button' onClick={startMeeting}>
        Start Meeting
      </button>
    </div>
  )
}

function CustomConnectionTab() {
  const navigate = useNavigate()

  const onSubmit = event => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const serverUrl = formData.get('serverUrl')
    const token = formData.get('token')
    navigate(`/custom/?liveKitUrl=${serverUrl}&token=${token}`)
  }
  return (
    <form className={styles.tabContent} onSubmit={onSubmit}>
      <p style={{ marginTop: 0 }}>Connect LiveKit Meet with a custom server using LiveKit Cloud or LiveKit Server.</p>
      <input
        id='serverUrl'
        name='serverUrl'
        type='url'
        placeholder='LiveKit Server URL: wss://*.livekit.cloud'
        required
      />
      <textarea
        id='token'
        name='token'
        placeholder='Token'
        required
        rows={5}
        style={{ padding: '1px 2px', fontSize: 'inherit', lineHeight: 'inherit' }}
      />
      <hr style={{ width: '100%', borderColor: 'rgba(255, 255, 255, 0.15)', marginBlock: '1rem' }} />
      <button style={{ paddingInline: '1.25rem', width: '100%' }} className='lk-button' type='submit'>
        Connect
      </button>
    </form>
  )
}

export default function Home() {
  return (
    <>
      <main className={styles.main} data-lk-theme='default'>
        <div className='header'>
          <img src='/images/livekit-meet-home.svg' alt='LiveKit Meet' width='360' height='45' />
          <h2>
            Open source video conferencing app built on{' '}
            <a href='https://github.com/livekit/components-js?ref=meet' rel='noopener'>
              LiveKit&nbsp;Components
            </a>
            ,{' '}
            <a href='https://livekit.io/cloud?ref=meet' rel='noopener'>
              LiveKit&nbsp;Cloud
            </a>{' '}
            and Vite.
          </h2>
        </div>
        <Suspense fallback='Loading'>
          <Tabs>
            <DemoMeetingTab label='Demo' />
            <CustomConnectionTab label='Custom' />
          </Tabs>
        </Suspense>
      </main>
      <footer data-lk-theme='default'>
        Hosted on{' '}
        <a href='https://livekit.io/cloud?ref=meet' rel='noopener'>
          LiveKit Cloud
        </a>
        . Source code on{' '}
        <a href='https://github.com/livekit/meet?ref=meet' rel='noopener'>
          GitHub
        </a>
        .
      </footer>
    </>
  )
}
