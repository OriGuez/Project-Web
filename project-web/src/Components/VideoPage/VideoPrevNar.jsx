import React from 'react';
import { Link } from 'react-router-dom';
import './VideoPrevNar.css'

function VideoPrevNar({ title, publisher, vidID, thumbnailUrl, upload_date }) {
    const url = `/video/${vidID}`;


    return (
        <div className="video-prev-nar" style={{ marginTop: '20px' }} >
            <div className="video-wrapper">
                <Link to={url} className="video-link-scroll">
                    <img src={thumbnailUrl} alt={title} className="video-thumbnail-scroll" />
                </Link>
                <div className="video-info-scroll">
                    <div class="title-container">
                        <h1 className="title" >{title}</h1>
                    </div>
                    <p className="video-publisher-scroll">{publisher}</p>
                    <p className="video-upload-date-scroll">{upload_date}</p>
                </div>
            </div>
        </div>
    );
}

export default VideoPrevNar;
