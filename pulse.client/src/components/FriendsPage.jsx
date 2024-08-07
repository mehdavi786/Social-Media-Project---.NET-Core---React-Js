import FindFriends from './FindFriends';
import Navbar from './Navbar';



function FriendsPage() {
  return (
      <>
          <Navbar />
          <div className="my-3"> 
              <FindFriends />
          </div>
      </>
  );
}

export default FriendsPage;