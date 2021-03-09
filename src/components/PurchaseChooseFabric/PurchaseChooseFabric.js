import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './PurchaseChooseFabric.module.scss';
import useOutsideClick from '../../libs/useOutsideClick';
import translate from '../../libs/i18n';
import Api from '../../libs/Api';

import ListSelector from '../ListSelector/ListSelector';
// import CloseIcon from '../assets/icons/Close';
import Arrow from '../../assets/icons/Arrow';
import Search from '../../assets/icons/Search';
import FormModal from '../FormModal/FormModal';
import Loading from '../Loading/Loading';

export default function PurchaseChooseFabric({
  chooseAction,
  prints,
  fabrics,
  fabricPurchase,
  close,
}) {
  const language = useSelector((state) => state.settings.language);
  // const [currentFabricIndex, setCurrentFabricIndex] = useState(0);
  const [, setCurrentFabricIndex] = useState(0);

  const [fabric, setFabric] = useState();
  const [fabricSelector, setFabricSelector] = useState(false);
  const [, setShowingFabric] = useState();

  const [fabricsModal, setFabricsModal] = useState(false);
  const [fabricQuery, setFabricQuery] = useState();
  const [meters, setMeters] = useState();
  const [action, setAction] = useState();

  const [fabricImages, setFabricImages] = useState([]);
  const [selectedFabricImage, setSelectedFabricImage] = useState();
  const [loading, setLoading] = useState(false);

  const fabricSelectorRef = useRef(null);

  useEffect(() => {
    if (fabric) {
      setLoading(true);
      Api.getFabricImages(fabric.id)
        .then((res) => {
          setFabricImages(res);
          setSelectedFabricImage(res[0]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [fabric]);

  // const activeScrollDown = useMemo(
  //   () => currentFabricIndex < fabrics.length - 7,
  //   [currentFabricIndex, fabrics.length]
  // );
  // const activeScrollUp = useMemo(() => currentFabricIndex > 0, [
  //   currentFabricIndex
  // ]);

  const selectedFabricInfo = useMemo(() => {
    if (fabric) {
      return fabrics.find((f) => f.id === fabric.id);
    }
    return false;
  }, [fabric, fabrics]);

  useEffect(() => {
    setFabricSelector(false);
  }, [fabric]);

  useOutsideClick(fabricSelectorRef, () => {
    setFabricSelector(false);
  });

  useEffect(() => {
    // if (fabrics.length) {
    //   const angra = fabrics.find(f => f.name === 'ANGRA');
    //   if (angra) {
    //     setFabric(angra);
    //   } else {
    //     setFabric(fabrics[0]);
    //   }
    // }
  }, [fabrics]);

  const chooseReserve = () => {
    chooseAction('reserve');
    fabricPurchase({
      type: 'RESERVA',
      fabric: selectedFabricInfo,
      meters,
    });
    chooseAction('produce');
  };

  const chooseHanger = () => {
    fabricPurchase({
      type: 'HANGER',
      fabric: selectedFabricInfo,
      meters,
    });
    chooseAction('hanger');
  };

  const chooseStrike = () => {
    fabricPurchase({
      type: 'PILOTO',
      fabric: selectedFabricInfo,
      meters,
    });
    chooseAction('strike');
  };

  const chooseProduction = () => {
    fabricPurchase({
      type: 'PRODUCAO',
      fabric: selectedFabricInfo,
      meters,
    });
    chooseAction('produce');
  };

  const getFabrics = useMemo(() => {
    const differentFabricsPrints = [];

    prints.forEach((p) => {
      if (
        p.fabric_id &&
        !differentFabricsPrints.find((dC) => dC.fabric_id === p.fabric_id)
      ) {
        differentFabricsPrints.push(p);
      }
    });

    const differentFabrics = [];
    differentFabricsPrints.forEach((f) => {
      const fab = fabrics.find((dF) => dF.id === f.fabric_id);
      differentFabrics.push(fab);
    });
    if (differentFabrics.length) {
      setFabric(differentFabrics[0]);
      setCurrentFabricIndex(0);
      return differentFabrics;
    }
    const angra = fabrics.find((f) => f.name === 'ANGRA');
    const angraIndex = fabrics.findIndex((f) => f.name === 'ANGRA');
    if (angra) {
      setFabric(angra);
      setCurrentFabricIndex(angraIndex);
    } else {
      setFabric(fabrics[0]);
      setCurrentFabricIndex(0);
    }
    return fabrics;
  }, [fabrics, prints]);

  const filteredFabrics = useMemo(() => {
    if (fabricQuery) {
      return getFabrics.filter((f) => {
        let t = '';

        if (language === 'en') {
          if (f && f.description_en && f.description_en.length) {
            t = `${t} ${f.description_en}`;
          }

          if (f && f.mixture_en && f.mixture_en.length) {
            t = `${t} ${f.mixture_en}`;
          }

          if (f && f.name_en && f.name_en.length) {
            t = `${t} ${f.name_en}`;
          }

          if (f && f.small_description_en && f.small_description_en.length) {
            t = `${t} ${f.small_description_en}`;
          }
        } else {
          if (f && f.description && f.description.length) {
            t = `${t} ${f.description}`;
          }

          if (f && f.mixture && f.mixture.length) {
            t = `${t} ${f.mixture}`;
          }

          if (f && f.name && f.name.length) {
            t = `${t} ${f.name}`;
          }

          if (f && f.small_description && f.small_description.length) {
            t = `${t} ${f.small_description}`;
          }
        }

        if (f.grammage) {
          t = `${t} ${f.grammage}`;
        }

        if (f.throughput) {
          t = `${t} ${f.throughput}`;
        }

        if (f.width) {
          t = `${t} ${f.width}`;
        }

        if (t.trim().toLowerCase().includes(fabricQuery.toLowerCase())) {
          return f;
        }

        return null;
      });
    }

    return getFabrics;
  }, [fabricQuery, getFabrics]);

  useEffect(() => {
    if (fabric) {
      const fabricIndex = fabrics.findIndex((f) => f.id === fabric.id);
      setShowingFabric(fabric);
      setCurrentFabricIndex(fabricIndex);
    }
  }, [fabric, fabrics]);

  useEffect(() => {
    if (getFabrics.length && fabrics.length) {
      const firstShowingFabric = fabrics.find((f) => f.id === getFabrics[0].id);
      setShowingFabric(firstShowingFabric);
    }
  }, [getFabrics, fabrics]);

  // const fabricsSlider = () => {
  //   return getFabrics.length
  //     ? getFabrics
  //         .slice(currentFabricIndex, currentFabricIndex + 7)
  //         .map((fab, index) => (
  //           <li
  //             key={index.toString()}
  //             className={` ${
  //               showingFabric && fab.id === showingFabric.id
  //                 ? styles.active
  //                 : ''
  //             }`}
  //           >
  //             <button type="button" onClick={() => setShowingFabric(fab)}>
  //               <img
  //                 src={fabrics.find(f => f.id === fab.id).image}
  //                 alt="tecido"
  //               />
  //             </button>
  //           </li>
  //         ))
  //     : null;
  // };

  return (
    <div className={styles.content}>
      <div className={styles.fabricsList}>
        <ul>
          {fabricImages.map((fab) => (
            <li
              className={
                selectedFabricImage &&
                fab.image_url === selectedFabricImage.image_url
                  ? styles.active
                  : ''
              }
            >
              <button type="button" onClick={() => setSelectedFabricImage(fab)}>
                <img src={fab.image_url} alt="fabric" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedFabricInfo && (
        <div className={styles.fabric}>
          {selectedFabricImage && (
            <img src={selectedFabricImage.image_url} alt="tecido" />
          )}
          <p>{selectedFabricInfo.name}</p>
        </div>
      )}
      <section className={styles.color}>
        <>
          <button className={styles.backColor} type="button" onClick={close}>
            <span className={styles.icon}>
              <Arrow />
            </span>
            {translate('color', language)}
          </button>
          <h2
            className={styles.sectionTitle}
            style={{ marginTop: '184px', marginBottom: '34px' }}
          >
            <b>{translate('fabric', language)}</b>
            {prints &&
            prints.length &&
            prints[0] &&
            prints[0].print_code &&
            prints[0].print_code.length
              ? ` - ${prints[0].print_code}`
              : ''}
          </h2>
          <div>
            <div className={styles.fabricsOptions}>
              <p className={styles.fabricSelectorLabel}>
                {translate('selectOneFabric', language)}
              </p>
              <button
                onClick={() => setFabricsModal(true)}
                type="button"
                className={styles.showFabrics}
              >
                {translate('showFabrics', language)}
              </button>
            </div>
            <div ref={fabricSelectorRef} className={styles.selectorContainer}>
              <button
                type="button"
                className={`${styles.defaultSelectInput}`}
                onClick={() => setFabricSelector(true)}
              >
                {fabric ? fabric.name : translate('chooseFabric', language)}
              </button>
              {fabricSelector && (
                <span>
                  <ListSelector
                    selectLabel={translate('choose', language)}
                    items={getFabrics}
                    onSelect={setFabric}
                    value={fabric}
                  />
                </span>
              )}
            </div>
          </div>
          <div>
            {/* <p className={styles.fabricSmallDesc}>
              {selectedFabricInfo &&
                (language === 'pt-br'
                  ? selectedFabricInfo.small_description || ''
                  : selectedFabricInfo.small_description_en || '')}
            </p> */}
            <p className={styles.fabricDesc}>
              {selectedFabricInfo &&
                (language === 'pt-br'
                  ? selectedFabricInfo.description || ''
                  : selectedFabricInfo.description_en || '')}
            </p>
          </div>
          <div className={styles.fabricDetails}>
            <div>
              {translate('grammage', language)}:{' '}
              <span>
                {selectedFabricInfo ? (
                  <>
                    {selectedFabricInfo.grammage} g/m<sup>2</sup>
                  </>
                ) : (
                  ''
                )}{' '}
              </span>
            </div>
            <div>
              {translate('composition', language)}:{' '}
              <span>
                {selectedFabricInfo
                  ? `${
                      language === 'pt-br'
                        ? selectedFabricInfo.mixture || ''
                        : selectedFabricInfo.mixture_en || ''
                    }`
                  : ''}
              </span>
            </div>
            <div>
              {translate('width', language)}:{' '}
              <span>
                {selectedFabricInfo ? `${selectedFabricInfo.width} cm` : ''}
              </span>
            </div>
            <div>
              {translate('yield', language)}:{' '}
              <span>
                {selectedFabricInfo
                  ? `${selectedFabricInfo.throughput} M/KG`
                  : ''}{' '}
              </span>
            </div>
          </div>
        </>
        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.defaultActionButton} ${styles.changeSectionButton}`}
            onClick={() => setAction('produce')}
          >
            {translate('produce', language)}
          </button>
          <button
            type="button"
            className={`${styles.defaultActionButton} ${styles.changeSectionButton}`}
            onClick={chooseReserve}
          >
            {translate('reserve', language)}
          </button>
          <button
            type="button"
            className={`${styles.defaultActionButton} ${styles.changeSectionButton}`}
            onClick={() => setAction('strike')}
          >
            {translate('strike', language)}
          </button>
          <button
            type="button"
            className={`${styles.defaultActionButton} ${styles.changeSectionButton}`}
            onClick={chooseHanger}
          >
            {translate('hanger', language)}
          </button>
        </div>
        {action && (
          <FormModal
            onCancel={() => setAction()}
            title={translate(
              action === 'strike' ? 'strike' : 'production',
              language
            )}
          >
            <p className={styles.formLabel}>
              {translate('chooseFabricFootage', language)}
            </p>
            <input
              className={styles.formInput}
              type="number"
              value={meters}
              onChange={(e) => setMeters(e.currentTarget.value)}
            />{' '}
            {translate('meters', language)}
            <hr className={styles.formDivisor} />
            <div className={styles.formButtonArea}>
              <button
                type="button"
                className={styles.defaultActionButton}
                onClick={action === 'strike' ? chooseStrike : chooseProduction}
              >
                {translate('next', language)}
              </button>
            </div>
          </FormModal>
        )}
      </section>
      {fabricsModal && (
        <>
          <div className={styles.fabricsModalContainer}>
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h1>{translate('chooseAFabric', language)}</h1>
                <div className={styles.head}>
                  <button
                    className={styles.backFabric}
                    type="button"
                    onClick={() => setFabricsModal(false)}
                  >
                    <span className={styles.icon}>
                      <Arrow color="#FFF" />
                    </span>
                    {translate('fabric', language)}
                  </button>
                </div>
                {/* <button
                  type="button"
                  className={styles.close}
                  onClick={() => setFabricsModal(false)}
                >
                  <CloseIcon />
                </button> */}
                <div className={styles.inputWrapper}>
                  <Search color="#9BA7B7" />
                  <input
                    type="search"
                    placeholder={translate('search', language)}
                    value={fabricQuery}
                    onChange={(e) => setFabricQuery(e.currentTarget.value)}
                  />
                </div>
                <ul className={styles.fabricsList}>
                  {filteredFabrics.map((fab) => (
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setShowingFabric(fab);
                          setFabric(fab);
                          setFabricsModal(false);
                        }}
                      >
                        <img src={fab.image} alt={fab.name} />
                        <div className={styles.fabricInfoContainer}>
                          <div className={styles.fabricName}>{fab.name}</div>
                          <div className={styles.fabricInfo}>
                            <div className={styles.item}>
                              <span>{translate('grammage', language)}</span>:{' '}
                              {fab.grammage} g/m2
                            </div>
                            <div className={styles.item}>
                              <span>{translate('width', language)}</span>:{' '}
                              {fab.width} cm
                            </div>
                            <div className={styles.item}>
                              <span>{translate('composition', language)}</span>:{' '}
                              {fab.mixture}
                            </div>
                            <div className={styles.item}>
                              <span>{translate('yield', language)}</span>:{' '}
                              {fab.throughput} M/KG
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
      {loading && <Loading />}
    </div>
  );
}

PurchaseChooseFabric.propTypes = {
  chooseAction: PropTypes.func.isRequired,
  fabrics: PropTypes.arrayOf(PropTypes.shape).isRequired,
  prints: PropTypes.arrayOf(PropTypes.shape).isRequired,
  fabricPurchase: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};
