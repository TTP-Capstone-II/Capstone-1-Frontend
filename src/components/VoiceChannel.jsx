import React, { useEffect, useState, useRef, PureComponent } from "react";
import axios from "axios";
import socket from "../socket";
import { API_URL } from "../shared";
import { Button } from "@mui/material";

const VoiceChannel = ({ roomId, mySocketID }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [iceServers, setIceServers] = useState([]);
  const localStreamRef = useRef(null);
  const peersConnectionRef = useRef({});
  const remoteAudioRef = useRef({});

  // set ICE servers
  useEffect(() => {
    const fetchTURNToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/turn-token`);
        console.log(response.data);
        const { iceServers } = response.data;
        setIceServers(iceServers);
      } catch (error) {
        console.error("Error fetching TURN servers", error);
      }
    };

    fetchTURNToken();
  }, []);

  const configuration = {
    iceServers: iceServers,
  };

  const createPeerConnection = (remoteSocketId, isInitiator) => {
    const pc = new RTCPeerConnection(configuration);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }
    pc.onicecandidate = (event) =>
      handleICECandidateEvent(event, remoteSocketId);
    pc.ontrack = (event) => handleOnTrackEvent(event, remoteSocketId);

    // log
    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
    };

    if (isInitiator) {
      pc.onnegotiationneeded = async () =>
        handleNegotiationNeededEvent(pc, remoteSocketId);
    }

    console.log(pc);
    return pc;
  };

  const handleOnTrackEvent = (event, remoteSocketId) => {
    const remoteStream = event.streams[0];
    if (!remoteAudioRef.current[remoteSocketId]) {
      const audioElement = document.createElement("audio");
      audioElement.autoplay = true;
      audioElement.srcObject = remoteStream;
      remoteAudioRef.current[remoteSocketId] = audioElement;
      document.body.appendChild(audioElement);
      audioElement.play();
    } else {
      remoteAudioRef.current[remoteSocketId].srcObject = remoteStream;
    }
  };

  const handleICECandidateEvent = (event, remoteSocketId) => {
    if (event.candidate) {
      if (!remoteSocketId) {
        console.log("Skipping ICE candidate send: missing remote socket id");
        return;
      }
      socket.emit("new-ice-candidate", {
        candidate: event.candidate,
        to: remoteSocketId,
      });
      console.log("Sending ICE candidate to", remoteSocketId, event.candidate);
    }
  };

  const handleNegotiationNeededEvent = async (pc, remoteSocketId) => {
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (!remoteSocketId) {
        console.log("Cannot send offer: missing remote socket id");
        return;
      }
      socket.emit("voice-offer", { offer, to: remoteSocketId });
    } catch (error) {
      console.log("Error during negotiation:", error);
    }
  };

  const getAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error("Cannot get audio stream", error);
    }
  };

  const handleJoinAudio = async () => {
    try {
      //createPeerConnection(mySocketID);
      await getAudioStream();
      socket.emit("voice-join", { roomId });
      setIsConnected(true);
    } catch (error) {
      console.error("", error);
    }
  };

  useEffect(() => {
    socket.on("voice-user-joined", async ({ socketId }) => {
      const pc = createPeerConnection(socketId, true);
      peersConnectionRef.current[socketId] = pc;
    });

    socket.on("voice-offer", async ({ offer, from }) => {
      try {
        const pc = createPeerConnection(from, false);

        peersConnectionRef.current[from] = pc;

        // Create audio element
        if (!remoteAudioRef.current[from]) {
          const audioElement = document.createElement("audio");
          audioElement.autoplay = true;
          remoteAudioRef.current[from] = audioElement;
          document.body.appendChild(audioElement);
        }

        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        await getAudioStream();

        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStreamRef.current);
          });
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("voice-answer", { answer, to: from });
        setIsConnected(true);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("voice-answer", async ({ answer, from }) => {
      try {
        const pc = peersConnectionRef.current[from];
        if (!pc) return;
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.log(error);
      }
    });

    // Receiving ice candidates
    socket.on("new-ice-candidate", async ({ candidate, from }) => {
      const newCandidate = new RTCIceCandidate(candidate);
      console.log(`Received ICE candidate from: ${from}`, candidate);

      const pc = peersConnectionRef.current[from];
      if (!pc) {
        console.log("peer connection doesn't exist");
        return;
      }
      try {
        await pc.addIceCandidate(newCandidate);
      } catch (error) {
        console.log(error);
      }
    });

    return () => {
      socket.off("voice-user-joined");
      socket.off("voice-offer");
      socket.off("voice-answer");
      socket.off("new-ice-candidate");
    };
  }, []);

  const handleMute = () => {
    console.log("Mute");
  };

  const handleDisconnectAudio = () => {
    console.log("Disconnect");
  };

  return (
    <div className="voice-channel">
      {isConnected ? (
        <div className="connected">
          <Button onClick={handleMute}>{isMuted ? "UnMute" : "Mute"}</Button>
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
