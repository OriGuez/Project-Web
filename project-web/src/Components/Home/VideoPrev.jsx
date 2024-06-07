import { Link } from 'react-router-dom';
import './VideoPrev.css';

function VideoPrev({ title, publisher, url, thumbnailUrl, upload_date }) {
    return (
        <div className="video-prev">
            <Link to={url} className="video-link">
                <img src={thumbnailUrl} alt={title} className="video-thumbnail" />
                <div className="video-info">
                    <h3 className="video-title">{title}</h3>
                    <p className="video-publisher">{publisher}</p>
                    <p className="video-upload-date">{upload_date}</p>
                </div>
            </Link>
        </div>
    );
}

export default VideoPrev;
