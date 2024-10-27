// src/Components/Seller_section/AddProduct/Message.jsx
import React from 'react';

function Message({ successMessage, errorMessage }) {
  return (
    <>
      {successMessage && <p className="message success">{successMessage}</p>}
      {errorMessage && <p className="message error">{errorMessage}</p>}
    </>
  );
}

export default Message;
