import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ChromePicker as ColorPicker } from 'react-color';

import styles from './PurchaseChoosePrint.module.scss';
import useOutsideClick from '../../libs/useOutsideClick';
import translate from '../../libs/i18n';
import Api from '../../libs/Api';
import calcDollRapport from '../../utils/calcDollRapport';

// import CloseIcon from '../assets/icons/Close';
// import EditIcon from '../assets/icons/Edit';
import ResetIcon from '../../assets/icons/Reset';
// import PlayIcon from '../assets/icons/Play';
import CheckInput from '../CheckInput/CheckInput';
import Loading from '../Loading/Loading';
// import ShoppingCartIcon from '../assets/icons/ShoppingCart';
import EditFilter from '../../assets/icons/EditFilter';
import EditMask from '../../assets/icons/EditMask';
import Arrow from '../../assets/icons/Arrow';
import Save from '../../assets/icons/Save';

import customizedPrint from '../../assets/images/customized-print.jpg';
import estampaCustomizada from '../../assets/images/estampa-customizada.jpg';

// import CustomizePrintAndDoll from './CustomizePrintAndDoll';

export default function PurchaseChoosePrint({
  chooseFabric,
  dolls,
  printsPurchase,
  purchaseCustomizedPrint,
  reserveCustomizedPrint,
  printsReserve,
  addPrintsToCart,
  prints,
  client,
  presentationType,
  addCustomizedPrintToCart,
  nextPrint,
  previousPrint,
  close,
  presentationId,
}) {
  const language = useSelector((state) => state.settings.language);
  const user = useSelector((state) => state.user);

  const location = useLocation();

  const [allColors, setAllColors] = useState(false);
  const [currentDollIndex, setCurrentDollIndex] = useState(0);
  const [showingDoll, setShowingDoll] = useState(0);
  const [showingPrint, setShowingPrint] = useState();
  const [editingPrint, setEditingPrint] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [loading, setLoading] = useState(true);

  const [colorVariationSelector, setColorVariationSelector] = useState(false);

  const [scale, setScale] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [color, setColor] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('');
  // const [observationField, setObservationField] = useState(false);
  const [dollVisibility, setDollVisibility] = useState(false);
  const [observation, setObservation] = useState();
  // const [observationSent] = useState(false);
  const [manualApplicatedDolls, setManualApplicatedDolls] = useState([]);
  const [showingDollMask, setShowingDollMask] = useState([]);
  const [showingDollAdjustment, setShowingDollAdjustment] = useState([]);
  const [singleConfigList, setSingleConfigList] = useState([]);
  const [showingDollPosXAdjustment, setShowingDollPosXAdjustment] = useState(
    []
  );
  const [showingDollPosYAdjustment, setShowingDollPosYAdjustment] = useState(
    []
  );
  const [
    showingDollRotateAdjustment,
    setShowingDollRotateAdjustment,
  ] = useState([]);
  const [showDollMAskAdjustments, setShowDollMAskAdjustments] = useState(false);
  const [showingDollMainAdjustment, setShowingDollMainAdjustment] = useState();
  const [editDollMasks] = useState(
    location.pathname && !location.pathname.includes('client')
  );
  const [showingPrintHeight, setShowingPrintHeight] = useState(0);
  const [showingPrintWidth, setShowingPrintWidth] = useState(0);
  const [fabricBackgroundSize, setFabricBackgroundSize] = useState('auto');
  const [fabricBackgroundPosition, setFabricBackgroundPosition] = useState(
    '50%'
  );
  const [printLoaded, setPrintLoaded] = useState(false);
  const [dollLoaded, setDollLoaded] = useState(false);
  const [shadowLoaded, setShadowLoaded] = useState(false);
  const [printZoomActive, setPrintZoomActive] = useState(false);
  const [printZoomPosition, setPrintZoomPosition] = useState({ x: 0, y: 0 });

  const dollRef = useRef(null);
  const colorVariationSelectorRef = useRef(null);
  const scrollDollsRef = useRef(null);
  const imgElement = useRef(null);

  const createMaskConfig = (r, x, y) => {
    const s = 1 + scale / 100;

    return {
      transform: `translateX(-50%) translateY(-50%) rotate(${r}deg) scale(${s})`,
      backgroundPosition: `${x / 100}% ${y / 100}%`,
    };
  };

  useEffect(() => {
    setShowingPrint(prints[0]);
  }, [prints]);

  useEffect(() => {
    if (dolls.length) {
      setShowingDoll(dolls[0].id);
      // setShowingDollMask(dolls[0].masks);
    }
  }, [dolls]);

  useEffect(() => {
    const currentDoll = dolls.find((d) => d.id === showingDoll);

    if (currentDoll && currentDoll.masks) {
      setShowingDollMask(currentDoll.masks);
    } else {
      setShowingDollMask([]);
    }
  }, [dolls, showingDoll]);

  useEffect(() => {
    setLoading(true);

    if (
      showingPrint &&
      showingPrint.print_id &&
      showingDoll &&
      showingDollMask &&
      showingDollMask.length
    ) {
      Api.getDollyAdjustment(showingPrint.print_id, showingDoll)
        .then((res) => {
          setShowingDollAdjustment(res.result);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showingPrint, showingDoll, showingDollMask]);

  useEffect(() => {
    if (
      showingDollMask &&
      !showingDollMask.length &&
      showingDoll &&
      showingPrint &&
      showingPrint.print_id
    ) {
      setLoading(true);

      Api.getMainDollyAdjustment(showingPrint.print_id, showingDoll)
        .then((res) => {
          if (res.count) {
            setShowingDollMainAdjustment(res.result[0]);
            setShowingDollPosXAdjustment([res.result[0].pos_x]);
            setShowingDollPosYAdjustment([res.result[0].pos_y]);
          } else {
            setShowingDollMainAdjustment({
              pos_x: 0,
              pos_y: 0,
              dolly: showingDoll,
              print: showingPrint.print_id,
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showingDoll, showingDollMask, showingPrint]);

  useEffect(() => {
    const dollPosXAdjustment = [];
    const dollPosYAdjustment = [];
    const dollRotateAdjustment = [];
    const configList = [];

    if (showingDollAdjustment && showingDollAdjustment.length) {
      showingDollAdjustment.forEach((adjustment) => {
        dollPosXAdjustment.push(adjustment.pos_x || 0);
        dollPosYAdjustment.push(adjustment.pos_y || 0);
        dollRotateAdjustment.push(adjustment.rotate || 0);
        configList.push(
          createMaskConfig(
            adjustment.rotate || 0,
            adjustment.pos_x || 0,
            adjustment.pos_y || 0
          )
        );
      });
    } else if (showingDollMask && showingDollMask.length) {
      showingDollMask.forEach(() => {
        dollPosXAdjustment.push(0);
        dollPosYAdjustment.push(0);
        dollRotateAdjustment.push(0);
        configList.push(createMaskConfig(0, 0, 0));
      });
    }

    if (dollPosXAdjustment.length) {
      setShowingDollPosXAdjustment(dollPosXAdjustment);
    }

    if (dollPosYAdjustment.length) {
      setShowingDollPosYAdjustment(dollPosYAdjustment);
    }

    if (dollRotateAdjustment.length) {
      setShowingDollRotateAdjustment(dollRotateAdjustment);
    }

    if (configList.length) {
      setSingleConfigList(configList);
    }
  }, [showingDollAdjustment, showingDollMask]);

  useEffect(() => {
    const configList = [];

    if (showingDollMask && showingDollMask.length) {
      showingDollMask.forEach((mask, index) => {
        let x = 0;
        let y = 0;
        let r = parseFloat(rotate) || 0;

        if (showingDollPosXAdjustment[index]) {
          x = showingDollPosXAdjustment[index];
        } else if (
          showingDollAdjustment &&
          showingDollAdjustment.length &&
          showingDollAdjustment[index] &&
          showingDollAdjustment[index].pos_x
        ) {
          x = showingDollAdjustment[index].pos_x;
        }

        if (showingDollPosYAdjustment[index]) {
          y = showingDollPosYAdjustment[index];
        } else if (
          showingDollAdjustment &&
          showingDollAdjustment.length &&
          showingDollAdjustment[index] &&
          showingDollAdjustment[index].pos_y
        ) {
          y = showingDollAdjustment[index].pos_y;
        }

        if (showingDollRotateAdjustment[index]) {
          r += showingDollRotateAdjustment[index];
        } else if (
          showingDollAdjustment &&
          showingDollAdjustment.length &&
          showingDollAdjustment[index] &&
          showingDollAdjustment[index].rotate
        ) {
          r += showingDollAdjustment[index].rotate;
        }

        configList.push(createMaskConfig(r, x, y));
      });
    } else {
      let x = 0;
      let y = 0;
      const r = parseFloat(rotate) || 0;

      if (showingDollPosXAdjustment[0]) {
        [x] = showingDollPosXAdjustment;
      } else if (showingDollMainAdjustment && showingDollMainAdjustment.pos_x) {
        x = showingDollMainAdjustment.pos_x;
      }

      if (showingDollPosYAdjustment[0]) {
        [y] = showingDollPosYAdjustment;
      } else if (showingDollMainAdjustment && showingDollMainAdjustment.pos_y) {
        y = showingDollMainAdjustment.pos_y;
      }

      configList.push(createMaskConfig(r, x, y));
    }

    setSingleConfigList(configList);
  }, [
    showingDollPosXAdjustment,
    showingDollPosYAdjustment,
    showingDollRotateAdjustment,
    setSingleConfigList,
    showingDollAdjustment,
    showingDollMask,
    scale,
    rotate,
    showingDollMainAdjustment,
  ]);

  useEffect(() => {
    setTimeout(() => {
      setShowComponent(true);
    }, 2500);
    setTimeout(() => {
      setDollVisibility(true);
    }, 5000);
  }, []);

  useEffect(() => {
    setScale(0);
    setRotate(0);
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setColor(0);
    setBackgroundColor('');
  }, [nextPrint]);

  useEffect(() => {
    setLoading(true);
    if (showingPrint) {
      Api.getManualApplication(showingPrint.print_id)
        .then((res) => {
          setManualApplicatedDolls(res.results);
          if (res.results.length) {
            setShowingDoll(res.results[0].id);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showingPrint]);

  const manualApplicatedDollsSlider = () => {
    return manualApplicatedDolls.length
      ? manualApplicatedDolls.map((doll, index) => (
          <li
            key={index.toString()}
            className={`${styles.doll} ${
              doll.id === showingDoll ? styles.active : ''
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setShowingDoll(doll.id);
                setDollLoaded(false);
                setShadowLoaded(false);
              }}
            >
              <div className={styles.mini}>
                <img
                  className={styles.objectMini}
                  src={doll.image}
                  alt="boneca"
                />
              </div>
            </button>
          </li>
        ))
      : null;
  };

  const dollsSlider = () => {
    return dolls.length
      ? dolls.map((doll, index) => (
          <li
            key={index.toString()}
            className={`${styles.doll} ${
              doll.id === showingDoll ? styles.active : ''
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setShowingDoll(doll.id);
                setDollLoaded(false);
                setShadowLoaded(false);
              }}
            >
              <div className={styles.mini}>
                <div
                  style={{
                    backgroundImage: `url(${showingPrint.print_image_url})`,
                    backgroundColor: showingPrint.flat_background
                      ? backgroundColor || showingPrint.flat_background_color
                      : showingPrint.pantone_color,
                    backgroundSize: showingPrint.print_jpeg_width
                      ? `auto ${calcDollRapport(
                          showingPrint.print_jpeg_width,
                          showingPrint.print_jpeg_height,
                          doll.rapport_propor
                        )}%`
                      : '100%',
                    backgroundPosition: `center calc(42% - ${
                      doll.rapport_propor || 0
                    }%)`,
                  }}
                  className={styles.fabricMini}
                />
                <img
                  className={styles.objectMini}
                  src={doll.image_dolly || doll.image_dolly_url}
                  alt="boneca"
                />

                <img
                  src={doll.image_shadow || doll.image_shadow_url}
                  className={styles.fabricShadowMini}
                  alt="vestido"
                />
              </div>
            </button>
          </li>
        ))
      : null;
  };

  useEffect(() => {
    setDollVisibility(false);
    setTimeout(() => {
      setDollVisibility(true);
    }, 1000);
  }, [showingDoll]);

  useEffect(() => {
    if (
      showingPrint &&
      showingPrint.print_image_url &&
      showingPrint.print_image_url.length
    ) {
      const printPreload = new Image();
      printPreload.src = showingPrint.print_image_url;
    }
  }, [showingPrint]);

  const activeScrollDown = useMemo(() => {
    if (scrollDollsRef.current) {
      scrollDollsRef.current.scroll({
        top: 100 * currentDollIndex,
        left: 0,
        behavior: 'smooth',
      });
    }
    return currentDollIndex < dolls.length - 7;
  }, [currentDollIndex, dolls.length, scrollDollsRef]);

  const activeScrollUp = useMemo(() => currentDollIndex > 0, [
    currentDollIndex,
  ]);

  const editConfig = useMemo(() => {
    return {
      transform: `translateX(-50%) translateY(-50%) rotate(${rotate}deg) scale(${
        1 + scale / 100
      })`,
      filter: ` contrast(${
        1 + contrast / 100
      }) hue-rotate(${color}deg) saturate(${1 + saturation / 10})`,
    };
  }, [scale, color, contrast, rotate, saturation]);

  const editConfigNoScale = useMemo(() => {
    return {
      transform: `translateX(-50%) translateY(-50%) rotate(${rotate}deg)`,
      filter: ` contrast(${
        1 + contrast / 100
      }) hue-rotate(${color}deg) saturate(${1 + saturation / 10})`,
    };
  }, [color, contrast, rotate, saturation]);

  const isCustomized = useMemo(() => {
    if (
      scale === 0 &&
      rotate === 0 &&
      brightness === 0 &&
      contrast === 0 &&
      saturation === 0 &&
      color === 0 &&
      backgroundColor === '' &&
      !observation
    ) {
      return false;
    }
    return true;
  }, [
    scale,
    rotate,
    brightness,
    contrast,
    saturation,
    color,
    backgroundColor,
    observation,
  ]);

  const renderDollMask = useMemo(() => {
    let currentDoll;

    if (manualApplicatedDolls.length) {
      currentDoll = manualApplicatedDolls.find(
        (doll) => doll.id === showingDoll
      );
    } else {
      currentDoll = dolls.find((doll) => doll.id === showingDoll);
    }

    const isNewDoll =
      currentDoll &&
      currentDoll.masks &&
      currentDoll.masks.length &&
      currentDoll.masks.length > 0;

    if (currentDoll && !manualApplicatedDolls.length) {
      if (isNewDoll && showingPrint) {
        return (
          <div
            className={`${styles.doll}${
              dollLoaded &&
              shadowLoaded &&
              (printLoaded || showingPrint.is_pantone)
                ? ` ${styles.dollLoaded}`
                : ''
            }`}
          >
            <div className={styles.dollBackgroundContainer}>
              {currentDoll.masks.map((mask, index) => (
                <div
                  className={styles.dollMask}
                  style={{
                    WebkitMaskImage: `url(${mask.mask})`,
                    maskImage: `url(${mask.mask})`,
                  }}
                >
                  {showingPrint.is_pantone ? (
                    <div
                      style={{
                        backgroundColor: showingPrint.pantone_color,
                        ...editConfig,
                        backgroundSize: '3.125%',
                        ...singleConfigList[index],
                      }}
                      className={styles.fabric}
                      alt="print"
                    />
                  ) : (
                    <div
                      style={{
                        backgroundImage: `url(${showingPrint.print_image_url})`,
                        backgroundColor: showingPrint.flat_background
                          ? backgroundColor ||
                            showingPrint.flat_background_color
                          : '#fff',
                        ...editConfig,
                        backgroundSize: showingPrint.print_jpeg_width
                          ? `auto ${
                              calcDollRapport(
                                showingPrint.print_jpeg_width,
                                showingPrint.print_jpeg_height,
                                currentDoll.rapport_propor
                              ) / 32
                            }%`
                          : '3.125%',
                        ...singleConfigList[index],
                      }}
                      className={styles.fabric}
                      alt="print"
                    />
                  )}
                </div>
              ))}
              <div
                style={{
                  backgroundColor: brightness > 0 ? 'white' : 'black',
                  opacity: brightness < 0 ? -brightness : brightness,
                }}
                className={styles.brightnessMask}
              />
            </div>
            <img
              className={styles.object}
              src={currentDoll.image_dolly || currentDoll.image_dolly_url}
              alt="boneca"
              ref={dollRef}
              onLoad={() => setDollLoaded(true)}
            />
            <img
              src={currentDoll.image_shadow || currentDoll.image_shadow_url}
              className={styles.fabricShadow}
              alt="vestido"
              onLoad={() => setShadowLoaded(true)}
            />
          </div>
        );
      }

      return (
        dolls.length > 0 && (
          <div
            className={`${styles.doll}${
              dollLoaded &&
              shadowLoaded &&
              (printLoaded || showingPrint.is_pantone)
                ? ` ${styles.dollLoaded}`
                : ''
            }`}
          >
            <div
              className={styles.dollBackgroundContainer}
              style={{
                backgroundColor:
                  showingPrint && showingPrint.flat_background
                    ? backgroundColor || showingPrint.flat_background_color
                    : showingPrint && showingPrint.pantone_color,
              }}
            >
              {showingPrint && (
                <div
                  style={{
                    backgroundImage: `url(${showingPrint.print_image_url})`,
                    ...singleConfigList[0],
                    ...editConfig,
                    backgroundSize: showingPrint.print_jpeg_width
                      ? `auto ${
                          calcDollRapport(
                            showingPrint.print_jpeg_width,
                            showingPrint.print_jpeg_height,
                            currentDoll.rapport_propor
                          ) / 32
                        }%`
                      : '3.125%',
                    top: `calc(50% - ${currentDoll.rapport_propor || 0}%)`,
                  }}
                  className={styles.fabric}
                  alt="print"
                />
              )}
              <div
                style={{
                  backgroundColor: brightness > 0 ? 'white' : 'black',
                  opacity: brightness < 0 ? -brightness : brightness,
                }}
                className={styles.brightnessMask}
              />
            </div>
            <img
              ref={dollRef}
              className={styles.object}
              src={currentDoll.image_dolly || currentDoll.image_dolly_url}
              alt="boneca"
              onLoad={() => setDollLoaded(true)}
            />
            <img
              src={currentDoll.image_shadow || currentDoll.image_shadow_url}
              className={styles.fabricShadow}
              alt="vestido"
              onLoad={() => setShadowLoaded(true)}
            />
            <div className={styles.adjustment} />
          </div>
        )
      );
    }

    if (
      currentDoll &&
      manualApplicatedDolls.length &&
      !editingPrint &&
      !isCustomized
    ) {
      return (
        dolls.length > 0 && (
          <div
            className={`${styles.doll}${
              dollLoaded ? ` ${styles.dollLoaded}` : ''
            }`}
          >
            <img
              className={styles.object}
              src={currentDoll.image}
              alt="boneca"
              ref={dollRef}
              onLoad={() => setDollLoaded(true)}
            />
            <div className={styles.adjustment} />
          </div>
        )
      );
    }

    if (
      currentDoll &&
      manualApplicatedDolls.length &&
      (editingPrint || isCustomized)
    ) {
      if (isNewDoll && showingPrint) {
        return (
          <div
            className={`${styles.doll}${
              dollLoaded &&
              shadowLoaded &&
              (printLoaded || showingPrint.is_pantone)
                ? ` ${styles.dollLoaded}`
                : ''
            }`}
          >
            <div className={styles.dollBackgroundContainer}>
              {currentDoll.maks.map((mask, index) => (
                <div
                  className={styles.dollMask}
                  style={{
                    WebkitMaskImage: `url(${mask.mask})`,
                    maskImage: `url(${mask.mask})`,
                  }}
                >
                  <div
                    style={{
                      backgroundImage: `url(${showingPrint.print_image_url})`,
                      ...editConfig,
                      backgroundColor: showingPrint.flat_background
                        ? backgroundColor || showingPrint.flat_background_color
                        : '#fff',
                      backgroundSize: showingPrint.print_jpeg_width
                        ? `auto ${
                            calcDollRapport(
                              showingPrint.print_jpeg_width,
                              showingPrint.print_jpeg_height,
                              currentDoll.rapport_propor
                            ) / 32
                          }%`
                        : '3.125%',
                      ...singleConfigList[index],
                    }}
                    className={styles.fabric}
                    alt="print"
                  />
                </div>
              ))}
              <div
                style={{
                  backgroundColor: brightness > 0 ? 'white' : 'black',
                  opacity: brightness < 0 ? -brightness : brightness,
                }}
                className={styles.brightnessMask}
              />
            </div>
            <img
              className={styles.object}
              src={currentDoll.image_dolly || currentDoll.image_dolly_url}
              alt="boneca"
              ref={dollRef}
              onLoad={() => setDollLoaded(true)}
            />
            <img
              src={currentDoll.image_shadow || currentDoll.image_shadow_url}
              className={styles.fabricShadow}
              alt="vestido"
              onLoad={() => setShadowLoaded(true)}
            />
          </div>
        );
      }

      return (
        dolls.length > 0 && (
          <div
            className={`${styles.doll}${
              dollLoaded &&
              shadowLoaded &&
              (printLoaded || showingPrint.is_pantone)
                ? ` ${styles.dollLoaded}`
                : ''
            }`}
          >
            <div className={styles.dollBackgroundContainer}>
              {showingPrint && (
                <div
                  style={{
                    backgroundImage: `url(${showingPrint.print_image_url})`,
                    ...singleConfigList[0],
                    ...editConfig,
                    backgroundSize: showingPrint.print_jpeg_width
                      ? `auto ${
                          calcDollRapport(
                            showingPrint.print_jpeg_width,
                            showingPrint.print_jpeg_height,
                            currentDoll.rapport_propor
                          ) / 32
                        }%`
                      : '3.125%',
                    backgroundColor: showingPrint.flat_background
                      ? showingPrint.flat_background_color
                      : '#fff',
                    top: `calc(50% - ${currentDoll.rapport_propor || 0}%)`,
                  }}
                  className={styles.fabric}
                  alt="print"
                />
              )}
              <div
                style={{
                  backgroundColor: brightness > 0 ? 'white' : 'black',
                  opacity: brightness < 0 ? -brightness : brightness,
                }}
                className={styles.brightnessMask}
              />
            </div>
            <img
              className={styles.object}
              src={
                dolls.find((doll) => currentDoll.dolly === doll.id)
                  .image_dolly ||
                dolls.find((doll) => currentDoll.dolly === doll.id)
                  .image_dolly_url
              }
              alt="boneca"
              ref={dollRef}
              onLoad={() => setDollLoaded(true)}
            />
            <img
              src={
                dolls.find((doll) => currentDoll.dolly === doll.id)
                  .image_shadow ||
                dolls.find((doll) => currentDoll.dolly === doll.id)
                  .image_shadow_url
              }
              className={styles.fabricShadow}
              alt="vestido"
              onLoad={() => setShadowLoaded(true)}
            />
            <div className={styles.adjustment} />
          </div>
        )
      );
    }
    return null;
  }, [
    manualApplicatedDolls,
    editingPrint,
    isCustomized,
    showingDoll,
    dolls,
    showingPrint,
    editConfig,
    brightness,
    singleConfigList,
    backgroundColor,
    printLoaded,
    dollLoaded,
    shadowLoaded,
  ]);

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    if (showingPrintHeight && showingPrintWidth) {
      const maxWidth = windowWidth * 0.2625;
      const maxHeight = windowHeight * 0.7;

      let fabricBackgroundWidth = showingPrintWidth;
      let fabricBackgroundHeight = showingPrintHeight;
      let backgroundSize = `${fabricBackgroundWidth}px auto`;
      let backgroundPostion = '50%';

      if (printZoomActive) {
        backgroundSize = `${showingPrintWidth}px auto`;
        backgroundPostion = `${
          showingPrintWidth * (printZoomPosition.x - 0.5)
        }px ${showingPrintHeight * (printZoomPosition.y - 0.5)}px`;
      } else if (showingPrintHeight > showingPrintWidth) {
        if (fabricBackgroundHeight > maxHeight) {
          fabricBackgroundHeight = maxHeight;
          fabricBackgroundWidth *= maxHeight / fabricBackgroundHeight;
        }

        backgroundSize = `auto ${fabricBackgroundHeight}px`;
        backgroundPostion = `calc(50% - ${
          (maxWidth -
            (fabricBackgroundWidth * fabricBackgroundHeight) /
              showingPrintHeight) /
          2
        }px) 50%`;
      } else if (showingPrintHeight < showingPrintWidth) {
        if (showingPrintWidth > maxWidth) {
          fabricBackgroundWidth = maxWidth;
          fabricBackgroundHeight *= maxWidth / showingPrintWidth;
        }

        backgroundSize = `${fabricBackgroundWidth}px auto`;
      } else {
        if (showingPrintWidth > maxWidth) {
          fabricBackgroundWidth = maxWidth;
        }

        backgroundSize = `${fabricBackgroundWidth}px auto`;
      }

      setFabricBackgroundSize(backgroundSize);
      setFabricBackgroundPosition(backgroundPostion);
    }
  }, [
    showingPrintHeight,
    showingPrintWidth,
    printZoomActive,
    printZoomPosition,
  ]);

  const renderPrintElements = useMemo(() => {
    if (showingPrint) {
      const fabricConfig =
        showingPrint.tag_ids && showingPrint.tag_ids.includes(65)
          ? editConfigNoScale
          : editConfig;

      return (
        <div className={styles.print}>
          <h2 className={styles.printCode}>{showingPrint.print_code}</h2>{' '}
          {showingPrint.tag_ids &&
          showingPrint.tag_ids.length > 0 &&
          showingPrint.tag_ids.includes(65) ? (
            <button
              type="button"
              className={`${styles.filtersContainer} ${
                styles.filtersContainerLocated
              }${
                printZoomActive ? ` ${styles.filtersContainerZoomActive}` : ''
              }`}
              onClick={(event) => {
                if (!printZoomActive) {
                  const dW = event.currentTarget.offsetWidth;
                  const dH = event.currentTarget.offsetHeight;
                  const dOX = event.nativeEvent.offsetX;
                  const dOY = event.nativeEvent.offsetY;
                  const currentX = dOX / dW;
                  const currentY = dOY / dH;

                  setPrintZoomPosition({
                    x: currentX,
                    y: currentY,
                  });
                }

                setPrintZoomActive(!printZoomActive);
              }}
              onMouseMove={(event) => {
                if (printZoomActive) {
                  const dW = event.currentTarget.offsetWidth;
                  const dH = event.currentTarget.offsetHeight;
                  const dOX = event.nativeEvent.offsetX;
                  const dOY = event.nativeEvent.offsetY;
                  const currentX = dOX / dW;
                  const currentY = dOY / dH;

                  setPrintZoomPosition({
                    x: currentX,
                    y: currentY,
                  });
                }
              }}
            >
              <div className={styles.LocatedPrintWrapper}>
                <img
                  ref={imgElement}
                  src={showingPrint.print_image_url}
                  onLoad={() => {
                    setShowingPrintHeight(imgElement.current.naturalHeight);
                    setShowingPrintWidth(imgElement.current.naturalWidth);
                    setPrintLoaded(true);
                  }}
                  alt="estampa"
                />
                <div
                  className={styles.fabric}
                  style={{
                    backgroundColor: showingPrint.flat_background
                      ? backgroundColor || showingPrint.flat_background_color
                      : '#fff',
                    backgroundImage: `url(${showingPrint.print_image_url})`,
                    backgroundSize: printZoomActive
                      ? fabricBackgroundSize
                      : 'auto',
                    backgroundPosition: printZoomActive
                      ? fabricBackgroundPosition
                      : 'auto',
                    ...fabricConfig,
                  }}
                  alt="print"
                />
                <div
                  className={styles.brightnessMask}
                  style={{
                    backgroundColor: brightness > 0 ? 'white' : 'black',
                    opacity: brightness < 0 ? -brightness : brightness,
                  }}
                />
              </div>
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.filtersContainer}${
                printZoomActive ? ` ${styles.filtersContainerZoomActive}` : ''
              }`}
              style={{
                backgroundColor: showingPrint.flat_background
                  ? backgroundColor || showingPrint.flat_background_color
                  : showingPrint.pantone_color,
                minHeight: showingPrint.is_pantone ? '300px' : '',
              }}
              onClick={(event) => {
                if (!printZoomActive) {
                  const dW = event.currentTarget.offsetWidth;
                  const dH = event.currentTarget.offsetHeight;
                  const dOX = event.nativeEvent.offsetX;
                  const dOY = event.nativeEvent.offsetY;
                  const currentX = dOX / dW;
                  const currentY = dOY / dH;

                  setPrintZoomPosition({
                    x: currentX,
                    y: currentY,
                  });
                }

                setPrintZoomActive(!printZoomActive);
              }}
              onMouseMove={(event) => {
                if (printZoomActive) {
                  const dW = event.currentTarget.offsetWidth;
                  const dH = event.currentTarget.offsetHeight;
                  const dOX = event.nativeEvent.offsetX;
                  const dOY = event.nativeEvent.offsetY;
                  const currentX = dOX / dW;
                  const currentY = dOY / dH;

                  setPrintZoomPosition({
                    x: currentX,
                    y: currentY,
                  });
                }
              }}
            >
              <img
                ref={imgElement}
                src={showingPrint.print_image_url}
                onLoad={() => {
                  setShowingPrintHeight(imgElement.current.naturalHeight);
                  setShowingPrintWidth(imgElement.current.naturalWidth);
                  setPrintLoaded(true);
                }}
                alt="estampa"
              />
              <div
                className={styles.fabric}
                style={{
                  backgroundImage: `url(${showingPrint.print_image_url})`,
                  backgroundSize: fabricBackgroundSize || 'auto',
                  backgroundPosition: fabricBackgroundPosition || 'auto',
                  ...fabricConfig,
                }}
                alt="print"
              />
              <div
                className={styles.brightnessMask}
                style={{
                  backgroundColor: brightness > 0 ? 'white' : 'black',
                  opacity: brightness < 0 ? -brightness : brightness,
                }}
              />
            </button>
          )}
          {!showingPrint.is_pantone && (
            <p className={styles.rapport}>
              rapport:
              <b>
                {showingPrint.print_jpeg_width
                  ? ` ${showingPrint.print_jpeg_width} x ${showingPrint.print_jpeg_height} cm`
                  : ''}
              </b>
            </p>
          )}
        </div>
      );
    }

    return null;
  }, [
    backgroundColor,
    brightness,
    editConfig,
    showingPrint,
    // language,
    fabricBackgroundSize,
    fabricBackgroundPosition,
    printZoomActive,
    editConfigNoScale,
  ]);

  useOutsideClick(colorVariationSelectorRef, () => {
    setColorVariationSelector(false);
  });

  const getColors = useMemo(() => {
    const differentColors = [];
    prints.forEach((p) => {
      if (!differentColors.find((dC) => dC.print_id === p.print_id)) {
        differentColors.push(p);
      }
    });
    const showing = prints.find((p) => p.print_is_origin);
    setShowingPrint(showing);
    return differentColors;
  }, [prints]);

  const nextStep = () => {
    if (allColors) {
      const allPrints = getColors.map((c) => c.print_id);
      printsPurchase(allPrints);
    } else {
      printsPurchase([showingPrint.print_id]);
    }
    chooseFabric();
  };

  const reset = () => {
    setScale(0);
    setRotate(0);
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setColor(0);
    setBackgroundColor('');
  };

  const reserve = () => {
    if (allColors) {
      const allPrints = getColors.map((c) => c.print_id);
      printsReserve(allPrints);
    } else {
      printsReserve([showingPrint.print_id]);
    }
  };

  const addToCart = () => {
    if (allColors) {
      const allPrints = getColors.map((c) => c.print_id);
      addPrintsToCart(allPrints);
    } else {
      addPrintsToCart([showingPrint.print_id]);
    }
  };

  if (!showingPrint) {
    return false;
  }

  const saveCustomization = async (type) => {
    setLoading(true);
    function srcToFile(src, fileName, mimeType) {
      return fetch(src)
        .then((res) => {
          return res.arrayBuffer();
        })
        .then((buf) => {
          return new File([buf], fileName, { type: mimeType });
        });
    }

    const originalPrint = await Api.getPrint(showingPrint.print_id);

    const formData = new FormData();
    formData.append('name', `${originalPrint.code} CUSTOMIZADA`);
    formData.append('status', `APP`);

    if (originalPrint.coordinator_id) {
      formData.append('coordinator', originalPrint.coordinator_id);
    }
    formData.append('is_origin', false);
    if (scale !== 0 || rotate !== 0) {
      formData.append('is_twin', true);
      formData.append('origin', originalPrint.id);
      formData.append('status', 'APP');
    } else {
      formData.append('is_twin', false);
      formData.append('code', originalPrint.code.split(' ')[0]);
      formData.append('origin', originalPrint.id);
    }
    if (language === 'en') {
      const imgFile = await srcToFile(
        customizedPrint,
        'customizedPrint.jpg',
        'image/jpg'
      );
      formData.append('image', imgFile);
    } else {
      const imgFile = await srcToFile(
        estampaCustomizada,
        'estampaCustomizada.jpg',
        'image/jpg'
      );
      formData.append('image', imgFile);
    }

    const createdPrint = await Api.createPrint(formData);

    const getBackgroundColor = () => {
      if (backgroundColor) {
        return backgroundColor;
      }
      if (showingPrint.flat_background && showingPrint.flat_background_color) {
        return showingPrint.flat_background_color;
      }
      return '';
    };

    await Api.createCustomization({
      print: createdPrint.id,
      sender: user ? user.id : '',
      rotate,
      scale,
      contrast,
      color,
      saturation,
      brightness,
      flat_background: showingPrint.flat_background,
      flat_background_color: getBackgroundColor(),
      attendance: parseInt(presentationId, 10),
      client,
      text: observation || '',
      meeting: parseInt(presentationId, 10),
    })
      .then(() => {
        const newPrint = {
          ...showingPrint,
          customized: true,
          print_id: createdPrint.id,
          print_code: createdPrint.code,
          print_color_variant: '',
          print_is_origin: createdPrint.is_origin,
          print_image_url: createdPrint.image_url,
          print_name: createdPrint.name,
        };
        if (type === 'reserve') {
          reserveCustomizedPrint(newPrint);
        } else if (type === 'cart') {
          addCustomizedPrintToCart(newPrint);
        } else {
          purchaseCustomizedPrint(newPrint);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isEditable = () => {
    if (presentationType === 'LE' || presentationType === 'COL') {
      return false;
    }
    return true;
  };

  if (!showingPrint) {
    return false;
  }

  const onChangePosXAdjustments = (value, index) => {
    const newDollPosXAdjustment = [...showingDollPosXAdjustment];

    newDollPosXAdjustment.splice(index, 1, parseFloat(value));
    setShowingDollPosXAdjustment(newDollPosXAdjustment);
  };

  const onChangePosYAdjustments = (value, index) => {
    const newDollPosYAdjustment = [...showingDollPosYAdjustment];

    newDollPosYAdjustment.splice(index, 1, parseFloat(value));
    setShowingDollPosYAdjustment(newDollPosYAdjustment);
  };

  // const onChangeRotateAdjustments = (value, index) => {
  //   const newDollRotateAdjustment = [...showingDollRotateAdjustment];

  //   newDollRotateAdjustment.splice(index, 1, parseFloat(value));
  //   setShowingDollRotateAdjustment(newDollRotateAdjustment);
  // };

  const onSubmitDollyAdjustment = () => {
    console.log(showingPrint, showingDollMask);
    if (
      showingPrint &&
      showingPrint.print_id &&
      showingDollMask &&
      showingDollMask.length
    ) {
      showingDollMask.forEach((mask, index) => {
        setLoading(true);

        const newAdjustment = {
          rotate: showingDollRotateAdjustment[index] || 0,
          scale: 0,
          pos_x: showingDollPosXAdjustment[index] || 0,
          pos_y: showingDollPosYAdjustment[index] || 0,
          mask: mask.id,
          print: showingPrint.print_id,
        };

        const adjustmentId =
          showingDollAdjustment[index] && showingDollAdjustment[index].id
            ? showingDollAdjustment[index].id
            : null;

        if (adjustmentId) {
          Api.updateDollyAdjustment(adjustmentId, newAdjustment)
            .then(() => {})
            .finally(() => {
              setLoading(false);
            });
        } else {
          Api.addDollyAdjustment(newAdjustment)
            .then(() => {})
            .finally(() => {
              setLoading(false);
            });
        }
      });
    } else if (showingDollMainAdjustment && showingDollMainAdjustment.id) {
      setLoading(true);

      Api.updateMainDollyAdjustment(showingDollMainAdjustment.id, {
        pos_x:
          showingDollPosXAdjustment[0] || showingDollMainAdjustment.pos_x || 0,
        pos_y:
          showingDollPosYAdjustment[0] || showingDollMainAdjustment.pos_y || 0,
      })
        .then(() => {})
        .finally(() => {
          setLoading(false);
        });
    } else if (showingDollMainAdjustment) {
      setLoading(true);

      Api.addMainDollyAdjustment({
        ...showingDollMainAdjustment,
        pos_x:
          showingDollPosXAdjustment[0] || showingDollMainAdjustment.pos_x || 0,
        pos_y:
          showingDollPosYAdjustment[0] || showingDollMainAdjustment.pos_y || 0,
      })
        .then(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <div className={`${styles.content} ${showComponent ? styles.show : ''}`}>
        <div className={styles.dollsList}>
          <ul className={styles.dollsScroll} ref={scrollDollsRef}>
            {manualApplicatedDolls.length
              ? manualApplicatedDollsSlider()
              : dollsSlider()}
          </ul>
          <div className={styles.dollsNavigation}>
            <button
              type="button"
              className={styles.arrowButton}
              disabled={!activeScrollDown}
              onClick={() => setCurrentDollIndex(currentDollIndex + 1)}
            >
              <span className={styles.arrowDown} />
            </button>
            <button
              type="button"
              className={styles.arrowButton}
              disabled={!activeScrollUp}
              onClick={() => setCurrentDollIndex(currentDollIndex - 1)}
            >
              <span className={styles.arrowUp} />
            </button>
          </div>
        </div>
        {renderPrintElements}
        <div
          className={`${styles.dollContainer} ${
            dollVisibility ? styles.visible : ''
          }`}
        >
          {renderDollMask}
        </div>
        {/* {showingPrint ? (
          <section className={styles.customizeWrapper}>
            <CustomizePrintAndDoll
              print={showingPrint}
              scale={scale}
              setScale={setScale}
              rotate={rotate}
              setRotate={setRotate}
              brightness={brightness}
              setBrightness={setBrightness}
              contrast={contrast}
              setContrast={setContrast}
              saturation={saturation}
              setSaturation={setSaturation}
              color={color}
              setColor={setColor}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
              reset={reset}
              customizePrint={false}
              dollMask={showingDollMask}
              dollPosXAdjustment={showingDollPosXAdjustment}
              handleChangePosXAdjustments={onChangePosXAdjustments}
              dollPosYAdjustment={showingDollPosYAdjustment}
              handleChangePosYAdjustments={onChangePosYAdjustments}
              dollRotateAdjustment={showingDollRotateAdjustment}
              handleChangeRotateAdjustments={onChangeRotateAdjustments}
            />
          </section>
        ) : null} */}
        <section className={styles.color}>
          <div className={styles.actions}>
            <div>
              <button
                className={styles.previousButton}
                type="button"
                onClick={previousPrint}
              >
                <span className={styles.backArrow} />
              </button>
              <button
                type="button"
                onClick={nextPrint}
                className={styles.nextButton}
              >
                <span className={styles.nextArrow} />
              </button>
              {(isEditable() || showDollMAskAdjustments) && (
                <>
                  <button
                    className={styles.editPrint}
                    type="button"
                    onClick={() => {
                      setEditingPrint(true);
                      setShowDollMAskAdjustments(false);
                    }}
                  >
                    <EditFilter width="22px" height="22px" />
                  </button>
                  {editDollMasks && (
                    <button
                      className={styles.editPrint}
                      type="button"
                      onClick={() => {
                        setEditingPrint(true);
                        setShowDollMAskAdjustments(true);
                      }}
                    >
                      <EditMask width="39px" height="39px" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          {editingPrint && !showDollMAskAdjustments && (
            <button
              className={styles.backColor}
              type="button"
              onClick={() => {
                setEditingPrint(false);
                setShowDollMAskAdjustments(false);
              }}
            >
              <span className={styles.icon}>
                <Arrow />
              </span>
              {translate('color', language)}
            </button>
          )}
          {editingPrint && showDollMAskAdjustments && (
            <button
              className={styles.backColor}
              type="button"
              onClick={() => {
                setEditingPrint(true);
                setShowDollMAskAdjustments(false);
              }}
            >
              <span className={styles.icon}>
                <Arrow />
              </span>
              {translate('customize', language)}
            </button>
          )}
          {!editingPrint && !showDollMAskAdjustments && (
            <button className={styles.backColor} type="button" onClick={close}>
              <span className={styles.icon}>
                <Arrow />
              </span>
              {translate('presentation', language)}
            </button>
          )}

          {/* <h3>{showingPrint.print_name}</h3> */}
          {/* <h2>{showingPrint.print_code}</h2> */}
          {!editingPrint && (
            <>
              <h2
                className={styles.sectionTitle}
                style={{ marginTop: '184px', marginBottom: '34px' }}
              >
                <b>{translate('color', language)}</b>
                {` - ${showingPrint.print_code}`}
              </h2>
              <h3 className={styles.printName}>{showingPrint.print_name}</h3>
            </>
          )}
          {editingPrint ? (
            <>
              <h2
                className={styles.sectionTitle}
                style={{ marginTop: '100px' }}
              >
                <b>{translate('customize', language)}</b>
                {` - ${showingPrint.print_code}`}
              </h2>
              <div className={styles.rangeArea}>
                {!showDollMAskAdjustments && (
                  <button
                    className={styles.resetButton}
                    type="button"
                    onClick={reset}
                  >
                    <ResetIcon /> Reset
                  </button>
                )}
                {editDollMasks && showDollMAskAdjustments && (
                  <button
                    className={styles.resetButton}
                    type="button"
                    onClick={onSubmitDollyAdjustment}
                  >
                    <Save /> {translate('save', language)}
                  </button>
                )}
                {!showDollMAskAdjustments && (
                  <>
                    {/* <p className={styles.monitorColorVariation}>
                      {translate('monitorColorVariation', language)}
                    </p> */}
                    <div className={styles.rangeContainer}>
                      <div className={styles.label}>
                        <span>{translate('scale', language)}</span>
                        <span>{`${scale}%`}</span>
                      </div>

                      <input
                        type="range"
                        min="-90"
                        max="100"
                        step="10"
                        value={scale}
                        onChange={(e) => setScale(e.currentTarget.value)}
                      />
                    </div>
                    <div className={styles.rangeContainer}>
                      <div className={styles.label}>
                        <span>{translate('rotate', language)}</span>
                        <span>{`${rotate}°`}</span>
                      </div>
                      <input
                        type="range"
                        min="-270"
                        max="270"
                        step="90"
                        value={rotate}
                        onChange={(e) => setRotate(e.currentTarget.value)}
                      />
                    </div>
                    <div className={styles.rangeContainer}>
                      <div className={styles.label}>
                        <span>{translate('luminosity', language)}</span>
                        <span>{`${parseInt(
                          Number(brightness * 100),
                          10
                        )}%`}</span>
                      </div>
                      <input
                        type="range"
                        min="-1"
                        max="1"
                        step="0.05"
                        value={brightness}
                        onChange={(e) => setBrightness(e.currentTarget.value)}
                      />
                    </div>
                    <div className={styles.rangeContainer}>
                      <div className={styles.label}>
                        <span>{translate('contrast', language)}</span>
                        <span>{`${contrast}%`}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={contrast}
                        onChange={(e) => setContrast(e.currentTarget.value)}
                      />
                    </div>
                    <div className={styles.rangeContainer}>
                      <div className={styles.label}>
                        <span>{translate('saturation', language)}</span>
                        <span>{`${saturation}%`}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={saturation}
                        onChange={(e) => setSaturation(e.currentTarget.value)}
                      />
                    </div>
                    <div className={styles.rangeContainer}>
                      <div className={styles.label}>
                        <span>{translate('color', language)}</span>{' '}
                        <span>{`${color}%`}</span>
                      </div>
                      <input
                        type="range"
                        min={-180}
                        max={180}
                        step="1"
                        value={parseInt(color, 10)}
                        onChange={(e) => setColor(e.currentTarget.value)}
                      />
                    </div>
                    {showingPrint.flat_background && (
                      <>
                        <div className={` ${styles.backgroundColorLabel}`}>
                          <span>
                            {translate(
                              'backgroundColor',
                              language
                            ).toUpperCase()}
                          </span>
                        </div>
                        <ColorPicker
                          disableAlpha
                          color={
                            backgroundColor ||
                            showingPrint.flat_background_color
                          }
                          onChange={(newColor) =>
                            setBackgroundColor(newColor.hex)
                          }
                        />
                      </>
                    )}
                  </>
                )}
                {showDollMAskAdjustments &&
                  showingDollMask &&
                  showingDollMask.length > 0 && (
                    <>
                      {showingDollMask.map((mask, index) => (
                        <>
                          <div className={styles.maskAdjustmentsLabel}>
                            {`${translate('mask', language)} ${index + 1}`}
                          </div>
                          <div
                            className={`${styles.rangeContainer} ${styles.rangeContainerSmall}`}
                          >
                            <div
                              className={`${styles.label} ${styles.adjustmentsLabel}`}
                            >
                              <span>
                                {translate('moveHorizontally', language)}
                              </span>
                              <span>
                                {`${showingDollPosXAdjustment[index]}%`}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={-500}
                              max={500}
                              step="1"
                              value={parseInt(
                                showingDollPosXAdjustment[index],
                                10
                              )}
                              onChange={(event) =>
                                onChangePosXAdjustments(
                                  event.currentTarget.value,
                                  index
                                )
                              }
                            />
                          </div>
                          <div
                            className={`${styles.rangeContainer} ${styles.rangeContainerSmall}`}
                          >
                            <div
                              className={`${styles.label} ${styles.adjustmentsLabel}`}
                            >
                              <span>
                                {translate('moveVertically', language)}
                              </span>
                              <span>
                                {`${showingDollPosYAdjustment[index]}%`}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={-500}
                              max={500}
                              step="1"
                              value={parseInt(
                                showingDollPosYAdjustment[index],
                                10
                              )}
                              onChange={(event) =>
                                onChangePosYAdjustments(
                                  event.currentTarget.value,
                                  index
                                )
                              }
                            />
                          </div>
                          {/* <div
                            className={`${styles.rangeContainer} ${styles.rangeContainerSmall}`}
                          >
                            <div
                              className={`${styles.label} ${styles.adjustmentsLabel}`}
                            >
                              <span>{translate('rotate', language)}</span>
                              <span>
                                {`${showingDollRotateAdjustment[index]}°`}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={-180}
                              max={180}
                              step={90}
                              value={parseInt(
                                showingDollRotateAdjustment[index],
                                10
                              )}
                              onChange={(event) =>
                                onChangeRotateAdjustments(
                                  event.currentTarget.value,
                                  index
                                )
                              }
                            />
                          </div> */}
                        </>
                      ))}
                    </>
                  )}
                {showDollMAskAdjustments &&
                  showingDollMask &&
                  showingDollMask.length <= 0 && (
                    <>
                      <div className={styles.maskAdjustmentsLabel}>
                        ll{`${translate('mask', language)} 1`}
                      </div>
                      <div
                        className={`${styles.rangeContainer} ${styles.rangeContainerSmall}`}
                      >
                        <div
                          className={`${styles.label} ${styles.adjustmentsLabel}`}
                        >
                          <span>{translate('moveHorizontally', language)}</span>
                          <span>{`${showingDollPosXAdjustment[0] || 0}%`}</span>
                        </div>
                        <input
                          type="range"
                          min={-500}
                          max={500}
                          step="1"
                          value={parseInt(showingDollPosXAdjustment[0], 10)}
                          onChange={(event) =>
                            onChangePosXAdjustments(
                              event.currentTarget.value,
                              0
                            )
                          }
                        />
                      </div>
                      <div
                        className={`${styles.rangeContainer} ${styles.rangeContainerSmall}`}
                      >
                        <div
                          className={`${styles.label} ${styles.adjustmentsLabel}`}
                        >
                          <span>{translate('moveVertically', language)}</span>
                          <span>{`${showingDollPosYAdjustment[0] || 0}%`}</span>
                        </div>
                        <input
                          type="range"
                          min={-500}
                          max={500}
                          step="1"
                          value={parseInt(showingDollPosYAdjustment[0], 10)}
                          onChange={(event) =>
                            onChangePosYAdjustments(
                              event.currentTarget.value,
                              0
                            )
                          }
                        />
                      </div>
                    </>
                  )}
              </div>
              {!showDollMAskAdjustments && (
                <textarea
                  className={styles.observationTextarea}
                  placeholder={translate('someModification', language)}
                  value={observation}
                  onChange={(event) =>
                    setObservation(event.currentTarget.value)
                  }
                />
              )}
              {/* {(isEditable() || editDollMasks) && showDollMAskAdjustments && (
                <div className={styles.saveDollMaskWrapper}>
                  <button
                    type="button"
                    className={`${styles.defaultActionButton} ${styles.maskActionButton}`}
                    onClick={() => setShowDollMAskAdjustments(false)}
                  >
                    Ajustar boneca
                  </button>
                  <button
                    type="button"
                    className={`${styles.defaultActionButton} ${styles.saveDollMaskButton} ${styles.maskActionButton}`}
                    onClick={onSubmitDollyAdjustment}
                  >
                    Salvar ajustes
                  </button>
                </div>
              )} */}
              {/* {observationSent && (
                <p>{translate('observationSent', language)}</p>
              )} */}
              {/* {!observationSent && observationField && (
                <div className={styles.observationFieldContainer}>
                  <div className={styles.closeArea}>
                    <button
                      className={styles.closeObservationButton}
                      type="button"
                      onClick={() => setObservationField(!observationField)}
                    >
                      <CloseIcon color="#9BA7B7" />
                    </button>
                  </div>

                  <textarea
                    value={observation}
                    onChange={e => setObservation(e.currentTarget.value)}
                  />
                </div>
              )} */}

              {/* {!observationField && (
                <div className={styles.observationButtonContainer}>
                  <button
                    className={styles.observationButton}
                    type="button"
                    onClick={() => setObservationField(!observationField)}
                  >
                    A
                  </button>
                </div>
              )} */}
            </>
          ) : (
            <>
              {/* {showingPrint && (
                <p className={styles.colorSelectorLabel}>
                  {translate('selectOneColor', language)}
                </p>
              )} */}
              <div
                ref={colorVariationSelectorRef}
                className={styles.colorSelectorContainer}
              >
                {showingPrint && (
                  <button
                    type="button"
                    className={styles.colorSelector}
                    onClick={() => setColorVariationSelector(true)}
                  >
                    <img
                      src={showingPrint.print_image_url}
                      alt="color variation"
                    />
                    <div>+</div>
                  </button>
                )}

                {colorVariationSelector && (
                  <ul className={styles.colorVariations}>
                    {getColors.map((c) => (
                      <li>
                        <button
                          type="button"
                          onClick={() => setShowingPrint(c)}
                        >
                          <img src={c.print_image_url} alt="color variation" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* <p className={styles.monitorColorVariation}>
                {translate('monitorColorVariation', language)}
              </p> */}
              {/* <hr /> */}
              <CheckInput
                text={translate('exclusivityAllColors', language)}
                value={allColors}
                newLayout
                onChange={setAllColors}
              />
            </>
          )}
          {!showDollMAskAdjustments && (
            <div className={styles.buttons}>
              {isCustomized ? (
                <button
                  onClick={saveCustomization}
                  type="button"
                  className={`${styles.defaultActionButton} ${styles.changeSectionButton}`}
                  // disabled={observationField}
                >
                  {translate('defineFabric', language)}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  type="button"
                  className={`${styles.defaultActionButton} ${styles.changeSectionButton}`}
                  // disabled={observationField}
                >
                  {translate('defineFabric', language)}
                </button>
              )}
              <button
                type="button"
                className={`${styles.defaultActionButton} ${styles.reserveButton}`}
                onClick={
                  isCustomized ? () => saveCustomization('reserve') : reserve
                }
              >
                {translate('reserve', language)}
              </button>
              {editingPrint && (
                <button
                  className={`${styles.defaultActionButton} ${styles.cartButton}`}
                  type="button"
                  onClick={
                    isCustomized ? () => saveCustomization('cart') : addToCart
                  }
                >
                  {translate('fastBuy', language)}
                </button>
              )}
            </div>
          )}
          {/* {(isEditable() || editDollMasks) && !showDollMAskAdjustments && (
            <button
              type="button"
              className={`${styles.defaultActionButton} ${styles.maskActionButton}`}
              onClick={() => {
                setEditingPrint(true);
                setShowDollMAskAdjustments(true);
              }}
            >
              Ajustar máscaras
            </button>
          )} */}
          {/* <div className={styles.bottomButtons}>
            {(isEditable() || showDollMAskAdjustments) && (
              <button
                className={`${styles.editPrintButton} ${
                  editingPrint ? styles.top : ''
                }`}
                type="button"
                onClick={() => {
                  setEditingPrint(!editingPrint);
                  setShowDollMAskAdjustments(false);
                }}
              >
                {editingPrint || showDollMAskAdjustments ? (
                  <CloseIcon color="#9BA7B7" />
                ) : (
                  <EditIcon />
                )}
              </button>
            )}
            <button
              className={styles.previousPrint}
              type="button"
              onClick={previousPrint}
            >
              <PlayIcon color="#9BA7B7" />
            </button>
            <button
              className={styles.nextPrint}
              type="button"
              onClick={nextPrint}
            >
              <PlayIcon color="#9BA7B7" />
            </button>
          </div> */}
        </section>
      </div>
      {loading && <Loading fixed />}
    </>
  );
}

PurchaseChoosePrint.propTypes = {
  prints: PropTypes.arrayOf(PropTypes.shape).isRequired,
  chooseFabric: PropTypes.func.isRequired,
  dolls: PropTypes.arrayOf(PropTypes.shape).isRequired,
  printsPurchase: PropTypes.func.isRequired,
  printsReserve: PropTypes.func.isRequired,
  purchaseCustomizedPrint: PropTypes.func.isRequired,
  reserveCustomizedPrint: PropTypes.func.isRequired,
  client: PropTypes.number.isRequired,
  addPrintsToCart: PropTypes.func.isRequired,
  presentationType: PropTypes.func.isRequired,
  addCustomizedPrintToCart: PropTypes.func.isRequired,
  nextPrint: PropTypes.func.isRequired,
  previousPrint: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  presentationId: PropTypes.number.isRequired,
};
