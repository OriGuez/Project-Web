import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Home/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar/NavBar';
import VideoPrev from '../Home/VideoPrev';

function Search({ loggedUser, setLoggedUser, isDarkMode, setIsDarkMode }) {
    const { query } = useParams();
    const decodedQuery = decodeURIComponent(query);
    const [foundVideosServer, setFoundVideosServer] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchedVideos = async () => {
            try {
                const response = await fetch(`/api/searchvideo?query=${query}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                const data = await response.json();
                setFoundVideosServer(data);  // Update the videoList state
                setLoading(false);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                setError(error);
                setLoading(false);
            }
        };
        fetchSearchedVideos();
    }, [query]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    return (
        <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <NavBar
                loggedUser={loggedUser}
                setLoggedUser={setLoggedUser}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
            />
            <main className="main-content">
                <section className="video-grid">
                <p>Search results for "{decodedQuery}":</p>
                    {foundVideosServer.length === 0 ? (
                        <div>No videos found</div>
                    ) : (
                        foundVideosServer.map((video) => (
                            <VideoPrev
                                key={video.url}
                                title={video.title}
                                publisher={video.userId}
                                vidID={video._id}
                                thumbnailUrl={"/" + video.thumbnail}
                                upload_date={video.createdAt}
                            />
                        ))
                    )}
                </section>
            </main>
        </div>
    );
}

export default Search;
