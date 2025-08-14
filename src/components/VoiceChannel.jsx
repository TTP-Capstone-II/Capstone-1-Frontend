import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import socket from "../socket";
import { useRef } from "react";
import axios from "axios";
import { API_URL } from "../shared";

const VoiceChannel = ({ roomId, socketID }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [pendingIceCandidates, setPendingIceCandidates] = useState([]);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const remoteSocketIdRef = useRef(null);
  const [iceServers, setIceServers] = useState([]);

  // set Ice Servers
  useEffect(() => {
    const fetchTURNToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/turn-token`);
        console.log(response.data);
        const { token, iceServers } = response.data;
        setIceServers(iceServers);
      } catch (error) {
        console.error("Error fetching TURN token:", error);
        setIceServers([
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
            ],
          },
        ]);
      }
    };
    fetchTURNToken();
  }, []);

  const configuration = {
    iceServers: iceServers,
  };

  const createPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection(configuration);

    if (pendingIceCandidates.length > 0) {
      console.log(
        `Processing ${pendingIceCandidates.length} pending ICE candidates`
      );
      pendingIceCandidates.forEach((candidate) => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current
            .addIceCandidate(candidate)
            .catch((e) =>
              console.error("Error adding pending ICE candidate:", e)
            );
        }
      });
      setPendingIceCandidates([]); // Clear the queue
    }

    peerConnectionRef.current.onnegotiationneeded =
      handleNegotiationNeededEvent;
    peerConnectionRef.current.onicecandidate = handleICECandidateEvent;
    peerConnectionRef.current.ontrack = handleOnTrackEvent;

    // log ICE connection state
    peerConnectionRef.current.oniceconnectionstatechange = () => {
      console.log(
        "ICE connection state:",
        peerConnectionRef.current.iceConnectionState
      );
    };
  };

  const handleOnTrackEvent = (event) => {
    console.log("Track event received:", event);
    console.log("Streams:", event.streams);
    console.log("Track:", event.track);
    // Play Remote Audio
    const remoteStream = event.streams[0];
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream;
      remoteAudioRef.current
        .play()
        .catch((e) => console.error("Audio play error:", e));
    } else {
      console.warn("No remote stream or audio element");
    }
  };

  const handleICECandidateEvent = (event) => {
    if (event.candidate) {
      if (!remoteSocketIdRef.current) {
        console.log("Skipping ICE candidate send: missing remote socket id");
        return;
      }
      socket.emit("new-ice-candidate", {
        candidate: event.candidate,
        to: remoteSocketIdRef.current,
      });
      console.log(
        "Sending ICE candidate to",
        remoteSocketIdRef.current,
        event.candidate
      );
    }
  };

  const handleNegotiationNeededEvent = async () => {
    try {
      const offer = await peerConnectionRef.current.createOffer(); // Create SDP
      await peerConnectionRef.current.setLocalDescription(offer); // Set SDP to local description

      if (!remoteSocketIdRef.current) {
        console.log("Cannot send offer: missing remote socket id");
        return;
      }
      socket.emit("voice-offer", { offer, to: remoteSocketIdRef.current });
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
      //socket.emit("voice-join", { roomId });
      console.log("Audio connected");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisconnectAudio = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    const audioElements = document.querySelectorAll("audio");
    audioElements.forEach((audio) => {
      audio.remove();
    });
    setIsConnected(false);

    socket.off("voice-offer");
    socket.off("voice-answer");
    socket.off("new-ice-candidate");

    //socket.emit("voice-leave", { roomId });

    console.log("Audio disconnected");
  };
  const handleMute = () => {
    setIsMuted((prevMuted) => {
      const newMuted = !prevMuted;
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = !newMuted; // Mute or unmute the audio track
        });
      }
      console.log(`Audio is now ${newMuted ? "muted" : "unmuted"}`);
      return newMuted;
    });
  };

  useEffect(() => {
    if (socketID) {
      // Keep latest intended remote id in sync for the caller path
      remoteSocketIdRef.current = socketID;
    }
    // If we already have a peer connection and local tracks but missed negotiation due to unknown remote id earlier,
    // proactively trigger an offer now that we know the remote id.
    if (
      remoteSocketIdRef.current &&
      peerConnectionRef.current &&
      peerConnectionRef.current.getSenders().length > 0 &&
      peerConnectionRef.current.signalingState === "stable" &&
      !peerConnectionRef.current.localDescription
    ) {
      handleNegotiationNeededEvent();
    }
  }, [socketID]);

  useEffect(() => {
    // Receiving offer
    socket.on("voice-offer", async ({ offer, from }) => {
      try {
        if (!peerConnectionRef.current) createPeerConnection();

        // Create audio element
        if (!remoteAudioRef.current) {
          const audioElement = document.createElement("audio");
          audioElement.autoplay = true;
          remoteAudioRef.current = audioElement;
          document.body.appendChild(audioElement);
        }

        console.log("peer connection:", peerConnectionRef.current);

        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );

        // Wait for Remote Description to be set before adding tracks
        await new Promise((resolve) => setTimeout(resolve, 100));

        await getAudioStream();

        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
          });
        }

        // Store the remote id for subsequent ICE candidates
        remoteSocketIdRef.current = from;

        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        socket.emit("voice-answer", { answer, to: from });
        setIsConnected(true);
      } catch (error) {
        console.log(error);
      }
    });

    // Receiving answer
    socket.on("voice-answer", async ({ answer, from }) => {
      try {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        // Ensure we have the correct remote id on the caller side
        if (from) remoteSocketIdRef.current = from;
      } catch (error) {
        console.log(error);
      }
    });

    // Receiving ice candidates
    socket.on("new-ice-candidate", async ({ candidate, from }) => {
      const newCandidate = new RTCIceCandidate(candidate);
      console.log(`Received ICE candidate from: ${from}`, candidate);

      if (peerConnectionRef.current) {
        peerConnectionRef.current
          .addIceCandidate(newCandidate)
          .catch((e) => console.error("Error adding ICE candidate:", e));
      } else {
        // Queue the candidate until peer connection is ready
        console.log("Queueing ICE candidate, peer connection not ready yet");
        setPendingIceCandidates((prev) => [...prev, newCandidate]);
      }
    });

    return () => {
      socket.off("voice-offer");
      socket.off("voice-answer");
      socket.off("new-ice-candidate");
      //socket.off("voice-user-joined");
      //socket.off("voice-user-left");
    };
  }, []);

  return (
    <div className="voice-channel">
      {isConnected ? (
        <div className="connected">
          <Button onClick={handleMute}>{isMuted ? "UnMute" : "Mute"}</Button>
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
