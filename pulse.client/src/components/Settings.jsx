import { useState, useEffect } from "react";
import Navbar from "./Navbar";

function Settings() {
    const [userId, setUserId] = useState(null);
    const [followings, setFollowing] = useState([]);
    const [followers, setFollower] = useState([]);
    const [user, setUser] = useState();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        setUserId(storedId);
    })

    const handleFollowingList = async () => {
        try {
            if (!userId) {
                console.log("no User Id");
                return; // Don't fetch if no user ID is available
            }

            const response = await fetch(`https://localhost:7199/api/Users/Following/${userId}`); // Corrected URL with user ID
            if (!response.ok) {
                throw new Error(`Error fetching users: ${response.status}`);
            }
            const data = await response.json();
            setFollowing(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            // Handle errors gracefully (e.g., show an error message)
        }
    }

    const handleFollowerList = async () => {
        try {
            if (!userId) {
                console.log("no User Id");
                return; // Don't fetch if no user ID is available
            }

            const response = await fetch(`https://localhost:7199/api/Users/Follower/${userId}`); // Corrected URL with user ID
            if (!response.ok) {
                throw new Error(`Error fetching users: ${response.status}`);
            }
            const data = await response.json();
            setFollower(data);
        } catch (error) {
            console.log("Error fetching users:", error);
            // Handle errors gracefully (e.g., show an error message)
        }
    }

    const handleRemoveFollowing = async (followingId) => {
        try {
            if (!userId) {
                console.log("No User Id");
                return;
            }

            const response = await fetch(`https://localhost:7199/api/Friend/Remove/Following/${userId}/${followingId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Error removing the following person!`);
            }
            handleFollowingList();
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleRemoveFollower = async (followerId) => {
        try {
            if (!userId) {
                console.log("No User Id");
                return;
            }

            const response = await fetch(`https://localhost:7199/api/Friend/Remove/Follower/${userId}/${followerId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Error removing the follower!`);
            }
            handleFollowerList();
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleShowUserDetails = async () => {
        try {
            if (!userId) {
                console.log("No User Id!");
                return;
            }

            const response = await fetch(`https://localhost:7199/api/Users/${userId}`);
            if (!response.ok) {
                throw new Error(`Error fetching user details: ${response.statusText}`);
            }

            const data = await response.json();
            setUser(data);
            setName(data.name);
            setImage(data.image);
        } catch (error) {
            console.error("Error fetching user data:", error);
            // Handle errors gracefully (e.g., show an error message)
        } 
    };

    const handleUpdate = async (event) => {
        try {
            if (!userId) {
                console.log("No User Id!");
                return;
            }

            const responseName = await fetch(`https://localhost:7199/api/Users/Update/Name/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(name)
            });

            const responseImage = await fetch(`https://localhost:7199/api/Users/Update/Image/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(image)
            });

            if (!responseName.ok || !responseImage.ok) { 
                console.log("Error")
                throw new error(`Error updating user`);
            }
            alert("User updated successfully!");
            console.log('User updated successfully!');
        } catch (error) {
            console.error('Error updating user: ', error);
        }
    }

    const handleEditPassword = async (event) => {
        event.preventDefault();

        try {
            if (!userId) {
                console.log("No User Id!");
                return;
            }
            
            const response = await fetch(`https://localhost:7199/api/Users/${userId}`);
            if (!response.ok) {
                throw new Error(`Error fetching user details: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (oldPassword != data.password) {
                alert("Old password is incorrect");
                return;
            }

            if (newPassword != confirmNewPassword) {
                alert("New password does not match!");
                return;
            }

            if (newPassword.length < 6 || newPassword.length > 32) {
                alert("Password length must be in between 6 and 32 characters.");
                return;
            }

            const response2 = await fetch(`https://localhost:7199/api/Users/Update/Password/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPassword)
            });

            if (!response2.ok) {
                throw new Error("Error editing password.");
            }
            alert("Password updated successfully!");
            setConfirmNewPassword('');
            setOldPassword('');
            setNewPassword('');

        } catch(error) {
            console.error(error);
        }
    }
    

    return (
        <>
              <Navbar />
              <div className="row">
                  <div className="col-3">
                      <div className="list-group" id="list-tab" role="tablist">
                      
                          <a
                              className="list-group-item list-group-item-action"
                              id="list-following-list"
                              data-bs-toggle="list"
                              href="#list-following"
                              role="tab"
                              aria-controls="list-following"
                              onClick={handleFollowingList}
                          >
                              Manage Following
                          </a>
                          <a
                            className="list-group-item list-group-item-action"
                            id="list-followers-list"
                            data-bs-toggle="list"
                            href="#list-followers"
                            role="tab"
                            aria-controls="list-followers"
                            onClick={handleFollowerList}
                          >
                              Manage Followers
                          </a>
                          <a
                            className="list-group-item list-group-item-action"
                            id="list-account-settings-list"
                            data-bs-toggle="list"
                            href="#list-account-settings"
                            role="tab"
                            aria-controls="list-account-settings"
                            onClick={handleShowUserDetails}
                          >
                              Edit Account Settings
                          </a>
                          <a
                            className="list-group-item list-group-item-action"
                            id="list-password-settings-list"
                            data-bs-toggle="list"
                            href="#list-password-settings"
                            role="tab"
                            aria-controls="list-password-settings"
                          >
                              Edit Password Settings
                          </a>
                      </div>
                  </div>
                  <div className="col-9">
                      <div className="tab-content" id="nav-tabContent">
                          <div className="tab-pane fade" id="list-following" role="tabpanel" aria-labelledby="list-following-list">
                              <div className="chat-container">
                                  <div className="chat-messages">
                                    <div>
                                        {followings.length > 0 ? (
                                            followings.map((following) => (
                                                <div key={following.id} className="my-3 position-relative me-3 border rounded">
                                                    <img
                                                        className="rounded-circle"
                                                        src={following.image ?? "https://th.bing.com/th/id/OIP.0TsJGYhWWOy_hBFOH0hX-gAAAA?rs=1&pid=ImgDetMain"}
                                                        style={{ width: 40 + "px", height: 40 + "px" }}
                                                    />
                                                    <span className="card-text mx-3 fs-6 align-middle">
                                                        {following.name} {/* Use optional chaining to access name without errors */}
                                                    </span>
                                                    <button onClick={() => handleRemoveFollowing(following.id)} className="btn btn-danger position-absolute end-0">
                                                        Remove
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center my-3">You are not following any user!</p>
                                        )}
                                    </div>
                                  </div>
                              </div>
                          </div>
                          <div className="tab-pane fade" id="list-followers" role="tabpanel" aria-labelledby="list-followers-list">
                              <div className="chat-container">
                                  <div className="chat-messages">
                                    <div>
                                        {followers.length > 0 ? (
                                            followers.map((follower) => (
                                                <div key={follower.id} className="my-3 position-relative me-3 border rounded">
                                                    <img
                                                        className="rounded-circle"
                                                        src={follower.image ?? "https://th.bing.com/th/id/OIP.0TsJGYhWWOy_hBFOH0hX-gAAAA?rs=1&pid=ImgDetMain"}
                                                        style={{ width: 40 + "px", height: 40 + "px" }}
                                                    />
                                                    <span className="card-text mx-3 fs-6 align-middle">
                                                        {follower.name} {/* Use optional chaining to access name without errors */}
                                                    </span>
                                                    <button onClick={() => handleRemoveFollower(follower.id)} className="btn btn-danger position-absolute end-0">Remove</button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center my-3">You are not being followed by any user!</p>
                                        )}
                                    </div>

                                  </div>
                              </div>
                          </div>
                          <div className="tab-pane fade" id="list-account-settings" role="tabpanel" aria-labelledby="list-account-settings-list">
                              <div className="chat-container">
                                  <div className="chat-messages">
                                      <div>
                                        <div className="friend-card">
                                            {user && ( // Use conditional rendering to check if user exists
                                                <>
                                                    <img
                                                        src={user.image ?? "https://th.bing.com/th/id/OIP.0TsJGYhWWOy_hBFOH0hX-gAAAA?rs=1&pid=ImgDetMain"}
                                                        className="rounded-circle d-block mx-auto"
                                                        alt="User"
                                                        style={{ width: "200px", height: "200px" }}
                                                    />
                                                    <form onSubmit={handleUpdate}>
                                                        <div className="mb-3">
                                                            <label htmlFor="Image" className="form-label">Edit Image URL</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="Image"
                                                                value={image}
                                                                onChange={(e) => setImage(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="Name" className="form-label">Edit Name</label>
                                                            <input
                                                                required
                                                                type="text"
                                                                className="form-control"
                                                                id="name"
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="d-flex justify-content-center">
                                                            <button className="btn btn-info text-white">
                                                                Save
                                                            </button>
                                                        </div>
                                                    </form>
                                                </>
                                            )}
                                        </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="tab-pane fade" id="list-password-settings" role="tabpanel" aria-labelledby="list-password-settings-list">
                            <form 
                                onSubmit={handleEditPassword}
                            >
                                <label htmlFor="OldPassword" className="form-label mt-3">Enter Old Password</label>
                                <input
                                    required
                                    type="password"
                                    className="form-control"
                                    id="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <label htmlFor="NewPassword" className="form-label mt-3">Enter New Password</label>
                                <input
                                    required
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <label htmlFor="ConfirmNewPassword" className="form-label mt-3">Confirm New Password</label>
                                <input
                                    required
                                    type="password"
                                    className="form-control"
                                    id="confirmNewPassword"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                />
                                <div className="d-flex justify-content-center mt-3">
                                    <button type="submit" className="btn btn-info text-white">Save</button>
                                </div>
                            </form>
                          </div>
                      </div>
                  </div>
              </div>
        </>
    );
}

export default Settings;