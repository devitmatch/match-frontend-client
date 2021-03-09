import React from 'react';
import PropTypes from 'prop-types';

import styles from './DefaultButton.module.scss';

function DefaultButton({ text, onClick }) {
  return (
    <button className={styles.DefaultButton} onClick={onClick} type="button">
      {text}
    </button>
  );
}

DefaultButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DefaultButton;
