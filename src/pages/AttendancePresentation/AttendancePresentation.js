import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import translate from '../../libs/i18n';
import Api from '../../libs/Api';
import styles from './AttendancePresentation.module.scss';
import useOutsideClick from '../../libs/useOutsideClick';

import PresentationConcept from '../../components/PresentationConcept/PresentationConcept';
import PresentationPrints from '../../components/PresentationPrints/PresentationPrints';
import FavoritePresentationPrints from '../../components/FavoritePresentationPrints/FavoritePresentationPrints';
import OtherIdeasPresentationPrints from '../../components/OtherIdeasPresentationPrints/OtherIdeasPresentationPrints';
import Loading from '../../components/Loading/Loading';
import PresentationPlayer from '../../components/PresentationPlayer/PresentationPlayer';
import ArrowIcon from '../../assets/icons/Arrow';

function AttendancePresentation() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.settings.language);
  const user = useSelector((state) => state.user);

  const { id, attendanceId } = useParams();

  const usersSelectorRef = useRef();

  const [presentation, setPresentation] = useState();
  const [prints, setPrints] = useState([]);
  const [concept, setConcept] = useState([]);
  const [tags] = useState([]);
  const [currentSection, setCurrentSection] = useState('concept');
  const [loading, setLoading] = useState(false);
  const [slider, setSlider] = useState(false);
  const [usersSelector, setUsersSelector] = useState('closed');
  const [dolls, setDolls] = useState([]);
  const [otherIdeas, setOtherIdeas] = useState([]);

  useEffect(() => {
    if (currentSection === 'prints' && prints.length) {
      Api.getFavoritePresentationSelectedPrints(user.id, presentation.id).then(
        (fp) => {
          const updatedPrints = [...prints];
          setPrints(
            updatedPrints.map((p) => ({
              ...p,
              isFavorite: fp.includes(p.id),
            }))
          );
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection]);

  const changeUsersSelector = (state) => {
    if (state === 'closed') {
      setUsersSelector('opened');
    } else {
      setUsersSelector('closed');
    }
  };

  useOutsideClick(usersSelectorRef, () => {
    changeUsersSelector(usersSelector);
  });

  useEffect(() => {
    (async function loadData() {
      setLoading(true);
      try {
        Api.getPresentation(id).then((res) => {
          setPresentation(res);

          Api.getFavoritePresentationSelectedPrints(user.id, res.id).then(
            (fp) => {
              Api.getPresentationSelectedPrints(id).then((psp) => {
                setPrints(
                  psp.map((p) => ({
                    ...p,
                    isFavorite: fp.includes(p.id),
                  }))
                );
              });
            }
          );

          Api.getDollsByProfile(res.customer_profile).then((dbp) => {
            setDolls(dbp);
          });
        });

        const getConcept = Api.getConcept(id);
        const getOtherIdeas = Api.getOtherIdeas(id);
        // const getFabrics = Api.getFabrics();

        await axios.all([getConcept, getOtherIdeas]).then(
          axios.spread(async (...responses) => {
            setConcept(responses[0].results);
            setOtherIdeas(responses[1]);
          })
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, id]);

  useEffect(() => console.log(otherIdeas), [otherIdeas]);

  const showSlider = () => {
    setSlider(true);
  };

  const hideSlider = () => {
    setSlider(false);
  };

  const updateConcept = () => {
    Api.getConcept(id).then((res) => {
      setConcept(res.results);
    });
  };

  const getSlidePrints = useMemo(() => {
    if (currentSection !== 'favorits') {
      const unifiedPrints = [];
      prints
        .filter((p) => p.intentional_inserted)
        .forEach((print) => {
          if (!unifiedPrints.find((uP) => uP.id === print.id)) {
            unifiedPrints.push(print);
          }
        });

      return unifiedPrints;
    }
    const favoritePrints = prints.filter((p) => p.isFavorite);

    const unifiedPrints = [];
    favoritePrints
      .filter((p) => p.intentional_inserted)
      .forEach((print) => {
        if (!unifiedPrints.find((uP) => uP.id === print.id)) {
          unifiedPrints.push(print);
        }
      });
    return unifiedPrints;
  }, [prints, currentSection]);

  const addFavorite = (printId) => {
    const updatedPrints = [...prints];
    const printIndex = updatedPrints.findIndex((up) => up.id === printId);
    updatedPrints[printIndex].isFavorite = true;
    setPrints(updatedPrints);

    Api.favoritePrint(printId, presentation.id).catch(() => {
      updatedPrints[printIndex].isFavorite = false;
      setPrints(updatedPrints);
    });
  };

  const removeFavorite = (printId) => {
    const updatedPrints = [...prints];
    const printIndex = updatedPrints.findIndex((up) => up.id === printId);
    updatedPrints[printIndex].isFavorite = false;
    setPrints(updatedPrints);

    Api.removeFavoritePrint(printId, presentation.id).catch(() => {
      updatedPrints[printIndex].isFavorite = true;
      setPrints(updatedPrints);
    });
  };

  return (
    <div className={styles.attendancePresentation}>
      <div className={styles.header}>
        <div className={styles.topHeader}>
          <h2 className={styles.sectionTitle}>
            <Link className={styles.return} to={`/attendances/${attendanceId}`}>
              <div className={styles.returnIconContainer}>
                <ArrowIcon color="#FFF" />
              </div>
              {translate('presentations', language)}
            </Link>
          </h2>
        </div>
      </div>
      <ul className={styles.sectionsMenu}>
        <li>
          <button
            className={`${currentSection === 'concept' ? styles.active : null}`}
            type="button"
            onClick={() => setCurrentSection('concept')}
          >
            {translate('concept', language)}
          </button>
        </li>
        <li>
          <button
            className={`${currentSection === 'prints' ? styles.active : null}`}
            type="button"
            onClick={() => setCurrentSection('prints')}
          >
            {translate('prints', language)}
          </button>
        </li>
        <li className={styles.break}>
          <button
            className={`${
              currentSection === 'favorites' ? styles.active : null
            }`}
            type="button"
            onClick={() => setCurrentSection('favorites')}
          >
            {translate('favorites', language)}
          </button>
        </li>
        <li>
          <button
            className={`${
              currentSection === 'other-ideas' ? styles.active : null
            }`}
            type="button"
            onClick={() => setCurrentSection('otherIdeas')}
          >
            {translate('otherIdeas', language)}
          </button>
        </li>
      </ul>
      <div className={styles.content}>
        {presentation && (
          <>
            {currentSection === 'concept' ? (
              <PresentationConcept
                presentation={presentation}
                playSlider={showSlider}
                concept={concept.sort((a, b) => a.position - b.position)}
                onUpdate={updateConcept}
              />
            ) : null}
            {currentSection === 'prints' ? (
              <PresentationPrints
                presentation={presentation}
                prints={prints}
                playSlider={showSlider}
                onUpdate={() => {}}
                tags={tags}
                dolls={dolls}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
              />
            ) : null}
            {currentSection === 'favorites' && (
              <FavoritePresentationPrints
                presentation={presentation}
                playSlider={showSlider}
                tags={tags}
                dolls={dolls}
              />
            )}
            {currentSection === 'otherIdeas' && (
              <OtherIdeasPresentationPrints
                presentation={presentation}
                playSlider={showSlider}
                onUpdate={() => {}}
                tags={tags}
                fabrics={[]}
                dolls={dolls}
              />
            )}
          </>
        )}
        {loading && <Loading fixed />}
      </div>
      {slider && (
        <PresentationPlayer
          concept={currentSection === 'favorites' ? [] : concept}
          presentation={presentation}
          prints={getSlidePrints}
          close={hideSlider}
          section={currentSection === 'favorites' ? 'prints' : currentSection}
        />
      )}
    </div>
  );
}

export default AttendancePresentation;
