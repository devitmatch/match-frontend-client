import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Api from '../../libs/Api';
import text from '../../libs/i18n';

import logoMatch from '../../assets/images/logo_match_2.svg';
import loginScreenImage from '../../assets/images/imagem-tela-login.png';

import styles from './ForgotPassword.module.scss';

export default function ForgotPassword() {
  const language = useSelector((state) => state.settings.language);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messageFeedback, setMessageFeedback] = useState('');
  const [wrongEmailFormat, setWrongEmailFormat] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);

  const { forgotToken } = useParams();

  const verifyEmail = (value) => {
    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test(String(value).toLowerCase())) {
      return true;
    }
    setWrongEmailFormat(true);
    return false;
  };

  const verifyPassword = (value) => {
    if (value) {
      return true;
    }
    setPasswordRequired(true);
    return false;
  };

  const tryResetPassword = async (event) => {
    event.preventDefault();

    if ((!forgotToken || !forgotToken.length) && email && email.length) {
      if (verifyEmail(email)) {
        const res = await Api.getResetPassword(email);

        if (res && res.status === 200) {
          setMessageFeedback('resetPasswordEmailSent');
        }
      }
    } else if (
      forgotToken &&
      forgotToken.length &&
      password &&
      password.length
    ) {
      if (verifyPassword(password)) {
        const res = await Api.postResetPassword({
          token: forgotToken,
          new_password: password,
        });

        if (res && res.status === 200) {
          setMessageFeedback('passwordChanged');
        }
      }
    }
  };

  return (
    <div className={styles.forgotPassword}>
      <header className={styles.loginHeader}>
        <img className={styles.headerLogo} src={logoMatch} alt="Match." />
      </header>
      <section className={styles.loginContent}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>
            {text('resetPasswordHere', language)}
          </h2>
          <form className={styles.formElement} onSubmit={tryResetPassword}>
            {(!forgotToken || !forgotToken.length) && (
              <div className={styles.emailRow}>
                <label htmlFor="email">{text('email', language)}</label>
                <input
                  id="email"
                  type="email"
                  placeholder={text('emailPlaceholder', language)}
                  autoComplete="on"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setWrongEmailFormat(false);
                    setWrongCredentials(false);
                  }}
                  value={email}
                />
                {wrongEmailFormat && (
                  <span className={styles.error}>
                    {text('invalidEmail', language)}
                  </span>
                )}
              </div>
            )}
            {forgotToken && forgotToken.length && (
              <div className={styles.passwordRow}>
                <label htmlFor="email">{text('password', language)}</label>
                <input
                  id="password"
                  type="password"
                  placeholder={text('passwordPlaceholder', language)}
                  autoComplete="off"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordRequired(false);
                    setWrongCredentials(false);
                  }}
                  value={password}
                />
                {passwordRequired && (
                  <span className={styles.error}>
                    {text('passwordRequired', language)}
                  </span>
                )}
              </div>
            )}
            <div className={styles.submitRow}>
              <button type="submit">{text('resetPassword', language)}</button>
              {wrongCredentials && (
                <span className={styles.error}>
                  {text('wrongCredentials', language)}
                </span>
              )}
            </div>
            {messageFeedback && messageFeedback.length && (
              <p className={styles.submitFeedback}>
                {text(messageFeedback, language)}
              </p>
            )}
          </form>
        </div>
        <div className={styles.imageContainer}>
          <img
            className={styles.loginScreenImage}
            src={loginScreenImage}
            alt="App Match."
          />
        </div>
      </section>
    </div>
  );
}
