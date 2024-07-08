import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './EditVideoPage.css';

function EditVideoPage({ loggedUser, videoList, setVideoList, setFilteredVideoList }) {
  const { id } = useParams();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState('');
  const [thumbnailOption, setThumbnailOption] = useState('none'); // Default option to 'none'
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for initial render
  const [thumbFileServer, setThumbFileServer] = useState(null);
  const [vidFileServer, setVidFileServer] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/videos/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        setVidFileServer(data);
        setTitle(data.title); // Set the title state with fetched data
        setDescription(data.description); // Set the description state with fetched data
        setThumbFileServer(data.thumbnail);
        setVideoPreview(data.url);
        setThumbnailPreview(data.thumbnail);

      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setError(error);
      } finally {
        setLoading(false); // Ensure loading state is set to false after fetch
      }
    };
    fetchVideo();
  }, [id]); // Ensure effect re-runs if id changes

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) {
      setIsAuthenticated(false);
    }
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVidFileServer(file);
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
      setThumbFileServer(file);
      setThumbnailFile(file);
      setImgPreview(URL.createObjectURL(file));
      setErrors((prevErrors) => ({ ...prevErrors, thumbnailFile: '' }));
    }
  };

  const handleThumbnailOptionChange = (e) => {
    const option = e.target.value;
    setThumbnailOption(option);
    if (option === 'generate' && videoPreview) {
      generateThumbnail(videoPreview);
    } else if (option === 'upload') {
      setImgPreview('');
    }
  };

  const generateThumbnail = (file) => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const context = canvasElement.getContext('2d');

    // const url = URL.createObjectURL(file);
    videoElement.src = videoPreview;
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
      const dataUrl = canvasElement.toDataURL('image/jpeg');
      setImgPreview(dataUrl);
      canvasElement.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'canvasImage.jpg', { type: 'image/jpeg' });
          setThumbFileServer(file);
        }
      }, 'image/jpeg');
    };
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const vidPayload = new FormData();
        vidPayload.append('title', title);
        vidPayload.append('description', description);
        vidPayload.append('video', vidFileServer);
        if (thumbnailOption !== 'none') {
          vidPayload.append('image', thumbFileServer);
        }
        const userID = localStorage.getItem('loggedUserID');
        const jwtToken = localStorage.getItem('jwt');
        const response = await fetch(`/api/users/${userID}/videos/${id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${jwtToken}` // Add the Authorization header
          },
          body: vidPayload,
        });
        if (response.status === 200) {
          setTitle('');
          setDescription('');
          setVideoFile(null);
          setThumbnailFile(null);
          setVidFileServer(null);
          setThumbFileServer(null);
          setErrors({});
          setImgPreview('');
          navigate('/');
        } else {
          switch (response.status) {
            case 400:
              {
                break;
              }
            case 403:
              {
                break;
              }
            case 500:
              {
                break;
              }
            default:
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

  if (!isAuthenticated) {
    return (
      <div className="main-container">
        <div className="video-edit-container">
          <h2>Please log in to access this page</h2>
          <Link to="/">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container-edit">
      <div className="video-edit-container">
        <div className="logo-container">
          <Link to="/">
            <img src="/logo.png" alt="ViewTube Logo" className="viewtube-logo" width="100px" height="auto" />
          </Link>ViewTube
        </div>
        <h2>Edit your video</h2>
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
            <div className="videoplay">
              <video src={"/" + videoPreview} controls></video>
            </div>           
          <div className="form-group">
            <label>Current Thumbnail</label>
            <div className="thumbnail-options">
              <img src={"/" + thumbnailPreview} width="100px" height="100px" className='rounded-scalable-image' alt="Preview" />
              <label className="thumbnail-option">
                <input
                  type="radio"
                  id="noneThumbnail"
                  name="thumbnailOption"
                  value="none"
                  checked={thumbnailOption === 'none'}
                  onChange={handleThumbnailOptionChange}
                />
                Keep Current
              </label>
              <label className="thumbnail-option">
                <input
                  type="radio"
                  id="uploadThumbnail"
                  name="thumbnailOption"
                  value="upload"
                  checked={thumbnailOption === 'upload'}
                  onChange={handleThumbnailOptionChange}
                />
                Upload Other
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
            <div className="form-group-edit">
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
          <div className="image-container-edit">
            {imgPreview && <img src={imgPreview} width="100px" height="100px" className='rounded-scalable-image-edit' alt="Preview" />}
          </div>
          <video ref={videoRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <Link to='/'>
          <button type="submit">Submit</button>
        </Link>       
       </form>
      </div>
    </div>
  );
}

export default EditVideoPage;
