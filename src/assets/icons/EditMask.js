import React from 'react';
import PropTypes from 'prop-types';

function EditMask({ width, height, color }) {
  return (
    <svg width={width} height={height} viewBox="0 0 50 50">
      <path
        d="M35,39.64c-2-10.47-3.27-16.09-4.3-19.39l0-.1a9.91,9.91,0,0,1-.22-6.23,7.77,7.77,0,0,1,1.17-2.22l.16-.22L29.86,6.91l-2.73-.06,0,.55a2.06,2.06,0,0,1-.43,1.38,2.23,2.23,0,0,1-1.81.73h-.06a2.2,2.2,0,0,1-1.7-.77,2.1,2.1,0,0,1-.41-1.34l0-.55-2.73.06-1.88,4.57.17.22a8,8,0,0,1,1.16,2.22,10,10,0,0,1-.25,6.33c-1,3.3-2.28,8.92-4.3,19.39l-.06.34.29.18a15.93,15.93,0,0,0,4.68,2,20.64,20.64,0,0,0,5.09.51,20.61,20.61,0,0,0,5.08-.51,16,16,0,0,0,4.69-2L35,40ZM30.12,20.4h0ZM22.86,9.85l.28.19.06,0a2.18,2.18,0,0,0,.38.18.76.76,0,0,0,.16.06l.2.07.18,0,.15,0,.17,0h1a3.23,3.23,0,0,0,1.64-.64,2.17,2.17,0,0,1,.19,1.23A2.65,2.65,0,0,1,25,13.13a2.64,2.64,0,0,1-2.29-2.05A2.12,2.12,0,0,1,22.86,9.85Zm-3.53,1.49L20.75,7.9l1,0A3.07,3.07,0,0,0,22.16,9a3.27,3.27,0,0,0-.47,2.2,3.66,3.66,0,0,0,3.21,2.89H25a3.66,3.66,0,0,0,3.2-2.89A3.22,3.22,0,0,0,27.77,9a3.07,3.07,0,0,0,.38-1.16l1,0,1.41,3.44a9.23,9.23,0,0,0-1.14,2.26,10.32,10.32,0,0,0,0,6.1h-9a10.32,10.32,0,0,0,0-6.1A9.06,9.06,0,0,0,19.33,11.34ZM29.82,41.15a19.88,19.88,0,0,1-4.85.48,19.91,19.91,0,0,1-4.86-.48A15.16,15.16,0,0,1,16,39.49C18,29.51,19.16,24,20.18,20.7h9.57c1,3.25,2.22,8.73,4.17,18.79A15.22,15.22,0,0,1,29.82,41.15Z"
        fill={color}
      />
    </svg>
  );
}

EditMask.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

EditMask.defaultProps = {
  width: 32,
  height: 32,
  color: '#909eae',
};

export default React.memo(EditMask);