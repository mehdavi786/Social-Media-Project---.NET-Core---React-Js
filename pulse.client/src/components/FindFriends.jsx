import { useState, useEffect } from "react";


function FindFriends() {
    const [userId, setUserId] = useState(null);
    const [findFriends, setFindFriends] = useState([]);

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        setUserId(storedId);

        const fetchUsers = async () => {
            try {
                if (!userId) {
                    return; // Don't fetch if no user ID is available
                }

                const response = await fetch(`https://localhost:7199/api/Users/findFriends/${userId}`); // Corrected URL with user ID
                if (!response.ok) {
                    throw new Error(`Error fetching users: ${response.status}`);
                }
                const data = await response.json();
                setFindFriends(data);
            } catch (error) {
                console.error("Error fetching users:", error);
                // Handle errors gracefully (e.g., show an error message)
            }
        };
        if (userId) { 
            fetchUsers();
        }
    }, [userId])

    const handleFollow = async (friendId) => {
        try {
            let response = await fetch(`https://localhost:7199/api/Users/Follow/${userId}/${friendId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new error("Error in following!");
            }
            window.location.reload();
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="friend-carousel carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {findFriends.length > 0 ? (
                        findFriends.map((findFriend, index) => (
                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={findFriend.id}>
                                <div className="friend-card">
                                    <img
                                        src={findFriend.image ?? "https://th.bing.com/th/id/OIP.0TsJGYhWWOy_hBFOH0hX-gAAAA?rs=1&pid=ImgDetMain"}
                                        className="rounded-circle d-block mx-auto"
                                        alt={findFriend.name}
                                        style={{ width: "300px", height: "300px" }}
                                    />
                                    <p className="card-text text-center">{findFriend.name}</p>
                                    <div className="d-flex justify-content-center">
                                        <button type="button" className="btn btn-primary" onClick={() => handleFollow(findFriend.id)}>
                                            Follow
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center">
                                <span className="align-middle">
                                    <h4>
                                        No users to show.
                                    </h4>
                                </span>
                        </div>
                    )}
                </div>
                <button className="carousel-control-prev bg-dark" type="button" data-bs-target=".friend-carousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon text-secondary" aria-hidden="true"></span>
                    <span className="visually-hidden text-secondary">Previous</span>
                </button>
                <button className="carousel-control-next bg-dark" type="button" data-bs-target=".friend-carousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </>

    );
}

export default FindFriends;