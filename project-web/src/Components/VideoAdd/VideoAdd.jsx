import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './VideoAdd.css';

function VideoAdd({ loggedUser}) {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState(null);
  const [thumbnailOption, setThumbnailOption] = useState('upload');
  const [isAuthenticated, setIsAuthenticated] = useState(true); 


  const [thumbFileServer, setThumbFileServer] = useState(null);
  const [vidFileServer, setVidFileServer] = useState(null);


  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) {
      setIsAuthenticated(false);
    }
  }, []);


  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVidFileServer(e.target.files[0])
      setVideoFile(file);
      if (thumbnailOption === 'generate') {
        generateThumbnail(file);
      }
      setErrors((prevErrors) => ({ ...prevErrors, videoFile: '' }));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbFileServer(e.target.files[0])
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
    else if (option === 'upload') {
      setImgPreview(null);
      //setThumbFileServer(null);
    }
  };

  const generateThumbnail = (file) => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const context = canvasElement.getContext('2d');
  
    const url = URL.createObjectURL(file);
    videoElement.src = url;
    videoElement.onloadedmetadata = () => {
      videoElement.currentTime = 0;
      videoElement.onseeked = () => {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const dataUrl = canvasElement.toDataURL('image/jpeg');
        setImgPreview(dataUrl);
        // Convert the canvas content to a Blob
        canvasElement.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'canvasImage.jpg', { type: 'image/jpeg' });
            console.log('File created:', file);
            setThumbFileServer(file);
          }
        }, 'image/jpeg');
      };
  
      // Ensure seeked event is triggered for very short videos
      videoElement.onloadeddata = () => {
        if (videoElement.currentTime !== 0) {
          videoElement.currentTime = 0;
        } else {
          videoElement.dispatchEvent(new Event('seeked'));
        }
      };
    };
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Map to the desired field names
        const vidPayload = new FormData();
        vidPayload.append('title', title);
        vidPayload.append('description', description);
        vidPayload.append('video', vidFileServer);
        vidPayload.append('image', thumbFileServer);
        const userID = localStorage.getItem('loggedUserID');
        const jwtToken = localStorage.getItem('jwt');
        const response = await fetch(`/api/users/${userID}/videos`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}` // Add the Authorization header
          },
          body: vidPayload,
        });
        //if user created successfully
        if (response.status === 201) {
          setTitle('');
          setDescription('');
          setVideoFile(null);
          setThumbnailFile(null);
          setVidFileServer(null)
          setThumbFileServer(null)
          setErrors({});
          setImgPreview(null);
          navigate('/');
          console.log("Video Upload Successful");
        } else {
          switch (response.status) {
            case 400:
              {
                break;
              }
            case 403:
              {
                //setRegisterError('No Profile Picture');
                break;
              }
            case 500:
              {
                //setRegisterError('Internal Server Error');
                break;
              }
            default:
            //setRegisterError('Something went wrong');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }

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
    if (value.length > 150) {
      setErrors((prevErrors) => ({ ...prevErrors, title: 'Title must be 150 characters or less.' }));
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
    if (value.length > 2000) {
      setErrors((prevErrors) => ({ ...prevErrors, title: 'Title must be 1200 characters or less.' }));
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
  if (!isAuthenticated) {
    return (
      <div className="main-container">
        <div className="video-add-container">
          <h2>Please log in to access this page</h2>
          <Link to="/">Go to Homepage</Link>
        </div>
      </div>
    );
  }
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
              maxlength="150"
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
              maxlength="2000"

            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="videoFile">Video File</label>
            <input
              type="file"
              id="videoFile"
              name="videoFile"
              accept=".mp4,.avi,.mkv,.mov,.webm,.wmv"
              // accept="video/*"
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
                accept=".jpeg,.jpg,.png,.gif,.svg,.webp"
                onChange={handleThumbnailChange}
                className="wide-input"
              />
              {errors.thumbnailFile && <div className="error-message">{errors.thumbnailFile}</div>}
            </div>
          )}
          <div className="image-container">
            {imgPreview && <img src={imgPreview} width="100px" height="100px" className='rounded-scalable-image' alt="Preview" />}
          </div>
          <video ref={videoRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
          <button type="submit" className='submitVideo' >Add Video</button>
        </form>
      </div>
    </div>
  );
}

export default VideoAdd;