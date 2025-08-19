import React from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useState } from "react";

const UploadImage = () => {
  const [preview, setPreview] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    var reader = new FileReader();
    reader.onloadend = function () {};
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h1></h1>
    </div>
  );
};

export default UploadImage;
