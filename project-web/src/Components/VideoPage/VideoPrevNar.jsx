import React from 'react';
import { Link } from 'react-router-dom';
import './VideoPrevNar.css'

function VideoPrevNar({ title, publisher, vidID, thumbnailUrl, upload_date }) {
    const url = `/video/${vidID}`;

    return (
        <div className="video-prev-nar">
            <Link to={url} className="video-link-scroll">
                <img src={thumbnailUrl} alt={title} className="video-thumbnail-scroll" />
                <div className="video-info-scroll">
                    <h3 className="video-title-scroll">{title}</h3>
                    <p className="video-publisher-scroll">{publisher}</p>
                    <p className="video-upload-date-scroll">{upload_date}</p>
                </div>
            </Link>
        </div>
    );
}

export default VideoPrevNar;
