/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-date-picker';
import PropTypes from 'prop-types';

import styles from './DateRange.module.scss';

import CalendarIcon from '../../assets/icons/Calendar';

function DateRange({
  selectInitialDate,
  selectFinalDate,
  clearDateRange,
  setClearDateRange,
  startInitialDate,
  startFinalDate,
}) {
  const [initialDate, setInitialDate] = useState('');
  const [finalDate, setFinalDate] = useState('');

  useEffect(() => {
    if (startInitialDate) {
      setInitialDate(startInitialDate);
      selectInitialDate(startInitialDate);
    }

    if (startFinalDate) {
      setFinalDate(startFinalDate);
      selectFinalDate(startFinalDate);
    }
  }, [startInitialDate, selectInitialDate, startFinalDate, selectFinalDate]);

  useEffect(() => {
    if (clearDateRange) {
      selectInitialDate('');
      selectFinalDate('');
      setInitialDate('');
      setFinalDate('');
    }
  }, [clearDateRange, selectInitialDate, selectFinalDate]);

  useEffect(() => {
    selectInitialDate(initialDate);

    if (setClearDateRange) {
      setClearDateRange(false);
    }
  }, [initialDate, selectInitialDate, setClearDateRange]);

  useEffect(() => {
    selectFinalDate(finalDate);

    if (setClearDateRange) {
      setClearDateRange(false);
    }
  }, [finalDate, selectFinalDate, setClearDateRange]);

  return (
    <div className={styles.dateRange}>
      <CalendarIcon />
      <DatePicker
        className={`${styles.dateInput} ${styles.first}`}
        value={initialDate}
        onChange={setInitialDate}
        format="dd/MM/y"
        clearIcon={initialDate ? undefined : null}
        calendarIcon={null}
      />
      <DatePicker
        className={styles.dateInput}
        value={finalDate}
        onChange={setFinalDate}
        format="dd/MM/y"
        clearIcon={finalDate ? undefined : null}
        calendarIcon={null}
      />
    </div>
  );
}

DateRange.propTypes = {
  selectInitialDate: PropTypes.func.isRequired,
  selectFinalDate: PropTypes.func.isRequired,
  clearDateRange: PropTypes.bool,
  setClearDateRange: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  startInitialDate: PropTypes.string,
  startFinalDate: PropTypes.string,
};

DateRange.defaultProps = {
  clearDateRange: false,
  setClearDateRange: false,
  startInitialDate: '',
  startFinalDate: '',
};

export default DateRange;
