import React from 'react';
import PropTypes from 'prop-types';

import styles from './Loading.module.scss';

export default function UploadProgress({ line, fixed }) {
  return (
    <div
      className={`${styles.container} ${line ? styles.line : ''} ${
        fixed ? styles.fixed : ''
      }`}
    >
      <div className={styles.ldsDualRing} />
    </div>
  );
}

UploadProgress.propTypes = {
  line: PropTypes.bool,
  fixed: PropTypes.bool,
};

UploadProgress.defaultProps = {
  line: false,
  fixed: false,
};
