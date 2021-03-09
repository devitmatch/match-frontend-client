import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import CheckInput from '../CheckInput/CheckInput';
import ClientPurchasePrint from '../ClientPurchasePrint/ClientPurchasePrint';
import FormModal from '../FormModal/FormModal';
import ListSelector from '../ListSelector/ListSelector';
import Loading from '../Loading/Loading';
import PresentationPlayer from '../PresentationPlayer/PresentationPlayer';
import PrintGridItem from '../PrintGridItem/PrintGridItem';
import TagsSelectors from '../TagsSelectors/TagsSelectors';
import EditIcon from '../../assets/icons/Edit';
import PlayIcon from '../../assets/icons/Play';

import Api from '../../libs/Api';
import translate from '../../libs/i18n';
import useOutsideClick from '../../libs/useOutsideClick';
import { addProductsOnClientCart } from '../../store/actions/clientCart';

import styles from './OtherIdeasPresentationPrints.module.scss';

function OtherIdeasPresentationPrints({ presentation, tags, fabrics, dolls }) {
  const language = useSelector((state) => state.settings.language);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [exclusivePrints, setExclusivePrints] = useState([]);
  const [nonDuplicatedPrints, setNonDuplicatedPrints] = useState([]);
  const [purchasingPrints, setPurchasingPrints] = useState([]);
  const [selectedArtFinalists] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedProveniences] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [editingPrintFabrics, setEditingPrintFabrics] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingExclusivity, setLoadingExclusivity] = useState(false);
  const [seeColorVariations, setSeeColorVariations] = useState(true);
  const [fabricsSelector, setFabricsSelector] = useState('closed');
  const [purchasingPrintId, setPurchasingPrintId] = useState();
  const [showPlayer, setShowPlayer] = useState(false);

  const fabricsSelectorRef = useRef();

  useOutsideClick(fabricsSelectorRef, () => {
    if (fabricsSelector === 'opened') {
      setFabricsSelector('closed');
    }
  });

  const closeEditingPrintFabrics = () => {
    setEditingPrintFabrics(false);
    setSelectedFabrics([]);
  };

  const updatePrints = useCallback(() => {
    setLoading(true);
    setLoadingExclusivity(true);

    Api.getOtherIdeas(presentation.id)
      .then((res) => {
        const newOtherIdeas = [];

        (res.results || []).forEach((oI, index) => {
          const time = new Date().getTime();
          const nOI = {
            ...oI,
            print_id: oI.id,
            print_code: oI.code,
            print_color_variant: oI.color_variant,
            print_name: oI.name,
            print_type: oI.type,
            product_id: parseInt(`${time}${oI.id}${index}`, 10),
            print_image_url: oI.image,
          };

          delete nOI.type;

          newOtherIdeas.push(nOI);
        });

        setExclusivePrints(newOtherIdeas);
      })
      .finally(() => {
        setLoadingExclusivity(false);
        setLoading(false);
      });
  }, [presentation]);

  useEffect(() => {
    updatePrints();
  }, [presentation, updatePrints]);

  const filteredPrints = useMemo(() => {
    let finalPrints = [...exclusivePrints];

    selectedTags.forEach((tag) => {
      finalPrints = finalPrints.filter((print) => {
        return print.tag_ids.some((t) => t === tag.id);
      });
    });

    selectedArtFinalists.forEach((artFinalist) => {
      finalPrints = finalPrints.filter(
        (print) => print.art_finisher_id === artFinalist.id
      );
    });

    selectedProveniences.forEach((provenience) => {
      finalPrints = finalPrints.filter(
        (print) => print.provenience === provenience.value
      );
    });

    if (!seeColorVariations) {
      const updatedFinalPrints = [];

      finalPrints.forEach((p) => {
        if (p.print_is_origin) {
          updatedFinalPrints.push(p);
        } else if (
          !finalPrints.find(
            (fP) =>
              fP.code.split(' ')[0] === p.code.split(' ')[0] &&
              p.code.split(' ')[1] &&
              ((fP.code.split(' ')[1] &&
                fP.code.split(' ')[1] < p.code.split(' ')[1]) ||
                fP.print_is_origin)
          )
        ) {
          updatedFinalPrints.push(p);
        }
      });

      finalPrints = [...updatedFinalPrints];
    }

    return finalPrints;
  }, [
    exclusivePrints,
    seeColorVariations,
    selectedArtFinalists,
    selectedProveniences,
    selectedTags,
  ]);

  useEffect(() => {
    const printCards = [];
    filteredPrints.forEach((p) => {
      if (!printCards.find((pc) => pc.id === p.id)) {
        printCards.push(p);
      }
    });

    if (printCards.length) {
      printCards.sort((a, b) => a.position - b.position);
    }

    setNonDuplicatedPrints(printCards);
  }, [filteredPrints]);

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
    const openEditingPrintFabrics = (id) => {
      const foundPrint = exclusivePrints.filter((p) => p.id === id);
      if (foundPrint[0]) {
        const print = foundPrint[0];

        setEditingPrintFabrics(print.id);

        const initialFabrics = [];
        const differentFabricsPrint = exclusivePrints.filter(
          (p) => p.id === id
        );
        differentFabricsPrint.forEach((dfp) => {
          initialFabrics.push({
            id: dfp.fabric_id,
            name: dfp.fabric_name,
            selected_print: dfp.selected_print_id,
            product_id: dfp.product_id,
          });
        });

        setSelectedFabrics(initialFabrics);
      }
    };

    const addToCart = (selectedPrintId) => {
      if (!user.clientId) {
        toast(translate('selectedClientRequired', language), {
          type: 'warning',
        });
      } else {
        const products = exclusivePrints.filter(
          (p) => p.id === selectedPrintId
        );
        const initialFabrics = [];

        products.forEach((dfp) => {
          if (dfp.fabric_id) {
            initialFabrics.push({
              id: dfp.fabric_id,
              name: dfp.fabric_name,
            });
          }
        });

        products.forEach((prod, index) => {
          products[index] = {
            ...prod,
            client: user.clientId,
            customer_meeting: presentation.id,
            seller: presentation.created_by,
            action: null,
            meters: '',
            product: prod.product_id,
            initialFabrics,
          };
        });

        dispatch(addProductsOnClientCart(products));
        toast(translate('printAddedToCart', language), {
          type: 'success',
        });
      }
    };

    const renderCard = (print) => {
      return (
        <div key={`${print.id}`} className={styles.printCard}>
          <button
            type="button"
            className={styles.editPrint}
            onClick={() => openEditingPrintFabrics(print.id)}
          >
            <EditIcon />
          </button>
          <PrintGridItem
            presentation
            id={print.id}
            image={print.print_image_url || print.image_url || print.image}
            code={print.print_code || print.code}
            tags={print.tags}
            name={print.print_name || print.name}
            printJpegWidth={print.print_jpeg_width || 0}
            printJpegHeight={print.print_jpeg_height || 0}
            purchaseSelect={() => setPurchasingPrintId(print.id)}
            addToCart={addToCart}
            doll={getDolly}
            printApplication={print.print_application}
            backgroundColor={
              print.flat_background && print.flat_background_color
                ? print.flat_background_color
                : false
            }
            pantone={print.is_pantone ? print.pantone_color : false}
            newDesignPending={print.new_design_pending}
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

  const changeSelectedPrints = () => {
    setLoading(true);

    const printsWithFabric = exclusivePrints.filter(
      (p) => p.id === editingPrintFabrics
    );
    const addedSelectedFabrics = [];
    const removedSelectedPrints = [];

    printsWithFabric.forEach((pwf) => {
      if (!selectedFabrics.find((sf) => sf.id === pwf.fabric_id)) {
        removedSelectedPrints.push(pwf.id);
      }
    });

    selectedFabrics.forEach((fabric) => {
      if (!printsWithFabric.some((pwf) => pwf.fabric_id === fabric.id)) {
        addedSelectedFabrics.push(fabric.id);
      }
    });

    const removeRequests = [];

    removedSelectedPrints.forEach((p) => {
      const request = Api.deleteSelectedProduct(presentation.id, p);
      removeRequests.push(request);
    });

    const addRequests = [];

    addedSelectedFabrics.forEach((f) => {
      const formData = new FormData();

      formData.append('fabric', f);
      formData.append('print', editingPrintFabrics);

      const request = Api.createProduct(formData).then(async (product) => {
        await Api.addSelectedPrintToPresentation(presentation.id, {
          product_id: product.id,
        });
      });

      addRequests.push(request);
    });

    axios
      .all(addRequests, removeRequests)
      .then(() => updatePrints())
      .finally(() => {
        setLoading(false);
        closeEditingPrintFabrics();
      });
  };

  useEffect(() => {
    if (purchasingPrintId) {
      const initialFabrics = [];
      const differentFabricsPrint = exclusivePrints.filter(
        (print) => print.id === purchasingPrintId
      );

      differentFabricsPrint.forEach((dfp) => {
        initialFabrics.push({
          id: dfp.fabric_id,
          name: dfp.fabric_name,
          selectedPrint: dfp.id,
        });
      });

      setSelectedFabrics(initialFabrics);
    } else {
      setSelectedFabrics([]);
    }
  }, [exclusivePrints, purchasingPrintId]);

  useEffect(() => {
    if (purchasingPrintId) {
      const purchasing = [];

      exclusivePrints.forEach((p) => {
        if (p.id === purchasingPrintId) {
          purchasing.push(p);
        }
      });

      const variations = [];

      exclusivePrints.forEach((p) => {
        if (p.id !== purchasingPrintId) {
          if (
            (p.code && p.code.includes(purchasing[0].code.split(' ')[0])) ||
            purchasing[0].code.includes(p.code)
          ) {
            variations.push(p);
          }
        }
      });

      setPurchasingPrints([...purchasing, ...variations]);
    }
  }, [exclusivePrints, purchasingPrintId]);

  const nextPrint = () => {
    const currentIndex = nonDuplicatedPrints.findIndex(
      (print) => print.id === purchasingPrintId
    );

    if (currentIndex === nonDuplicatedPrints.length - 1) {
      setPurchasingPrintId(nonDuplicatedPrints[0].id);
    } else {
      setPurchasingPrintId(nonDuplicatedPrints[currentIndex + 1].id);
    }
  };

  const previousPrint = () => {
    const currentIndex = nonDuplicatedPrints.findIndex(
      (print) => print.id === purchasingPrintId
    );

    if (currentIndex > 0) {
      setPurchasingPrintId(nonDuplicatedPrints[currentIndex - 1].id);
    } else {
      setPurchasingPrintId(
        nonDuplicatedPrints[nonDuplicatedPrints.length - 1].id
      );
    }
  };

  return (
    <>
      <div className={styles.presentationConcept}>
        <div className={styles.header}>
          <div className={styles.checkArea}>
            <CheckInput
              text={translate('seeColorVariations', language)}
              value={seeColorVariations}
              onChange={setSeeColorVariations}
            />
          </div>
        </div>
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
        <button
          className={styles.play}
          type="button"
          onClick={() => setShowPlayer(!showPlayer)}
        >
          <PlayIcon />
          Play
        </button>
        {loadingExclusivity ? <Loading line /> : renderedGrid()}
      </div>
      {loading && <Loading fixed />}
      {editingPrintFabrics && (
        <FormModal
          title={translate('edit', language)}
          onCancel={closeEditingPrintFabrics}
        >
          <div className={styles.editingProductModal}>
            <div className={styles.content} ref={fabricsSelectorRef}>
              <button
                type="button"
                className={styles.defaultSelectInput}
                onClick={() => setFabricsSelector('opened')}
              >
                {selectedFabrics && selectedFabrics.length
                  ? selectedFabrics.map((fabric) =>
                      fabric.name ? (
                        <span className={styles.fabric}>{fabric.name}</span>
                      ) : (
                        ''
                      )
                    )
                  : translate('addFabrics', language)}
              </button>
              {fabricsSelector === 'opened' && (
                <span className={styles.listContainer}>
                  <ListSelector
                    label={translate('applyFixedFabric', language)}
                    selectLabel={translate('choose', language)}
                    items={fabrics}
                    onSelect={setSelectedFabrics}
                    values={selectedFabrics}
                    multiple
                    search
                  />
                </span>
              )}
            </div>
            <span className={styles.separator} />
            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.defaultActionButton}
                onClick={changeSelectedPrints}
              >
                {translate('save', language)}
              </button>
            </div>
          </div>
        </FormModal>
      )}
      {purchasingPrintId && user.clientId && (
        <ClientPurchasePrint
          onClose={() => setPurchasingPrintId()}
          prints={purchasingPrints}
          presentation={presentation}
          dolls={dolls}
          selectedClient={user.clientId}
          nextPrint={nextPrint}
          previousPrint={previousPrint}
        />
      )}
      {showPlayer && exclusivePrints && exclusivePrints.length && (
        <PresentationPlayer
          concept={[]}
          presentation={presentation}
          prints={exclusivePrints}
          close={() => setShowPlayer(false)}
          section="prints"
        />
      )}
    </>
  );
}

OtherIdeasPresentationPrints.propTypes = {
  presentation: PropTypes.shape().isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape),
  fabrics: PropTypes.arrayOf(PropTypes.shape),
  dolls: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

OtherIdeasPresentationPrints.defaultProps = {
  tags: [],
  fabrics: [],
};

export default OtherIdeasPresentationPrints;
