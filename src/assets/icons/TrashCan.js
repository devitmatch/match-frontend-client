import React from 'react';
import PropTypes from 'prop-types';

function TrashCan({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="0 0 15 20">
      <defs>
        <path
          id="prefix__a"
          d="M1 16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4H1v12zM14 1h-3.5l-1-1h-5l-1 1H0v2h14V1z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={color} xlinkHref="#prefix__a" />
      </g>
    </svg>
  );
}

TrashCan.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

TrashCan.defaultProps = {
  width: 20,
  height: 20,
  color: '#FFF',
};

export default React.memo(TrashCan);
