import React from 'react';
import PropTypes from 'prop-types';

function Pause({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="0 0 477.867 477.867">
      <path
        fill={color}
        d="M187.733,0H51.2c-9.426,0-17.067,7.641-17.067,17.067V460.8c0,9.426,7.641,17.067,17.067,17.067h136.533c9.426,0,17.067-7.641,17.067-17.067V17.067C204.8,7.641,197.159,0,187.733,0z"
      />
      <path
        fill={color}
        d="M426.667,0H290.133c-9.426,0-17.067,7.641-17.067,17.067V460.8c0,9.426,7.641,17.067,17.067,17.067h136.533c9.426,0,17.067-7.641,17.067-17.067V17.067C443.733,7.641,436.092,0,426.667,0z"
      />
    </svg>
  );
}

Pause.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

Pause.defaultProps = {
  width: 18,
  height: 18,
  color: '#FFF',
};

export default React.memo(Pause);
