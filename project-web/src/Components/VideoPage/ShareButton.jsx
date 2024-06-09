import React from 'react';
import './ShareButton.css';

function ShareButton() {
    const copyToClipboard = () => {
        const url = window.location.href;

        navigator.clipboard.writeText(url)
            .then(() => {
                alert('URL copied to clipboard!');
            })
            .catch((error) => {
                console.error('Failed to copy URL: ', error);
            });
    };

    return (
        <button className="share-button" onClick={copyToClipboard}>
            <span className="share-icon">🔗</span>
            Share
        </button>
    );
}

export default ShareButton;
