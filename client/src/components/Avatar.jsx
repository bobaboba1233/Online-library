import React from "react";
import { Link } from "react-router-dom";

export default function Avatar({ src }) {
  return (
    <Link to="/profile" className="avatar" style={{ display: 'inline-block' }}>
      <img src={src} alt="avatar" />
    </Link>
  );
};