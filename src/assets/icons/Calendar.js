import React from 'react';
import PropTypes from 'prop-types';

function Calendar({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24">
      <defs>
        <filter
          id="prefix__a"
          width="170%"
          height="163.6%"
          x="-35%"
          y="-22.7%"
          filterUnits="objectBoundingBox"
        >
          <feOffset dy={2} in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
            stdDeviation={2}
          />
          <feColorMatrix
            in="shadowBlurOuter1"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
          />
        </filter>
        <path
          id="prefix__b"
          d="M14 0a1 1 0 01.993.883L15 1v1h2a3 3 0 012.995 2.824L20 5v14a3 3 0 01-3 3H3a3 3 0 01-3-3V5a3 3 0 013-3h2V1A1 1 0 016.993.883L7 1v1h6V1a1 1 0 011-1zm4 10H2v9a1 1 0 00.883.993L3 20h14a1 1 0 001-1v-9zM5 4H3a1 1 0 00-1 1v3h16V5a1 1 0 00-.883-.993L17 4h-2v1a1 1 0 01-1.993.117L13 5V4H7v1a1 1 0 01-1.993.117L5 5V4z"
        />
      </defs>
      <g fill="none" fillRule="evenodd" transform="translate(2 1)">
        <use fill="#000" filter="url(#prefix__a)" xlinkHref="#prefix__b" />
        <use fill={color} xlinkHref="#prefix__b" />
      </g>
    </svg>
  );
}

Calendar.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

Calendar.defaultProps = {
  width: 24,
  height: 24,
  color: '#707D8E',
};

export default React.memo(Calendar);
