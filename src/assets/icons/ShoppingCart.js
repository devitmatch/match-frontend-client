import React from 'react';
import PropTypes from 'prop-types';

function ShoppingCart({ width, height, color, notification }) {
  return (
    <svg width={width} height={height} viewBox="0 0 22 23">
      <path
        fill={color}
        id="shopping_cart"
        d="M7.2 16.5c-.99 0-1.791.825-1.791 1.833 0 1.009.801 1.834 1.791 1.834.99 0 1.8-.825 1.8-1.834 0-1.008-.81-1.833-1.8-1.833zM1.8 1.833v1.834h1.8l3.24 6.957-1.215 2.246c-.144.257-.225.56-.225.88 0 1.008.81 1.833 1.8 1.833H18V13.75H7.578a.225.225 0 01-.225-.23l.027-.11.81-1.493h6.705c.675 0 1.269-.376 1.575-.944l3.222-5.95a.909.909 0 00.108-.44.911.911 0 00-.9-.916H5.589l-.846-1.834H1.8zM16.2 16.5c-.99 0-1.791.825-1.791 1.833 0 1.009.801 1.834 1.791 1.834.99 0 1.8-.825 1.8-1.834 0-1.008-.81-1.833-1.8-1.833z"
      />
      <g fillRule="evenodd" transform="translate(.2 .75)">
        {notification && (
          <ellipse
            cx={4.95}
            cy={5.042}
            rx={4.95}
            ry={5.042}
            transform="translate(11.7)"
          />
        )}
      </g>
    </svg>
  );
}

ShoppingCart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  notification: PropTypes.bool,
};

ShoppingCart.defaultProps = {
  width: 22,
  height: 22,
  color: '#FFF',
  notification: false,
};

export default React.memo(ShoppingCart);
