import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';

import styles from './Notifications.module.scss';

import translate from '../../libs/i18n';
import ClockIcon from '../../assets/icons/Clock';

export default function Notifications({ notifications }) {
  const language = useSelector((state) => state.settings.language);

  if (!notifications) {
    return null;
  }

  return (
    <ul className={styles.Notifications}>
      {notifications.map((notification) => (
        <li
          key={notification.id}
          className={`${styles.notificationBox}${
            notification.image_url && notification.image_url.length
              ? ''
              : ` ${styles.notificationBoxWithoutImage}`
          }`}
        >
          {notification.image_url && notification.image_url.length && (
            <div
              className={styles.notificationBoxImage}
              style={{
                backgroundImage: `url(${notification.image_url})`,
              }}
            />
          )}
          <div className={styles.notificationBoxText}>
            {notification.message && notification.message.length && (
              <p className={styles.notificationBoxTitle}>
                {notification.message}
              </p>
            )}
            {notification.link && notification.link.length && (
              <p className={styles.notificationBoxLink}>
                <a href={notification.link}>
                  {translate('checkHere', language)}
                </a>
              </p>
            )}
            {notification.date && notification.date.length && (
              <p className={styles.notificationBoxTime}>
                <span className={styles.timeIconWrapper}>
                  <ClockIcon width={14} height={14} />
                </span>{' '}
                <Moment fromNow locale="pt-br">
                  {notification.date}
                </Moment>
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      id: PropTypes.number,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
};
