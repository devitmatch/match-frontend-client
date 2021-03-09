import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import translate from '../../libs/i18n';
import styles from './PresentationConcept.module.scss';
import Api from '../../libs/Api';

import PlayIcon from '../../assets/icons/Play';
import FormModal from '../FormModal/FormModal';
import FileSelector from '../FileSelector/FileSelector';
// import CheckInput from '../CheckInput/CheckInput';
import Loading from '../Loading/Loading';

function PresentationConcept({ presentation, concept, playSlider, onUpdate }) {
  // const [checkedImages, setCheckedImages] = useState([]);
  const language = useSelector((state) => state.settings.language);

  const [orderedConcept, setOrderedConcept] = useState([]);
  const [createConceptModal, setCreateConceptModal] = useState(false);
  const [newConceptImage, setNewConceptImage] = useState([]);
  const [newConceptDescription, setNewConceptDescription] = useState('');
  // const [checkedImages, setCheckedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [dragOrigin, setDragOrigin] = useState();
  // const [dragDestiny, setDragDestiny] = useState();

  useEffect(() => {
    const ordered = [...concept];
    ordered.sort((a, b) => a.position - b.position);
    setOrderedConcept(ordered);
  }, [concept]);

  // const changeCheckedImages = useCallback(
  //   (index) => {
  //     let updatedCheckedImages;
  //     if (!checkedImages.includes(index)) {
  //       updatedCheckedImages = [...checkedImages, index];
  //     } else {
  //       updatedCheckedImages = checkedImages.filter((img) => img !== index);
  //     }
  //     setCheckedImages(updatedCheckedImages);
  //   },
  //   [checkedImages]
  // );

  // const finishEditingText = () => {
  //   setEditingTitle(false);
  //   setEditingDescription(false);
  //   setEditingConcept('');

  //   const formData = new FormData();

  //   if (updatedTitle && updatedTitle !== presentation.name) {
  //     formData.append('name', updatedTitle);
  //     Api.updatePresentation(presentation.id, formData)
  //       .then()
  //       .catch(() => {
  //         setUpdatedTitle('');
  //       });
  //   }

  //   if (
  //     updatedDescription &&
  //     updatedDescription !== presentation.meeting_briefin
  //   ) {
  //     formData.append('meeting_briefing', updatedDescription);
  //     Api.updatePresentation(presentation.id, formData)
  //       .then()
  //       .catch(() => {
  //         setUpdatedDescription('');
  //       });
  //   }
  // };

  const createConcept = () => {
    setLoading(true);

    let oldMaxPosition = 0;

    if (orderedConcept && orderedConcept.length) {
      orderedConcept.map((c) => {
        if (c && c.position && c.position > oldMaxPosition) {
          oldMaxPosition = c.position;
        }

        return null;
      });
    }

    newConceptImage.map((image, index) => {
      const formData = new FormData();

      formData.append('attendance', presentation.id);
      formData.append('image', image);
      formData.append('position', oldMaxPosition + index + 1);

      if (newConceptDescription) {
        formData.append('description', newConceptDescription);
      }

      Api.createConcept(formData)
        .then(() => {
          toast(translate('successCreatingConcept', language), {
            type: 'success',
          });
          setCreateConceptModal(false);
          setNewConceptDescription('');
          setNewConceptImage([]);
          onUpdate();
        })
        .catch(() => {
          toast(translate('failCreatingConcept', language), {
            type: 'error',
          });
        })
        .finally(() => {
          setLoading(false);
        });

      return null;
    });
  };

  const renderedCard = useCallback((id, image, description) => {
    // const onDragStart = () => {
    //   setDragOrigin(index);
    // };

    // const onDragOver = () => {
    //   if (index !== setDragDestiny) {
    //     setDragDestiny(index);
    //   }
    // };

    // const onDragEnd = () => {
    //   setLoading(true);

    //   const updatedDraggableImages = [...orderedConcept];
    //   const draggadedPrint = updatedDraggableImages[dragOrigin];
    //   updatedDraggableImages[dragOrigin] =
    //     updatedDraggableImages[dragDestiny];
    //   updatedDraggableImages[dragDestiny] = draggadedPrint;

    //   Api.updateConceptImagePosition(updatedDraggableImages[dragOrigin].id, {
    //     position: dragOrigin,
    //   }).finally(() => {
    //     setLoading(false);
    //   });
    //   Api.updateConceptImagePosition(updatedDraggableImages[dragDestiny].id, {
    //     position: dragDestiny,
    //   }).finally(() => {
    //     setLoading(false);
    //   });

    //   setOrderedConcept([...updatedDraggableImages]);
    //   setDragOrigin();
    //   setDragDestiny();
    // };

    return (
      <div
        key={`${id}`}
        className={`${styles.cardImage}`}
        // draggable
        // onDragStart={onDragStart}
        // onDragOver={onDragOver}
        // onDragEnd={onDragEnd}
      >
        {/* <div className={styles.checkInputArea}>
            <CheckInput
              card
              value={checkedImages.includes(id)}
              onChange={() => changeCheckedImages(id)}
              id={id}
            />
          </div> */}
        <img key={image} id={id} src={image} alt={id} />
        {/* {editingConcept === id ? (
            <textarea
              type="text"
              value={updatedConcept}
              onChange={(event) => setUpdatedConcept(event.currentTarget.value)}
              onBlur={() => {
                setEditingTitle(false);
                setEditingDescription(false);
                setEditingConcept('');

                if (updatedConcept !== description) {
                  const formData = new FormData();

                  formData.append('description', updatedConcept);
                  Api.updateConcept(id, formData)
                    .then(() => {
                      onUpdate();
                    })
                    .catch(() => {});
                }
              }}
              className={styles.cardDescription}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditingTitle(false);
                setEditingDescription(false);
                setEditingConcept(id);
              }}
            > */}
        <p>{description && description.length ? description : ''}</p>
        {/* </button>
          )} */}
      </div>
    );
  }, []);

  const renderedGrid = useMemo(() => {
    return (
      <div className={styles.photoGrid}>
        <div>
          {orderedConcept.map((item, index) => {
            if (index % 4 === 0) {
              return renderedCard(item.id, item.image, item.description, index);
            }
            return null;
          })}
        </div>
        <div>
          {orderedConcept.map((item, index) => {
            if (index % 4 === 1) {
              return renderedCard(item.id, item.image, item.description, index);
            }
            return null;
          })}
        </div>
        <div>
          {orderedConcept.map((item, index) => {
            if (index % 4 === 2) {
              return renderedCard(item.id, item.image, item.description, index);
            }
            return null;
          })}
        </div>
        <div>
          {orderedConcept.map((item, index) => {
            if (index % 4 === 3) {
              return renderedCard(item.id, item.image, item.description, index);
            }
            return null;
          })}
        </div>
      </div>
    );
  }, [orderedConcept, renderedCard]);

  return (
    <>
      <div className={styles.presentationConcept}>
        <div className={styles.header}>
          <div className={styles.actions} />
        </div>
        <div className={styles.mainInfo}>
          {/* {editingTitle ? (
            <textarea
              type="text"
              value={updatedTitle || presentation.name}
              onChange={(e) => setUpdatedTitle(e.currentTarget.value)}
              onBlur={finishEditingText}
              className={styles.title}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditingTitle(true);
                setEditingDescription(false);
                setEditingConcept('');
              }}
            > */}
          <h1>{presentation.name}</h1>
          {/* </button>
          )} */}
          {/* {editingDescription ? (
            <textarea
              type="text"
              value={updatedDescription || presentation.meeting_briefing}
              onChange={(e) => setUpdatedDescription(e.currentTarget.value)}
              onBlur={finishEditingText}
              className={styles.description}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditingTitle(false);
                setEditingDescription(true);
                setEditingConcept('');
              }}
            > */}
          <p>{presentation.meeting_briefing}</p>
          {/* </button>
          )} */}
        </div>
        <button className={styles.play} type="button" onClick={playSlider}>
          <PlayIcon />
          Play
        </button>
        {renderedGrid}
        {createConceptModal && (
          <FormModal onCancel={() => setCreateConceptModal(false)}>
            <h1 className={styles.conceptModalTitle}>
              {translate('addConcept', language)}
            </h1>
            {newConceptImage.length > 0 ? (
              <div>
                {newConceptImage.map((image) => (
                  <div key={image.lastModified}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className={styles.newConceptImage}
                    />
                    <button
                      className={styles.deleteNewConceptImage}
                      type="button"
                      onClick={() => {
                        const currentNewConceptImage = newConceptImage.filter(
                          (jImage) => jImage !== image
                        );

                        setNewConceptImage(currentNewConceptImage);
                      }}
                    >
                      {translate('delete', language)}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <FileSelector
                files={newConceptImage}
                label={translate('image', language)}
                onSelect={setNewConceptImage}
                jpg
                fullWidth
                multiple
              />
            )}

            {/* <textarea
              value={newConceptDescription}
              onChange={e => setNewConceptDescription(e.currentTarget.value)}
              className={styles.newConceptDescription}
              placeholder={translate('description', language)}
            /> */}
            <button
              disabled={!newConceptImage.length}
              type="button"
              className={styles.defaultActionButton}
              onClick={createConcept}
            >
              {translate('save', language)}
            </button>
          </FormModal>
        )}
      </div>
      {loading && <Loading fixed />}
    </>
  );
}

PresentationConcept.propTypes = {
  presentation: PropTypes.shape().isRequired,
  concept: PropTypes.arrayOf(PropTypes.shape()),
  playSlider: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

PresentationConcept.defaultProps = {
  concept: [],
};

export default PresentationConcept;
