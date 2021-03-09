import React from 'react';
import PropTypes from 'prop-types';

function Play({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="0 0 51 52">
      <g fill="none" fillRule="evenodd">
        <path
          fill={color}
          d="M33.211 27.394l-11.764 5.882A1 1 0 0120 32.382V20.618a1 1 0 011.447-.894l11.764 5.882a1 1 0 010 1.788z"
        />
      </g>
    </svg>
  );
}

Play.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

Play.defaultProps = {
  width: 51,
  height: 51,
  color: '#FFF',
};

export default React.memo(Play);
