import React from 'react';
import PropTypes from 'prop-types';

function Upload({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 19">
      <path
        fill={color}
        fillRule="evenodd"
        d="M14.855 8.5c.436 0 .796.326.848.748l.007.107v6.8c0 1.362-1.083 2.467-2.44 2.55l-.165.005h-10.5c-1.378 0-2.514-1.052-2.6-2.393L0 16.155v-6.8a.855.855 0 011.703-.107l.007.107v6.8c0 .426.337.785.782.838l.113.007h10.5c.461 0 .834-.327.888-.74l.007-.105v-6.8c0-.472.383-.855.855-.855zM8.426.168l.087.074 3.5 3.4a.855.855 0 01-1.103 1.302l-.088-.076-1.987-1.93v9.845a.855.855 0 01-1.703.108l-.007-.108V2.816L5.013 4.868a.855.855 0 01-1.122.06l-.087-.077a.855.855 0 01-.06-1.123l.078-.086 3.5-3.4A.855.855 0 018.426.168z"
      />
    </svg>
  );
}

Upload.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

Upload.defaultProps = {
  width: 16,
  height: 19,
  color: '#9BA7B7',
};

export default React.memo(Upload);
