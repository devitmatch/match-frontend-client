import React from 'react';

function Reset() {
  return (
    <svg width={16} height={22} viewBox="0 0 16 22">
      <defs>
        <path
          id="reset_a"
          d="M8 5v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L2.7 13.8A5.87 5.87 0 012 11c0-3.31 2.69-6 6-6zm6.76 1.74L13.3 8.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"
        />
        <path id="reset_c" d="M0 0h50v50H0z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="reset_b" fill="#fff">
          <use xlinkHref="#reset_a" />
        </mask>
        <g mask="url(#reset_b)">
          <use
            fill="#808D9E"
            xlinkHref="#reset_c"
            transform="translate(-17 -14)"
          />
        </g>
      </g>
    </svg>
  );
}

export default React.memo(Reset);
