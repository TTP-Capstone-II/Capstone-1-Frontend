import React, { useState } from 'react';
import { Button } from '@mui/material';

const VoiceChannel = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const handleJoinAudio = () => {
        // Logic to join audio channel
        setIsConnected(true);
    }
    const handleDisconnectAudio = () => {
        // Logic to disconnect audio channel
        setIsConnected(false);
    }
    const handleMute = () => {
        // Logic to mute/unmute audio
        setIsMuted(!isMuted);
    }
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
}
export default VoiceChannel;