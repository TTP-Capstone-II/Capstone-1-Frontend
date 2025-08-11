import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import socket from "../socket";
import { useRef } from "react";

const VoiceChannel = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const createPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection(configuration);

    // Play Remote Audio
    peerConnectionRef.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      const audioElement = document.createElement("audio");
      audioElement.srcObject = remoteStream;
      audioElement.autoplay = true;
      document.body.appendChild(audioElement);
    };

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, localStreamRef.current);
      });
    }
  };

  const sendICECandidates = () => {
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate });
      }
    };
  };

  const getAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.log("Cannot get audio stream", error);
    }
  };

  const handleJoinAudio = async () => {
    try {
      await getAudioStream();
      createPeerConnection();
      sendICECandidates();

      const offer = await peerConnectionRef.current.createOffer(); // Create SDP
      await peerConnectionRef.current.setLocalDescription(offer); // Set SDP to local description

      socket.emit("voice-offer", { offer });
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

  useEffect(() => {
    // Receiving offer
    socket.on("voice-offer", async (data) => {
      await getAudioStream();
      if (!peerConnectionRef.current) createPeerConnection();

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socket.emit("voice-answer", { answer });
      setIsConnected(true);
    });

    // Receiving answer
    socket.on("voice-answer", async ({ answer }) => {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    // Receiving ice candidates
    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await peerConnectionRef.current?.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (error) {
        console.error("Error adding ICE candidate", error);
      }
    });

    return () => {
      socket.off("voice-offer");
      socket.off("voice-answer");
      socket.off("ice-candidate");
    };
  }, []);

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
