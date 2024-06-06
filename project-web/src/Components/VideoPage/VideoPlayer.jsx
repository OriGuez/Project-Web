function VideoPlayer({ videoURL }) {
    return (
        <div>
            <video src={videoURL} className="object-fit-contain" autoPlay controls></video>
        </div>
    )
}

export default VideoPlayer;