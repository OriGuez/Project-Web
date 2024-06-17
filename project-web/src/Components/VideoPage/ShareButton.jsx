import React, { useState } from 'react';
import './ShareButton.css';

function ShareButton() {
    const [menuVisible, setMenuVisible] = useState(false);

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

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    return (
        <div className="share-button-container">
            <button className="share-button" onClick={toggleMenu}>
                <i className="bi bi-share"></i>
                Share
            </button>
            {menuVisible && (
                <div className="share-modal" onClick={closeMenu}>
                    <div className="share-modal-content" onClick={e => e.stopPropagation()}>
                        <button1 className="close-button" onClick={closeMenu}>&times;</button1>
                        <div className="share-options">
                        <div className="share-option" onClick={copyToClipboard}>
                                <img src="/copy.png" alt="Copy link" className="share-icon" />
                                <span>Copy link</span>
                            </div>
                            <div className="share-option">
                                <img src="/whatsapp.png" alt="WhatsApp" className="share-icon" />
                                <span>WhatsApp</span>
                            </div>
                            <div className="share-option">
                                <img src="/facebook.png" alt="Facebook" className="share-icon" />
                                <span>Facebook</span>
                            </div>
                            <div className="share-option">
                                <img src="/x.png" alt="X" className="share-icon" />
                                <span>X</span>
                            </div>
                            <div className="share-option">
                                <img src="/linkedin.png" alt="LinkedIn" className="share-icon" />
                                <span>LinkedIn</span>
                            </div>
                            <div className="share-option">
                                <img src="/mail.png" alt="Mail" className="share-icon" />
                                <span>Mail</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShareButton;
