import React from "react";

const ReplyCard = ({ author, content, createdAt }) => {
  return (
    <div className="reply-card-container">
      <div className="reply-card-header">
        <label>Author: {author}</label>
        <label>Created At: {createdAt}</label>
      </div>
      <div className="reply-card-content">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default ReplyCard;
