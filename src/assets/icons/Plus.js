import React from 'react';
import PropTypes from 'prop-types';

function Plus({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="0 0 15 15">
      <path
        fill={color}
        fillRule="evenodd"
        d="M8.334 15.216V8.909h5.876V6.93H8.334V.667H6.246v6.262H.4v1.98h5.846v6.307z"
      />
    </svg>
  );
}

Plus.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

Plus.defaultProps = {
  width: 15,
  height: 15,
  color: '#FFF',
};

export default React.memo(Plus);
