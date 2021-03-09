import React from 'react';
import PropTypes from 'prop-types';

function EditFilter({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="0 0 32 32">
      <rect y="3" width="17" height="4" fill={color} />
      <polygon
        points="32 3 25 3 25 0 21 0 21 10 25 10 25 7 32 7 32 3"
        fill={color}
      />
      <polygon
        points="7 11 7 14 0 14 0 18 7 18 7 21 11 21 11 11 7 11"
        fill={color}
      />
      <rect x="15" y="14" width="17" height="4" fill={color} />
      <rect y="25" width="11" height="4" fill={color} />
      <polygon
        points="32 25 19 25 19 22 15 22 15 32 19 32 19 29 32 29 32 25"
        fill={color}
      />
    </svg>
  );
}

EditFilter.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

EditFilter.defaultProps = {
  width: 32,
  height: 32,
  color: '#C8CFD8',
};

export default React.memo(EditFilter);
