import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import './VideoPrev.css';

function VideoPrev({ title, publisher, description, vidID, thumbnailUrl, upload_date, videoList, setVideoList, loggedUser }) {
    const url = `/video/${vidID}`;
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [newDescription, setNewDescription] = useState(description);
    const handleDelete = () => {
        console.log(`Deleting video with ID: ${vidID}`);
        const newVideoList = videoList.filter(video => video.vidID !== vidID);
        console.log('Updated Video List:', newVideoList);
        setIsEditing(false);
        setVideoList(newVideoList);
    };
    const handleSave = () => {
        const newVideoList = videoList.map(video => {
            if (video.vidID === vidID) {
                return { ...video, title: newTitle, description: newDescription };
            }
            return video;
        });
        setVideoList(newVideoList);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setNewTitle(title);
        setNewDescription(description);
        setIsEditing(false);
    };


    return (
        <div className="video-prev">
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <textarea className="textarea-description"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>) : (
                <div>
                    <Link to={url} className="video-link">
                        <img src={thumbnailUrl} alt={title} className="video-thumbnail" />
                        <div className="video-info">
                            <h3 className="video-title">{title} </h3>
                            <p className="video-publisher">{publisher}</p>
                            <p className="video-upload-date">{upload_date}</p>
                        </div>
                    </Link>
                    {/* {loggedUser &&<button onClick={() => setIsEditing(true)}>Edit</button>} */}
                </div>
            )
            }
            {/* {loggedUser && <button onClick={handleDelete} className="delete-button">Delete</button>} */}
        </div>
    );
}

export default VideoPrev;