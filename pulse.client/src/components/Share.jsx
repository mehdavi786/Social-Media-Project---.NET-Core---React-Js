import React, { useState, useEffect } from 'react';

function Share() {
    const [userId, setUserId] = useState(null);
    const [content, setContent] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [isShared, setIsShared] = useState(false); // Flag for successful share

    useEffect(() => {
        try {
            const storedId = localStorage.getItem('userId');
            setUserId(storedId);
        } catch (error) {
            console.error("Error retrieving user ID from local storage:", error);
        }
    }, [userId]);

    const handleShare = async () => {
        try {
            const response = await fetch('https://localhost:7199/api/Post/CreatePost', { // Replace with your API endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, imageLink, userId }), // Send content, userId, and imagelink (if available)
            });

            if (!response.ok) {
                throw new Error(`Error sharing content: ${response.statusText}`);
            }

            setIsShared(true); // Set shared flag
            setContent(''); // Clear content after successful share
            setImageLink(''); // Clear image link after successful share
            alert("Post Shared Successfully!");
        } catch (error) {
            console.error('Error sharing content:', error);
            alert("Error in sharing content!");
            // Handle errors gracefully (e.g., display an error message to the user)
        }
    };

    return (
        <>
            <form onSubmit={handleShare}>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <input
                        required
                        type="text"
                        className="form-control"
                        id="content"
                        placeholder="What's on your mind today?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image URL (optional)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="image"
                        placeholder="Enter image URL"
                        value={imageLink}
                        onChange={(e) => setImageLink(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Share</button>
            </form>

            {/* Conditionally display success message after share */}
            {isShared && <p className="alert alert-success">Post Shared Successfully!</p>}
        </>
    );
}

export default Share;
