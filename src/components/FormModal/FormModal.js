import React from 'react';
import PropTypes from 'prop-types';

import styles from './FormModal.module.scss';

import CloseIcon from '../../assets/icons/Close';

function FormModal({ onCancel, title, children, spaced }) {
  return (
    <div className={styles.modalContainer}>
      <div className={`${styles.modal} ${spaced ? styles.spaced : ''}`}>
        <button className={styles.close} type="button" onClick={onCancel}>
          <CloseIcon color="#00c4c5" />
        </button>
        <h3 className={styles.title}>{title}</h3>
        {children}
      </div>
      <button
        type="button"
        className={styles.modalOverlay}
        onClick={onCancel}
      />
    </div>
  );
}

FormModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  spaced: PropTypes.bool,
};

FormModal.defaultProps = {
  title: '',
  spaced: false,
};

export default FormModal;
