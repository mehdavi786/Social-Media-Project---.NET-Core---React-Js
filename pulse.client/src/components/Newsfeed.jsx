import FindFriends from "./FindFriends";
import Navbar from "./Navbar";
import PostForNewsfeed from "./PostForNewsfeed";
import Post from "./PostForProfile";
import Share from "./Share";

function Newsfeed() {
    return (
        <>
            <Navbar />
            <div className="d-flex">
                <div className="w-100 vh-100 justify-content-center align-items-center p-2 my-5">
                    <div className="my-5">
                        <Share />
                    </div>

                    <hr />

                    <div className="my-5">
                        <FindFriends />
                    </div>
                </div>
                <div className="vr my-2"></div>
                <div className="w-100 vh-100 bg-light my-2 overflow-y-scroll p-2">
                    <PostForNewsfeed />
                </div>
            </div>
        </>

    );
}

export default Newsfeed;