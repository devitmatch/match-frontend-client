import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';

import translate from '../../libs/i18n';
import Api from '../../libs/Api';
import imagePlaceholder from '../../assets/images/image_placeholder.png';
import whiteImagePlaceholder from '../../assets/images/image_placeholder_white.png';
import ArrowIcon from '../../assets/icons/Arrow';
import EditIcon from '../../assets/icons/Edit';
// import FormModal from '../FormModal/FormModal';
// import FormPrints from '../FormPrints/FormPrints';
import PrintGridItem from '../PrintGridItem/PrintGridItem';
import Loading from '../Loading/Loading';

import styles from './BriefingForm.module.scss';

function BriefingForm({ id, close, created }) {
  const [language] = useSelector((state) => [state.settings.language]);
  const user = useSelector((state) => state.user);

  const referencesInput = useRef();
  const clientSelectorRef = useRef();

  const [briefingTitle, setBriefingTitle] = useState();
  const [briefingDescription, setBriefingDescription] = useState();
  const [selectedClient, setSelectedClient] = useState();
  const [references, setReferences] = useState([]);
  const [referencePreviews, setReferencePreviews] = useState([]);
  const [selectedPrints, setSelectedPrints] = useState([]);
  // const [printsModal, setPrintsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [briefingCover, setBriefingCover] = useState();
  const [editingReferenceTitle, setEditingReferenceTitle] = useState();
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      (async function loadBriefing() {
        try {
          const getBriefing = await Api.getBriefing(id);
          setSelectedClient(
            getBriefing.client
              ? { name: getBriefing.client_name, id: getBriefing.client }
              : null
          );
          setBriefingTitle(getBriefing.text || '');
          setBriefingDescription(getBriefing.content || '');
          setSelectedPrints(getBriefing.prints);
          setReferencePreviews(getBriefing.visual_references);
          setBriefingCover(getBriefing.cover_id);
          setLoading(false);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      })();
    }
  }, [id]);

  const onSelectReferences = (e) => {
    const fileArray = Array.from(e.currentTarget.files);
    const newFilePreviews = [...referencePreviews];
    const numberOfFiles = Array.from(e.currentTarget.files).length;
    let counter = 0;

    const loadImagePreview = (f) => {
      const reader = new FileReader();
      try {
        reader.readAsDataURL(f);

        reader.onloadend = () => {
          newFilePreviews.push({ name: f.name, src: reader.result });
          counter += 1;
          if (counter < numberOfFiles) {
            loadImagePreview(fileArray[counter]);
          } else {
            setReferencePreviews(newFilePreviews);
            const updatedFiles = [...references];
            setReferences([...updatedFiles, ...fileArray]);
          }
        };
      } catch (err) {
        // console.log(err);
      }
    };
    loadImagePreview(fileArray[counter]);
  };

  const onRemoveReference = (fileName) => {
    setReferencePreviews(referencePreviews.filter((f) => f.name !== fileName));
    setReferences(references.filter((f) => f.name !== fileName));
    referencesInput.current.value = '';
  };

  const onRemoveReferenceById = (refId) => {
    setReferencePreviews(referencePreviews.filter((f) => f.id !== refId));
  };

  // const addSelectedPrints = (prints) => {
  //   const currentSelectedPrint = [...selectedPrints];

  //   prints.forEach((p) => {
  //     if (!currentSelectedPrint.find((pres) => pres.id === p.id)) {
  //       currentSelectedPrint.push(p);
  //     }
  //   });
  //   setSelectedPrints(currentSelectedPrint);
  //   setPrintsModal(false);
  // };

  // const removePrint = useCallback(
  //   (printId) => {
  //     const updatedPrints = selectedPrints.filter((p) => p.id !== printId);
  //     setSelectedPrints(updatedPrints);
  //   },
  //   [selectedPrints]
  // );

  const registerBriefing = useCallback(() => {
    setLoading(true);
    const creatingReferences = [];
    references.forEach((ref, index) => {
      const formData = new FormData();
      formData.append('image', ref);
      formData.append(
        'text',
        referencePreviews[index].name || referencePreviews[index].text || ''
      );

      const createVisualRefRequest = Api.createVisualReference(formData);
      creatingReferences.push(createVisualRefRequest);
    });

    const previousCreatedRefs = referencePreviews
      .filter((ref) => ref.id)
      .map((ref) => ref.id);

    axios
      .all(creatingReferences)
      .then((res) => {
        const createdReferenceIds = res.map((ref) => ref.id);
        let briefingCoverId = briefingCover;

        if (briefingCover && (!id || !Number.isInteger(briefingCover))) {
          const referenceCoverIndex = referencePreviews.findIndex(
            (ref) => ref.src === briefingCover
          );

          briefingCoverId = createdReferenceIds[referenceCoverIndex];
        }

        if (id) {
          Api.updateBriefing(id, {
            text: briefingTitle,
            content: briefingDescription,
            prints: selectedPrints.map((print) => print.id),
            visual_references: [...createdReferenceIds, ...previousCreatedRefs],
            cover_id: briefingCoverId || null,
          })
            .then(() => {
              setLoading(false);
              toast(translate('successUpdatingBriefing', language), {
                type: 'success',
              });
              created();
            })
            .catch(() => {
              setLoading(false);
              toast(translate('failUpdatingBriefing', language), {
                type: 'error',
              });
            });
        } else {
          Api.createBriefing({
            text: briefingTitle,
            content: briefingDescription,
            prints: selectedPrints.map((print) => print.id),
            visual_references: createdReferenceIds,
            cover_id: briefingCoverId || null,
          })
            .then(() => {
              setLoading(false);
              toast(translate('successCreatingBriefing', language), {
                type: 'success',
              });
              created();
            })
            .catch(() => {
              setLoading(false);
              toast(translate('failCreatingBriefing', language), {
                type: 'error',
              });
            });
        }
      })
      .catch(() => {
        setLoading(false);
        toast(translate('failCreatingBriefing', language), {
          type: 'error',
        });
      });
  }, [
    selectedClient,
    briefingTitle,
    briefingDescription,
    references,
    selectedPrints,
    language,
    briefingCover,
    referencePreviews,
    created,
    id,
  ]);

  const setReferenceTitle = (index) => {
    const updatedReferencePreviews = [...referencePreviews];

    if (updatedReferencePreviews[index] && editingTitle) {
      if (updatedReferencePreviews[index].name) {
        updatedReferencePreviews[index].name = editingTitle;
      } else {
        updatedReferencePreviews[index].text = editingTitle;
      }
    }

    setEditingTitle('');
    setEditingReferenceTitle(null);
    setReferencePreviews(updatedReferencePreviews);
  };

  return (
    <>
      <div className={styles.briefingFormModal}>
        <header>
          <button className={styles.closeButton} type="button" onClick={close}>
            <span className={styles.backIcon}>
              <ArrowIcon color="white" />
            </span>

            {translate('briefings', language)}
          </button>
        </header>
        <div className={styles.briefingForm}>
          <form>
            <div className={styles.mainInfo}>
              <div className={styles.clientNameField} ref={clientSelectorRef}>
                <h3 className={styles.subtitle}>
                  {translate('client', language)}: {user.name}
                </h3>
              </div>

              <input
                className={styles.briefingName}
                type="text"
                placeholder={translate('writeBriefingTitle', language)}
                value={briefingTitle}
                onChange={(e) => setBriefingTitle(e.currentTarget.value)}
              />
              <textarea
                className={styles.description}
                placeholder={translate('writeBriefingDescription', language)}
                value={briefingDescription}
                onChange={(e) => setBriefingDescription(e.currentTarget.value)}
              />

              <div className={styles.fileArea}>
                <div className={styles.fileInstructions}>
                  <div>
                    <div className={styles.instructionsTitle}>
                      {translate('addVisualReferences', language)}
                    </div>
                    <div>{translate('dragImages', language)}</div>
                  </div>
                  <div className={styles.uploadButton}>
                    {translate('uploadImages', language)}
                  </div>
                </div>
                <input
                  type="file"
                  ref={referencesInput}
                  multiple
                  onChange={onSelectReferences}
                />
                <hr />
                {referencePreviews.length === 0 && (
                  <div className={styles.referenceItem}>
                    <div className={styles.imageContainer}>
                      <img src={imagePlaceholder} alt="placeholder" />
                    </div>
                    <div className={styles.infoPlaceholder}>
                      <span className={styles.imageNamePlaceholder} />
                      <span className={styles.imageDetailsPlaceholder} />
                    </div>
                  </div>
                )}
              </div>

              {referencePreviews.map((ref, index) => (
                <div key={ref.name || ref.id} className={styles.referenceItem}>
                  <img
                    src={ref.src || ref.image_url}
                    alt={ref.name || ref.text}
                    className={styles.referenceImage}
                  />
                  <div className={styles.info}>
                    <span className={styles.imageName}>
                      {id && ref.id && (
                        <span className={styles.editingReferenceTitle}>
                          {ref.name || ref.text}
                        </span>
                      )}
                      {(!id || !ref.id) &&
                        (editingReferenceTitle === index ? (
                          <input
                            placeholder={ref.name || ref.text}
                            type="text"
                            value={editingTitle}
                            onChange={(e) =>
                              setEditingTitle(e.currentTarget.value)
                            }
                            onBlur={() => setReferenceTitle(index)}
                            onKeyUp={(event) => {
                              if (event.keyCode === 13) {
                                setReferenceTitle(index);
                              }
                            }}
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingReferenceTitle(index);
                              setEditingTitle(ref.name || ref.text);
                            }}
                            className={styles.editingReferenceTitle}
                          >
                            {ref.name || ref.text}
                            <span className={styles.iconContainer}>
                              <EditIcon />
                            </span>
                          </button>
                        ))}

                      {briefingCover &&
                      (briefingCover === ref.id ||
                        briefingCover === ref.src) ? (
                        <span className={styles.cover}>
                          {translate('cover', language)}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            ref.id
                              ? setBriefingCover(ref.id)
                              : setBriefingCover(ref.src)
                          }
                          className={styles.selectCover}
                        >
                          {translate('defineAsCover', language)}
                        </button>
                      )}
                    </span>
                    <button
                      onClick={() =>
                        ref.id
                          ? onRemoveReferenceById(ref.id)
                          : onRemoveReference(ref.name)
                      }
                      type="button"
                      className={styles.delete}
                    >
                      {translate('delete', language)}
                    </button>
                  </div>
                </div>
              ))}
              <hr />
            </div>
            {selectedPrints.length > 0 && (
              <div className={styles.printsContainer}>
                <div className={styles.containerHeader}>
                  <span className={styles.printsTitle}>
                    {translate('prints', language)}
                  </span>
                  {/* <button
                  className={styles.addPrints}
                  type="button"
                  onClick={() => setPrintsModal(true)}
                >
                  {translate('addPrints', language)}
                </button> */}
                </div>
                <div className={styles.printsGrid}>
                  {selectedPrints && selectedPrints.length > 0 && (
                    <>
                      <div className={styles.column}>
                        {selectedPrints &&
                          selectedPrints.map((print, index) => {
                            if (index % 4 === 0) {
                              return (
                                <PrintGridItem
                                  key={`${print.id}-${print.code}`}
                                  id={print.id}
                                  image={print.image_url || print.image}
                                  code={print.code}
                                  name={print.name}
                                  doNothing
                                />
                              );
                            }
                            return null;
                          })}
                      </div>
                      <div className={styles.column}>
                        {selectedPrints &&
                          selectedPrints.map((print, index) => {
                            if (index % 4 === 1) {
                              return (
                                <PrintGridItem
                                  key={`${print.id}-${print.code}`}
                                  id={print.id}
                                  image={print.image_url || print.image}
                                  code={print.code}
                                  name={print.name}
                                  doNothing
                                  // deletePrint={removePrint}
                                />
                              );
                            }
                            return null;
                          })}
                      </div>
                      <div className={styles.column}>
                        {selectedPrints &&
                          selectedPrints.map((print, index) => {
                            if (index % 4 === 2) {
                              return (
                                <PrintGridItem
                                  key={`${print.id}-${print.code}`}
                                  id={print.id}
                                  image={print.image_url || print.image}
                                  code={print.code}
                                  name={print.name}
                                  doNothing
                                  // deletePrint={removePrint}
                                />
                              );
                            }
                            return null;
                          })}
                      </div>
                      <div className={styles.column}>
                        {selectedPrints &&
                          selectedPrints.map((print, index) => {
                            if (index % 4 === 3) {
                              return (
                                <PrintGridItem
                                  key={`${print.id}-${print.code}`}
                                  id={print.id}
                                  image={print.image_url || print.image}
                                  code={print.code}
                                  name={print.name}
                                  doNothing
                                  // deletePrint={removePrint}
                                />
                              );
                            }
                            return null;
                          })}
                      </div>
                    </>
                  )}
                  {selectedPrints.length === 0 && (
                    <>
                      <div className={styles.cardPlaceholder}>
                        <div className={styles.imageContainer}>
                          <img src={whiteImagePlaceholder} alt="placeholder" />
                        </div>
                        <span className={styles.title} />
                      </div>
                      <div className={styles.cardPlaceholder}>
                        <div className={styles.imageContainer}>
                          <img src={whiteImagePlaceholder} alt="placeholder" />
                        </div>
                        <span className={styles.title} />
                      </div>
                      <div className={styles.cardPlaceholder}>
                        <div className={styles.imageContainer}>
                          <img src={whiteImagePlaceholder} alt="placeholder" />
                        </div>
                        <span className={styles.title} />
                      </div>
                      <div className={styles.cardPlaceholder}>
                        <div className={styles.imageContainer}>
                          <img src={whiteImagePlaceholder} alt="placeholder" />
                        </div>
                        <span className={styles.title} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </form>
          <div className={styles.saveContainer}>
            <button
              type="button"
              className={`${styles.defaultRoundedActionButton} ${styles.save}`}
              onClick={registerBriefing}
              disabled={!briefingTitle}
            >
              {id
                ? translate('updateBriefing', language)
                : translate('sendBriefing', language)}
            </button>
          </div>
        </div>
      </div>
      {/* {printsModal && (
        <FormModal onCancel={() => setPrintsModal(false)} spaced>
          <FormPrints applyPrints={addSelectedPrints} />
        </FormModal>
      )} */}
      {loading && (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      )}
    </>
  );
}

BriefingForm.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
  close: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).isRequired,
  created: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).isRequired,
};

export default BriefingForm;
