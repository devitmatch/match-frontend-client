import React from 'react';
import PropTypes from 'prop-types';

import styles from './FiltersModal.module.scss';

function FiltersModal({ title, children, fixedHeight, fullWidth }) {
  return (
    <div className={styles.modalContainer}>
      <div
        className={`${styles.modal} ${fixedHeight ? styles.fixedHeight : ''} ${
          fullWidth ? styles.fullWidth : ''
        }`}
      >
        <h3 className={styles.title}>{title}</h3>
        {children}
      </div>
      <div
        // type="button"
        className={styles.modalOverlay}
        // onClick={onCancel}
      />
    </div>
  );
}

FiltersModal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  fixedHeight: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

FiltersModal.defaultProps = {
  title: '',
  fixedHeight: false,
  fullWidth: false,
};

export default FiltersModal;
