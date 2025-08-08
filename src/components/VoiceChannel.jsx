import React, { useState } from "react";
import { Button } from "@mui/material";

const VoiceChannel = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [stream, setStream] = useState();
  const [audioDevices, setAudioDevices] = useState();

  const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
  const peerConnection = new RTCPeerConnection(configuration);// Create a new RTCPeerConnection instance with STUN server configuration
  stream.getTracks().forEach((track) => { // Add each track from the stream to the peer connection
    peerConnection.addTrack(track, stream);
  }
  );
  peerConnection.ontrack = (event) => { // Handle incoming tracks from the remote peer
    const remoteStream = event.streams[0];
    const audioElement = document.createElement("audio");
    audioElement.srcObject = remoteStream;
    audioElement.autoplay = true; // Automatically play the audio when it starts
    document.body.appendChild(audioElement); // Append the audio element to the body
  };

  const getAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);
    } catch (error) {
      console.log("Cannot get audio stream", error);
    }
  };

  // In case you want to access the devices programmatically. Otherwise, it's unnecessary.
  /*  const getAudioDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "audioinput");
  };*/

  const handleJoinAudio = async () => {
    try {
      await getAudioStream();
      //const devices = await getAudioDevices();
      //setAudioDevices(devices);
      //console.log("Audio found:", devices);
      setIsConnected(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDisconnectAudio = () => {
    // Logic to disconnect audio channel
    setIsConnected(false);
  };
  const handleMute = () => {
    // Logic to mute/unmute audio
    setIsMuted(!isMuted);
  };
  return (
    <div className="voice-channel">
      {isConnected ? (
        <div className="connected">
          <Button onClick={handleMute}>Mute</Button>
          <Button onClick={handleDisconnectAudio}>Disconnect Audio</Button>
        </div>
      ) : (
        <div className="disconnected">
          <Button onClick={handleJoinAudio}>Join Audio</Button>
        </div>
      )}
    </div>
  );
};
export default VoiceChannel;
