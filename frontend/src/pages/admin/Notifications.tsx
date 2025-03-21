import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminDashboard.css';
import '../../styles/Notifications.css';

interface Notification {
  id: number;
  type: string;
  date: string;
  from: string;
  message: string;
  isRead: boolean;
  comments: { id: number; comment: string; author: string }[];
}

const Notifications: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [newCommentAuthor, setNewCommentAuthor] = useState<string>(''); 
  const [authorName, setAuthorName] = useState<string>(''); 
  const navigate = useNavigate();

  const messageTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = () => {
    if (messageTextareaRef.current) {
      messageTextareaRef.current.style.height = 'auto'; 
      messageTextareaRef.current.style.height = `${messageTextareaRef.current.scrollHeight}px`; 
    }
  };

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const addNewMessage = () => {
    if (!authorName || !newMessage) {
      alert('Please fill in your name and message');
      return;
    }

    const newNotif: Notification = {
      id: notifications.length + 1,
      type: 'New Message',
      date: new Date().toISOString(),
      from: authorName,
      message: newMessage,
      isRead: false,
      comments: [],
    };
    setNotifications((prev) => [...prev, newNotif]);
    setNewMessage('');
    setAuthorName('');
  };

  const addComment = (id: number) => {
    if (!newCommentAuthor || !newComment) {
      alert('Please fill in your name and comment');
      return;
    }

    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              comments: [
                ...notif.comments,
                { id: Date.now(), comment: newComment, author: newCommentAuthor },
              ],
            }
          : notif
      )
    );
    setNewComment('');
    setNewCommentAuthor(''); 
  };

  const deleteComment = (notifId: number, commentId: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notifId
          ? {
              ...notif,
              comments: notif.comments.filter((comment) => comment.id !== commentId),
            }
          : notif
      )
    );
  };

  const deleteMessage = (id: number) => {
    const updatedNotifications = notifications.filter((notif) => notif.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications)); 
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-navbar">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="admin-dashboard-menu-toggle-button"
          >
            ☰
          </button>
        </div>

        <div className={`admin-dashboard-sidebar ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li onClick={() => navigate('/admin/dashboard')}>Dashboard</li>
            <li onClick={() => navigate('/admin/booking')}>Booking</li>
            <li onClick={() => navigate('/admin/notifications')}>Notifications</li>
          </ul>
        </div>

        <div className={`admin-dashboard-main-content ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="admin-dashboard-centered-content">
          <h1>Notifications</h1>
        </div>

          <button onClick={markAllAsRead} className="admin-dashboard-mark-all-btn">
            Mark All as Read
          </button>

          <div className="chat-container">
            <div className="chat-history">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`chat-message ${notif.isRead ? 'incoming' : 'outgoing'}`}
                >
                  <div className="chat-sender">{notif.from}:</div>
                  <div className="chat-content">{notif.message}</div>
                  <div className="chat-timestamp">{notif.date}</div>

                  <div className="chat-actions">
                    <button onClick={() => deleteMessage(notif.id)} className="delete-message-btn">
                      Delete Message
                    </button>
                  </div>

                  <div className="chat-comments">
                    {notif.comments.map((comment) => (
                      <div key={comment.id} className="chat-message comment">
                        <strong>{comment.author}: </strong>{comment.comment}
                        <button
                          onClick={() => deleteComment(notif.id, comment.id)}
                          className="delete-comment-btn"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="chat-input">
                    <input
                      type="text"
                      value={newCommentAuthor}
                      onChange={(e) => setNewCommentAuthor(e.target.value)}
                      placeholder="Your Name"
                    />
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment"
                    />
                    <button onClick={() => addComment(notif.id)} className="add-comment-btn">
                      Add Comment
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your Name"
              />
              <textarea
                ref={messageTextareaRef}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  resizeTextarea(); 
                }}
                placeholder="Type a new message..."
              />
              <button onClick={addNewMessage} className="add-message-btn">
                Add Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
