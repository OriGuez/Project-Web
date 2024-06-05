function VideoPrev({ title, publisher, url, thumbnailUrl, upload_date }) {
    return (
        <div>
            <h3>{title}</h3>
            <span>{publisher}</span>
            <span>{upload_date}</span>
            <img src={thumbnailUrl} width="50" height="50" />
            <video width="300" height="300" controls >
                <source src={url} />
            </video>
        </div>
    )
}
export default VideoPrev;
