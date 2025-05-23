import React from "react";

export default function Avatar({ src }) {
  return (
    <div className="avatar">
      <img src={src} alt="avatar" />
    </div>
  );
}
