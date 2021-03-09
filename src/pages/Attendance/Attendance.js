import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import translate from '../../libs/i18n';
import Api from '../../libs/Api';
import styles from './Attendance.module.scss';
import useOutsideClick from '../../libs/useOutsideClick';

import SearchIcon from '../../assets/icons/Search';
import Loading from '../../components/Loading/Loading';
import PresentationGridItem from '../../components/PresentationGridItem/PresentationGridItem';
import PresentationConcept from '../../components/PresentationConcept/PresentationConcept';
import PresentationPrints from '../../components/PresentationPrints/PresentationPrints';
import FavoritePresentationPrints from '../../components/FavoritePresentationPrints/FavoritePresentationPrints';
import OtherIdeasPresentationPrints from '../../components/OtherIdeasPresentationPrints/OtherIdeasPresentationPrints';
import PresentationPlayer from '../../components/PresentationPlayer/PresentationPlayer';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';

function Attendance() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.settings.language);

  const { id } = useParams();

  const usersSelectorRef = useRef();

  const [attendance, setAttendance] = useState();
  // const [invites, setInvites] = useState([]);
  // const [users, setUsers] = useState([]);
  const [presentation, setPresentation] = useState();
  const [concept, setConcept] = useState();
  const [loading, setLoading] = useState(false);
  const [usersSelector, setUsersSelector] = useState('closed');
  // const [updatedTitle] = useState('');
  // const [editingTitle, setEditingTitle] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uniquePresentation, setUniquePresentation] = useState(false);
  const [currentSection, setCurrentSection] = useState('concept');
  const [tags] = useState([]);
  // const [collections, setCollections] = useState([]);
  // const [clients, setClients] = useState([]);
  // const [artFinalists, setArtFinalists] = useState([]);
  const [fabrics] = useState([]);
  const [dolls, setDolls] = useState([]);
  const [prints, setPrints] = useState([]);
  const [slider, setSlider] = useState(false);
  const [selectedPresentations, setSelectedPresentations] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  // const [, setDeletingInvite] = useState(false);

  const changeUsersSelector = useCallback((state) => {
    if (state === 'closed') {
      setUsersSelector('opened');
    } else {
      setUsersSelector('closed');
    }
  }, []);

  useOutsideClick(usersSelectorRef, () => {
    changeUsersSelector(usersSelector);
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      Api.getAttendance(id).then(async (res) => {
        setAttendance(res);
        if (res.selected_prints && res.selected_prints.length) {
          setUniquePresentation(true);
          setPrints(res.selected_prints);
          if (res.customer_profile && res.customer_profile.length) {
            Api.getDollsByProfile(res.customer_profile).then((dbp) => {
              setDolls(dbp);
            });
          }
          Api.getPresentation(res.meeting_id).then((pres) => {
            setPresentation(pres);
            setLoading(false);
          });
          const getConcept = Api.getConcept(res.meeting_id);
          const getTags = Api.getTags();
          const getFabrics = Api.getFabrics();

          await axios.all([getTags, getConcept, getFabrics]).then(
            axios.spread(async (...responses) => {
              // setTags(responses[0]);
              setConcept(responses[1].results);
              if (!responses[1].results.length) {
                setCurrentSection('prints');
              }
              // setFabrics(responses[2].results);
            })
          );
        } else {
          setLoading(false);
        }
      });
      // Api.getCollections().then((res) => {
      //   setCollections(res);
      // });
      // Api.getClients().then((res) => {
      //   setClients(res);
      // });
      // Api.getArtFinalists().then((res) => {
      //   setArtFinalists(res);
      // });
      // Api.getAttendanceInvites(id).then((res) => {
      //   setInvites(res.results);
      // });

      // Api.getUsers().then((res) => {
      //   setUsers(res);
      // });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      // setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [dispatch, id, loadData]);

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

  const filteredPresentations = useMemo(() => {
    if (attendance) {
      if (searchQuery) {
        return attendance.selected_meetings.filter((pres) =>
          pres.meeting.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return attendance.selected_meetings;
    }
    return [];
  }, [attendance, searchQuery]);

  const showSlider = useCallback(() => {
    setSlider(true);
  }, []);

  const loadPresentationPrints = useCallback(() => {
    Api.getPresentationSelectedPrints(presentation.id)
      .then((res) => {
        setPrints(res);
      })
      .catch();
  }, [presentation]);

  const updateConcept = useCallback(() => {
    Api.getConcept(presentation.id).then((res) => {
      setConcept(res.results);
    });
  }, [presentation]);

  const updatePrints = useCallback(() => {
    setLoading(true);
    Api.getPresentation(presentation.id)
      .then(async (ans) => {
        const returnedPresentation = { ...ans };
        loadPresentationPrints(returnedPresentation.id);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loadPresentationPrints, presentation]);

  const renderMissingCardSpaces = useMemo(() => {
    if (filteredPresentations.length) {
      const numberOfEmptyCards = filteredPresentations.length % 4;
      const emptyCards = [];

      for (let i = 1; i <= numberOfEmptyCards; i += 1) {
        emptyCards.push(i);
      }

      return emptyCards.map((i) => (
        <div key={i} className={styles.emptyCard} />
      ));
    }
    return false;
  }, [filteredPresentations]);

  // const onSelectPresentation = (presentationId, selected) => {
  //   let currentSelectedPresentations = [...selectedPresentations];
  //   const containsPresentation = currentSelectedPresentations.find(
  //     (pres) => pres === presentationId
  //   );

  //   if (!selected && containsPresentation) {
  //     currentSelectedPresentations = currentSelectedPresentations.filter(
  //       (pres) => pres !== presentationId
  //     );
  //   } else if (selected && !containsPresentation) {
  //     currentSelectedPresentations = [...selectedPresentations, presentationId];
  //   }
  //   setSelectedPresentations(currentSelectedPresentations);
  // };

  // const getInvitedUser = (userId) => {
  //   return users.find((user) => user.id === userId);
  // };

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

  const renderContent = () => {
    const hideSlider = () => {
      setSlider(false);
    };

    if (uniquePresentation) {
      return (
        <>
          <ul className={styles.sectionsMenu}>
            <li>
              <button
                className={`${currentSection === 'concept' && styles.active}`}
                type="button"
                onClick={() => setCurrentSection('concept')}
              >
                {translate('concept', language)}
              </button>
            </li>
            <li>
              <button
                className={`${currentSection === 'prints' && styles.active}`}
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
                  currentSection === 'otherIdeas' ? styles.active : null
                } ${styles.otherIdeas}`}
                type="button"
                onClick={() => setCurrentSection('otherIdeas')}
              >
                {translate('otherIdeas', language)}
              </button>
            </li>
          </ul>
          <div className={styles.content}>
            {presentation && currentSection === 'concept' && (
              <PresentationConcept
                presentation={presentation}
                playSlider={showSlider}
                concept={concept}
                onUpdate={updateConcept}
              />
            )}
            {presentation && currentSection === 'prints' && (
              <PresentationPrints
                presentation={presentation}
                playSlider={showSlider}
                onUpdate={updatePrints}
                tags={tags}
                prints={prints}
                // collections={collections}
                // clients={clients}
                // artFinalists={artFinalists}
                fabrics={fabrics}
                dolls={dolls}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
              />
            )}
            {presentation && currentSection === 'favorites' && (
              <FavoritePresentationPrints
                presentation={presentation}
                playSlider={showSlider}
                tags={tags}
                dolls={dolls}
              />
            )}

            {presentation && currentSection === 'otherIdeas' && (
              <OtherIdeasPresentationPrints
                presentation={presentation}
                playSlider={showSlider}
                onUpdate={updatePrints}
                tags={tags}
                fabrics={fabrics}
                dolls={dolls}
              />
            )}

            {loading && <Loading fixed />}
          </div>
          {slider && (
            <PresentationPlayer
              concept={concept}
              presentation={presentation}
              prints={getSlidePrints}
              close={hideSlider}
              section={currentSection}
            />
          )}
        </>
      );
    }
    // const finishEditingText = () => {
    //   setEditingTitle(false);

    //   const formData = new FormData();

    //   if (updatedTitle && updatedTitle !== attendance.name) {
    //     formData.append('name', updatedTitle);
    //     Api.updateAttendance(attendance.id, formData)
    //       .then()
    //       .catch(() => {
    //         setUpdatedTitle('');
    //       });
    //   }
    // };

    return (
      <div className={styles.content}>
        <div className={styles.searchInputContainer}>
          <SearchIcon color="#a3b3c7" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            placeholder={translate('searchPresentation', language)}
          />
        </div>
        {attendance && (
          <div className={styles.mainInfo}>
            <h2 className={styles.attendanceTitle}>
              {translate('attendance', language)}
            </h2>
            /<h1 className={styles.title}>{attendance.name}</h1>
            {/* </button>
            )} */}
          </div>
        )}

        <div className={styles.attendancesGrid}>
          {attendance &&
            filteredPresentations.map((pres) => (
              <PresentationGridItem
                name={pres.meeting && pres.meeting.name}
                image={pres.meeting && pres.meeting.print_image_url}
                id={pres.meeting && pres.meeting.id}
                type={pres.meeting && pres.meeting.type}
                small
                fromAttendance={attendance.id}
              />
            ))}
          {renderMissingCardSpaces}
        </div>
        {loading && <Loading fixed />}
      </div>
    );
  };

  const removePresentations = useCallback(() => {
    setConfirmationModal(false);
    let updatedPresentations = [...attendance.selected_meetings];

    selectedPresentations.forEach((sp) => {
      if (
        attendance.selected_meetings.find(
          (sm) => sm.meeting && sm.meeting.id === sp
        )
      ) {
        updatedPresentations = updatedPresentations.filter(
          (up) => up.meeting && up.meeting.id !== sp
        );
      }
    });
    updatedPresentations = updatedPresentations.map((up) => up.meeting.id);
    Api.removeAttendancePresentation(id, {
      meetings_ids: updatedPresentations,
    })
      .then(() => {
        loadData();
      })
      .catch(() => {
        // toast('errorRemovingAttendancePresentation', language);
      });
    setSelectedPresentations([]);
  }, [attendance, id, loadData, selectedPresentations]);

  return (
    <div className={styles.attendance}>
      <div className={styles.header}>
        <div className={styles.topHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.title}>
              {translate('attendance', language).toUpperCase()}
            </span>
          </h2>
          <div className={styles.social}>
            {/* {users.length && invites.length && (
              <ul className={styles.invitedUsers}>
                {invites.map((invite) => (
                  <li key={invite.id}>
                    <button
                      className={styles.delete}
                      type="button"
                      onClick={() => setDeletingInvite(invite.id)}
                    >
                      -
                    </button>
                    <div className={styles.imageContainer}>
                      <img
                        src={getInvitedUser(invite.staff).image}
                        alt={getInvitedUser(invite.staff).name}
                        title={getInvitedUser(invite.staff).name}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )} */}
          </div>
        </div>
      </div>
      {renderContent()}
      <div
        className={`${styles.actionsMenuContainer} ${
          selectedPresentations.length > 0 && styles.actionsMenuActive
        }`}
      >
        <div className={styles.actionsMenu}>
          <div className={styles.left}>
            <div>
              {`${selectedPresentations.length} ${
                selectedPresentations.length > 1
                  ? translate('selectedMultiple', language)
                  : translate('selectedOne', language)
              }`}
            </div>
          </div>
          <button
            onClick={() => setConfirmationModal(true)}
            disabled={!selectedPresentations.length}
            type="button"
            className={styles.delete}
          >
            {translate('delete', language)}
          </button>
        </div>
      </div>
      {confirmationModal && (
        <ConfirmationModal
          message={translate('confirmRemoveAttendancePresentation', language)}
          confirmText={translate('yes', language)}
          cancelText={translate('no', language)}
          onConfirm={removePresentations}
          onCancel={() => setConfirmationModal(false)}
          deleteWarning
        />
      )}
    </div>
  );
}

export default Attendance;
