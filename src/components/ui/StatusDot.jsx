import React from 'react';

export default function StatusDot({ variant = 'neutral', pulse = false }) {
  return (
    <span
      className={`status-dot status-dot--${variant} ${pulse ? 'status-dot--pulse' : ''}`}
    />
  );
}
