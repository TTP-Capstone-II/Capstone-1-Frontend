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

    peerConnectionRef.current.negotiationneeded = handleNegotiationNeededEvent;
    peerConnectionRef.current.onicecandidate = handleICECandidateEvent;
    peerConnectionRef.current.ontrack = handleOnTrackEvent;
  };

  const handleOnTrackEvent = (event) => {
    // Play Remote Audio
    const remoteStream = event.streams[0];
    const audioElement = document.createElement("audio");
    audioElement.srcObject = remoteStream;
    audioElement.autoplay = true;
    document.body.appendChild(audioElement);
  };

  const handleICECandidateEvent = (event) => {
    if (event.candidate) {
      socket.emit("new-ice-candidate", { candidate: event.candidate });
    }
  };

  const handleNegotiationNeededEvent = async () => {
    const offer = await peerConnectionRef.current.createOffer(); // Create SDP
    await peerConnectionRef.current.setLocalDescription(offer); // Set SDP to local description

    socket.emit("voice-offer", { offer });
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
    setIsMuted(!isMuted);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted; // Toggle mute
      });
      if (isMuted) {
        console.log("Unmuted");
      } else {
        console.log("Muted");
      }
    }
  };

  useEffect(() => {
    // Receiving offer
    socket.on("voice-offer", async ({ offer }) => {
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

      socket.emit("voice-answer", { answer });
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
    socket.on("new-ice-candidate", async ({ candidate }) => {
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
