import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import 'moment/locale/pt-br';

import styles from './Chat.module.scss';
import useOutsideClick from '../../libs/useOutsideClick';

import Api from '../../libs/Api';

import ClockIcon from '../../assets/icons/Clock';
import CloseIcon from '../../assets/icons/Close';
import Loading from '../Loading/Loading';

function Chat({ close, newFeedback }) {
  const chatRef = useRef();

  const language = useSelector((state) => state.settings.language);
  const user = useSelector((state) => state.user);

  const [feedbacks, setFeedBacks] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);

  useOutsideClick(chatRef, () => {
    close();
  });

  useEffect(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append('unread', false);
    Api.getChat()
      .then((res) => {
        if (res.results.length) {
          Api.readMessage(res.results[0].id, formData);
        }
        setFeedBacks(res.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getMessage = (feedback, direction) => (
    <div>
      <div
        className={`${styles.info} ${direction === 'right' && styles.inverse}`}
      >
        <div className={styles.name}>
          {feedback.sent_by_client ? feedback.client_name : feedback.staff_name}
        </div>
        <div className={styles.time}>
          <ClockIcon />
          <Moment
            filter={(d) => d.charAt(0).toUpperCase() + d.slice(1)}
            styles={styles.textTime}
            fromNow
            locale={language}
          >
            {feedback.date}
          </Moment>
        </div>
      </div>
      <p
        className={`${styles.message} ${
          direction === 'right' && styles.inverse
        }`}
      >
        {feedback.text}
      </p>
    </div>
  );

  const sendMessage = () => {
    if (newMessage) {
      setSending(true);
      Api.sendMessage(newMessage, user.clientId)
        .then(() => {
          setNewMessage('');
        })
        .catch(() => {})
        .finally(() => {
          Api.getChat().then((res) => {
            setFeedBacks(res.results);
            setSending(false);
          });
          if (newFeedback) {
            newFeedback();
          }
        });
    }
  };

  const getChat = () => (
    <div className={styles.overlay}>
      <div className={styles.chatContainer} ref={chatRef}>
        <button className={styles.closeButton} type="button" onClick={close}>
          <CloseIcon color="black" />
        </button>
        <div className={styles.title}>Chat</div>

        <div
          className={`${styles.inputContainer} ${
            sending ? styles.disabled : ''
          }`}
        >
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            type="text"
            disabled={sending}
          />
          <button onClick={sendMessage} type="button">
            {sending ? 'Enviando' : 'Enviar'}
          </button>
        </div>

        <div className={styles.dialog}>
          {feedbacks.map((feedback, index) =>
            getMessage(
              feedback,
              feedback.sent_by_client ? 'right' : 'left',
              index === 0
            )
          )}
        </div>
      </div>
      {loading && <Loading fixed />}
    </div>
  );

  return getChat();
}

Chat.propTypes = {
  mini: PropTypes.bool,
  close: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  printId: PropTypes.number.isRequired,
};

Chat.defaultProps = {
  mini: false,
  close: false,
};

export default Chat;
