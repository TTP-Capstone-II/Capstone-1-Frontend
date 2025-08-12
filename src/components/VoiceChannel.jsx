import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import socket from "../socket";
import { useRef } from "react";

const VoiceChannel = ({ socketID }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteAudioRef = useRef(null);

  /*
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:5349" },
      { urls: "stun:stun3.l.google.com:3478" },
      { urls: "stun:stun3.l.google.com:5349" },
      { urls: "stun:stun4.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:5349" },
  */

  const configuration = {
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
        ],
      },
    ],
  };

  const createPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection(configuration);

    peerConnectionRef.current.onnegotiationneeded =
      handleNegotiationNeededEvent;
    peerConnectionRef.current.onicecandidate = handleICECandidateEvent;
    peerConnectionRef.current.ontrack = handleOnTrackEvent;
  };

  const handleOnTrackEvent = (event) => {
    // Play Remote Audio
    const remoteStream = event.streams[0];
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  };

  const handleICECandidateEvent = (event) => {
    if (event.candidate) {
      socket.emit("new-ice-candidate", {
        candidate: event.candidate,
        to: socketID,
      });
    }
  };

  const handleNegotiationNeededEvent = async () => {
    const offer = await peerConnectionRef.current.createOffer(); // Create SDP
    await peerConnectionRef.current.setLocalDescription(offer); // Set SDP to local description

    socket.emit("voice-offer", { offer, to: socketID });
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
      createPeerConnection();
      await getAudioStream();
      // Add local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, localStreamRef.current);
        });
      }

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
    socket.on("voice-offer", async ({ offer, from }) => {
      if (!peerConnectionRef.current) createPeerConnection();

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      await getAudioStream();

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, localStreamRef.current);
        });
      }

      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socket.emit("voice-answer", { answer, to: from });
      setIsConnected(true);
    });

    // Receiving answer
    socket.on("voice-answer", async ({ answer }) => {
      try {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      } catch (error) {
        console.log(error);
      }
    });

    // Receiving ice candidates
    socket.on("new-ice-candidate", async ({ candidate, from }) => {
      const newCandidate = new RTCIceCandidate(candidate);

      peerConnectionRef.current
        .addIceCandidate(newCandidate)
        .catch(window.reportError);
    });

    return () => {
      socket.off("voice-offer");
      socket.off("voice-answer");
      socket.off("new-ice-candidate");
    };
  }, []);

  return (
    <div className="voice-channel">
      {isConnected ? (
        <div className="connected">
          <Button onClick={handleMute}>Mute</Button>
          <Button onClick={handleDisconnectAudio}>Disconnect Audio</Button>
          <audio ref={remoteAudioRef} autoPlay />
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
