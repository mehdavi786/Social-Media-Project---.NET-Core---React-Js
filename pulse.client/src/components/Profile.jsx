import React, { useEffect, useState } from 'react';
import Post from './PostForProfile';
import Navbar from './Navbar';
import Share from './Share';

function Profile() {
    const [user, setUser] = useState();
    const [userId, setUserId] = useState();


    useEffect(() => {
        const storedId = localStorage.getItem('userId');

        Promise.resolve(storedId) // Wrap storedId in a promise
            .then((id) => {
                if (id) {
                    setUserId(id);
                    return fetch(`https://localhost:7199/api/Users/${id}`); // Return the fetch promise
                }
                return null; // Return null if userId is not available
            })
            .then((response) => {
                if (response) {
                    return response.json(); // Return the response.json() promise
                }
                return null; // Return null if no response
            })
            .then((userData) => {
                if (userData) {
                    setUser(userData);
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                // Handle errors gracefully (e.g., show an error message)
            });
    }, []);

    const contents = user ? (
        <>
            <Navbar />
            <div className="px-3 my-3 border border-top-0 rounded pb-3">
                <Share />
            </div>
            <Post />
        </>
    ) : (
        <p><em>Loading...</em></p>
    );

    return contents;
}

export default Profile;
