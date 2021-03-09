import React, { memo, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import translate from '../../libs/i18n';
import Api from '../../libs/Api';
import calcDollRapport from '../../utils/calcDollRapport';

import styles from './StaticPrintGridItem.module.scss';

function StaticPrintGridItem({
  id,
  code,
  image,
  name,
  doll,
  printApplication,
  printJpegWidth,
  printJpegHeight,
  exclusivity,
  reserved,
  pendingReview,
  backgroundColor,
  mini,
}) {
  const language = useSelector((state) => state.settings.language);

  const [dollAdjustments, setDollAdjustments] = useState();

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

  const isChrome = () => {
    if (navigator.userAgent.indexOf('Chrome') > -1) {
      return true;
    }
    return false;
  };

  const renderCardDoll = () => {
    if (
      doll &&
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
                      backgroundColor,
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
                        backgroundColor,
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

    if (doll) {
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
                    backgroundColor,
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
                        backgroundColor,
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
    }

    return null;
  };

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
      <div className={styles.imageButton}>
        {printApplication ? (
          <>
            {image ? (
              <div
                className={styles.imagePrint}
                style={{
                  backgroundColor,
                  backgroundImage: `url(${image})`,
                  backgroundSize: fabricBackgroundSize,
                }}
              >
                <img className={styles.image} src={image} alt={code} />
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
            {image ? (
              <div
                className={styles.imagePrint}
                style={{
                  backgroundColor,
                  backgroundImage: `url(${image})`,
                  backgroundSize: fabricBackgroundSize,
                }}
              >
                <img className={styles.image} src={image} alt={code} />
              </div>
            ) : (
              <div className={styles.imageReplace} />
            )}
            {renderCardDoll(doll)}
          </>
        )}
      </div>
    );
  }, [
    backgroundColor,
    code,
    doll,
    image,
    printApplication,
    printJpegHeight,
    printJpegWidth,
  ]);

  return (
    <div className={`${styles.card}${doll ? ` ${styles.cardWithDoll}` : ''}`}>
      <div className={styles.cardContent}>
        <div className={styles.printGridItem}>
          {renderImageButton}
          <div className={styles.info}>
            <div className={`${styles.name} ${mini && styles.mini}`}>
              {name}
            </div>
            <div className={styles.tagArea}>
              <div className={`${styles.code} ${mini && styles.mini}`}>
                {code}
              </div>
              <div className={styles.tags}>
                {exclusivity && (
                  <div className={`${styles.tag} ${mini && styles.mini}`}>
                    {translate('exclusive', language).toUpperCase()}
                  </div>
                )}
                {reserved && (
                  <div className={`${styles.tag} ${mini && styles.mini}`}>
                    {translate('reserved', language).toUpperCase()}
                  </div>
                )}
                {pendingReview && (
                  <div className={`${styles.tag} ${mini && styles.mini}`}>
                    {translate('pendingReview', language).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

StaticPrintGridItem.propTypes = {
  id: PropTypes.number.isRequired,
  code: PropTypes.string.isRequired,
  image: PropTypes.string,
  name: PropTypes.string,
  doll: PropTypes.oneOfType([PropTypes.shape, PropTypes.bool]),
  exclusivity: PropTypes.bool,
  reserved: PropTypes.string,
  pendingReview: PropTypes.bool,
  printJpegWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  printJpegHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  printApplication: PropTypes.bool,
  backgroundColor: PropTypes.string.isRequired,
  mini: PropTypes.bool.isRequired,
};

StaticPrintGridItem.defaultProps = {
  name: '',
  image: '',
  doll: false,
  exclusivity: false,
  reserved: '',
  pendingReview: false,
  printJpegWidth: false,
  printJpegHeight: false,
  printApplication: false,
};

export default memo(StaticPrintGridItem);
