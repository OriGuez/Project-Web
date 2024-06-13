import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './VideoAdd.css';

function VideoAdd({ loggedUser, videoList, setVideoList }) {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedUser) {
      navigate('/login');
    }
  }, [loggedUser, navigate]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setImgPreview(URL.createObjectURL(file)); // Preview for video if needed
      setErrors((prevErrors) => ({ ...prevErrors, videoFile: '' }));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setImgPreview(URL.createObjectURL(file)); // Preview for image
      setErrors((prevErrors) => ({ ...prevErrors, thumbnailFile: '' }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newVideo = {
        title,
        description,
        publisher: loggedUser.username,
        vidID: String(Date.now()),
        url: URL.createObjectURL(videoFile),
        thumbnailUrl: URL.createObjectURL(thumbnailFile),
        upload_date: new Date().toISOString().split('T')[0],
        whoLikedList: [],
        comments: [],
      };

      setVideoList([...videoList, newVideo]);
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
      setErrors({});
      navigate('/');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'title':
        validateTitle(value);
        break;
      case 'description':
        validateDescription(value);
        break;
      case 'videoFile':
        validateVideoFile(value);
        break;
      case 'thumbnailFile':
        validateThumbnailFile(value);
        break;
      default:
        break;
    }
  };

  const validateTitle = (value) => {
    if (!value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, title: 'Please enter a title.' }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, title: '' }));
    return true;
  };

  const validateDescription = (value) => {
    if (!value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, description: 'Please enter a description.' }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
    return true;
  };

  const validateVideoFile = () => {
    if (!videoFile) {
      setErrors((prevErrors) => ({ ...prevErrors, videoFile: 'Please upload a video file.' }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, videoFile: '' }));
    return true;
  };

  const validateThumbnailFile = () => {
    if (!thumbnailFile) {
      setErrors((prevErrors) => ({ ...prevErrors, thumbnailFile: 'Please upload a thumbnail image.' }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, thumbnailFile: '' }));
    return true;
  };

  const validateForm = () => {
    const isTitleValid = validateTitle(title);
    const isDescriptionValid = validateDescription(description);
    const isVideoFileValid = validateVideoFile();
    const isThumbnailFileValid = validateThumbnailFile();

    return isTitleValid && isDescriptionValid && isVideoFileValid && isThumbnailFileValid;
  };

  return (
    <div className="main-container">
      
      <div className="video-add-container">
      <div className="logo-container">
        <Link to="/">
          <img src="/logo.png" alt="ViewTube Logo" className="viewtube-logo" width="100px" height="auto" />
        </Link>ViewTube
      </div>
      <h2>Add a New Video</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="title-input">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              placeholder="Title"
              required
              className="title-input"
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleBlur}
              placeholder="Description"
              className="description-textarea"
              required
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="videoFile">Video File</label>
            <input
              type="file"
              id="videoFile"
              name="videoFile"
              accept="video/*"
              onChange={handleVideoChange}
              onBlur={handleBlur}
              className="wide-input"
            />
            {errors.videoFile && <div className="error-message">{errors.videoFile}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="thumbnailFile">Thumbnail Image</label>
            <input
              type="file"
              id="thumbnailFile"
              name="thumbnailFile"
              accept="image/*"
              onChange={handleThumbnailChange}
              onBlur={handleBlur}
              className="wide-input"
            />
            {errors.thumbnailFile && <div className="error-message">{errors.thumbnailFile}</div>}
          </div>
          <div className="image-container">
            {imgPreview && <img src={imgPreview} width="100px" height="100px" className='rounded-scalable-image' alt="Preview" />}
          </div>
          <button type="submit">Add Video</button>
        </form>
      </div>
    </div>
  );
}

export default VideoAdd;
