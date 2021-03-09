import React from 'react';
import PropTypes from 'prop-types';

function Message({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 30">
      <defs>
        <filter
          id="message"
          width="170%"
          height="170%"
          x="-35%"
          y="-25%"
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
          id="message__b"
          d="M21.99 12c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill="#000" filter="url(#message)" xlinkHref="#message__b" />
        <use fill={color} xlinkHref="#message__b" />
      </g>
    </svg>
  );
}

Message.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

Message.defaultProps = {
  width: 28,
  height: 28,
  color: '#707D8E',
};

export default React.memo(Message);
