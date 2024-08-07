import Navbar from "../Navbar";
import { useState, useEffect } from "react";
import "./Chat.css";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

function ChatInterface() {
  const [userId, setUserId] = useState(null);
  const [conn, setConn] = useState(null);
  const [chats, setChat] = useState([]);
  const [persons, setPersons] = useState([]);
  const [recipientId, setRecipientId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [activeRecipient, setActiveRecipient] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    setUserId(storedId);

    if (!userId) {
      return;
    }

    const createConnection = async () => {
      if (conn) {
        conn.stop();
      }
      const newConn = new HubConnectionBuilder()
        .withUrl("https://localhost:7199/chat")
        .configureLogging(LogLevel.Information)
        .build();

      newConn.on("ReceivePrivateMessage", (user, recipient, msgFromServer) => {
        // console.log(groupname);
        console.log(user.name, ":", msgFromServer);
        setUser(user);
        // setRecipient(recipient);
        setMessages((prevMessages) => [
          ...prevMessages,
          { user, recipient, msgFromServer },
        ]);
      });

      await newConn
        .start()
        .then(() => console.log("SignalR Connected."))
        .catch((err) => console.error(err));

      setConn(newConn);
    };

    createConnection();

    const fetchUsers = async () => {
      try {
        if (!userId) {
          return; // Don't fetch if no user ID is available
        }

        const response = await fetch(
          `https://localhost:7199/api/Users/ChatPersons/${userId}`
        ); // Corrected URL with user ID
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.status}`);
        }
        const data = await response.json();
        setPersons(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle errors gracefully (e.g., show an error message)
      }
    };

    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  const displayChat = async (personId) => {
    setMessages([]);
    setActiveRecipient(personId);
    try {
      const response = await fetch(
        `https://localhost:7199/api/Chat/${userId}/${personId}`
      ); // Replace with your chat fetch endpoint
      if (!response.ok) {
        throw new Error(`Error fetching chat: ${response.status}`);
      }
      const chatData = await response.json();
      setChat(chatData);
      setRecipientId(personId);
      //   setActivePersonId(personId);
    } catch (error) {
      console.error("Error fetching chat:", error);
      // Handle errors gracefully (e.g., show an error message)
    }
  };

  const handleSendChat = async () => {
    try {
      let response = await fetch(
        `https://localhost:7199/api/Chat/CreateChat/${userId}/${recipientId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new Error("Cannot send message!");
      }
      setMessage("");

      if (conn) {
        // await conn.invoke("JoinPrivateChat", userId, recipientId, message);
        await conn.invoke("JoinPrivateChat", userId, recipientId, message);
      } else {
        console.error("Connection not established");
      }

      // response = await fetch(`https://localhost:7199/api/Chat/${userId}/${recipientId}`);
      // if (!response.ok) {
      //     throw new Error("Cannot send message!");
      // }
      // const chatData = await response.json();
      // setChat(chatData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="row">
        <div className="col-3">
          <div className="list-group" id="list-tab" role="tablist">
            {persons.map((person) => (
              <a
                key={person.id}
                className="list-group-item list-group-item-action"
                id="list-messages-list"
                data-bs-toggle="list"
                href="#list-messages"
                role="tab"
                aria-controls="list-messages"
                onClick={() => displayChat(person.id)}
              >
                <img
                  className="mx-3 rounded-circle"
                  src={
                    person.image ??
                    "https://th.bing.com/th/id/OIP.0TsJGYhWWOy_hBFOH0hX-gAAAA?rs=1&pid=ImgDetMain"
                  }
                  style={{ width: "40px", height: "40px" }}
                />
                {person.name}
              </a>
            ))}
          </div>
        </div>
        <div className="col-9">
          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade"
              id="list-messages"
              role="tabpanel"
              aria-labelledby="list-messages-list"
            >
              <div className="chat-container overflow-y-scroll">
                <div className="chat-messages ">
                  {chats.map((chat) => (
                    <div key={chat.id}>
                      <p
                        key={chat.id}
                        className={`text-${
                          chat.senderId == userId ? "end" : "start"
                        }`}
                      >
                        {chat.message}
                      </p>
                    </div>
                  ))}

                  {messages.map((msg, index) => ( 
                    (<p
                      key={index}
                      className={`text-${
                        msg.user.id == userId ? "end" : "start"
                      }`}
                    >
                      {msg.msgFromServer}
                    </p>
                  )))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChat();
                  }}
                  className="chat-input d-flex align-items-center"
                >
                  <input
                    required
                    type="text"
                    className="form-control flex-grow-1"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <button className="btn btn-primary">Send</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatInterface;
