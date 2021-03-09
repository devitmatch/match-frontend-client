import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import styles from './FavoritePresentationPrints.module.scss';
import Api from '../../libs/Api';
import translate from '../../libs/i18n';
import useOutsideClick from '../../libs/useOutsideClick';
import { addProductsOnClientCart } from '../../store/actions/clientCart';

import PlayIcon from '../../assets/icons/Play';
import PrintGridItem from '../PrintGridItem/PrintGridItem';
import TagsSelectors from '../TagsSelectors/TagsSelectors';
import Loading from '../Loading/Loading';
import ClientPurchasePrint from '../ClientPurchasePrint/ClientPurchasePrint';

function PresentationPrints({ presentation, playSlider, tags, dolls }) {
  const language = useSelector((state) => state.settings.language);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // const [editingTitle] = useState(false);
  // const [updatedDescription, setUpdatedDescription] = useState('');
  // const [editingDescription, setEditingDescription] = useState(false);
  const [prints, setPrints] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedArtFinalists] = useState([]);
  const [selectedProveniences] = useState([]);
  const [fabricsSelector, setFabricsSelector] = useState('closed');
  const [purchasingPrintId, setPurchasingPrintId] = useState();
  const [purchasingPrints, setPurchasingPrints] = useState([]);
  const [exclusivePrints] = useState([]);
  const [loadingExclusivity] = useState(false);
  const [fabrics, setFabrics] = useState([]);
  // const [dragOrigin, setDragOrigin] = useState();
  // const [dragDestiny, setDragDestiny] = useState();
  const [nonDuplicatedPrints, setNonDuplicatedPrints] = useState([]);

  // const [loading, setLoading] = useState(false);
  const fabricsSelectorRef = useRef();

  useEffect(() => {
    Api.getFabrics().then((res) => {
      setFabrics(res.results);
    });

    Api.getFavoritePresentationSelectedPrints(user.id, presentation.id).then(
      (fp) => {
        Api.getPresentationSelectedPrints(presentation.id).then((psp) => {
          setPrints(
            psp
              .filter((p) => fp.includes(p.id))
              .map((p) => ({ ...p, isFavorite: true }))
          );
        });
      }
    );
  }, [presentation.id, user.id]);

  useOutsideClick(fabricsSelectorRef, () => {
    if (fabricsSelector === 'opened') {
      setFabricsSelector('closed');
    }
  });

  const filteredPrints = useMemo(() => {
    let finalPrints = [...exclusivePrints];
    selectedTags.forEach((tag) => {
      finalPrints = finalPrints.filter((print) => {
        return print.tag_ids.some((t) => t === tag.id);
      });
    });

    const updatedFinalPrints = [];
    finalPrints.forEach((p) => {
      if (p.print_is_origin) {
        updatedFinalPrints.push(p);
      } else if (
        !finalPrints.find(
          (fP) =>
            fP.print_code.split(' ')[0] === p.print_code.split(' ')[0] &&
            p.print_code.split(' ')[1] &&
            ((fP.print_code.split(' ')[1] &&
              fP.print_code.split(' ')[1] < p.print_code.split(' ')[1]) ||
              fP.print_is_origin)
        )
      ) {
        updatedFinalPrints.push(p);
      }
    });

    finalPrints = [...updatedFinalPrints];

    return finalPrints;
  }, [
    exclusivePrints,
    selectedArtFinalists,
    selectedProveniences,
    selectedTags,
  ]);

  useEffect(() => {
    const printCards = [];
    prints.forEach((p) => {
      if (!printCards.find((pc) => pc.print_id === p.print_id)) {
        printCards.push(p);
      }
    });

    if (printCards.length) {
      printCards.sort((a, b) => a.position - b.position);
    }

    setNonDuplicatedPrints(printCards);
  }, [filteredPrints, prints]);

  const getDolly = useMemo(() => {
    return {
      dolly_id: presentation.dolly_id,
      image: presentation.dolly,
      shadow: presentation.dolly_shadow,
      rapport_propor: presentation.rapport_propor,
      dolly_masks: presentation.dolly_masks,
      is_new_doll:
        presentation.dolly_masks &&
        presentation.dolly_masks.length &&
        presentation.dolly_masks.length > 0,
    };
  }, [presentation]);

  const renderedGrid = () => {
    const addToCart = (selectedPrintId) => {
      const products = prints.filter((p) => p.print_id === selectedPrintId);
      const initialFabrics = [];
      products.forEach((dfp) => {
        if (dfp.fabric_id) {
          initialFabrics.push({
            id: dfp.fabric_id,
            name: dfp.fabric_name,
          });
        }
      });
      let angraFabric;
      if (!initialFabrics.length) {
        angraFabric = fabrics.find((fab) => fab.name === 'ANGRA');
      } else {
        angraFabric = initialFabrics.find((fab) => fab.name === 'ANGRA');
      }

      products.forEach((prod, i) => {
        products[i] = {
          ...prod,
          initialFabrics: [...initialFabrics],
          client: user.id,
          customer_meeting: presentation.id,
          action: null,
          meters: '',
          product: prod.product_id,
          fabric_id: angraFabric ? angraFabric.id : prod.fabric_id,
          fabric_name: angraFabric ? angraFabric.name : prod.fabric_name,
        };
      });
      dispatch(addProductsOnClientCart([products[0]]));
      toast(translate('printAddedToCart', language), {
        type: 'success',
      });

      // const onDragStart = (e, index) => {
      //   setDragOrigin(index);
      // };

      // const onDragOver = (e, index) => {
      //   if (index !== setDragDestiny) {
      //     setDragDestiny(index);
      //   }
      // };

      // const onDragEnd = () => {
      //   setLoading(true);

      //   const updatedDraggablePrints = [...nonDuplicatedPrints];
      //   const draggadedPrint = updatedDraggablePrints[dragOrigin];
      //   updatedDraggablePrints[dragOrigin] = updatedDraggablePrints[dragDestiny];
      //   updatedDraggablePrints[dragDestiny] = draggadedPrint;

      //   Api.updatePrintPosition(updatedDraggablePrints[dragOrigin].id, {
      //     position: updatedDraggablePrints[dragDestiny].position,
      //   })
      //     .then((response) => {
      //       const elementIndex = updatedDraggablePrints.findIndex(
      //         (element) => element.id === updatedDraggablePrints[dragOrigin].id
      //       );

      //       updatedDraggablePrints[elementIndex] = response;
      //     })
      //     .catch()
      //     .finally(() => {
      //       setLoading(false);
      //     });
      //   Api.updatePrintPosition(updatedDraggablePrints[dragDestiny].id, {
      //     position: updatedDraggablePrints[dragOrigin].position,
      //   })
      //     .then((response) => {
      //       const elementIndex = updatedDraggablePrints.findIndex(
      //         (element) => element.id === updatedDraggablePrints[dragDestiny].id
      //       );

      //       updatedDraggablePrints[elementIndex] = response;
      //     })
      //     .catch()
      //     .finally(() => {
      //       setLoading(false);
      //     });

      //   setNonDuplicatedPrints(updatedDraggablePrints);
      //   setDragOrigin();
      //   setDragDestiny();
    };

    const removeFavorite = (printId) => {
      const updatedPrints = [...prints];
      const printIndex = updatedPrints.findIndex((up) => up.id === printId);
      const currentPrint = updatedPrints[printIndex];
      updatedPrints.splice(printIndex, 1);
      setPrints(updatedPrints);

      Api.removeFavoritePrint(printId, presentation.id).catch(() => {
        updatedPrints.splice(printIndex, 0, currentPrint);
        setPrints(updatedPrints);
      });
    };

    const renderCard = (print) => {
      return (
        <div
          key={`${print.id}`}
          className={`${styles.printCard}`}
          // draggable
          // onDragStart={(e) => onDragStart(e, index)}
          // onDragOver={(e) => onDragOver(e, index)}
          // onDragEnd={(e) => onDragEnd(e, index)}
        >
          <PrintGridItem
            presentation
            id={print.print_id}
            image={print.print_image_url || print.image_url}
            code={print.print_code || print.code}
            tags={print.tags}
            name={print.print_name}
            printJpegWidth={print.print_jpeg_width}
            printJpegHeight={print.print_jpeg_height}
            doll={getDolly}
            printApplication={print.print_application}
            backgroundColor={
              print.flat_background && print.flat_background_color
                ? print.flat_background_color
                : '#FFFFFF'
            }
            purchaseSelect={() => setPurchasingPrintId(print.print_id)}
            favorite={() => removeFavorite(print.id)}
            isFavorite={print.isFavorite}
            addToCart={addToCart}
          />
        </div>
      );
    };

    return (
      <div className={styles.printsGrid}>
        <div>
          {nonDuplicatedPrints.map((print, index) => {
            if (index % 4 === 0) {
              return renderCard(print, index);
            }
            return null;
          })}
        </div>
        <div>
          {nonDuplicatedPrints.map((print, index) => {
            if (index % 4 === 1) {
              return renderCard(print, index);
            }
            return null;
          })}
        </div>
        <div>
          {nonDuplicatedPrints.map((print, index) => {
            if (index % 4 === 2) {
              return renderCard(print, index);
            }
            return null;
          })}
        </div>
        <div>
          {nonDuplicatedPrints.map((print, index) => {
            if (index % 4 === 3) {
              return renderCard(print, index);
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (purchasingPrintId) {
      const purchasing = [];

      prints.forEach((p) => {
        if (p.print_id === purchasingPrintId) {
          purchasing.push(p);
        }
      });

      const variations = [];

      prints.forEach((p) => {
        if (p.print_id !== purchasingPrintId) {
          if (
            (p.print_code &&
              p.print_code.includes(purchasing[0].print_code.split(' ')[0])) ||
            purchasing[0].print_code.includes(p.print_code)
          ) {
            variations.push(p);
          }
        }
      });
      setPurchasingPrints([...purchasing, ...variations]);
    }
  }, [prints, purchasingPrintId]);

  const nextPrint = () => {
    const currentIndex = nonDuplicatedPrints.findIndex(
      (print) => print.print_id === purchasingPrintId
    );

    if (currentIndex === nonDuplicatedPrints.length - 1) {
      setPurchasingPrintId(nonDuplicatedPrints[0].print_id);
    } else {
      setPurchasingPrintId(nonDuplicatedPrints[currentIndex + 1].print_id);
    }
  };

  const previousPrint = () => {
    const currentIndex = nonDuplicatedPrints.findIndex(
      (print) => print.print_id === purchasingPrintId
    );

    if (currentIndex > 0) {
      setPurchasingPrintId(nonDuplicatedPrints[currentIndex - 1].print_id);
    } else {
      setPurchasingPrintId(
        nonDuplicatedPrints[nonDuplicatedPrints.length - 1].print_id
      );
    }
  };

  return (
    <>
      <div className={styles.presentationConcept}>
        <div className={styles.header}>
          <div className={styles.actions} />
          <div className={styles.tagsArea}>
            <TagsSelectors
              tags={tags}
              selectLabel={translate('add', language)}
              selectTags={setSelectedTags}
            />
          </div>
        </div>
        <div className={styles.mainInfo}>
          <h1>{presentation.name}</h1>

          <p>{presentation.meeting_briefing}</p>
        </div>
        <button className={styles.play} type="button" onClick={playSlider}>
          <PlayIcon />
          Play
        </button>
        {loadingExclusivity ? <Loading line /> : renderedGrid()}
      </div>
      {/* {loading && <Loading fixed />} */}
      {purchasingPrintId && (
        <ClientPurchasePrint
          onClose={() => setPurchasingPrintId()}
          prints={purchasingPrints}
          presentation={presentation}
          dolls={dolls}
          client={presentation.client}
          nextPrint={nextPrint}
          previousPrint={previousPrint}
        />
      )}
    </>
  );
}

PresentationPrints.propTypes = {
  presentation: PropTypes.shape().isRequired,
  playSlider: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape),
  dolls: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

PresentationPrints.defaultProps = {
  tags: [],
};

export default PresentationPrints;
