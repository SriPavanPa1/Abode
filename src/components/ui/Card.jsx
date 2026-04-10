import React from 'react';

export default function Card({
  children,
  className = '',
  variant = 'default',
  header,
  headerAction,
  onClick,
  ...props
}) {
  const classes = [
    'card',
    variant === 'glass' && 'card--glass',
    onClick && 'card--interactive',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {(header || headerAction) && (
        <div className="card__header">
          <div>
            {typeof header === 'string' ? (
              <h3 className="card__title">{header}</h3>
            ) : (
              header
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
