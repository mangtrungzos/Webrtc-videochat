import { useEffect, useRef } from "react";

export const VideoPlayer: React.FC<{stream: MediaStream}>  =({stream}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(()=>{ 
       if(videoRef.current) videoRef.current.srcObject = stream
    },[stream]);
    return (
        <div className="">
            {/* <video ref={videoRef} autoPlay /> */}
            <video className="rounded-2xl" ref={videoRef} autoPlay muted={true}/>
        </div>
    );
};