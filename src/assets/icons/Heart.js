import React from 'react';
import PropTypes from 'prop-types';

function Heart({ width, height, color, active, activeColor }) {
  return (
    <svg width={width} height={height} viewBox="0 0 315 342">
      <path
        d="M0 200V0h200a100 100 90 010 200 100 100 90 01-200 0z"
        stroke={active ? activeColor : color}
        fill={active ? activeColor : color}
        transform="rotate(225 150 121)"
        strokeWidth={0}
      />
    </svg>
  );
}

Heart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  activeColor: PropTypes.string,
  active: PropTypes.bool,
};

Heart.defaultProps = {
  width: 21,
  height: 20,
  color: '#9BA7B7',
  activeColor: '#00C4C5',
  active: false,
};

export default React.memo(Heart);
