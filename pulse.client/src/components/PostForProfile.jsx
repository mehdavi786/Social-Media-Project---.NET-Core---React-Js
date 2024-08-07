import React, { useState, useEffect } from 'react';
import PosterImageName from './PosterImageName'; // Assuming PosterImageName retrieves user data

function Post() {
    const [posts, setPosts] = useState([]); // State to store fetched posts
    const [userId, setUserId] = useState(null); // State to store user ID

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        setUserId(storedId); // Set user ID from local storage

        const fetchPosts = async () => {
            try {
                if (!userId) {
                    return; // Don't fetch if no user ID is available
                }

                const response = await fetch(`https://localhost:7199/api/Post/${userId}`); // Corrected URL with user ID
                if (!response.ok) {
                    throw new Error(`Error fetching posts: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
                // Handle errors gracefully (e.g., show an error message)
            }
        };

        fetchPosts();
    }, [userId]); // Re-run useEffect when userId changes

    return (
        <>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id} className="card position-relative d-flex flex-column">
                        <div className="mx-3 mt-3">
                            <PosterImageName name={post.user.name} image={post.user.image} />
                        </div>
                        <div className="card-body">
                            <p className="mt-1 mx-auto">{post.content}</p>
                            {post.imageLink && (  // Check if imageLink exists before rendering
                                <div className="d-flex justify-content-center">
                                    <img
                                        src={post.imageLink}
                                        className="align-self-center card-img-top mx-auto w-50"
                                        alt="..."
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : userId ? (
                    <p className="mx-auto"><em>No posts found for this user.</em></p>
            ) : (
                <p><em>Fetching posts...</em></p>
            )}
        </>
    );
}

export default Post;

