import React, { memo, useState, useRef, useEffect, useMemo } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import translate from '../../libs/i18n';
import Api from '../../libs/Api';
import useOutsideClick from '../../libs/useOutsideClick';
import styles from './PrintGridItem.module.scss';
import calcDollRapport from '../../utils/calcDollRapport';

import ShoppingCartIcon from '../../assets/icons/ShoppingCart';
import CheckInput from '../CheckInput/CheckInput';
import ListSelector from '../ListSelector/ListSelector';
import TrashCanIcon from '../../assets/icons/TrashCan';
import CustomizedPrintImage from '../../assets/images/customized-print.jpg';
import EstampaCustomizadaImage from '../../assets/images/estampa-customizada.jpg';
import FavoriteIcon from '../../assets/icons/Heart';

function PrintGridItem({
  id,
  code,
  image,
  name,
  presentations,
  fabrics,
  purchaseSelect,
  addToCart,
  doll,
  printApplication,
  printJpegWidth,
  printJpegHeight,
  exclusivity,
  reserved,
  pendingReview,
  type,
  backgroundColor,
  newTab,
  selectable,
  onSelect,
  mini,
  // eslint-disable-next-line react/prop-types
  deletePrint,
  // eslint-disable-next-line react/prop-types
  doNothing,
  pantone,
  customizableBackground,
  printApproval,
  newDesignPending,
  favorite,
  isFavorite,
}) {
  const language = useSelector((state) => state.settings.language);
  const presentationSelectorRef = useRef();

  const history = useHistory();
  const location = useLocation();

  const [selectedPresentation, setSelectedPresentation] = useState([]);
  const [presentationSelector, setPresentationSelector] = useState(false);
  const [presentationSection, setPresentationSection] = useState(
    'presentation'
  );
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [lastPresentation, setLastPresentation] = useState();
  const [dollAdjustments, setDollAdjustments] = useState();
  const [checked, setChecked] = useState(false);

  const changePresentationSelector = (state) => {
    if (!state) {
      setPresentationSelector(true);
    } else {
      setPresentationSelector(false);
    }
  };

  useOutsideClick(presentationSelectorRef, () => {
    setPresentationSection('presentation');
    changePresentationSelector(presentationSelector);
    setSelectedPresentation([]);
    setSelectedFabrics([]);
  });

  useEffect(() => {
    if (
      selectedPresentation.length &&
      !selectedPresentation.includes(
        (presentation) => presentation.id === lastPresentation
      )
    ) {
      if (selectedPresentation.length === 1) {
        setLastPresentation(selectedPresentation[0]);
      } else {
        const newPresentation = selectedPresentation.filter(
          (presentation) => presentation.id !== lastPresentation.id
        );
        setSelectedPresentation(newPresentation);
      }
    }

    if (selectedPresentation.length) {
      setPresentationSection('fabric');
    }
  }, [lastPresentation, selectedPresentation]);

  useEffect(() => {
    (async function loadData() {
      if (id && doll && doll.dolly_id) {
        let adjustments = [];

        if (doll.is_new_doll) {
          adjustments = await Api.getDollyAdjustment(id, doll.dolly_id);
        } else {
          adjustments = await Api.getMainDollyAdjustment(id, doll.dolly_id);
        }

        if (adjustments && adjustments.result) {
          setDollAdjustments(adjustments.result);
        }
      }
    })();
  }, [id, doll]);

  const includePrintPresentation = () => {
    setPresentationSection('presentation');
    setPresentationSelector(false);

    if (selectedFabrics.length) {
      selectedFabrics.forEach((fabric) => {
        const formData = new FormData();
        formData.append('fabric', fabric.id);
        formData.append('print', id);
        Api.createProduct(formData).then((product) => {
          Api.addSelectedPrintToPresentation(selectedPresentation[0].id, {
            product_id: product.id,
          })
            .then(() => {
              toast(
                `${translate(
                  'successAddingProductToPresentation',
                  language
                )} : ${code}-${fabric.name}`,
                {
                  type: 'success',
                }
              );
            })
            .catch(() => {
              toast(
                `${translate(
                  'failAddingProductToPresentation',
                  language
                )}: ${code}-${fabric.name}`,
                {
                  type: 'error',
                }
              );
            })
            .finally(() => {
              setSelectedPresentation([]);
              setSelectedFabrics([]);
            });
        });
      });
    } else {
      const formData = new FormData();

      formData.append('print', id);
      Api.createProduct(formData).then((product) => {
        Api.addSelectedPrintToPresentation(selectedPresentation[0].id, {
          product_id: product.id,
        })
          .then(() => {
            toast(
              `${translate(
                'successAddingProductToPresentation',
                language
              )} : ${code}`,
              {
                type: 'success',
              }
            );
          })
          .catch(() => {
            toast(
              `${translate(
                'failAddingProductToPresentation',
                language
              )}: ${code}`,
              {
                type: 'error',
              }
            );
          })
          .finally(() => {
            setSelectedPresentation([]);
            setSelectedFabrics([]);
          });
      });
    }
  };

  const isChrome = () => {
    if (navigator.userAgent.indexOf('Chrome') > -1) {
      return true;
    }
    return false;
  };

  const renderCardDoll = () => {
    if (
      doll.is_new_doll &&
      doll.dolly_masks &&
      doll.dolly_masks.length &&
      dollAdjustments
    ) {
      return (
        <div
          className={styles.cardDoll}
          style={!isChrome() ? { width: '100%' } : {}}
        >
          <div className={styles.grayBackground} />
          {doll.dolly_masks.map((mask, index) => {
            if (mask && mask.mask.length) {
              return (
                <div
                  className={styles.dollMask}
                  style={{
                    WebkitMaskImage: `url(${mask.mask})`,
                    maskImage: `url(${mask.mask})`,
                  }}
                >
                  <div
                    className={styles.dollMaskPrint}
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundColor: backgroundColor || pantone || '',
                      backgroundSize: printJpegWidth
                        ? `auto ${calcDollRapport(
                            printJpegWidth,
                            printJpegHeight,
                            dollAdjustments[index] &&
                              dollAdjustments[index].scale
                              ? dollAdjustments[index].scale
                              : doll.rapport_propor
                          )}%`
                        : '100%',
                      backgroundPosition: `center calc(42% - ${
                        doll.rapport_propor || 0
                      }%`,
                      transform: `translateX(-50%) rotate(${
                        dollAdjustments[index] && dollAdjustments[index].rotate
                          ? dollAdjustments[index].rotate
                          : 0
                      }deg)`,
                    }}
                  />
                </div>
              );
            }

            return null;
          })}
          <img src={doll.shadow} className={styles.maskShadow} alt="shadow" />
          <div className={styles.dolly}>
            <div className={styles.background}>
              <img
                style={
                  !isChrome()
                    ? {
                        backgroundImage: `url(${image})`,
                        backgroundColor: backgroundColor || pantone || '',
                        backgroundSize: printJpegWidth
                          ? `auto ${calcDollRapport(
                              printJpegWidth,
                              printJpegHeight,
                              doll.rapport_propor
                            )}%`
                          : '100%',
                      }
                    : {}
                }
                className={styles.model}
                src={doll.image}
                alt="doll"
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={styles.cardDoll}
        style={!isChrome() ? { width: '100%' } : {}}
      >
        <div className={styles.grayBackground} />
        <div className={styles.dolly}>
          <div className={styles.background}>
            {isChrome() && (
              <div
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundColor: backgroundColor || pantone || '',
                  backgroundSize: printJpegWidth
                    ? `auto ${calcDollRapport(
                        printJpegWidth,
                        printJpegHeight,
                        doll.rapport_propor
                      )}%`
                    : '100%',
                  backgroundPosition: `center calc(42% - ${
                    doll.rapport_propor || 0
                  }%)`,
                }}
              />
            )}
            <img
              style={
                !isChrome()
                  ? {
                      backgroundImage: `url(${image})`,
                      backgroundColor: backgroundColor || pantone || '',
                      backgroundSize: printJpegWidth
                        ? `auto ${calcDollRapport(
                            printJpegWidth,
                            printJpegHeight,
                            doll.rapport_propor
                          )}%`
                        : '100%',
                    }
                  : {}
              }
              className={styles.model}
              src={doll.image}
              alt="doll"
            />
          </div>
          <img src={doll.shadow} className={styles.shadow} alt="shadow" />
        </div>
      </div>
    );
  };

  const getCustomizadeImage = useMemo(
    () => (language === 'en' ? CustomizedPrintImage : EstampaCustomizadaImage),
    [language]
  );

  const renderImageButton = useMemo(() => {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const printJpegHeightPixel = printJpegHeight ? printJpegHeight * 37.79 : 0;
    const printJpegWidthPixel = printJpegWidth ? printJpegWidth * 37.79 : 0;
    let fabricBackgroundSize = 'contain';

    if (
      (printJpegWidthPixel && windowWidth * 0.225 > printJpegWidthPixel) ||
      (printJpegHeightPixel && windowHeight * 0.225 > printJpegHeightPixel)
    ) {
      fabricBackgroundSize = `${printJpegWidthPixel / 4}px ${
        printJpegHeightPixel / 4
      }px`;
    }

    return (
      <button
        type="button"
        className={styles.imageButton}
        onClick={purchaseSelect}
      >
        {printApplication ? (
          <>
            {image || pantone ? (
              <div
                className={styles.imagePrint}
                style={{
                  backgroundColor: backgroundColor || pantone || '',
                  backgroundSize: fabricBackgroundSize,
                  backgroundImage: `url(${image})`,
                }}
              >
                {image && (
                  <img
                    className={styles.image}
                    src={newDesignPending ? getCustomizadeImage : image}
                    alt={code}
                  />
                )}
              </div>
            ) : (
              <div className={styles.imageReplace} />
            )}
            <div
              className={styles.cardDoll}
              style={!isChrome() ? { width: '100%' } : {}}
            >
              <div className={styles.grayBackground} />
              <div className={styles.dolly}>
                <div className={styles.background}>
                  <img
                    className={styles.model}
                    src={printApplication}
                    alt="doll"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {image || pantone ? (
              <div
                className={styles.imagePrint}
                style={{
                  backgroundColor: backgroundColor || pantone || '',
                  backgroundSize: fabricBackgroundSize,
                  backgroundImage: `url(${image})`,
                }}
              >
                <img
                  className={styles.image}
                  src={newDesignPending ? getCustomizadeImage : image}
                  alt={code}
                />
              </div>
            ) : (
              <div className={styles.imageReplace} />
            )}
            {renderCardDoll(doll)}
          </>
        )}
      </button>
    );
  }, [
    backgroundColor,
    code,
    doll,
    image,
    printApplication,
    printJpegHeight,
    printJpegWidth,
    purchaseSelect,
  ]);

  const cardContent = (
    <div className={styles.printGridItem}>
      {customizableBackground && (
        <span className={styles.customizableBackground} />
      )}
      {image || pantone ? (
        <div
          className={pantone ? styles.pantone : ''}
          style={{ backgroundColor: backgroundColor || pantone }}
        >
          {image && (
            <img
              className={styles.image}
              src={newDesignPending ? getCustomizadeImage : image}
              alt={code}
            />
          )}
        </div>
      ) : (
        <div className={styles.imageReplace} />
      )}

      <div className={styles.info}>
        <div className={`${styles.name} ${mini && styles.mini}`}>{name}</div>
        <div className={styles.tagArea}>
          <div className={`${styles.code} ${mini && styles.mini}`}>{code}</div>
          <div className={styles.tags}>
            {type && (
              <div
                className={`${styles.tag} ${styles.dig} ${mini && styles.mini}`}
              >
                {type === 'DIG' && translate('digital', language).toUpperCase()}
                {type === 'CYL' &&
                  translate('cylinder', language).toUpperCase()}
                {type === 'BOT' &&
                  `${translate('digital', language).toUpperCase()}/${translate(
                    'cylinder',
                    language
                  ).toUpperCase()}`}
              </div>
            )}

            {exclusivity && (
              <div className={`${styles.tag} ${mini && styles.mini}`}>
                {translate('exclusive', language)}
              </div>
            )}
            {!!reserved && (
              <div className={`${styles.tag} ${mini && styles.mini}`}>
                {translate('reserved', language)}
              </div>
            )}
            {pendingReview && (
              <div className={`${styles.tag} ${mini && styles.mini}`}>
                {translate('pendingReview', language)}
              </div>
            )}
          </div>
        </div>

        {favorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              favorite();
            }}
            type="button"
            className={styles.favorite}
          >
            <FavoriteIcon active={isFavorite} />
          </button>
        )}
      </div>
    </div>
  );

  const LinkContainer = useMemo(() => {
    if (newTab) {
      return (
        <button
          type="button"
          onClick={() => {
            const currentUrl = window.location.href;
            const mainUrl = currentUrl.split(location.pathname)[0];
            window.open(`${mainUrl}/print/${id}`, '_blank');
          }}
          className={styles.cardButton}
        >
          {cardContent}
        </button>
      );
    }
    if (printApproval) {
      return (
        <button
          type="button"
          onClick={printApproval}
          className={styles.cardButton}
        >
          {cardContent}
        </button>
      );
    }
    if (doNothing) {
      return cardContent;
    }
    return (
      <Link to={`/print/${id}`} className={styles.cardLink}>
        {cardContent}
      </Link>
    );
  }, [isFavorite]);

  return (
    <div className={styles.card}>
      {deletePrint && (
        <button
          type="button"
          className={styles.delete}
          onClick={() => deletePrint(id)}
        >
          <TrashCanIcon color="#ff5d68" />
        </button>
      )}
      {selectable && (
        <div className={styles.check}>
          <CheckInput
            card
            value={checked}
            onChange={(value) => {
              setChecked(value);
              onSelect(
                {
                  id,
                  name,
                  code,
                  image_url: image,
                },
                value
              );
            }}
            id={id}
          />
        </div>
      )}

      {purchaseSelect ? (
        <div className={styles.cardButton}>
          <div className={styles.printGridItem}>
            {renderImageButton}
            <div className={styles.info}>
              <button
                type="button"
                className={styles.addToCart}
                onClick={
                  addToCart
                    ? (e) => {
                        e.stopPropagation();
                        addToCart(id);
                      }
                    : () => {}
                }
              >
                <ShoppingCartIcon width="25" height="25" />
              </button>
              <div className={styles.name}>{name}</div>
              <div>
                <div className={styles.code}>{code}</div>
                <div className={styles.tags} />
              </div>
              {favorite && (
                <button
                  type="button"
                  className={styles.favorite}
                  onClick={(e) => {
                    e.stopPropagation();

                    e.preventDefault();
                    favorite();
                  }}
                >
                  <FavoriteIcon active={isFavorite} />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        LinkContainer
      )}

      {presentations && presentations.length > 0 && (
        <div className={styles.presentationSelector}>
          <button
            type="button"
            className={`${styles.defaultSelectInput}`}
            onClick={(e) => {
              e.stopPropagation();
              setPresentationSelector(true);
            }}
          >
            {!selectedPresentation.length
              ? translate('choosePresentation', language)
              : selectedPresentation[0].name}
          </button>

          {presentationSelector && (
            <span
              className={styles.selectorPosition}
              ref={presentationSelectorRef}
            >
              <div className={styles.steps}>
                <button
                  type="button"
                  className={
                    presentationSection === 'presentation' && styles.active
                  }
                  onClick={() => setPresentationSection('presentation')}
                >
                  {translate('presentation', language)}
                </button>{' '}
                <span className={styles.separator}>{'>'}</span>
                <button
                  type="button"
                  onClick={() => setPresentationSection('fabric')}
                  className={presentationSection === 'fabric' && styles.active}
                >
                  {translate('fabric', language)}
                </button>
              </div>
              <div className={styles.list}>
                {presentationSection === 'presentation' ? (
                  <ListSelector
                    label={translate('mainPresentations', language)}
                    selectLabel={translate('choose', language)}
                    items={presentations} // presentations
                    onSelect={setSelectedPresentation}
                    values={selectedPresentation}
                    multiple
                    fullWidth
                    search
                    action={() => history.push('/create-presentation')}
                    actionText={translate('createPresentation', language)}
                  />
                ) : (
                  <ListSelector
                    label={translate('applyFixedFabric', language)}
                    selectLabel={translate('choose', language)}
                    items={fabrics} // presentations
                    onSelect={setSelectedFabrics}
                    values={selectedFabrics}
                    multiple
                    action={includePrintPresentation}
                    actionText={translate('save', language)}
                    fullWidth
                    search
                  />
                )}
              </div>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

PrintGridItem.propTypes = {
  id: PropTypes.number.isRequired,
  code: PropTypes.string.isRequired,
  image: PropTypes.string,
  name: PropTypes.string,
  presentations: PropTypes.arrayOf(PropTypes.shape),
  fabrics: PropTypes.arrayOf(PropTypes.shape),
  purchaseSelect: PropTypes.func,
  addToCart: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  doll: PropTypes.oneOfType([PropTypes.shape, PropTypes.bool]),
  exclusivity: PropTypes.bool,
  reserved: PropTypes.bool,
  pendingReview: PropTypes.bool,
  type: PropTypes.string,
  printJpegWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  printJpegHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  printApplication: PropTypes.bool,
  backgroundColor: PropTypes.string.isRequired,
  newTab: PropTypes.bool,
  selectable: PropTypes.bool,
  onSelect: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  mini: PropTypes.bool.isRequired,
  pantone: PropTypes.string,
  customizableBackground: PropTypes.bool,
  printApproval: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  newDesignPending: PropTypes.bool,
  favorite: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  isFavorite: PropTypes.bool,
};

PrintGridItem.defaultProps = {
  name: '',
  image: '',
  presentations: [],
  fabrics: [],
  purchaseSelect: false,
  addToCart: false,
  doll: false,
  exclusivity: false,
  reserved: false,
  pendingReview: false,
  type: '',
  printJpegWidth: false,
  printJpegHeight: false,
  printApplication: false,
  newTab: false,
  selectable: false,
  onSelect: false,
  pantone: '',
  customizableBackground: false,
  printApproval: false,
  newDesignPending: false,
  favorite: false,
  isFavorite: false,
};

export default memo(PrintGridItem);
