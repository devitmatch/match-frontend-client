/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';

import styles from './CheckInput.module.scss';

function CheckInput({ text, onChange, value, error, topMenu, card }) {
  return (
    <div
      className={`${styles.checkInputContainer} ${error ? styles.error : ''} ${
        topMenu === true && styles.topMenu
      } ${card === true && styles.cardCheck}`}
    >
      <label
        className={`${styles.checkmarkcontainer} ${
          topMenu && value ? styles.marked : ''
        }`}
      >
        {text}
        <input
          type="checkbox"
          onChange={() => onChange(!value)}
          checked={value}
        />
        <span
          className={styles.checkmark}
          data-check={value ? 'mark' : 'nomark'}
        />
      </label>
    </div>
  );
}

CheckInput.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  error: PropTypes.bool,
  topMenu: PropTypes.bool,
  card: PropTypes.bool,
};

CheckInput.defaultProps = {
  text: '',
  error: false,
  topMenu: false,
  card: false,
};

export default CheckInput;
