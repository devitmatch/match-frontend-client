import React, { memo, useMemo, useEffect, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import ShoppingCartIcon from '../../assets/icons/ShoppingCart';
import translate from '../../libs/i18n';
import Api from '../../libs/Api';
import useOutsideClick from '../../libs/useOutsideClick';
import styles from './PresentationGridItem.module.scss';
import ListSelector from '../ListSelector/ListSelector';

function PrintGridItem({
  id,
  image,
  name,
  type,
  attendances,
  fromAttendance,
  client,
  mini,
}) {
  const language = useSelector((state) => state.settings.language);
  const history = useHistory();
  const attendanceSelectorRef = useRef();

  const [selectedAttendance, setSelectedAttendance] = useState();
  const [attendanceSelector, setAttendanceSelector] = useState(false);

  const changeAttendanceSelector = (state) => {
    if (!state) {
      setAttendanceSelector(true);
    } else {
      setAttendanceSelector(false);
    }
  };

  useOutsideClick(attendanceSelectorRef, () => {
    changeAttendanceSelector(attendanceSelector);
    setSelectedAttendance();
  });

  useEffect(() => {
    if (selectedAttendance) {
      Api.includeAttendancePresentation({
        meeting_id: id,
        meeting_box_id: selectedAttendance.id,
      })
        .then(() => {
          toast(
            `${translate('successAddingPresentationToAttendance', language)}`,
            {
              type: 'success',
            }
          );
        })
        .catch(() => {
          toast(
            `${translate('failAddingPresentationToAttendance', language)}`,
            {
              type: 'error',
            }
          );
        });
      setAttendanceSelector(false);
      setSelectedAttendance();
    }
  }, [id, language, selectedAttendance]);

  const getImagesGrid = useMemo(() => {
    return (
      <div className={styles.imagesGrid}>
        {image && <img src={image} alt="print" />}
      </div>
    );
  }, [image]);

  return (
    <div className={`${styles.card} ${mini ? styles.small : ''}`}>
      {attendances && attendances.length > 0 && (
        <div className={styles.attendanceSelector}>
          <button
            type="button"
            className={`${styles.defaultSelectInput}`}
            onClick={(e) => {
              e.stopPropagation();
              setAttendanceSelector(true);
            }}
          >
            {translate('chooseAttendance', language)}
          </button>

          {attendanceSelector && (
            <span
              className={styles.selectorPosition}
              ref={attendanceSelectorRef}
            >
              <div className={styles.list}>
                <ListSelector
                  selectLabel={translate('choose', language)}
                  items={attendances}
                  onSelect={setSelectedAttendance}
                  value={selectedAttendance}
                  fullWidth
                  search
                  action={() => history.push('/create-attendance')}
                  actionText={translate('createAttendance', language)}
                />
              </div>
            </span>
          )}
        </div>
      )}
      <Link
        to={() => {
          if (client) {
            return `/client/${fromAttendance}/presentations/${id}/concept`;
          }
          return fromAttendance
            ? `/attendances/${fromAttendance}/presentations/${id}`
            : `/presentations/${id}`;
        }}
        className={styles.cardLink}
      >
        <div className={styles.presentationGridItem}>
          {getImagesGrid}
          <div className={`${styles.info} ${mini && styles.mini}`}>
            <div className={`${styles.name} ${mini && styles.mini}`}>
              {name}
            </div>
            <div className={styles.tags}>
              <div className={`${styles.tag} ${mini && styles.mini}`}>
                {type === 'COL' && translate('collecion', language)}
                {type === 'ID' && translate('id', language)}
                {type === 'LE' && translate('leCollection', language)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

PrintGridItem.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  attendances: PropTypes.arrayOf(PropTypes.shape),
  mini: PropTypes.bool,
  fromAttendance: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  client: PropTypes.oneOfType([PropTypes.shape, PropTypes.bool]),
};

PrintGridItem.defaultProps = {
  name: '',
  image: '',
  type: 'COL',
  attendances: [],
  fromAttendance: false,
  client: false,
  mini: false,
};

export default memo(PrintGridItem);
