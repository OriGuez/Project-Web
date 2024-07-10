import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './EditVideoPage.css';

function EditVideoPage({ loggedUser }) {
  const { id } = useParams();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [currentThumb, setCurrentThumb] = useState('');
  const [uploaderId, setUploaderId] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [thumbnailOption, setThumbnailOption] = useState('none'); // Default option to 'none'
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for initial render
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
        setTitle(data.title); // Set the title state with fetched data
        setDescription(data.description); // Set the description state with fetched data
        setThumbnailPreview(data.thumbnail);
        setCurrentThumb(data.thumbnail);
        setVideoPreview(data.url);
        setUploaderId(data.userId);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]); // Ensure effect re-runs if id changes

  useEffect(() => {
    if (!loggedUser) {
      setIsAuthenticated(false);
      return;
    }
    if (uploaderId !== loggedUser._id)
      setIsAuthenticated(false);
    else
      setIsAuthenticated(true);
  }, [loggedUser, uploaderId]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors((prevErrors) => ({ ...prevErrors, thumbnailFile: '' }));
    }
  };

  const handleThumbnailOptionChange = (e) => {
    const option = e.target.value;
    setThumbnailOption(option);
    if (option === 'generate' && videoPreview) {
      generateThumbnail();
    } else if (option === 'upload') {
      setThumbnailPreview(null);
    }
    else if (option === 'none')
      setThumbnailPreview(null);
  };

  const generateThumbnail = () => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const context = canvasElement.getContext('2d');
    videoElement.src = videoPreview;
    // Load metadata to get video dimensions
    videoElement.onloadedmetadata = () => {
      // Set the current time to a point where we are sure we have a frame
      videoElement.currentTime = 0;
      // Wait for the frame to be ready
      videoElement.onseeked = () => {
        // Ensure the video dimensions are available
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        // Draw the frame on the canvas
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        // Convert the canvas content to a Data URL
        const dataUrl = canvasElement.toDataURL('image/jpeg');
        setThumbnailPreview(dataUrl);
        // Convert the canvas content to a Blob
        canvasElement.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'canvasImage.jpg', { type: 'image/jpeg' });
            setThumbnailFile(file);
          }
        }, 'image/jpeg');
      };
    };
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const vidPayload = new FormData();
        vidPayload.append('title', title);
        vidPayload.append('description', description);
        if (thumbnailOption !== 'none') {
          vidPayload.append('image', thumbnailFile);
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
          // on success
          setTitle('');
          setDescription('');
          setThumbnailFile(null);
          setThumbnailPreview(null);
          setThumbnailOption('none');
          setErrors({});
          navigate(`/userpage/${userID}`);
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
  const handleDeleteVideo = async (vidId) => {
    const confirmed = window.confirm("Are you sure you want to delete this video?");
  if (!confirmed) return;
    const token = localStorage.getItem('jwt');
    const userID = localStorage.getItem('loggedUserID');
    const response = await fetch(`/api/users/${userID}/videos/${vidId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to delete video: ${errorMessage}`);
    }
    else {
      setTitle('');
      setDescription('');
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setThumbnailOption('none');
      setErrors({});
      navigate(`/userpage/${userID}`);
    }
  };

  const validateForm = () => {
    const isTitleValid = validateTitle(title);
    const isDescriptionValid = validateDescription(description);
    return isTitleValid && isDescriptionValid;
  };

  if (!isAuthenticated) {
    return (
      <div className="main-container">
        <div className="video-edit-container">
          <h2>You Are Not Authorized to enter this page</h2>
          <Link to="/">Go to Homepage</Link>
        </div>
      </div>
    );
  }
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="main-container-edit">
      <div className="video-edit-container">
        <div className="logo-container">
          <Link to="/">
            <img src="/logo.png" alt="ViewTube Logo" className="viewtube-logo" width="100px" height="auto" />
          </Link>ViewTube
        </div>
        <h3>Edit/Delete your video</h3>
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
          <div className="videoplay">
            <video src={videoPreview} controls></video>
          </div>
          <div className="form-group">
            <label>Current Thumbnail</label>
            <div className="thumbnail-options">
              <img src={currentThumb} width="100px" height="100px" className='rounded-scalable-image' alt="Preview" />
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
                accept=".jpeg,.jpg,.png,.gif,.svg,.webp"
                onChange={handleThumbnailChange}
                className="wide-input"
              />
              {errors.thumbnailFile && <div className="error-message">{errors.thumbnailFile}</div>}
            </div>
          )}
          <div className="image-container-edit">
            {thumbnailPreview && <img src={thumbnailPreview} width="100px" height="100px" className='rounded-scalable-image-edit' alt="Preview" />}
          </div>
          <video ref={videoRef} style={{ display: 'none' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <button type="submit" className="edit-video-button">Save Changes</button>
          <button onClick={() => handleDeleteVideo(id)} className='edit-video-button'>Delete Video</button>
        </form>
      </div>
    </div>
  );
}

export default EditVideoPage;
