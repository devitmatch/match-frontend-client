import React from 'react';
import PropTypes from 'prop-types';

import styles from './ConfirmationModal.module.scss';

import CloseIcon from '../../assets/icons/Close';

function ConfirmationModal({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  deleteWarning,
}) {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <button className={styles.close} type="button" onClick={onCancel}>
          <CloseIcon color="#00c4c5" />
        </button>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <hr />
        <div className={styles.buttonsContainer}>
          <button
            type="button"
            className={
              deleteWarning
                ? styles.defaultDeleteButton
                : styles.defaultActionButton
            }
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className={styles.defaultActionButton}
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  deleteWarning: PropTypes.bool,
};

ConfirmationModal.defaultProps = {
  deleteWarning: false,
};

export default ConfirmationModal;
