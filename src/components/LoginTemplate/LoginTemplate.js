import React from 'react';
import PropTypes from 'prop-types';

import logoMatch from '../../assets/images/Logo-Match.svg';
import matchLoginImage from '../../assets/images/Match-Login-Image.png';

import styles from './LoginTemplate.module.scss';

function LoginTemplate({ children, withHeader }) {
  return (
    <div className={styles.LoginTemplate}>
      {withHeader ? (
        <header className={styles.LoginTemplateHeader}>
          <img
            className={styles.LoginTemplateHeaderLogo}
            src={logoMatch}
            alt="Match."
          />
        </header>
      ) : null}
      <section className={styles.LoginTemplateContent}>
        <div className={styles.LoginTemplateChild}>{children}</div>
        <div className={styles.LoginTemplateImage}>
          <img
            className={styles.LoginTemplateImageFile}
            src={matchLoginImage}
            alt="App Match."
          />
        </div>
      </section>
    </div>
  );
}

LoginTemplate.propTypes = {
  children: PropTypes.element,
  withHeader: PropTypes.bool,
};

LoginTemplate.defaultProps = {
  children: null,
  withHeader: false,
};

export default LoginTemplate;
