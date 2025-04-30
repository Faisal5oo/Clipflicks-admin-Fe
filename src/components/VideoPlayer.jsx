"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactPlayer with SSR disabled
const ReactPlayer = dynamic(() => import("react-player"), { 
  ssr: false,
  loading: () => <div className="aspect-video bg-gray-700 flex items-center justify-center"><p className="text-gray-400">Loading player...</p></div>
});

const VideoPlayer = ({ src, poster, controls = true, autoPlay = false, loop = false, muted = false, width = "100%", height = "100%" }) => {
  const playerRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  // Configuration for the player
  const playerConfig = {
    file: {
      attributes: {
        poster: poster || "",
        controls: controls,
        controlsList: "nodownload", // Disable download button in some browsers
      },
    },
  };

  const handleError = () => {
    console.error("Error loading video with ReactPlayer, falling back to HTML5 video");
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="video-player-container relative w-full h-full">
        <video
          src={src}
          poster={poster}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          width={width}
          height={height}
          className="w-full h-full"
          onError={() => console.error("Error loading video with HTML5 video element")}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="video-player-container relative w-full h-full">
      <ReactPlayer
        ref={playerRef}
        url={src}
        width={width}
        height={height}
        playing={autoPlay}
        controls={controls}
        loop={loop}
        muted={muted}
        config={playerConfig}
        className="react-player"
        style={{ position: "absolute", top: 0, left: 0 }}
        onError={handleError}
      />
    </div>
  );
};

export default VideoPlayer; 