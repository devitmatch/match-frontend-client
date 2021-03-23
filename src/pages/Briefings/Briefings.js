import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import Loading from '../../components/Loading/Loading';
import BriefingForm from '../../components/BriefingForm/BriefingForm';
import DateRange from '../../components/DateRange/DateRange';
import SearchIcon from '../../assets/icons/Search';
import translate from '../../libs/i18n';
import Api from '../../libs/Api';

import styles from './Briefings.module.scss';
import criarBriefing from '../../assets/images/criarBriefing.png';

function Briefings() {
  const language = useSelector((state) => state.settings.language);

  const [newBriefing, setNewBriefing] = useState(false);
  const [briefings, setBriefings] = useState([]);
  const [editingBriefing, setEditingBriefing] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [initialDate, setInitialDate] = useState();
  const [finalDate, setFinalDate] = useState();
  const [reloadBriefings, setReloadBriefings] = useState(false);
  const [clearAllFilters, setClearAllFilters] = useState(false);
  const [searchQueryTimeout, setSearchQueryTimeout] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const openBriefingForm = useCallback(() => {
    setNewBriefing(true);
  }, []);

  useEffect(() => {
    if (searchQueryTimeout) {
      clearTimeout(searchQueryTimeout);
    }

    let query = '';
    function concat(filters) {
      query += `&${filters}`;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalDate, initialDate, searchQuery]);

  useEffect(() => {
    setLoading(true);

    if (filter) {
      Api.getBriefings(`?${filter}`)
        .then((res) => {
          setBriefings(res.result);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      Api.getBriefings()
        .then((res) => {
          setBriefings(res.result);
        })
        .catch()
        .finally(() => {
          setLoading(false);
        });
    }
  }, [filter]);

  const handleClearFilters = () => {
    setLoading(true);
    setClearAllFilters(true);
    setSearchQuery('');
  };

  const getBriefingsWithoutFilter = () => {
    setLoading(true);
    Api.getBriefings()
      .then((res) => {
        setBriefings(res.result);
        setLoading(false);
      })
      .catch(() => {
        setBriefings([]);
        setReloadBriefings(true);
      })
      .finally(() => {
        setReloadBriefings(false);
        setLoading(false);
      });
  };

  const getFilteredBriefings = () => {
    setLoading(true);
    Api.getBriefings(`?${filter}`)
      .then((res) => {
        setBriefings(res.result);
        setLoading(false);
      })
      .catch(() => {
        setBriefings([]);
      })
      .finally(() => {
        setLoading(false);
        setReloadBriefings(false);
      });
  };

  useEffect(() => {
    if (reloadBriefings) {
      if (!filter) {
        getBriefingsWithoutFilter();
      } else {
        getFilteredBriefings();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadBriefings]);

  const createdBriefing = () => {
    setNewBriefing(false);
    setEditingBriefing();
    Api.getBriefings().then((res) => {
      setBriefings(res.result);
    });
  };

  const closeEditingBriefing = () => {
    setNewBriefing(false);
    setEditingBriefing();
  };

  return (
    <div className={styles.briefings}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.title}>
            {translate('briefings', language).toUpperCase()}
          </span>
        </h2>
      </div>
      <div className={styles.content}>
        <div className={styles.actions}>
          <div className={styles.filters}>
            <div className={styles.searchInputContainer}>
              <SearchIcon color="#a3b3c7" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                className={`${styles.searchInput} ${styles.search}`}
                placeholder={translate('search', language)}
              />
            </div>
            <div className={styles.dateFilter}>
              <DateRange
                selectInitialDate={setInitialDate}
                selectFinalDate={setFinalDate}
                clearDateRange={clearAllFilters}
                setClearDateRange={setClearAllFilters}
                startInitialDate={initialDate}
                startFinalDate={finalDate}
              />
            </div>
            {filter && (
              <button
                className={styles.clearFilters}
                type="button"
                onClick={handleClearFilters}
              >
                {translate('clearFilters', language)}
              </button>
            )}
          </div>

          <button
            type="button"
            className={`${styles.defaultRoundedActionButton}`}
            onClick={openBriefingForm}
          >
            {translate('createBriefing', language)}
          </button>
        </div>
        <div className={styles.briefingsGrid}>
        <div
          className={styles.newBriefingCard}
          onClick={openBriefingForm}
          >
            <div className={styles.info}>
                <span className={styles.title}>{translate('createNewCardBriefingText', language)}</span>
            </div>
        </div>
          {briefings.map((briefing) => (
            <button
              key={briefing.id}
              className={styles.briefingCard}
              type="button"
              onClick={() => setEditingBriefing(briefing.id)}
            >
              {!!briefing.cover_url && (
                <img src={briefing.cover_url} alt={briefing.text} />
              )}
              <div className={styles.info}>
                {briefing.new && (
                  <span className={styles.new}>
                    {translate('new', language)}
                  </span>
                )}
                <span className={styles.label}>
                  {translate('briefing', language)}
                </span>
                <span className={styles.title}>{briefing.text}</span>
                <span className={styles.client}>{briefing.client_name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {(newBriefing || editingBriefing) && (
        <BriefingForm
          id={editingBriefing}
          close={closeEditingBriefing}
          created={createdBriefing}
        />
      )}
      {loading && (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      )}
    </div>
  );
}

export default Briefings;
