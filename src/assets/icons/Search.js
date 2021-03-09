import React from 'react';
import PropTypes from 'prop-types';

function Search({ width, height, color, notificationColor, notification }) {
  return (
    <svg width={width} height={height} viewBox="0 0 19 19">
      <path
        fill={color}
        fillRule="evenodd"
        d="M7.55-.167c4.225 0 7.65 3.489 7.65 7.792a7.85 7.85 0 01-1.641 4.823l4.077 4.154a.929.929 0 010 1.296.888.888 0 01-1.188.076l-.084-.076-4.079-4.153a7.53 7.53 0 01-4.735 1.672c-4.225 0-7.65-3.489-7.65-7.792S3.325-.167 7.55-.167zm0 1.834c-3.23 0-5.85 2.667-5.85 5.958 0 3.29 2.62 5.958 5.85 5.958a5.777 5.777 0 004.102-1.71.226.226 0 01.032-.038l.036-.032a5.996 5.996 0 001.68-4.178c0-3.29-2.62-5.958-5.85-5.958z"
      />
      {notification && (
        <ellipse
          cx={4.95}
          cy={5.042}
          fill={notificationColor}
          rx={4.95}
          ry={5.042}
          transform="translate(11 .917)"
        />
      )}
    </svg>
  );
}

Search.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  notificationColor: PropTypes.string,
  notification: PropTypes.bool,
};

Search.defaultProps = {
  width: 19,
  height: 19,
  color: '#FFF',
  notificationColor: '#FF634C',
  notification: false,
};

export default React.memo(Search);
