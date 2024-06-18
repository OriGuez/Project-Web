import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './VideoAdd.css';

function VideoAdd({ loggedUser, videoList, setVideoList, setFilteredVideoList }) {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState('');
  const [thumbnailOption, setThumbnailOption] = useState('upload');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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
      if (thumbnailOption === 'generate') {
        generateThumbnail(file);
      }
      setImgPreview(URL.createObjectURL(file));
      setErrors((prevErrors) => ({ ...prevErrors, videoFile: '' }));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setImgPreview(URL.createObjectURL(file));
      setErrors((prevErrors) => ({ ...prevErrors, thumbnailFile: '' }));
    }
  };

  const handleThumbnailOptionChange = (e) => {
    const option = e.target.value;
    setThumbnailOption(option);
    if (option === 'generate' && videoFile) {
      generateThumbnail(videoFile);
    }
  };

  const generateThumbnail = (file) => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const context = canvasElement.getContext('2d');

    const url = URL.createObjectURL(file);
    videoElement.src = url;
    videoElement.currentTime = 2;

    videoElement.onloadeddata = () => {
      videoElement.play();
      videoElement.pause();
      videoElement.currentTime = 2;
    };

    videoElement.onseeked = () => {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      const dataUrl = canvasElement.toDataURL('image/png');
      setImgPreview(dataUrl);
      setThumbnailFile(dataUrl);
    };
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
        thumbnailUrl: thumbnailOption === 'generate' ? imgPreview : URL.createObjectURL(thumbnailFile),
        upload_date: new Date().toISOString().split('T')[0],
        whoLikedList: [],
        comments: [],
      };

      const updatedVideoList = [...videoList, newVideo];
      setVideoList(updatedVideoList);
      setFilteredVideoList(updatedVideoList); 

      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
      setErrors({});
      setImgPreview('');
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
    if (thumbnailOption === 'upload' && !thumbnailFile) {
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
              className="wide-input"
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
              className="wide-input"
            />
            {errors.videoFile && <div className="error-message">{errors.videoFile}</div>}
          </div>
          <div className="form-group">
            <label>Thumbnail Option</label>
            <div className="thumbnail-options">
              <label className="thumbnail-option">
                <input
                  type="radio"
                  id="uploadThumbnail"
                  name="thumbnailOption"
                  value="upload"
                  checked={thumbnailOption === 'upload'}
                  onChange={handleThumbnailOptionChange}
                />
                Upload Image
              </label>
              <label className="thumbnail-option">
                <input
                  type="radio"
                  id="generateThumbnail"
                  name="thumbnailOption"
                  value="generate"
                  checked={thumbnailOption === 'generate'}
                  onChange={handleThumbnailOptionChange}
                />
                Generate from Video
              </label>
            </div>
          </div>
          {thumbnailOption === 'upload' && (
            <div className="form-group">
              <label htmlFor="thumbnailFile">Thumbnail Image</label>
              <input
                type="file"
                id="thumbnailFile"
                name="thumbnailFile"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="wide-input"
              />
              {errors.thumbnailFile && <div className="error-message">{errors.thumbnailFile}</div>}
            </div>
          )}
          <div className="image-container">
            {imgPreview && <img src={imgPreview} width="100px" height="100px" className='rounded-scalable-image' alt="Preview" />}
          </div>
          <button type="submit">Add Video</button>
        </form>
      </div>
      <div className="video-container">
        <video ref={videoRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      <video ref={videoRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
  );
}

export default VideoAdd;
