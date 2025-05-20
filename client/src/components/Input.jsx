import React from "react";

export default function Input({ type = "text", placeholder, className, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`search-input ${className || ""}`}
      {...props}
    />
  );
}
