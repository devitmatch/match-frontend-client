import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

import styles from './Attendances.module.scss';
import translate from '../../libs/i18n';
import Api from '../../libs/Api';

import SearchIcon from '../../assets/icons/Search';
import AttendanceGridItem from '../../components/AttendanceGridItem/AttendanceGridItem';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import FiltersModal from '../../components/FiltersModal/FiltersModal';
import DateRange from '../../components/DateRange/DateRange';

import Loading from '../../components/Loading/Loading';

function Attendances() {
  const language = useSelector((state) => state.settings.language);

  const [selectedAttendances, setSelectedAttendances] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [attendances, setAttendances] = useState([]);
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [updatedPage, setUpdatedPage] = useState();

  const [counter, setCounter] = useState();
  const [filteredCounter] = useState();
  const [filtersModal, setFiltersModal] = useState(false);
  const [initialDate, setInitialDate] = useState();
  const [finalDate, setFinalDate] = useState();
  const [clearAllFilters, setClearAllFilters] = useState(false);
  const [reloadAttendances, setReloadAttendances] = useState(false);
  const [searchQueryTimeout, setSearchQueryTimeout] = useState(null);

  useEffect(() => {
    setLoading(true);
    setInitialLoad(true);
  }, []);

  useEffect(() => {
    setLoading(true);

    if (filter) {
      Api.getAttendances(`${filter}&page=${page - 1}`)
        .then((res) => {
          // setFilteredCounter(res.count);
          setAttendances(res.result);
          let numberOfPages = parseInt(res.count / 30, 10);
          if (res.count % 30) {
            numberOfPages += 1;
          }
          setLastPage(numberOfPages);
        })
        .finally(() => {
          setLoading(false);
          setInitialLoad(true);
        });
    } else {
      Api.getAttendances(`page=${page - 1}`)
        .then((res) => {
          setAttendances(res.result);
          setCounter(res.count);
          let numberOfPages = parseInt(res.count / 30, 10);
          if (res.count % 30) {
            numberOfPages += 1;
          }
          setLastPage(numberOfPages);
        })
        .catch()
        .finally(() => {
          setLoading(false);
          setInitialLoad(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const getAttendancesWithoutFilter = () => {
    setLoading(true);
    Api.getAttendances(`page=${page - 1}`)
      .then((res) => {
        setCounter(res.count);
        let numberOfPages = parseInt(res.count / 30, 10);
        if (res.count % 30) {
          numberOfPages += 1;
        }
        setLastPage(numberOfPages);
        if (res && res.result) {
          setAttendances(res.result);
        }
        setLoading(false);
      })
      .catch(() => {
        setAttendances([]);
        setPage(1);
      })
      .finally(() => {
        setReloadAttendances(false);
        setLoading(false);
      });
  };

  const getFilteredAttendances = () => {
    setLoading(true);
    Api.getAttendances(`page=${page - 1}&${filter}`)
      .then((res) => {
        if (res && res.result) {
          setAttendances(res.result);
          let numberOfPages = parseInt(res.count / 30, 10);
          if (res.count % 30) {
            numberOfPages += 1;
          }
          setLastPage(numberOfPages);
        }
        setLoading(false);
      })
      .catch(() => {
        setAttendances([]);
      })
      .finally(() => {
        setLoading(false);
        setReloadAttendances(false);
      });
  };

  useEffect(() => {
    if (reloadAttendances && initialLoad) {
      if (!filter) {
        getAttendancesWithoutFilter();
      } else {
        getFilteredAttendances();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadAttendances]);

  useEffect(() => {
    let query = '';
    function concat(filters) {
      if (query) {
        query += `&${filters}`;
      } else {
        query += filters;
      }
    }
    if (initialLoad) {
      if (searchQueryTimeout) {
        clearTimeout(searchQueryTimeout);
      }

      if (initialDate) {
        concat(`init_date=${moment(initialDate).format('MM-DD-YYYY')}`);
      }
      if (finalDate) {
        concat(`final_date=${moment(finalDate).format('MM-DD-YYYY')}`);
      }

      if (searchQuery.length) {
        concat(`search=${searchQuery}`);
      }

      if (query === '?') {
        setFilter('');
      } else if (query !== '?' && searchQuery.length) {
        setSearchQueryTimeout(setTimeout(() => setFilter(query), 1000));
      } else {
        setFilter(query);
      }
      setPage(1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, initialDate, finalDate]);

  useEffect(() => {
    if (initialLoad) {
      if (searchQueryTimeout) {
        clearTimeout(searchQueryTimeout);
      }

      setSearchQueryTimeout(
        setTimeout(() => {
          setReloadAttendances(true);
        }, 1000)
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && updatedPage > 0 && updatedPage <= lastPage) {
      setPage(updatedPage);
      setUpdatedPage();
    }
  };
  const looseFocus = () => {
    if (updatedPage > 0 && updatedPage <= lastPage) {
      setPage(updatedPage);
      setUpdatedPage();
    }
  };

  const goTop = () => {
    window.scrollTo(0, 200);
  };

  const handleClearFilters = () => {
    setClearAllFilters(true);
    setSearchQuery('');
    setInitialDate();
    setFinalDate();
    setFilter('');
    setTimeout(() => {
      setClearAllFilters(false);
    }, 500);

    setFiltersModal(false);
  };

  const searchAttendances = () => {
    setFiltersModal(false);
    setReloadAttendances(true);
  };

  const renderMissingCardSpaces = useMemo(() => {
    if (attendances.length) {
      const numberOfEmptyCards = attendances.length % 4;
      const emptyCards = [];

      for (let i = 1; i <= numberOfEmptyCards; i += 1) {
        emptyCards.push(i);
      }

      return emptyCards.map((i) => (
        <div key={i} className={styles.emptyCard} />
      ));
    }
    return false;
  }, [attendances]);

  const duplicateAttendances = useCallback(() => {
    setLoading(true);
    const duplicateRequests = [];

    selectedAttendances.forEach((attendance) => {
      const deleteRequest = Api.duplicateAttendance(attendance);
      duplicateRequests.push(deleteRequest);
    });
    axios
      .all(duplicateRequests)
      .then(() => {
        Api.getAttendances(`page=${page - 1}`).then((res) => {
          setAttendances(res.result);
          setCounter(res.count);
          let numberOfPages = parseInt(res.count / 30, 10);
          if (res.count % 30) {
            numberOfPages += 1;
          }
          setLastPage(numberOfPages);
        });
        setSelectedAttendances([]);
      })
      .catch(() => {
        toast(translate('failDuplicateAttendances', language), {
          type: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [language, page, selectedAttendances]);

  const deleteAttendances = () => {
    setLoading(true);
    setConfirmationModal(false);
    const deleteRequests = [];

    selectedAttendances.forEach((attendance) => {
      const deleteRequest = Api.deleteAttendance(attendance);
      deleteRequests.push(deleteRequest);
    });
    axios
      .all(deleteRequests)
      .then(() => {
        Api.getAttendances(`page=${page - 1}`).then((res) => {
          setAttendances(res.result);
          setCounter(res.count);
          let numberOfPages = parseInt(res.count / 30, 10);
          if (res.count % 30) {
            numberOfPages += 1;
          }
          setLastPage(numberOfPages);
        });
        setSelectedAttendances([]);
      })
      .catch(() => {
        toast(translate('failDeletingAttendances', language), {
          type: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSelectAttendance = (id, selected) => {
    let currentSelectedAttendances = [...selectedAttendances];
    const containsAttendance = currentSelectedAttendances.find(
      (attendance) => attendance === id
    );
    if (!selected && containsAttendance) {
      currentSelectedAttendances = currentSelectedAttendances.filter(
        (attendance) => attendance !== id
      );
    } else if (selected && !containsAttendance) {
      currentSelectedAttendances = [...selectedAttendances, id];
    }
    setSelectedAttendances(currentSelectedAttendances);
  };

  return (
    <div className={styles.attendances}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.title}>
            {translate('attendances', language).toUpperCase()}
          </span>
        </h2>
      </div>
      <div className={styles.content}>
        <div className={styles.filters}>
          <div className={styles.left}>
            <div className={styles.inputContainer}>
              <SearchIcon color="#a3b3c7" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                className={styles.exclusivityFilter}
                placeholder={translate('searchAttendance', language)}
              />
            </div>
            <button
              type="button"
              className={styles.filtersButton}
              onClick={() => setFiltersModal(true)}
            >
              {translate('filters', language)}
            </button>
          </div>
        </div>

        <div className={styles.attendancesGrid}>
          {attendances.map((attendance) => (
            <AttendanceGridItem
              key={`${attendance.name}-${attendance.id}`}
              attendance={attendance}
              onSelect={onSelectAttendance}
            />
          ))}
          {renderMissingCardSpaces}
        </div>
        {loading && <Loading fixed={!initialLoad} />}
      </div>
      {confirmationModal && (
        <ConfirmationModal
          message={translate('confirmAttendancesDelete', language)}
          confirmText={translate('yes', language)}
          cancelText={translate('no', language)}
          onConfirm={deleteAttendances}
          onCancel={() => setConfirmationModal(false)}
          deleteWarning
        />
      )}
      {(counter || filteredCounter) && lastPage && (
        <div className={`${styles.footer}`}>
          <div className={`${styles.pagination}`}>
            <button
              disabled={page === 1}
              type="button"
              onClick={() => setPage(page - 1)}
            >
              <span className={styles.backArrow} />
            </button>
            <input
              type="number"
              placeholder={page}
              onKeyDown={handleKeyDown}
              value={updatedPage}
              onChange={(e) =>
                setUpdatedPage(parseInt(e.currentTarget.value, 10))
              }
              onBlur={looseFocus}
            />
            <span>de {lastPage}</span>
            <button
              disabled={page === lastPage}
              type="button"
              onClick={() => setPage(page + 1)}
            >
              <span className={styles.nextArrow} />
            </button>
          </div>
          <button type="button" className={styles.upButton} onClick={goTop}>
            <span className={styles.upArrow} />
          </button>
        </div>
      )}
      <div
        className={`${styles.actionsMenuContainer} ${
          selectedAttendances.length > 0 && styles.actionsMenuActive
        }`}
      >
        <div className={styles.actionsMenu}>
          <div className={styles.left}>
            <div>
              {`${selectedAttendances.length} ${
                selectedAttendances.length > 1
                  ? translate('selectedMultiple', language)
                  : translate('selectedOne', language)
              }`}
            </div>
            <span className={styles.separator}>|</span>
            <button
              onClick={() => {}}
              disabled={!selectedAttendances.length}
              type="button"
              className={styles.duplicate}
            >
              {translate('duplicate', language)}
            </button>
          </div>
          <button
            onClick={() => setConfirmationModal(true)}
            disabled={!selectedAttendances.length}
            type="button"
            className={styles.delete}
          >
            {translate('delete', language)}
          </button>
        </div>
      </div>
      <div
        className={`${styles.actionsMenuContainer} ${
          selectedAttendances.length > 0 && styles.actionsMenuActive
        }`}
      >
        <div className={styles.actionsMenu}>
          <div className={styles.left}>
            <div>
              {`${selectedAttendances.length} ${
                selectedAttendances.length > 1
                  ? translate('selectedMultiple', language)
                  : translate('selectedOne', language)
              }`}
            </div>
            <span className={styles.separator}>|</span>
            <button
              onClick={duplicateAttendances}
              disabled={!selectedAttendances.length}
              type="button"
              className={styles.duplicate}
            >
              {translate('duplicate', language)}
            </button>
          </div>
          <button
            onClick={() => setConfirmationModal(true)}
            disabled={!selectedAttendances.length}
            type="button"
            className={styles.delete}
          >
            {translate('delete', language)}
          </button>
        </div>
      </div>
      {filtersModal && (
        <FiltersModal
          title={translate('filters', language)}
          fixedHeight
          fullWidth
        >
          <div className={styles.datesContainer}>
            <div className={styles.dateFilter}>
              <p className={styles.sectionLabel}>
                {translate('period', language)}
              </p>
              <DateRange
                selectInitialDate={setInitialDate}
                selectFinalDate={setFinalDate}
                clearDateRange={clearAllFilters}
                setClearDateRange={setClearAllFilters}
                startInitialDate={initialDate}
                startFinalDate={finalDate}
              />
            </div>
            <div />
          </div>

          <div className={styles.filterActions}>
            <button
              className={styles.clearAttendancesFilters}
              type="button"
              onClick={handleClearFilters}
            >
              {translate('clearFilters', language)}
            </button>
            <button
              className={`${styles.defaultActionButton} ${styles.showAttendances}`}
              type="button"
              onClick={searchAttendances}
            >
              {translate('showAttendances', language)}
            </button>
          </div>
        </FiltersModal>
      )}
    </div>
  );
}

export default Attendances;
