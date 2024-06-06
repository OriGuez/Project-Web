import React from 'react';

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
        <button onClick={copyToClipboard}>Share</button>
    );
}

export default ShareButton;