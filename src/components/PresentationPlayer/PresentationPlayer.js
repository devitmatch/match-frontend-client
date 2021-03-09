/* eslint-disable react/destructuring-assignment */
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import styles from './PresentationPlayer.module.scss';
import Api from '../../libs/Api';
import translate from '../../libs/i18n';
import calcDollRapport from '../../utils/calcDollRapport';

import ArrowIcon from '../../assets/icons/Arrow';
import CloseIcon from '../../assets/icons/Close';
import PlayIcon from '../../assets/icons/Play';
import PauseIcon from '../../assets/icons/Pause';

function Sketches({ presentation, concept, prints, close, section }) {
  const language = useSelector((state) => state.settings.language);

  const [currentSection, setCurrentSection] = useState(section || 'concept');
  const [currentIndex, setCurrentIndex] = useState(
    section === 'prints' && concept && concept.length ? concept.length : 0
  );
  const [changingSectionIndex, setChangingSectionIndex] = useState();
  const [unifiedSlides, setUnifiedSlides] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [nonDuplicatedPrints, setNonDuplicatedPrints] = useState([]);
  const [showingDollMask, setShowingDollMask] = useState([]);
  const [showingDollAdjustment, setShowingDollAdjustment] = useState([]);
  const [fabricBackgroundPosition] = useState('50%');
  const [playing, setPlaying] = useState(true);

  const imgElement = useRef(null);

  useEffect(() => {
    if (nonDuplicatedPrints) {
      imgElement.current = new Array(nonDuplicatedPrints.length);
    }
  }, [nonDuplicatedPrints]);

  const currentSlide = useMemo(() => {
    const current = currentIndex + 1;

    if (current < 10) {
      return `0${current}`;
    }

    return current;
  }, [currentIndex]);

  const slidesTotal = useMemo(() => {
    const nonDuplicated = [];

    prints.forEach((p) => {
      if (!nonDuplicated.find((pc) => pc.print_id === p.print_id)) {
        nonDuplicated.push(p);
      }
    });

    setNonDuplicatedPrints(nonDuplicated);

    const total = concept.length + nonDuplicated.length;

    if (total < 10) {
      return `0${total}`;
    }

    return total;
  }, [concept, prints]);

  const getFabricBackgroundSize = (
    showingPrintWidth = 0,
    showingPrintHeight = 0,
    tags
  ) => {
    if (!showingPrintWidth || !showingPrintHeight) {
      return 'auto';
    }

    if (tags && tags.length && tags.includes(65)) {
      return 'contain';
    }

    if (tags && tags.length && tags.includes(64)) {
      return 'auto 100vh';
    }

    if (showingPrintHeight && showingPrintWidth) {
      let fabricBackgroundHeight = showingPrintHeight / 240;

      if (fabricBackgroundHeight > 1) {
        fabricBackgroundHeight = 1;
      }

      return `auto ${fabricBackgroundHeight * 100}vh`;
    }

    return 'auto';
  };

  const createMaskConfig = (r, x, y) => ({
    backgroundPosition: `${x / 100}% ${y / 100}%`,
  });

  useEffect(() => {
    if (concept.length) {
      setChangingSectionIndex(concept.length);
    } else {
      setChangingSectionIndex(0);
    }

    const slides = [...concept, ...prints];

    setUnifiedSlides(slides);
  }, [concept, concept.length, prints]);

  useEffect(() => {
    if (currentIndex >= changingSectionIndex) {
      setCurrentSection('prints');
    } else {
      setCurrentSection('concept');
    }
  }, [changingSectionIndex, currentIndex]);

  const onClickNext = () => {
    if (currentIndex < unifiedSlides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const onClickPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    let fadin;
    let fadout;
    let id;

    if (playing) {
      const slide = concept.length + nonDuplicatedPrints.length;
      const slides = (currentIndex + 1) % slide;

      fadin = setTimeout(() => setShowContent(true), 500);
      fadout = setTimeout(() => setShowContent(false), 8000);
      id = setTimeout(() => setCurrentIndex(slides), 8500);
    }

    return () => {
      clearTimeout(fadin);
      clearTimeout(fadout);
      clearTimeout(id);
    };
  }, [currentIndex, concept, nonDuplicatedPrints, playing]);

  useEffect(() => {
    Api.getDollyMasks(presentation.dolly_id).then((res) => {
      setShowingDollMask(res);
    });
  }, [presentation.dolly_id]);

  useEffect(() => {
    if (presentation && presentation.dolly_id) {
      if (
        nonDuplicatedPrints[currentIndex] &&
        nonDuplicatedPrints[currentIndex].print_id
      ) {
        Api.getDollyAdjustment(
          nonDuplicatedPrints[currentIndex].print_id,
          presentation.dolly_id
        ).then((res) => {
          setShowingDollAdjustment(res.result);
        });
      }
    }
  }, [presentation, currentIndex, nonDuplicatedPrints]);

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
  }, [showingDollAdjustment, showingDollMask]);

  const renderMultipleMasksDoll = useCallback(
    (masks, slide) => (
      <div key={slide.id} className={styles.multipleMasksDoll}>
        <div className={styles.dollWrapper}>
          {masks.map((mask) => (
            <div
              className={styles.masksWrapper}
              style={{
                WebkitMaskImage: `url(${mask.mask})`,
                maskImage: `url(${mask.mask})`,
                height: '100%',
              }}
            >
              <div
                className={styles.dollMaskPrint}
                style={{
                  backgroundImage: `url(${slide.print_image_url})`,
                  backgroundSize: slide.print_jpeg_width
                    ? `auto ${calcDollRapport(
                        slide.print_jpeg_width,
                        slide.print_jpeg_height,
                        presentation.rapport_propor
                      )}%`
                    : '100%',
                  backgroundPosition: `center calc(42% - ${
                    presentation.rapport_propor || 0
                  }%`,
                  backgroundColor: slide.flat_background
                    ? slide.flat_background_color
                    : '#fff',
                  transform: `translateX(-50%) rotate(${0}deg)`,
                }}
                alt="estampa"
              />
            </div>
          ))}
          <img
            className={styles.dollTexture}
            src={presentation.dolly}
            alt="boneca"
          />
          <img
            className={styles.dollShadow}
            src={presentation.dolly_shadow}
            alt="sombra da boneca"
          />
        </div>
      </div>
    ),
    [presentation.dolly, presentation.dolly_shadow, presentation.rapport_propor]
  );

  const renderSingleMasksDoll = (slide) => (
    <div key={slide.id} className={styles.singleMasksWrapper}>
      <div className={styles.dollWrapper}>
        <div
          className={styles.dollPrint}
          style={{
            backgroundImage: `url(${slide.print_image_url})`,
            backgroundSize: slide.print_jpeg_width
              ? `auto ${calcDollRapport(
                  slide.print_jpeg_width,
                  slide.print_jpeg_height,
                  presentation.rapport_propor
                )}%`
              : '33.125%',
            backgroundPosition: `center calc(42% - ${
              presentation.rapport_propor || 0
            }%)`,
            backgroundColor: slide.flat_background
              ? slide.flat_background_color
              : '#fff',
          }}
          alt="estampa"
        />
        <img
          className={styles.dollShadow}
          src={presentation.dolly_shadow}
          alt="sombra da boneca"
        />
        <img
          className={styles.dollTexture}
          src={presentation.dolly}
          alt="boneca"
        />
      </div>
    </div>
  );

  return (
    <div className={styles.PresentationPlayer}>
      <div className={styles.presentationInfo}>
        <h1 className={styles.presentationName}>{presentation.name}</h1>
        <h2 className={styles.presentationSection}>
          {translate(currentSection, language)}
        </h2>
      </div>
      {currentSection === 'concept' && unifiedSlides.length > 0 && (
        <>
          <div
            key={unifiedSlides[currentIndex].id}
            className={`${styles.presentationSlideConcept}${
              showContent ? ` ${styles.show}` : ''
            }`}
          >
            <div className={styles.imageWrapper}>
              <img
                className={styles.conceptImage}
                src={unifiedSlides[currentIndex].image}
                alt={unifiedSlides[currentIndex]}
              />
              {unifiedSlides[currentIndex] &&
                unifiedSlides[currentIndex].description &&
                unifiedSlides[currentIndex].description.length && (
                  <p className={styles.conceptImageDescription}>
                    {unifiedSlides[currentIndex].description}
                  </p>
                )}
            </div>
          </div>
        </>
      )}
      {currentSection === 'prints' && unifiedSlides.length > 0 && (
        <>
          {unifiedSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.presentationSlidePrint}${
                showContent && currentIndex === index ? ` ${styles.show}` : ''
              }`}
            >
              <div className={styles.printInfo}>
                <h3 className={styles.printCode}>{slide.print_code}</h3>
                <h4 className={styles.printRapportSize}>
                  {slide.print_rapport}
                </h4>
              </div>
              <div className={styles.printDollContainer}>
                <div className={styles.dollContainer}>
                  {showingDollMask && showingDollMask.length
                    ? renderMultipleMasksDoll(showingDollMask, slide)
                    : renderSingleMasksDoll(slide)}
                </div>
                <div className={styles.printContainer}>
                  <img
                    ref={(el) => {
                      imgElement.current[index] = el;
                    }}
                    src={slide.print_image_url}
                    alt="print ref"
                    style={{ display: 'none' }}
                  />
                  <div
                    className={styles.printContent}
                    style={{
                      backgroundImage: `url(${slide.print_image_url})`,
                      backgroundColor: slide.flat_background
                        ? slide.flat_background_color
                        : '#fff',
                      backgroundSize: imgElement.current[index]
                        ? getFabricBackgroundSize(
                            slide.print_jpeg_width || undefined,
                            slide.print_jpeg_height || undefined,
                            slide.tag_ids || []
                          )
                        : 'auto',
                      backgroundPosition: fabricBackgroundPosition || 'auto',
                      backgroundRepeat:
                        slide &&
                        slide.tag_ids &&
                        slide.tag_ids.length &&
                        slide.tag_ids.includes(65)
                          ? 'no-repeat'
                          : 'repeat',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      <button
        type="button"
        className={styles.closePresentation}
        onClick={close}
      >
        <CloseIcon color="#202730" />
      </button>
      <div className={styles.presentationControls}>
        <button
          type="button"
          className={styles.previousControl}
          onClick={onClickPrevious}
        >
          <ArrowIcon color="white" />
        </button>
        <button
          type="button"
          className={styles.nextControl}
          onClick={onClickNext}
        >
          <ArrowIcon color="white" />
        </button>
        {playing ? (
          <button
            type="button"
            className={styles.pauseControl}
            onClick={() => setPlaying(false)}
          >
            <PauseIcon />
          </button>
        ) : (
          <button
            type="button"
            className={styles.playControl}
            onClick={() => setPlaying(true)}
          >
            <PlayIcon />
          </button>
        )}
      </div>
      <div className={styles.slideCounter}>
        {currentSlide}/{slidesTotal}
      </div>
    </div>
  );
}

Sketches.propTypes = {
  presentation: PropTypes.shape.isRequired,
  concept: PropTypes.arrayOf(PropTypes.shape).isRequired,
  prints: PropTypes.arrayOf(PropTypes.shape).isRequired,
  close: PropTypes.func.isRequired,
  section: PropTypes.string,
};

Sketches.defaultProps = {
  section: 'concept',
};

export default Sketches;
