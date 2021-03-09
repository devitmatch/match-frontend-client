import React from 'react';
import PropTypes from 'prop-types';

function Close({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24">
      <path
        fill={color}
        fillRule="evenodd"
        transform="translate(5 5)"
        d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z"
      />
    </svg>
  );
}

Close.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

Close.defaultProps = {
  width: 24,
  height: 24,
  color: '#FFF',
};

export default React.memo(Close);
