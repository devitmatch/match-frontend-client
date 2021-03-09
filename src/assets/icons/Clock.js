import React from 'react';
import PropTypes from 'prop-types';

function Clock({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="-1 -1 13 14">
      <defs>
        <filter
          id="clock"
          width="206.1%"
          height="206.1%"
          x="-53%"
          y="-37.9%"
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
          id="clock__b"
          d="M7 .4a6.6 6.6 0 110 13.2A6.6 6.6 0 017 .4zm0 1.2a5.4 5.4 0 100 10.8A5.4 5.4 0 007 1.6zm0 1.2a.6.6 0 01.592.503L7.6 3.4v3.351l1.624 1.625a.599.599 0 01.07.765l-.07.083a.599.599 0 01-.765.07l-.083-.07-1.8-1.8a.6.6 0 01-.169-.33L6.4 7V3.4a.6.6 0 01.6-.6z"
        />
      </defs>
      <g fill="none" fillRule="evenodd" transform="translate(-1 -1)">
        <use fill="#000" filter="url(#clock)" xlinkHref="#clock__b" />
        <use fill={color} xlinkHref="#clock__b" />
      </g>
    </svg>
  );
}

Clock.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

Clock.defaultProps = {
  width: 12,
  height: 12,
  color: '#4B5768',
};

export default React.memo(Clock);
