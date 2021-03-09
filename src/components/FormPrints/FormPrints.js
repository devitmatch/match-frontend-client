import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import translate from '../../libs/i18n';
import Api from '../../libs/Api';
import styles from './FormPrints.module.scss';

import SearchIcon from '../../assets/icons/Search';
import PrintGridItem from '../PrintGridItem/PrintGridItem';
import Loading from '../Loading/Loading';

function FormPrints({ applyPrints }) {
  const language = useSelector((state) => state.settings.language);

  const [filter, setFilter] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [prints, setPrints] = useState([]);
  const [selectedPrints, setSelectedPrints] = useState([]);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  const [updatedPage, setUpdatedPage] = useState();
  const [counter, setCounter] = useState();

  const [filteredCounter, setFilteredCounter] = useState();
  const [loading, setLoading] = useState(false);

  const [reloadPrints, setReloadPrints] = useState(true);

  const filterTimer = useRef();

  const getPrintsWithoutFilter = () => {
    setLoading(true);
    Api.getLibrary(`?page=${page - 1}`)
      .then((res) => {
        setCounter(res.count);
        let numberOfPages = parseInt(res.count / 30, 10);
        if (res.count % 30) {
          numberOfPages += 1;
        }
        setLastPage(numberOfPages);
        if (res && res.results) {
          setPrints(res.results);
        }
        setLoading(false);
      })
      .catch(() => {
        setPrints([]);
        setPage(1);
        setReloadPrints(true);
      })
      .finally(() => {
        setReloadPrints(false);
        setLoading(false);
      });
  };

  const getFilteredPrints = () => {
    setLoading(true);
    Api.getLibrary(`?page=${page - 1}${filter}`)
      .then((res) => {
        setFilteredCounter(res.count);

        if (res && res.results) {
          setPrints(res.results);
          let numberOfPages = parseInt(res.count / 30, 10);
          if (res.count % 30) {
            numberOfPages += 1;
          }
          setLastPage(numberOfPages);
        }
        setLoading(false);
      })
      .catch(() => {
        setPrints([]);
      })
      .finally(() => {
        setLoading(false);
        setReloadPrints(false);
      });
  };

  useEffect(() => {
    if (filterTimer.current) {
      clearTimeout(filterTimer.current);
    }
    filterTimer.current = setTimeout(() => {
      setReloadPrints(true);
    }, 2200);
  }, [searchQuery]);

  useEffect(() => {
    if (filterTimer.current) {
      clearTimeout(filterTimer.current);
    }
    filterTimer.current = setTimeout(() => {
      setReloadPrints(true);
    }, 1000);
  }, [searchQuery]);

  useEffect(() => {
    if (reloadPrints) {
      if (!filter) {
        getPrintsWithoutFilter();
      } else {
        getFilteredPrints();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, reloadPrints]);

  useEffect(() => {
    setPage(1);
    setUpdatedPage();
  }, [filter]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && updatedPage > 0 && updatedPage <= lastPage) {
      setPage(updatedPage);
      setReloadPrints(true);
      setUpdatedPage();
    }
  };
  const looseFocus = () => {
    if (updatedPage > 0 && updatedPage <= lastPage) {
      setPage(updatedPage);
      setReloadPrints(true);
      setUpdatedPage();
    }
  };

  const onSelectPrint = (print, selected) => {
    let currentSelectedPrints = [...selectedPrints];
    const containsPrint = currentSelectedPrints.find((p) => p.id === print.id);
    if (!selected && containsPrint) {
      currentSelectedPrints = currentSelectedPrints.filter(
        (p) => p.id !== print.id
      );
    } else if (selected && !containsPrint) {
      currentSelectedPrints = [...currentSelectedPrints, print];
    }
    setSelectedPrints(currentSelectedPrints);
  };

  useEffect(() => {
    let query = '';
    function concat(filters) {
      query += `&${filters}`;
    }

    if (searchQuery) {
      concat(`search=${searchQuery}`);
    }
    if (query === '?') {
      setFilter('');
    } else {
      setFilter(query);
    }
  }, [searchQuery]);

  const renderedGrid = () => {
    const printsArray = prints;
    const renderPrintGridItem = (print) => (
      <PrintGridItem
        key={`${print.id}-${print.code}`}
        id={print.id}
        image={print.image_url || print.image}
        code={print.code}
        name={print.name}
        exclusivity={print.exclusivity}
        reserved={print.reserved}
        pendingReview={'already_reviewed' in print && !print.already_reviewed}
        type={print.type}
        backgroundColor={
          print.flat_background && print.flat_background_color
            ? print.flat_background_color
            : '#FFFFFF'
        }
        newTab
        selectable
        onSelect={onSelectPrint}
        mini
      />
    );
    return (
      <>
        {printsArray && printsArray.length > 0 ? (
          <div className={styles.printsGrid}>
            <div>
              {printsArray &&
                printsArray.map((print, index) => {
                  if (index % 4 === 0) {
                    return renderPrintGridItem(print);
                  }
                  return null;
                })}
            </div>
            <div>
              {printsArray &&
                printsArray.map((print, index) => {
                  if (index % 4 === 1) {
                    return renderPrintGridItem(print);
                  }
                  return null;
                })}
            </div>
            <div>
              {printsArray &&
                printsArray.map((print, index) => {
                  if (index % 4 === 2) {
                    return renderPrintGridItem(print);
                  }
                  return null;
                })}
            </div>
            <div>
              {printsArray &&
                printsArray.map((print, index) => {
                  if (index % 4 === 3) {
                    return renderPrintGridItem(print);
                  }
                  return null;
                })}
            </div>
          </div>
        ) : (
          <div className={styles.emptyPrintList}>
            {translate('printNotFound', language)}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.formPrints}>
      <h2>{translate('selectOneOrMorePrints', language)}</h2>
      <div className={styles.filters}>
        <div className={styles.left}>
          <div className={styles.inputContainer}>
            <SearchIcon color="#a3b3c7" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              className={styles.exclusivityFilter}
              placeholder={translate('searchPrint', language)}
            />
          </div>
        </div>
        <div className={styles.right}>
          <button
            type="button"
            className={styles.defaultActionButton}
            onClick={() => applyPrints(selectedPrints)}
          >
            {translate('apply', language)}
          </button>
        </div>
      </div>
      {renderedGrid()}
      {(counter || filteredCounter) && lastPage && (
        <div className={`${styles.footer}`}>
          <div className={`${styles.pagination}`}>
            <button
              disabled={page === 1}
              type="button"
              onClick={() => {
                setPage(page - 1);
                setReloadPrints(true);
              }}
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
              onClick={() => {
                setPage(page + 1);
                setReloadPrints(true);
              }}
            >
              <span className={styles.nextArrow} />
            </button>
          </div>
        </div>
      )}
      {loading && <Loading fixed />}
    </div>
  );
}

export default FormPrints;

FormPrints.propTypes = {
  applyPrints: PropTypes.func.isRequired,
};
