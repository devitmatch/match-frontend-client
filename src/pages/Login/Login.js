import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Api from '../../libs/Api';
import { registerUser } from '../../store/actions/user';

import text from '../../libs/i18n';
import logoMatch from '../../assets/images/logo_match_2.svg';
import loginScreenImage from '../../assets/images/imagem-tela-login.png';

import styles from './Login.module.scss';

export default function Login() {
  const language = useSelector((state) => state.settings.language);

  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wrongEmailFormat, setWrongEmailFormat] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const history = useHistory();

  const getSalutation = () => {
    const hour = new Date().getHours();
    if (hour < 5) {
      return text('goodNight', language);
    }
    if (hour < 8) {
      return text('goodMorning', language);
    }
    if (hour < 12) {
      return text('goodMorning', language);
    }
    if (hour < 18) {
      return text('goodAfternoon', language);
    }
    return text('goodNight', language);
  };

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

  const tryLogin = async (event) => {
    event.preventDefault();

    if (verifyEmail(email) && verifyPassword(password)) {
      const res = await Api.auth(email, password);

      if (res && res.status === 200) {
        const user = await Api.getUser();

        const client = await Api.getClient();

        if (user.is_client) {
          dispatch(registerUser({ ...user, clientId: client.result[0].id }));
        }
        history.push('/');
      } else {
        setWrongCredentials(true);
      }
    }
  };

  return (
    <div className={styles.login}>
      <header className={styles.loginHeader}>
        <img className={styles.headerLogo} src={logoMatch} alt="Match." />
      </header>
      <section className={styles.loginContent}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>{getSalutation()}</h2>
          <form className={styles.formElement} onSubmit={tryLogin}>
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
            <div className={styles.passwordRow}>
              <label htmlFor="password">{text('password', language)}</label>
              <Link to="/reset_password" className={styles.forgotPasswordLink}>
                {text('forgotPassword', language)}
              </Link>
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
            <div className={styles.submitRow}>
              <button type="submit">{text('enter', language)}</button>
              {wrongCredentials && (
                <span className={styles.error}>
                  {text('wrongCredentials', language)}
                </span>
              )}
            </div>
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
