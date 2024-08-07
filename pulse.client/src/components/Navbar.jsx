import { React, Component, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Navbar() {
    const [user, setUser] = useState();
    const [userId, setUserId] = useState();

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        setUserId(storedId);
      
        if (!userId) {
          return;
        }
      
        const fetchUser = async () => {
          try {
            const response = await fetch(`https://localhost:7199/api/Users/${userId}`);
            if (!response.ok) {
              throw new Error('Error retrieving name of user!');
            }
            const data = await response.json();
            setUser(data);
          } catch (error) {
            console.error('Error fetching user:', error);
            // Handle error, e.g., show an error message
          }
        };
      
        fetchUser();
      }, [userId]);
    
    const handleLogout = () => {
        try {
            localStorage.removeItem('userId');
            // Optionally, redirect to login page after logout
            window.location.href = "/login";
        } catch (error) {
            console.error("Error removing user ID from local storage:", error);
            // Handle errors gracefully (e.g., display an error message to the user)
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top">
            <div className="container-fluid">
                <a className="navbar-brand" href="#"><b>Pulse</b></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/newsfeed">Newsfeed</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/findFriends">Find Friends</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile">Profile</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/chat">Chat</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/settings">Settings</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-5">
                        <li className="nav-item fw-medium">
                            Hi {user && user.name}!
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-5">
                        <li className="nav-item">
                            <Link className="nav-link" onClick={ handleLogout } to="/login">Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;