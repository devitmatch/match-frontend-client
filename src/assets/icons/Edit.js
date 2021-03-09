import React from 'react';
import PropTypes from 'prop-types';

function Edit({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="0 0 25 26">
      <path
        fill={color}
        fillRule="evenodd"
        d="M18.25 8.5L14.5 4.75l-10 10v3.75h3.75l10-10zm6.25 13v4H.5v-4h24zM17.46 1.79a.996.996 0 011.41 0l2.34 2.34c.39.39.39 1.02 0 1.41L19.25 7.5 15.5 3.75z"
      />
    </svg>
  );
}

Edit.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

Edit.defaultProps = {
  width: 23,
  height: 24,
  color: '#9BA7B7',
};

export default React.memo(Edit);
