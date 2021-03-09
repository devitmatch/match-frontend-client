import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import CheckInput from '../../components/CheckInput/CheckInput';
import TagsSelectors from '../../components/TagsSelectors/TagsSelectors';
import FiltersModal from '../../components/FiltersModal/FiltersModal';
import Loading from '../../components/Loading/Loading';
import StaticPrintGridItem from '../../components/StaticPrintGridItem/StaticPrintGridItem';
import SearchIcon from '../../assets/icons/Search';

import Api from '../../libs/Api';
import translate from '../../libs/i18n';

import styles from './MyPrints.module.scss';

function MyPrints() {
  const language = useSelector((state) => state.settings.language);

  const [myPrints, setMyPrints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [counter, setCounter] = useState();
  const [lastPage, setLastPage] = useState(0);
  const [updatedPage, setUpdatedPage] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersModal, setFiltersModal] = useState(false);
  const [digital, setDigital] = useState(false);
  const [cylinder, setCylinder] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [pantone, setPantone] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loadPrints, setLoadPrints] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState();

  const goTop = () => window.scrollTo(0, 0);

  useEffect(() => {
    setLoading(true);

    Api.getTags()
      .then((res) => {
        setTags(
          res.filter(
            (t) =>
              t.category === 'Tema' ||
              t.category === 'Construção' ||
              t.category === 'Técnica' ||
              t.category === 'Adjetivo' ||
              t.category === 'Tema' ||
              t.category === 'Cor'
          )
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loadPrints) {
      setLoading(true);

      const printTypes = [];
      const printTags = [];

      if (digital) {
        printTypes.push('DIG');
      }

      if (cylinder) {
        printTypes.push('CYL');
      }

      if (digital && cylinder) {
        printTypes.push('BOT');
      }

      let currentFilter = `?page=${page - 1}`;

      if (printTypes.length) {
        currentFilter += `&type=${printTypes}`;
      }

      if (reserved) {
        currentFilter += `&reserve=true`;
      }

      if (pantone) {
        currentFilter += `&pantone=true`;
      }

      if (selectedTags && selectedTags.length) {
        selectedTags.forEach((sT) => {
          if (sT && sT.id) {
            printTags.push(sT.id);
          }
        });
      }

      if (printTags.length) {
        currentFilter += `&tags=${printTags}`;
      }

      if (searchQuery.length) {
        currentFilter += `&search=${searchQuery}`;
      }

      Api.getLibrary(currentFilter)
        .then((res) => {
          setCounter(res.count);

          let numberOfPages = parseInt(res.count / 30, 10);

          if (res.count % 30) {
            numberOfPages += 1;
          }

          setLastPage(numberOfPages);

          if (res && res.results) {
            setMyPrints(res.results);
          }
        })
        .catch(() => {
          setMyPrints([]);
          setPage(1);
          setLoadPrints(false);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
          setLoadPrints(false);
          goTop();
        });
    }
  }, [updatedPage, page, loadPrints]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => setLoadPrints(true), 1000);

    setSearchTimeout(timeout);
  }, [searchQuery]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && updatedPage > 0 && updatedPage <= lastPage) {
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

  const handleClearFilters = () => {
    setCylinder(false);
    setDigital(false);
    setReserved(false);
    setPantone(false);
    setFiltersModal(false);
    setPage(1);
    setLoadPrints(true);
  };

  const searchMyPrint = () => {
    setFiltersModal(false);
    setLoadPrints(true);
    setPage(1);
  };

  return (
    <>
      <div className={styles.myPrints}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.title}>
              {translate('myPrints', language).toUpperCase()}
            </span>
          </h2>
        </div>
        <div className={styles.filtersWrapper}>
          <div className={styles.filters}>
            <div className={styles.left}>
              <div className={styles.inputContainer}>
                <SearchIcon color="#a3b3c7" />
                <input
                  className={styles.exclusivityFilter}
                  type="search"
                  placeholder={translate('searchPrint', language)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />
              </div>
              <button
                className={styles.filtersButton}
                type="button"
                onClick={() => setFiltersModal(true)}
              >
                {translate('filters', language)}
              </button>
            </div>
          </div>
        </div>
        {myPrints && myPrints.length > 0 && (
          <div className={styles.printsContainer}>
            <div className={styles.printsGrid}>
              <div className={styles.column}>
                {myPrints.map((print, index) => {
                  if (index % 4 === 0) {
                    return (
                      <StaticPrintGridItem
                        key={`${print.id}-${print.code}`}
                        id={print.id}
                        code={print.code}
                        name={print.name}
                        type={print.type}
                        exclusivity={print.exclusivity}
                        reserved={print.reserved}
                        image={print.image_url || print.image}
                      />
                    );
                  }

                  return null;
                })}
              </div>
              <div className={styles.column}>
                {myPrints.map((print, index) => {
                  if (index % 4 === 1) {
                    return (
                      <StaticPrintGridItem
                        key={`${print.id}-${print.code}`}
                        id={print.id}
                        code={print.code}
                        name={print.name}
                        type={print.type}
                        exclusivity={print.exclusivity}
                        reserved={print.reserved}
                        image={print.image_url || print.image}
                      />
                    );
                  }

                  return null;
                })}
              </div>
              <div className={styles.column}>
                {myPrints.map((print, index) => {
                  if (index % 4 === 2) {
                    return (
                      <StaticPrintGridItem
                        key={`${print.id}-${print.code}`}
                        id={print.id}
                        code={print.code}
                        name={print.name}
                        type={print.type}
                        exclusivity={print.exclusivity}
                        reserved={print.reserved}
                        image={print.image_url || print.image}
                      />
                    );
                  }

                  return null;
                })}
              </div>
              <div className={styles.column}>
                {myPrints.map((print, index) => {
                  if (index % 4 === 3) {
                    return (
                      <StaticPrintGridItem
                        key={`${print.id}-${print.code}`}
                        id={print.id}
                        code={print.code}
                        name={print.name}
                        type={print.type}
                        exclusivity={print.exclusivity}
                        reserved={print.reserved}
                        image={print.image_url || print.image}
                      />
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      {counter > 0 && lastPage > 0 && (
        <div className={`${styles.footer}`}>
          <div className={`${styles.pagination}`}>
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <span className={styles.backArrow} />
            </button>
            <input
              type="number"
              placeholder={page}
              value={updatedPage}
              onChange={(event) =>
                setUpdatedPage(parseInt(event.currentTarget.value, 10))
              }
              onKeyDown={handleKeyDown}
              onBlur={looseFocus}
            />
            <span>de {lastPage}</span>
            <button
              type="button"
              disabled={page === lastPage}
              onClick={() => setPage(page + 1)}
            >
              <span className={styles.nextArrow} />
            </button>
          </div>
        </div>
      )}
      {filtersModal && (
        <FiltersModal title={translate('filters', language)}>
          <div className={styles.checks}>
            <TagsSelectors
              tags={tags}
              selectLabel={translate('add', language)}
              selectTags={setSelectedTags}
            />
            <div className={styles.checkGroup}>
              <CheckInput
                text={translate('digital', language)}
                topMenu
                value={digital}
                onChange={() => setDigital(!digital)}
              />
              <CheckInput
                text={translate('cylinder', language)}
                value={cylinder}
                topMenu
                onChange={() => setCylinder(!cylinder)}
              />
            </div>
            <div className={styles.checkGroup}>
              <CheckInput
                text={translate('reserved', language)}
                topMenu
                value={reserved}
                onChange={() => setReserved(!reserved)}
              />
            </div>
            <div className={styles.checkGroup}>
              <CheckInput
                text={translate('pantone', language)}
                topMenu
                value={pantone}
                onChange={() => setPantone(!pantone)}
              />
            </div>
          </div>
          <div className={styles.filterActions}>
            <button
              type="button"
              className={styles.clearAttendancesFilters}
              onClick={handleClearFilters}
            >
              {translate('clearFilters', language)}
            </button>
            <button
              type="button"
              className={`${styles.defaultActionButton} ${styles.showAttendances}`}
              onClick={searchMyPrint}
            >
              {translate('showPrints', language)}
            </button>
          </div>
        </FiltersModal>
      )}
      {loading && (
        <div className={styles.loadingContainer}>
          <Loading fixed />
        </div>
      )}
    </>
  );
}

export default MyPrints;
