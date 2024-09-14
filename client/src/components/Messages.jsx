import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Messages.css';


const Messages = () => {
  const therapistID = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/messages/${therapistID.
          therapistID
          }`);
        const data = await response.json();
        setMessages(data); // עדכן את setMessages כך שיתאים למבנה הנתונים
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [therapistID]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="messages-container">
      <h2>Messages</h2>
      <table className="messages-table">
        <thead>
          <tr>
            <th>Message ID</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {messages.length > 0 ? (
            messages.map((message) => (
              <tr key={message.MessageID}>
                <td>{message.MessageID}</td>
                <td>{message.Content}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No messages available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Messages;

