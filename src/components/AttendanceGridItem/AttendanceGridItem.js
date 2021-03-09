import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './AttendanceGridItem.module.scss';

export default function Attendance({ attendance }) {
  return (
    <div className={styles.attendanceCard}>
      <Link to={`/attendances/${attendance.id}`} className={styles.cardLink}>
        <div className={styles.printGridItem}>
          {attendance.cover_url ? (
            <div
              className={styles.imageContainer}
              style={
                attendance.backgroundColor
                  ? { backgroundColor: attendance.backgroundColor }
                  : {}
              }
            >
              <img
                className={styles.image}
                src={attendance.cover_url}
                alt={attendance.id}
              />
            </div>
          ) : (
            <div className={styles.imageReplace} />
          )}

          <div className={styles.info}>
            <div className={styles.name}>{attendance.name}</div>
            <hr />
          </div>
        </div>
      </Link>
    </div>
  );
}

Attendance.propTypes = {
  attendance: PropTypes.oneOfType([PropTypes.shape, PropTypes.bool]),
};

Attendance.defaultProps = {
  attendance: false,
};
