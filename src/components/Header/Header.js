import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import styles from './Header.module.scss';
import translate from '../../libs/i18n';
import Api from '../../libs/Api';
import useOutsideClick from '../../libs/useOutsideClick';
import { setLanguage } from '../../store/actions/settings';
import { unregisterUser } from '../../store/actions/user';

import logoMatch from '../../assets/images/logo_match_2.svg';
import ShoppingCartIcon from '../../assets/icons/ShoppingCart';
import NotificationIcon from '../../assets/icons/Notification';
import Avatar from '../../assets/icons/Avatar';
import Cart from '../Cart/Cart';
import Notifications from '../Notifications/Notifications';
import Chat from '../Chat/Chat';

function Header() {
  const language = useSelector((state) => state.settings.language);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const [inputState, setInputState] = useState('closed');
  const [cart, setCart] = useState(false);
  const [openedNotifications, setOpenedNotifications] = useState(false);
  const [notifications, setNotifications] = useState(false);
  // const [attendantAvatar, setAttendantAvatar] = useState();
  const [chat, setChat] = useState(false);
  // const [unreadMessages, setUnreadMessages] = useState(0);
  // const [firstMessage, setFirstMessage] = useState('');

  const ref = useRef();
  const notificationsRef = useRef();

  // useEffect(() => {
  //   setUnreadMessages(0);
  //   setFirstMessage('');
  // }, [chat]);

  const openLogoutMenu = () => {
    setInputState('opened');
  };

  const updateNotifications = () => {
    Api.getNotifications().then((res) => {
      if (res) {
        setNotifications(res.results);
      }
    });
  };

  // const updateChatMessages = () => {
  //   Api.getChat().then((res) => {
  //     if (res && res.results.length) {
  //       let unread = 0;
  //       res.results.forEach((m) => {
  //         if (m.unread && !m.sent_by_client) {
  //           unread += 1;
  //         }
  //       });
  //       if (unread) {
  //         setFirstMessage(res.results[0].text);
  //       }
  //       setUnreadMessages(unread);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   if (user && user.clientId) {
  //     Api.getClientById(user.clientId).then((res) => {
  //       setAttendantAvatar(res.client_manager_image_url);
  //     });
  //   }
  // }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateNotifications();
      // updateChatMessages();
    }, 5 * 60 * 1000);
    updateNotifications();
    // updateChatMessages();

    return () => clearInterval(interval);
  }, [dispatch]);

  const switchOpenNotification = () => {
    if (inputState === 'opened') {
      setInputState('closed');
    }

    if (notifications && notifications.length) {
      Api.viewAllNotifications(notifications[0]);
      updateNotifications();
    }

    setOpenedNotifications(!openedNotifications);
  };

  const changeInputState = (state) => {
    if (state === 'closed') {
      setInputState('opened');
    } else {
      setInputState('closed');
    }
  };

  useOutsideClick(ref, () => {
    changeInputState(inputState);
  });

  useOutsideClick(notificationsRef, () => {
    if (openedNotifications) {
      setOpenedNotifications(false);
    }
  });

  const logout = () => {
    localStorage.clear('leatkn');
    localStorage.clear('lertkn');
    dispatch(unregisterUser());
    history.push('/login');
  };

  return (
    <>
      <header className={styles.header}>
        <NavLink to="/" className={styles.homeLink}>
          <img className={styles.logo} src={logoMatch} alt="blend" />
        </NavLink>
        <nav className={styles.mainMenu}>
          <ul>
            <li className={styles.mainMenu__item}>
              <NavLink to="/briefings" activeClassName={styles.activeLink}>
                {translate('briefings', language)}
              </NavLink>
            </li>
            <li className={styles.mainMenu__item}>
              <NavLink to="/attendances" activeClassName={styles.activeLink}>
                {translate('attendances', language)}
              </NavLink>
            </li>
            <li className={styles.mainMenu__item}>
              <NavLink to="/orders" activeClassName={styles.activeLink}>
                {translate('orders', language)}
              </NavLink>
            </li>
            <li className={styles.mainMenu__item}>
              <NavLink to="/my-prints" activeClassName={styles.activeLink}>
                {translate('myShopping', language)}
              </NavLink>
            </li>
          </ul>
        </nav>
        <ul className={styles.optionsMenu}>
          <li className={styles.optionsMenu__item}>
            <button
              type="button"
              className={`${styles.language} ${styles.pt} ${
                language === 'pt-br' ? styles.active : ''
              }`}
              onClick={() => dispatch(setLanguage('pt-br'))}
            >
              PT
            </button>
            <span className={styles.languageSeparator}>-</span>
            <button
              type="button"
              className={`${styles.language} ${styles.en} ${
                language === 'en' ? styles.active : ''
              }`}
              onClick={() => dispatch(setLanguage('en'))}
            >
              EN
            </button>
            <span className={styles.languageDivisor}>|</span>
          </li>
          <li className={styles.optionsMenu__item}>
            <button
              type="button"
              className={styles.cart}
              onClick={() => setCart(true)}
            >
              <ShoppingCartIcon />
            </button>
          </li>
          <li
            className={`${styles.optionsMenu__item} ${
              notifications && notifications.some((n) => !n.viewed)
                ? styles.optionsMenu__allViewed
                : ''
            }`}
          >
            <button
              type="button"
              className={styles.notifications}
              onClick={switchOpenNotification}
            >
              <NotificationIcon />
            </button>
          </li>
          <div ref={notificationsRef}>
            {openedNotifications && (
              <Notifications notifications={notifications} />
            )}
          </div>

          <li className={`${styles.optionsMenu__item} ${styles.userMenu}`}>
            <button
              className={styles.avatarButton}
              type="button"
              onClick={openLogoutMenu}
            >
              <Avatar
                img={
                  user.image ||
                  'data:image/jpeg;base64,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'
                }
              />
            </button>
            {inputState === 'opened' && (
              <div className={styles.logoutMenu} ref={ref}>
                <Avatar
                  img={
                    user.image ||
                    'data:image/jpeg;base64,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'
                  }
                />
                <div className={styles.logoutMenuInfos}>
                  <p>{user.name}</p>
                  <Link to="/register/">
                    {translate('myRegister', language)}
                  </Link>
                  <button type="button" onClick={logout}>
                    {translate('logout', language)}
                  </button>
                </div>
              </div>
            )}
          </li>
        </ul>
      </header>
      {/* <button
        className={styles.chatButton}
        type="button"
        onClick={() => setChat(true)}
      >
        <div className={styles.message}>
          {firstMessage || translate('chatMessage', language)}
        </div>
        <div className={styles.avatarContainer}>
          {unreadMessages > 0 && (
            <span className={styles.unreadMessages}>{unreadMessages}</span>
          )}
          <img
            src={
              attendantAvatar ||
              'data:image/jpeg;base64,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'
            }
            alt="atendente"
          />
        </div>
      </button> */}
      {cart && <Cart close={() => setCart(false)} />}
      {chat && <Chat close={() => setChat(false)} />}
    </>
  );
}

export default Header;
