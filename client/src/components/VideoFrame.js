import React from 'react'

const VideoFrame = ({src}) => {
  return(
    <iframe
      style={{ width: "100%", display: "block" }}
      title="title-here"
      width="560"
      height="315"
      // src="https://www.youtube.com/embed/dzxFdtWmjto"
      src={src}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

export default VideoFrame;