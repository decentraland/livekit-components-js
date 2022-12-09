import {
  ParticipantView,
  LiveKitRoom,
  TrackToggle,
  TrackSource,
  ParticipantsLoop,
  ConnectionState,
  DisconnectButton,
  ScreenShareView,
  ParticipantName,
  TrackMutedIndicator,
  RoomName,
  RoomAudioRenderer,
  useConnectionQualityIndicator,
  MediaTrack,
  MediaDeviceMenu,
  useToken,
} from '@livekit/components-react';
import { ConnectionQuality, Track } from 'livekit-client';

import styles from '../styles/Simple.module.css';
import myStyles from '../styles/Customize.module.css';
import type { NextPage } from 'next';
import Head from 'next/head';
import { HTMLAttributes, useState } from 'react';

const Home: NextPage = () => {
  const params = typeof window !== 'undefined' ? new URLSearchParams(location.search) : null;

  const roomName = params?.get('room') ?? 'test-room';
  const userIdentity = params?.get('user') ?? 'test-user';
  const [connect, setConnect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const token = useToken({
    tokenEndpoint: process.env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT,
    roomName,
    userInfo: {
      identity: userIdentity,
      name: 'myname',
    },
  });

  const handleDisconnect = () => {
    setConnect(false);
    setIsConnected(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>LiveKit Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://livekit.io">LiveKit</a>
        </h1>
        {!isConnected && (
          <button onClick={() => setConnect(!connect)}>{connect ? 'Disconnect' : 'Connect'}</button>
        )}
        <LiveKitRoom
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LK_SERVER_URL}
          connect={connect}
          onConnected={() => setIsConnected(true)}
          onDisconnected={handleDisconnect}
          audio={true}
          video={true}
        >
          <RoomName />
          <ConnectionState />
          <RoomAudioRenderer />
          {/* <MediaSelection type="microphone"/>  */}
          {isConnected && (
            <>
              <div className={styles.controlBar}>
                <TrackToggle source={TrackSource.Camera}></TrackToggle>
                <MediaDeviceMenu kind={'videoinput'} />
                <TrackToggle source={TrackSource.Microphone}></TrackToggle>
                <MediaDeviceMenu kind={'audioinput'} />
                <TrackToggle source={TrackSource.ScreenShare}></TrackToggle>
                <DisconnectButton>Hang up!</DisconnectButton>
              </div>
              <ScreenShareView />
              <div className={styles.participantGrid}>
                <ParticipantsLoop>
                  <ParticipantView>
                    <MediaTrack source={Track.Source.Camera}></MediaTrack>

                    <div className={styles.participantIndicators}>
                      <div style={{ display: 'flex' }}>
                        <TrackMutedIndicator source={Track.Source.Microphone}></TrackMutedIndicator>
                        <TrackMutedIndicator source={Track.Source.Camera}></TrackMutedIndicator>
                      </div>
                      {/* Overwrite styles: By passing our own class name, we can easily overwrite/extend the existing styles. */}
                      {/* In addition, we can still specify a style attribute and further customize the styles. */}
                      <ParticipantName
                        className={myStyles['my-participant-name']}
                        // style={{ color: 'blue' }}
                      />
                      {/* Custom components: Here we replace the provided <ConnectionQualityIndicator />  with our own implementation. */}
                      <UserDefinedConnectionQualityIndicator />
                    </div>
                  </ParticipantView>
                </ParticipantsLoop>
              </div>
            </>
          )}
        </LiveKitRoom>
      </main>
    </div>
  );
};

export function UserDefinedConnectionQualityIndicator(props: HTMLAttributes<HTMLSpanElement>) {
  /**
   *  We use the same React hook that is used internally to build our own component.
   *  By using this hook, we inherit all the state management and logic and can focus on our implementation.
   */
  const { quality } = useConnectionQualityIndicator();

  function qualityToText(quality: ConnectionQuality): string {
    switch (quality) {
      case ConnectionQuality.Unknown:
        return 'No idea';
      case ConnectionQuality.Poor:
        return 'Poor';
      case ConnectionQuality.Good:
        return 'Good';
      case ConnectionQuality.Excellent:
        return 'Excellent';
    }
  }

  return <span {...props}> {qualityToText(quality)} </span>;
}

export default Home;
