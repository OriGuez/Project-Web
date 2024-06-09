import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoAdd.css';

function VideoAdd({ loggedUser, videoList, setVideoList }) {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // Add state for description
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    // Redirect to login if loggedUser is null when component mounts
    if (!loggedUser) {
      navigate('/login');
    }
  }, [loggedUser, navigate]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();


    if (!videoFile || !thumbnailFile || !title) {
      alert('Please fill in all fields and upload both files.');
      return;
    }

    const newVideo = {
      title,
      description,
      publisher: loggedUser.username,
      vidID: String(Date.now()), // Unique ID based on timestamp
      url: URL.createObjectURL(videoFile),
      thumbnailUrl: URL.createObjectURL(thumbnailFile),
      upload_date: new Date().toISOString().split('T')[0],
      whoLikedList: [],
      comments: []
    };
    // Update the video list with the new video
    setVideoList([...videoList, newVideo]);
    // Clear the form fields
    setTitle('');
    setDescription('');
    setThumbnailFile(null);
    //setUrl('');





    // // Get existing videos from local storage
    // const videos = JSON.parse(localStorage.getItem('videos')) || [];
    // // Add new video to the list
    // videos.push(newVideo);
    // // Save updated list to local storage
    // localStorage.setItem('videos', JSON.stringify(videos));

    // // Redirect to home page after submission
    navigate('/'); // Use navigate to go to the home page
  };

  return (
    <div className="video-add-container">
      <h2>Add a New Video</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
          />
        </div>
        <div className="form-group">
          <label>Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </div>
        <button type="submit">Add Video</button>
      </form>
    </div>
  );
}

export default VideoAdd;
