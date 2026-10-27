import React, { useState } from 'react'

const fallback = (name) => `https://placehold.co/480x360?text=${encodeURIComponent(name || "Item")}`;

// Shows the item image, falling back to a text placeholder if it fails to load
export default function ItemImage({ src, name, className }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed || !src ? fallback(name) : src}
      alt={name}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
