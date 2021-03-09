import React from 'react';
import PropTypes from 'prop-types';

function Notification({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="0 0 21 22">
      <g fill="none" fillRule="evenodd">
        <path
          fill={color}
          d="M10.757 19.253c.694 0 1.127.765.779 1.377A2.691 2.691 0 019.2 22a2.691 2.691 0 01-2.335-1.37c-.331-.581.043-1.301.676-1.372l.102-.005h3.114zM9.2 1.833c3.901 0 7.078 3.161 7.197 7.106l.003.229v4.584c0 .967.734 1.759 1.666 1.829l.254.01c1 .11 1.039 1.588.115 1.802l-.115.02-.12.006H.2l-.12-.006c-1.04-.114-1.04-1.707 0-1.821l.254-.011a1.817 1.817 0 001.66-1.685L2 13.752V9.168c0-4.05 3.224-7.335 7.2-7.335zm0 1.834c-2.915 0-5.29 2.352-5.396 5.295l-.004.206v4.584c0 .537-.113 1.047-.317 1.507l-.093.194-.073.133h11.765l-.072-.133a3.692 3.692 0 01-.387-1.286l-.019-.232-.004-.183V9.168c0-3.038-2.418-5.501-5.4-5.501z"
        />
      </g>
    </svg>
  );
}

Notification.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

Notification.defaultProps = {
  width: 21,
  height: 22,
  color: '#FFF',
};

export default React.memo(Notification);
