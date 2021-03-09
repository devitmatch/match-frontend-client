import React from 'react';
import PropTypes from 'prop-types';

function Arrow({ width, height, color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="20 21 12 10"
    >
      <g fill="none" fillRule="evenodd" transform="rotate(90 25.5 25.5)">
        <path
          fill={color}
          d="M26.504 19.218l.014.011.072.06.01.012 3.5 3.454.078.087c.257.334.235.814-.07 1.122l-.087.077c-.333.258-.814.235-1.122-.069l-2.044-2.018v9.182l-.007.108c-.052.421-.412.747-.848.747-.472 0-.855-.382-.855-.855v-9.182l-2.044 2.018-.088.076c-.337.253-.817.224-1.122-.084-.331-.336-.328-.877.008-1.209l3.5-3.454.014-.013c.015-.015.03-.029.047-.042l.027-.02.012-.01c.021-.015.043-.03.065-.043l.032-.018c.033-.017.067-.033.103-.046l.016-.006c.03-.01.06-.02.092-.027l.035-.007c.05-.01.104-.015.158-.015l-.081.004.038-.003h.077l.042.002.077.01.03.007c.028.006.054.013.08.021l.036.013c.067.025.131.059.19.1l.015.01z"
        />
      </g>
    </svg>
  );
}

Arrow.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

Arrow.defaultProps = {
  width: 18,
  height: 11,
  color: '#4B5768',
};

export default React.memo(Arrow);
