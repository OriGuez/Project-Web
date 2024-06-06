function VideoPlayer({ videoURL }) {
    return (
        <div>
            <video src={videoURL} class="object-fit-contain" autoplay></video>

        </div>
    )
}

export default VideoPlayer;