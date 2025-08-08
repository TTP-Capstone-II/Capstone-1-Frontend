import React, { useState } from 'react';
import { Button } from '@mui/material';

const VoiceChannel = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);


    return (
        <div className="voice-channel">
            {isConnected ? ( 
                <div className="connected">
                    <Button >Mute</Button>
                    <Button >Disconnect Audio</Button>
                </div>
            ) : (
                <div className="disconnected">
                    <Button >Join Audio</Button>
                </div>
            )}
        </div>
    );
}
export default VoiceChannel;