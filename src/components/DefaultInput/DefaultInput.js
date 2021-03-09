import React from 'react';
import PropTypes from 'prop-types';

import styles from './DefaultInput.module.scss';

function DefaultInput({ type, name, label, placeholder, value, onChange }) {
  return (
    <div className={styles.DefaultInput}>
      {label && label.length ? (
        <label className={styles.inputLabel} htmlFor={name}>
          {label}
        </label>
      ) : null}
      <input
        id={name}
        className={styles.inputField}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

DefaultInput.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

DefaultInput.defaultProps = {
  type: 'text',
  label: '',
  placeholder: '',
};

export default DefaultInput;
