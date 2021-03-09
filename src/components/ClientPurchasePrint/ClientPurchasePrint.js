import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import styles from './ClientPurchasePrint.module.scss';
import translate from '../../libs/i18n';
import Api from '../../libs/Api';
import { addProductsOnClientCart } from '../../store/actions/clientCart';

import CloseIcon from '../../assets/icons/Close';
import PurchaseChoosePrint from '../PurchaseChoosePrint/PurchaseChoosePrint';
import PurchaseChooseFabric from '../PurchaseChooseFabric/PurchaseChooseFabric';

export default function ClientPurchasePrint({
  onClose,
  prints,
  presentation,
  dolls,
  selectedClient,
  nextPrint,
  previousPrint,
}) {
  const language = useSelector((state) => state.settings.language);
  const client = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // const [dolls, setDolls] = useState([]);
  const [fabrics, setFabrics] = useState([]);

  const [activeSection, setActiveSection] = useState('color');

  const [choosePrintColors, setChoosePrintColors] = useState([]);
  const [fabricPurchase, setFabricPurchase] = useState();
  const [customizedPrints, setCustomizedPrints] = useState([]);
  const [exclusivityPurchase, setExclusivityPurchase] = useState();

  useEffect(() => {
    Api.getFabrics().then((res) => {
      setFabrics(res.results);
    });
  }, [presentation]);

  useEffect(() => {
    if (
      (client && fabricPurchase) ||
      (fabricPurchase && fabricPurchase.type === 'RESERVA')
    ) {
      const addToCart = (products) => {
        dispatch(addProductsOnClientCart(products));

        onClose();

        toast(translate('printAddedToCart', language), {
          type: 'success',
        });
      };

      const allPrints = [...prints, ...customizedPrints];
      const cartProducts = allPrints.filter((p) =>
        choosePrintColors.includes(p.print_id)
      );

      const initialFabrics = [];
      cartProducts.forEach((dfp) => {
        if (dfp.fabric_id) {
          initialFabrics.push({
            id: dfp.fabric_id,
            name: dfp.fabric_name,
          });
        }
      });

      const uniqueProducts = [];
      cartProducts.forEach((cP) => {
        if (!uniqueProducts.find((uP) => uP.print_id === cP.print_id)) {
          uniqueProducts.push(cP);
        }
      });

      uniqueProducts.forEach((cP, index) => {
        uniqueProducts[index] = {
          ...uniqueProducts[index],
          initialFabrics,
          type: fabricPurchase.type,
          meters: fabricPurchase.meters,
          ...fabricPurchase.fabric,
          fabric_name: fabricPurchase.fabric ? fabricPurchase.fabric.name : '',
          fabric_id: fabricPurchase.fabric ? fabricPurchase.fabric.id : '',
          client: client.id,
        };
      });
      addToCart(uniqueProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    choosePrintColors,
    client,
    dispatch,
    fabricPurchase,
    language,
    onClose,
    prints,
  ]);

  useEffect(() => {
    const addToCart = (products) => {
      dispatch(addProductsOnClientCart(products));
      onClose();
      toast(translate('printAddedToCart', language), {
        type: 'success',
      });
    };

    if (exclusivityPurchase) {
      const allPrints = [...prints, ...customizedPrints];
      const cartProducts = allPrints.filter((p) =>
        choosePrintColors.includes(p.print_id)
      );

      const initialFabrics = [];
      cartProducts.forEach((dfp) => {
        if (dfp.fabric_id) {
          initialFabrics.push({
            id: dfp.fabric_id,
            name: dfp.fabric_name,
          });
        }
      });

      const uniqueProducts = [];
      cartProducts.forEach((cP) => {
        if (!uniqueProducts.find((uP) => uP.print_id === cP.print_id)) {
          uniqueProducts.push(cP);
        }
      });

      uniqueProducts.forEach((cP, index) => {
        // if (cP.fabric_id === fabricPurchase.fabric_id) {
        uniqueProducts[index] = {
          ...uniqueProducts[index],
          initialFabrics,
          type: fabricPurchase.type,
          meters: fabricPurchase.meters,
          ...fabricPurchase.fabric,
          fabric_name: fabricPurchase.fabric ? fabricPurchase.fabric.name : '',
          fabric_id: fabricPurchase.fabric ? fabricPurchase.fabric.id : '',
        };
        // }
      });

      const exclusivity = [];
      const exclusivityInt = [];
      const exclusivityReg = [];
      const exclusivityCont = [];

      uniqueProducts.forEach((cp, index) => {
        uniqueProducts[index] = {
          ...uniqueProducts[index],
          print_exclusivity: exclusivity,
          print_exclusivity_int: exclusivityInt,
          print_exclusivity_reg: exclusivityReg,
          print_exclusivity_cont: exclusivityCont,
          print_exclusivity_var: exclusivityPurchase.length
            ? exclusivityPurchase[exclusivityPurchase.length - 1]
                .exclusivity_var
            : '',
          presentation: presentation.id,
          idCode:
            exclusivityPurchase.length && exclusivityPurchase[0].idCode
              ? exclusivityPurchase[0].idCode
              : '',
        };
      });

      addToCart(uniqueProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    choosePrintColors,
    client,
    dispatch,
    exclusivityPurchase,
    language,
    onClose,
    presentation,
  ]);

  const setNextSection = () => {
    setExclusivityPurchase([]);
  };

  const addPrintColorsToCart = (printColors) => {
    const addToCart = (products) => {
      dispatch(addProductsOnClientCart(products));
      onClose();

      toast(translate('printAddedToCart', language), {
        type: 'success',
      });
    };

    const allPrints = [...prints, ...customizedPrints];
    const cartProducts = allPrints.filter((p) =>
      printColors.includes(p.print_id)
    );
    const uniqueProducts = [];
    cartProducts.forEach((cP) => {
      if (!uniqueProducts.find((uP) => uP.print_id === cP.print_id)) {
        uniqueProducts.push(cP);
      }
    });

    const initialFabrics = [];
    cartProducts.forEach((dfp) => {
      initialFabrics.push({
        id: dfp.fabric_id,
        name: dfp.fabric_name,
      });
    });
    uniqueProducts.forEach((cP, index) => {
      uniqueProducts[index] = {
        ...uniqueProducts[index],
        type: '',
        meters: 0,
        fabric_name: '',
        fabric_id: null,
        initialFabrics,
        client: client.id,
        presentation: presentation.id,
      };
    });
    addToCart(uniqueProducts);
    setActiveSection('');
  };

  const reservePrintColors = (printColors) => {
    const addToCart = (products) => {
      dispatch(addProductsOnClientCart(products));
      onClose();

      toast(translate('printAddedToCart', language), {
        type: 'success',
      });
    };

    const allPrints = [...prints, ...customizedPrints];
    const cartProducts = allPrints.filter((p) =>
      printColors.includes(p.print_id)
    );
    const uniqueProducts = [];
    cartProducts.forEach((cP) => {
      if (!uniqueProducts.find((uP) => uP.print_id === cP.print_id)) {
        uniqueProducts.push(cP);
      }
    });

    const initialFabrics = [];
    cartProducts.forEach((dfp) => {
      initialFabrics.push({
        id: dfp.fabric_id,
        name: dfp.fabric_name,
      });
    });
    uniqueProducts.forEach((cP, index) => {
      uniqueProducts[index] = {
        ...uniqueProducts[index],
        type: 'RESERVA',
        meters: 0,
        fabric_name: '',
        fabric_id: null,
        initialFabrics,
        client: client.id,
        presentation: presentation.id,
      };
    });
    addToCart(uniqueProducts);
    setActiveSection('');
  };

  const reserveCustomizedPrintColors = (print) => {
    const addToCart = (products) => {
      dispatch(addProductsOnClientCart(products));
      onClose();

      toast(translate('printAddedToCart', language), {
        type: 'success',
      });
    };

    const allPrints = [...prints, print];

    const cartProducts = allPrints.filter((p) => p.print_id === print.print_id);

    const uniqueProducts = [];
    cartProducts.forEach((cP) => {
      if (!uniqueProducts.find((uP) => uP.print_id === cP.print_id)) {
        uniqueProducts.push(cP);
      }
    });

    const initialFabrics = [];
    cartProducts.forEach((dfp) => {
      initialFabrics.push({
        id: dfp.fabric_id,
        name: dfp.fabric_name,
      });
    });
    uniqueProducts.forEach((cP, index) => {
      uniqueProducts[index] = {
        ...uniqueProducts[index],
        type: 'RESERVA',
        meters: 0,
        fabric_name: '',
        fabric_id: null,
        initialFabrics,
        client: client.id,
        presentation: presentation.id,
      };
    });
    addToCart(uniqueProducts);
    setActiveSection('');
  };

  const setCustomizedPrintColor = (print) => {
    const updatedPrints = [...customizedPrints];
    updatedPrints.push(print);
    setCustomizedPrints(updatedPrints);
    setChoosePrintColors([print.print_id]);
    setActiveSection('fabric');
  };

  const addCustomizedPrintColorsToCart = (print) => {
    const addToCart = (products) => {
      dispatch(addProductsOnClientCart(products));
      onClose();

      toast(translate('printAddedToCart', language), {
        type: 'success',
      });
    };

    const allPrints = [...prints, print];

    const cartProducts = allPrints.filter((p) => p.print_id === print.print_id);

    const uniqueProducts = [];
    cartProducts.forEach((cP) => {
      if (!uniqueProducts.find((uP) => uP.print_id === cP.print_id)) {
        uniqueProducts.push(cP);
      }
    });

    const initialFabrics = [];
    cartProducts.forEach((dfp) => {
      if (dfp.fabric_id) {
        initialFabrics.push({
          id: dfp.fabric_id,
          name: dfp.fabric_name,
        });
      }
    });

    uniqueProducts.forEach((cP, index) => {
      uniqueProducts[index] = {
        ...uniqueProducts[index],
        type: '',
        meters: 0,
        fabric_name: '',
        fabric_id: null,
        initialFabrics,
        client: client.id,
        presentation: presentation.id,
      };
    });
    addToCart(uniqueProducts);
    setActiveSection('');
  };

  const getSelectedPrint = () => {
    const allPrints = [...prints, ...customizedPrints];
    const selectedPrint = allPrints.find(
      (p) => p.print_id === choosePrintColors[0]
    );
    return selectedPrint;
  };

  return (
    <div className={`${styles.clientEditPrint} ${client ? styles.client : ''}`}>
      {/* <nav className={styles.breadCrumb}>
        <li className={activeSection === 'color' ? styles.active : ''}>
          <button type="button" onClick={() => setActiveSection('color')}>
            {translate('color', language).toUpperCase()}
          </button>
        </li>
        <span className={styles.next} />
        <li className={activeSection === 'fabric' ? styles.active : ''}>
          <button type="button" onClick={() => setActiveSection('fabric')}>
            {translate('fabric', language).toUpperCase()}
          </button>
        </li>
        {fabricPurchase && (
          <>
            <span className={styles.next} />
            <li
              className={activeSection === 'exclusivity' ? styles.active : ''}
            >
              <button
                type="button"
                onClick={() => setActiveSection('exclusivity')}
              >
                {translate(fabricPurchase.type, language).toUpperCase()}
              </button>
            </li>
          </>
        )}

        {activeSection === 'produce' && (
          <>
            <span className={styles.next} />
            <li className={activeSection === 'produce' ? styles.active : ''}>
              <button onClick={() => {}} type="button">
                {translate('produce', language).toUpperCase()}
              </button>
            </li>
          </>
        )}
        {activeSection === 'strike' && (
          <>
            <span className={styles.next} />
            <li className={activeSection === 'strike' ? styles.active : ''}>
              <button onClick={() => {}} type="button">
                {translate('strike', language).toUpperCase()}
              </button>
            </li>
          </>
        )}
        {activeSection === 'reserve' && (
          <>
            <span className={styles.next} />
            <li className={activeSection === 'reserve' ? styles.active : ''}>
              <button onClick={() => {}} type="button">
                {translate('reserve', language).toUpperCase()}
              </button>
            </li>
          </>
        )}
        {activeSection === 'hanger' && (
          <>
            <span className={styles.next} />
            <li className={activeSection === 'hanger' ? styles.active : ''}>
              <button onClick={() => {}} type="button">
                {translate('hanger', language).toUpperCase()}
              </button>
            </li>
          </>
        )}
      </nav> */}

      {/* {activeSection === 'color' && (
        <button onClick={onClose} type="button">
          <span className={styles.backArrow} />
        </button>
      )}
      {activeSection === 'fabric' && (
        <button onClick={() => setActiveSection('color')} type="button">
          <span className={styles.backArrow} />
        </button>
      )}
      {activeSection !== 'color' && activeSection !== 'fabric' && (
        <button onClick={() => setActiveSection('fabric')} type="button">
          <span className={styles.backArrow} />
        </button>
      )} */}

      <button className={styles.closeButton} type="button" onClick={onClose}>
        <CloseIcon />
      </button>
      {activeSection === 'color' && (
        <PurchaseChoosePrint
          prints={prints}
          chooseFabric={() => setActiveSection('fabric')}
          printsPurchase={setChoosePrintColors}
          purchaseCustomizedPrint={setCustomizedPrintColor}
          addCustomizedPrintToCart={addCustomizedPrintColorsToCart}
          printsReserve={reservePrintColors}
          addPrintsToCart={addPrintColorsToCart}
          reserveCustomizedPrint={reserveCustomizedPrintColors}
          dolls={dolls}
          client={client.id || selectedClient}
          presentationType={presentation.type}
          nextPrint={nextPrint}
          previousPrint={previousPrint}
          close={onClose}
          presentationId={presentation.id}
        />
      )}
      {activeSection === 'fabric' && (
        <PurchaseChooseFabric
          prints={prints}
          print={getSelectedPrint()}
          fabrics={fabrics}
          fabricPurchase={setFabricPurchase}
          chooseAction={setNextSection}
          close={() => setActiveSection('color')}
        />
      )}
    </div>
  );
}

ClientPurchasePrint.propTypes = {
  onClose: PropTypes.func.isRequired,
  prints: PropTypes.arrayOf(PropTypes.shape).isRequired,
  presentation: PropTypes.shape,
  dolls: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape),
    PropTypes.bool,
  ]),
  selectedClient: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  nextPrint: PropTypes.func.isRequired,
  previousPrint: PropTypes.func.isRequired,
};

ClientPurchasePrint.defaultProps = {
  presentation: {},
  dolls: [],
  selectedClient: false,
};
