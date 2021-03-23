/* eslint-disable no-param-reassign */
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

import translate from '../../libs/i18n';
import useOutsideClick from '../../libs/useOutsideClick';
import Api from '../../libs/Api';
import {
  updateProductOnClientCart,
  removeProductOnClientCart,
  clearClientCart,
} from '../../store/actions/clientCart';

import styles from './Cart.module.scss';

import logoMatch from '../../assets/images/logo_match_1.svg';
import CloseIcon from '../../assets/icons/Close';
import ListSelector from '../ListSelector/ListSelector';
import TrashCanIcon from '../../assets/icons/TrashCan';
import CheckInput from '../CheckInput/CheckInput';
import Loading from '../Loading/Loading';

function Cart({ close }) {
  const language = useSelector((state) => state.settings.language);
  const clientCarts = useSelector((state) => state.clientCart);
  const { id: client, clientId } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [fabrics, setFabrics] = useState([]);

  const [clientOrders, setClientOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState();

  const [productsSelector, setProductsSelector] = useState(false);
  const [selectedProduct] = useState();

  const [
    productionProductsCheckboxes,
    setProductionProductsCheckboxes,
  ] = useState([]);
  const [reserveProductsCheckboxes, setReserveProductsCheckboxes] = useState(
    []
  );
  const [hangerProductsCheckboxes, setHangerProductsCheckboxes] = useState([]);
  const [strikeProductsCheckboxes, setStrikeProductsCheckboxes] = useState([]);
  const [
    noClassifiedProductsCheckboxes,
    setNoClassifiedProductsCheckboxes,
  ] = useState([]);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedProductionType, setSelectedProductionType] = useState();
  const [meters, setMeters] = useState();
  const [repetition, setRepetition] = useState(false);
  const [simple, setSimple] = useState(false);
  const [clientProducts, setClientProducts] = useState([]);

  const [currentMeters, setCurrentMeters] = useState();
  const [editingSingleMeters, setEditingSingleMeters] = useState(false);

  const [fabricsModal, setFabricsModal] = useState(false);
  const [fabricQuery, setFabricQuery] = useState();
  const [fabricOptions, setFabricOptions] = useState([]);

  const productsSelectorRef = useRef();

  const [editingProduct, setEditingProduct] = useState();
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const [loading, setLoading] = useState(false);

  const productionTypeOptions = [
    {
      id: 1,
      value: 'PRODUCAO',
      name: 'production',
    },
    {
      id: 2,
      value: 'PILOTO',
      name: 'strike',
    },
    {
      id: 3,
      value: 'HANGER',
      name: 'hanger',
    },
    {
      id: 4,
      value: 'RESERVA',
      name: 'reserve',
    },
  ];

  useEffect(() => {
    Api.getFabrics().then((res) => {
      setFabrics(res.results);
    });
  }, []);

  useEffect(() => {
    setProductsSelector(false);
  }, [selectedProduct]);

  useOutsideClick(productsSelectorRef, () => {
    setProductsSelector(false);
  });

  useEffect(() => {
    setLoading(true);
    Api.getClientOrders()
      .then((res) => {
        setClientOrders(res.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedOrder) {
      const allProducts = [...clientCarts];
      const filteredClientProducts = allProducts.filter(
        (product) => product.client === client
      );
      const updatedProds = [];
      filteredClientProducts.forEach((prod, index) => {
        const getPrint = Api.getMiniPrint(prod.print_id).then((print) => {
          if (print && print.image) {
            filteredClientProducts[index].print_image_url = print.image;
          }
        });
        updatedProds.push(getPrint);
      });
      axios.all(updatedProds).then(() => {
        setClientProducts(filteredClientProducts);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, clientCarts, selectedOrder]);

  const getProductionProducts = useMemo(() => {
    const filtered = clientProducts.filter(
      (product) => product.type === 'PRODUCAO'
    );

    return filtered;
  }, [clientProducts]);

  const getReserveProducts = useMemo(() => {
    const filtered = clientProducts.filter(
      (product) => product.type === 'RESERVA'
    );

    return filtered;
  }, [clientProducts]);

  const getHangerProducts = useMemo(() => {
    const filtered = clientProducts.filter(
      (product) => product.type === 'HANGER'
    );

    return filtered;
  }, [clientProducts]);

  const getStrikeProducts = useMemo(() => {
    const filtered = clientProducts.filter(
      (product) => product.type === 'PILOTO'
    );

    return filtered;
  }, [clientProducts]);

  const getNoClassifiedProducts = useMemo(() => {
    const filtered = clientProducts.filter((product) => !product.type);

    return filtered;
  }, [clientProducts]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCheckedProducts = useCallback(() => {
    const checkedList = [];

    productionProductsCheckboxes.forEach((val, index) => {
      if (val) {
        checkedList.push(getProductionProducts[index]);
      }
    });

    hangerProductsCheckboxes.forEach((val, index) => {
      if (val) {
        checkedList.push(getHangerProducts[index]);
      }
    });

    strikeProductsCheckboxes.forEach((val, index) => {
      if (val) {
        checkedList.push(getStrikeProducts[index]);
      }
    });

    reserveProductsCheckboxes.forEach((val, index) => {
      if (val) {
        checkedList.push(getReserveProducts[index]);
      }
    });

    noClassifiedProductsCheckboxes.forEach((val, index) => {
      if (val) {
        checkedList.push(getNoClassifiedProducts[index]);
      }
    });
    return checkedList;
  });

  const clearCheckboxes = () => {
    let checks = [...noClassifiedProductsCheckboxes];
    getNoClassifiedProducts.forEach((check, index) => {
      checks[index] = false;
    });
    setNoClassifiedProductsCheckboxes(checks);

    checks = [...productionProductsCheckboxes];
    getProductionProducts.forEach((check, index) => {
      checks[index] = false;
    });
    setProductionProductsCheckboxes(checks);

    checks = [...reserveProductsCheckboxes];
    getReserveProducts.forEach((check, index) => {
      checks[index] = false;
    });
    setReserveProductsCheckboxes(checks);

    checks = [...hangerProductsCheckboxes];
    getHangerProducts.forEach((check, index) => {
      checks[index] = false;
    });
    setHangerProductsCheckboxes(checks);

    checks = [...strikeProductsCheckboxes];
    getStrikeProducts.forEach((check, index) => {
      checks[index] = false;
    });
    setStrikeProductsCheckboxes(checks);
  };

  useEffect(() => {
    const clearCheck = () => {
      let checks = [...noClassifiedProductsCheckboxes];
      getNoClassifiedProducts.forEach((check, index) => {
        checks[index] = false;
      });
      setNoClassifiedProductsCheckboxes(checks);

      checks = [...productionProductsCheckboxes];
      getProductionProducts.forEach((check, index) => {
        checks[index] = false;
      });
      setProductionProductsCheckboxes(checks);

      checks = [...reserveProductsCheckboxes];
      getReserveProducts.forEach((check, index) => {
        checks[index] = false;
      });
      setReserveProductsCheckboxes(checks);

      checks = [...hangerProductsCheckboxes];
      getHangerProducts.forEach((check, index) => {
        checks[index] = false;
      });
      setHangerProductsCheckboxes(checks);

      checks = [...strikeProductsCheckboxes];
      getStrikeProducts.forEach((check, index) => {
        checks[index] = false;
      });
      setStrikeProductsCheckboxes(checks);
    };
    if (selectedProductionType) {
      let checked = getCheckedProducts();
      checked = checked.map((product) => ({
        ...product,
        type: selectedProductionType.value,
      }));

      const allProducts = [...clientProducts];
      allProducts.forEach((prod, i) => {
        checked.forEach((ch) => {
          if (prod.product_id === ch.product_id) {
            allProducts[i] = { ...ch };
            dispatch(updateProductOnClientCart(allProducts[i], client));
          }
        });
      });
      setClientProducts(allProducts);
      setSelectedProductionType();
      setProductsSelector(false);
      clearCheck();
    }
  }, [
    clientProducts,
    dispatch,
    getCheckedProducts,
    client,
    selectedProductionType,
    noClassifiedProductsCheckboxes,
    getNoClassifiedProducts,
    productionProductsCheckboxes,
    getProductionProducts,
    reserveProductsCheckboxes,
    getReserveProducts,
    hangerProductsCheckboxes,
    getHangerProducts,
    strikeProductsCheckboxes,
    getStrikeProducts,
  ]);

  const modifyMeters = (value) => {
    setMeters(value);
    let checked = getCheckedProducts();
    checked = checked.map((product) => ({
      ...product,
      meters: value,
    }));

    const allProducts = [...clientProducts];
    allProducts.forEach((prod, i) => {
      checked.forEach((ch) => {
        if (prod.product_id === ch.product_id) {
          allProducts[i] = { ...ch };
        }
      });
    });
    setClientProducts(allProducts);
    setSelectedProductionType();
    setProductsSelector(false);
  };

  const modifyRepetitionSimple = (repetitionValue, simpleValue) => {
    setRepetition(repetitionValue);
    setSimple(simpleValue);

    let category = '';
    if (repetitionValue && simpleValue) {
      category = 'BOT';
    } else if (repetitionValue) {
      category = 'REP';
    } else if (simpleValue) {
      category = 'SIM';
    }

    let checked = getCheckedProducts();
    checked = checked.map((product) => ({
      ...product,
      category,
    }));

    const allProducts = [...clientProducts];
    allProducts.forEach((prod, i) => {
      checked.forEach((ch) => {
        if (prod.product_id === ch.product_id) {
          allProducts[i] = { ...ch };
        }
      });
    });
    setClientProducts(allProducts);
    setSelectedProductionType();
    setProductsSelector(false);
  };

  const finishModifyingMeters = () => {
    const checked = getCheckedProducts();
    checked.forEach((prod) => {
      dispatch(updateProductOnClientCart(prod, client));
    });
    clearCheckboxes();
  };

  const deleteProducts = () => {
    const selectedProducts = getCheckedProducts();
    let updatedProducts = [...clientProducts];
    selectedProducts.forEach((product) => {
      if (product) {
        updatedProducts = updatedProducts.filter(
          (p) => p.product_id !== product.product_id
        );
        dispatch(removeProductOnClientCart(product.product_id, product.client));
      }
    });
    clearCheckboxes();
    setClientProducts(updatedProducts);
  };

  useEffect(() => {
    let checks = [...noClassifiedProductsCheckboxes];
    getNoClassifiedProducts.forEach((check, index) => {
      checks[index] = selectAll;
    });
    setNoClassifiedProductsCheckboxes(checks);

    checks = [...productionProductsCheckboxes];
    getProductionProducts.forEach((check, index) => {
      checks[index] = selectAll;
    });
    setProductionProductsCheckboxes(checks);

    checks = [...reserveProductsCheckboxes];
    getReserveProducts.forEach((check, index) => {
      checks[index] = selectAll;
    });
    setReserveProductsCheckboxes(checks);

    checks = [...hangerProductsCheckboxes];
    getHangerProducts.forEach((check, index) => {
      checks[index] = selectAll;
    });
    setHangerProductsCheckboxes(checks);

    checks = [...strikeProductsCheckboxes];
    getStrikeProducts.forEach((check, index) => {
      checks[index] = selectAll;
    });
    setStrikeProductsCheckboxes(checks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAll]);

  useEffect(() => {
    if (selectedOrder) {
      setLoading(true);
      Api.getClientOrder(selectedOrder)
        .then((res) => {
          const updatedOrders = [...clientOrders];
          const orderIndex = updatedOrders.findIndex(
            (order) => order.id === selectedOrder
          );
          updatedOrders[orderIndex] = { ...res };

          const productOrderSet = [...res.productorder_set];

          setClientProducts([...productOrderSet]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clientOrders, selectedOrder]);

  const createOrder = (status) => {
    const updatedProducts = [...getCheckedProducts()];

    if (updatedProducts.length) {
      const updateProductsRequests = [];

      let allRequiredFields = true;

      updatedProducts.forEach((product) => {
        if (product.type === 'PRODUCAO') {
          if (!product.meters) {
            toast(translate('setProductionMeters', language), {
              type: 'warning',
            });
            allRequiredFields = false;
          }
          if (!product.fabric_id) {
            toast(translate('setProductionFabric', language), {
              type: 'warning',
            });
            allRequiredFields = false;
          }
        }
        if (product.type === 'PILOTO') {
          if (!product.meters) {
            toast(translate('setStrikeMeters', language), {
              type: 'warning',
            });
            allRequiredFields = false;
          }
          if (!product.fabric_id) {
            toast(translate('setStrikeFabric', language), {
              type: 'warning',
            });
            allRequiredFields = false;
          }
        }
      });

      if (allRequiredFields) {
        setLoading(true);
        updatedProducts.forEach((cp, index) => {
          const formData = new FormData();
          formData.append('fabric', cp.fabric_id);
          formData.append('print', cp.print_id);
          const update = Api.createProduct(formData)
            .then((res) => {
              updatedProducts[index] = {
                ...updatedProducts[index],
                product_id: res.id,
              };
            })
            .catch(() => {
              setLoading(false);
            });
          updateProductsRequests.push(update);
        });
        axios.all(updateProductsRequests).then(() => {
          Api.createOrder({
            client: clientId,
            customer_meeting: clientProducts[0].presentation,
            seller: clientProducts[0].seller,
            status,
          })
            .then((res) => {
              const orderId = res.id;
              const orders = [];

              updatedProducts.forEach((product) => {
                if (product.type) {
                  const order = Api.createProductOrder({
                    type: product.type,
                    meters: product.meters || 0,
                    order: orderId,
                    product: product.product_id,
                  }).catch(() => {
                    setLoading(false);
                  });
                  orders.push(order);
                }
              });
              if (orders.length) {
                axios
                  .all(orders)
                  .then(() => {
                    toast(translate('createdOrdersSuccess', language), {
                      type: 'success',
                    });
                    Api.sendOrderEmail(orderId);
                    if (status === 'OPEN') {
                      setPurchaseSuccess(true);
                    }
                    dispatch(clearClientCart(clientProducts[0].client));
                  })
                  .catch(() => {
                    toast(translate('failCreatingOrders', language), {
                      type: 'error',
                    });
                    setLoading(false);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              } else {
                toast(translate('selectProductionType', language), {
                  type: 'error',
                });
                setLoading(false);
              }
            })
            .catch(() => {
              setLoading(false);
            });
        });
      }
    }
  };

  const applyFabric = (fabric) => {
    const updatedProducts = [...clientProducts];
    const productIndex = updatedProducts.findIndex(
      (prod) => prod.product_id === editingProduct
    );

    updatedProducts[productIndex] = {
      ...updatedProducts[productIndex],
      fabric_id: fabric.id,
      fabric_name: fabric.name,
    };

    dispatch(updateProductOnClientCart(updatedProducts[productIndex], client));

    setClientProducts(updatedProducts);
    setFabricsModal(false);
    setEditingProduct();
  };

  const defineFabric = (productId, initialFabrics) => {
    setEditingProduct(productId);
    if (initialFabrics && initialFabrics.length) {
      const filtered = [];
      initialFabrics.forEach((f) => {
        const fab = fabrics.find((item) => item.id === f.id);
        if (fab) {
          filtered.push(fab);
        }
      });
      setFabricOptions([...filtered]);
    } else {
      setFabricOptions([...fabrics]);
    }

    setFabricsModal(true);
  };

  const returnToPresentation = () => {
    close();
  };

  const finishEditingMeters = () => {
    const updatedProducts = [...clientProducts];

    let productIndex;
    if (!selectedOrder) {
      productIndex = updatedProducts.findIndex(
        (prod) => prod.product_id === editingProduct
      );
    } else {
      productIndex = updatedProducts.findIndex(
        (prod) => prod.product === editingProduct
      );
    }
    updatedProducts[productIndex] = {
      ...updatedProducts[productIndex],
      meters: currentMeters,
    };
    if (!selectedOrder) {
      dispatch(
        updateProductOnClientCart(updatedProducts[productIndex], client)
      );
    }
    setClientProducts(updatedProducts);
    setEditingProduct();
    setCurrentMeters();
    setEditingSingleMeters(false);
  };

  const renderMetersArea = (product) => (
    <div className={styles.metersArea}>
      {!editingSingleMeters && (
        <button
          type="button"
          onClick={() => {
            if (product.product_id) {
              setEditingProduct(product.product_id);
            } else {
              setEditingProduct(product.product);
            }
            setEditingSingleMeters(true);
            setCurrentMeters(product.meters);
          }}
        >
          <span>{product.meters ? `${product.meters}m` : '0m'}</span>
        </button>
      )}
      {((product.product_id && editingProduct === product.product_id) ||
        editingProduct === product.product) &&
        editingSingleMeters && (
          <div className={styles.singleMetersInput}>
            <div>
              <input
                type="number"
                className={styles.meters}
                value={currentMeters}
                onChange={(e) => setCurrentMeters(e.currentTarget.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' ? finishEditingMeters : false
                }
              />
              <span>{translate('meters', language)} </span>
            </div>
            <button type="button" onClick={finishEditingMeters}>
              {translate('save', language)}
            </button>
          </div>
        )}
    </div>
  );

  const clearCart = () => {
    clientProducts.forEach((product) => {
      dispatch(removeProductOnClientCart(product.product_id, product.client));
    });
    clearCheckboxes();
    setClientProducts([]);
  };

  const getClientOrders = useMemo(() => {
    return (
      <>
        {selectedOrder && (
          <li>
            <button
              type="button"
              onClick={() => setSelectedOrder()}
              className={styles.draft}
            >
              {translate('draft', language)}
            </button>
          </li>
        )}

        {clientOrders.map((order) => (
          <li
            key={order.id}
            className={selectedOrder === order.id ? styles.hide : ''}
          >
            <button type="button" onClick={() => setSelectedOrder(order.id)}>
              {language === 'en'
                ? moment(order.date).format('MM/DD/YYYY')
                : moment(order.date).format('DD/MM/YYYY')}{' '}
              - {translate(order.status, language)}
            </button>
          </li>
        ))}
      </>
    );
  }, [clientOrders, language, selectedOrder]);

  const getTotalsItems = () => {
    return (getProductionProducts.length + getHangerProducts.length + getStrikeProducts.length + getNoClassifiedProducts.length)
  }

  const filteredFabrics = useMemo(() => {
    if (fabricQuery) {
      return fabricOptions.filter((f) => {
        let t = '';

        if (language === 'en') {
          if (f && f.description_en && f.description_en.length) {
            t = `${t} ${f.description_en}`;
          }

          if (f && f.mixture_en && f.mixture_en.length) {
            t = `${t} ${f.mixture_en}`;
          }

          if (f && f.name_en && f.name_en.length) {
            t = `${t} ${f.name_en}`;
          }

          if (f && f.small_description_en && f.small_description_en.length) {
            t = `${t} ${f.small_description_en}`;
          }
        } else {
          if (f && f.description && f.description.length) {
            t = `${t} ${f.description}`;
          }

          if (f && f.mixture && f.mixture.length) {
            t = `${t} ${f.mixture}`;
          }

          if (f && f.name && f.name.length) {
            t = `${t} ${f.name}`;
          }

          if (f && f.small_description && f.small_description.length) {
            t = `${t} ${f.small_description}`;
          }
        }

        if (f.grammage) {
          t = `${t} ${f.grammage}`;
        }

        if (f.throughput) {
          t = `${t} ${f.throughput}`;
        }

        if (f.width) {
          t = `${t} ${f.width}`;
        }

        if (t.trim().toLowerCase().includes(fabricQuery.toLowerCase())) {
          return f;
        }

        return null;
      });
    }

    return fabricOptions;
  }, [fabricOptions, fabricQuery, language]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={logoMatch} alt="blend." className={styles.logo} />
        <button type="button" className={styles.close} onClick={close}>
          <CloseIcon />
        </button>
      </div>
      <div className={styles.draftText}>
        {selectedOrder ? (
          <>
            {clientOrders.find((co) => co.id === selectedOrder) ? (
              <>
                {translate(
                  clientOrders.find((co) => co.id === selectedOrder).status,
                  language
                )}{' '}
                -{' '}
                {language === 'en'
                  ? moment(
                      clientOrders.find((co) => co.id === selectedOrder).date
                    ).format('MM/DD/YYYY')
                  : moment(
                      clientOrders.find((co) => co.id === selectedOrder).date
                    ).format('DD/MM/YYYY')}
              </>
            ) : (
              ''
            )}{' '}
          </>
        ) : (
          <>
            {translate('OPEN', language)}{' '}
            <span>({translate('draft', language)})</span>
          </>
        )}
      </div>
      {!selectedOrder && (
        <>
          <div className={styles.deleteContainer}>
            <CheckInput
              id="selecteAll"
              onChange={setSelectAll}
              value={selectAll}
            />
            <span className={styles.separator} />
            <button
              className={styles.deleteProducts}
              type="button"
              onClick={deleteProducts}
            >
              <TrashCanIcon color="#202730" />
            </button>
            <span className={styles.separator} />

            <div className={styles.productModifiers}>
              <div
                className={styles.productionSelectorContainer}
                ref={productsSelectorRef}
              >
                <button
                  id=""
                  type="button"
                  className={`${styles.defaultSelectInput} ${styles.production}`}
                  onClick={() => setProductsSelector(true)}
                >
                  {selectedProduct
                    ? selectedProduct.name
                    : translate('typeOfProduction', language)}
                </button>
                {productsSelector && (
                  <span>
                    <ListSelector
                      selectLabel={translate('choose', language)}
                      items={productionTypeOptions}
                      onSelect={setSelectedProductionType}
                      value={selectedProductionType}
                    />
                  </span>
                )}
              </div>
              <div className={styles.metersInputContainer}>
                <input
                  type="number"
                  className={styles.meters}
                  value={meters}
                  onChange={(e) => modifyMeters(e.currentTarget.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' ? finishModifyingMeters() : false
                  }
                  onBlur={finishModifyingMeters}
                />
                <span>{translate('meters', language)}</span>
              </div>
              <div className={styles.checks}>
                <CheckInput
                  id="repetition"
                  onChange={(val) => modifyRepetitionSimple(val, simple)}
                  value={repetition}
                  text={translate('repetition', language)}
                />
                <CheckInput
                  id="simple"
                  onChange={(val) => modifyRepetitionSimple(repetition, val)}
                  value={simple}
                  text={translate('simple', language)}
                />
              </div>
            </div>
          </div>
        </>
      )}
      {getNoClassifiedProducts.length > 0 && (
        <div className={styles.products}>
          <ul className={styles.productsList}>
            {getNoClassifiedProducts.map((product, index) => (
              <li className={styles.product}>
                {!selectedOrder && (
                  <div className={styles.productCheck}>
                    <CheckInput
                      id={`noClassified${index}`}
                      value={noClassifiedProductsCheckboxes[index]}
                      onChange={(val) => {
                        const checkboxes = [...noClassifiedProductsCheckboxes];
                        checkboxes[index] = val;
                        setNoClassifiedProductsCheckboxes(checkboxes);
                      }}
                    />
                  </div>
                )}
                <div
                  className={styles.imageContainer}
                  style={{
                    backgroundColor: product.pantone_color
                      ? product.pantone_color
                      : '#808d9e',
                  }}
                >
                  {product.print_image_url && (
                    <img src={product.print_image_url} alt="print" />
                  )}
                </div>
                <div className={styles.info}>
                  <div className={styles.code}>{product.print_code}</div>
                  {product.color_variant && (
                    <div>
                      {translate('colorVariant', language)}:{' '}
                      {product.color_variant}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {getProductionProducts.length > 0 && (
        <>
          <div className={styles.section}>
            No. {translate('production', language)}: {getProductionProducts.length}
          </div>
          <div className={styles.products}>
            <ul className={styles.productsList}>
              {getProductionProducts.map((product, index) => (
                <li className={styles.product}>
                  {!selectedOrder && (
                    <div className={styles.productCheck}>
                      <CheckInput
                        id={`production${index}`}
                        value={productionProductsCheckboxes[index]}
                        onChange={(val) => {
                          const checkboxes = [...productionProductsCheckboxes];
                          checkboxes[index] = val;
                          setProductionProductsCheckboxes(checkboxes);
                        }}
                      />
                    </div>
                  )}
                  <div
                    className={styles.imageContainer}
                    style={{
                      backgroundColor: product.pantone_color
                        ? product.pantone_color
                        : '#808d9e',
                    }}
                  >
                    {product.print_image_url && (
                      <img src={product.print_image_url} alt="print" />
                    )}
                  </div>
                  <div className={styles.info}>
                    <div className={styles.code}>{product.print_code}</div>
                    {product.color_variant && (
                      <div>
                        {translate('colorVariant', language)}:{' '}
                        {product.color_variant}
                      </div>
                    )}
                    <div>
                      {product.fabric_name && !selectedOrder ? (
                        <button
                          className={styles.defineFabric}
                          type="button"
                          onClick={() =>
                            defineFabric(
                              product.product_id,
                              product.initialFabrics
                            )
                          }
                        >
                          {translate('fabric', language)} {product.fabric_name}
                        </button>
                      ) : (
                        <>
                          {translate('fabric', language)} {product.fabric_name}
                        </>
                      )}
                      {!product.fabric_id && !selectedOrder && (
                        <button
                          className={styles.defineFabric}
                          type="button"
                          onClick={() =>
                            defineFabric(
                              product.product_id,
                              product.initialFabrics
                            )
                          }
                        >
                          {translate('defineFabric', language)}
                        </button>
                      )}
                      {product.fabric_name && product.meters ? ' - ' : ''}
                      {renderMetersArea(product)}

                      {(product.fabric_name || product.meters) &&
                      product.category
                        ? ' - '
                        : ''}
                      {product.category === 'SIM' &&
                        translate('simple', language)}
                      {product.category === 'REP' &&
                        translate('repetition', language)}
                      {product.category === 'BOT' &&
                        translate('simpleRepetition', language)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {getStrikeProducts.length > 0 && (
        <>
          <div className={styles.section}>No. {translate('strike', language)}: {getStrikeProducts.length}</div>
          <div className={styles.products}>
            <ul className={styles.productsList}>
              {getStrikeProducts.map((product, index) => (
                <li className={styles.product}>
                  {!selectedOrder && (
                    <div className={styles.productCheck}>
                      <CheckInput
                        id={`strike${index}`}
                        value={strikeProductsCheckboxes[index]}
                        onChange={(val) => {
                          const checkboxes = [...strikeProductsCheckboxes];
                          checkboxes[index] = val;
                          setStrikeProductsCheckboxes(checkboxes);
                        }}
                      />
                    </div>
                  )}

                  <div
                    className={styles.imageContainer}
                    style={{
                      backgroundColor: product.pantone_color
                        ? product.pantone_color
                        : '#808d9e',
                    }}
                  >
                    {product.print_image_url && (
                      <img src={product.print_image_url} alt="print" />
                    )}
                  </div>
                  <div className={styles.info}>
                    <div className={styles.code}>{product.print_code}</div>
                    {product.color_variant && (
                      <div>
                        {translate('colorVariant', language)}:{' '}
                        {product.color_variant}
                      </div>
                    )}
                    <div>
                      {product.fabric_name && !selectedOrder ? (
                        <button
                          className={styles.defineFabric}
                          type="button"
                          onClick={() =>
                            defineFabric(
                              product.product_id,
                              product.initialFabrics
                            )
                          }
                        >
                          {translate('fabric', language)} {product.fabric_name}
                        </button>
                      ) : (
                        <>
                          {translate('fabric', language)} {product.fabric_name}
                        </>
                      )}
                      {!product.fabric_id && !selectedOrder && (
                        <button
                          className={styles.defineFabric}
                          type="button"
                          onClick={() =>
                            defineFabric(
                              product.product_id,
                              product.initialFabrics
                            )
                          }
                        >
                          {translate('defineFabric', language)}
                        </button>
                      )}
                      {product.fabric_name && product.meters ? ' - ' : ''}
                      {renderMetersArea(product)}
                      {(product.fabric_name || product.meters) &&
                      product.category
                        ? ' - '
                        : ''}
                      {product.category === 'SIM' &&
                        translate('simple', language)}
                      {product.category === 'REP' &&
                        translate('repetition', language)}
                      {product.category === 'BOT' &&
                        translate('simpleRepetition', language)}
                    </div>
                    <div>{product.idCode ? `ID ${product.idCode}` : ''}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {getReserveProducts.length > 0 && (
        <>
          <div className={styles.section}>No. {translate('reserve', language)}: {getReserveProducts.length}</div>
          <div className={styles.products}>
            <ul className={styles.productsList}>
              {getReserveProducts.map((product, index) => (
                <li className={styles.product}>
                  {!selectedOrder && (
                    <div className={styles.productCheck}>
                      <CheckInput
                        id={`reserve${index}`}
                        value={reserveProductsCheckboxes[index]}
                        onChange={(val) => {
                          const checkboxes = [...reserveProductsCheckboxes];
                          checkboxes[index] = val;
                          setReserveProductsCheckboxes(checkboxes);
                        }}
                      />
                    </div>
                  )}

                  <div
                    className={styles.imageContainer}
                    style={{
                      backgroundColor: product.pantone_color
                        ? product.pantone_color
                        : '#808d9e',
                    }}
                  >
                    {product.print_image_url && (
                      <img src={product.print_image_url} alt="print" />
                    )}
                  </div>
                  <div className={styles.info}>
                    <div className={styles.code}>{product.print_code}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {getHangerProducts.length > 0 && (
        <>
          <div className={styles.section}>No. {translate('hanger', language)}: {getHangerProducts.length}</div>
          <div className={styles.products}>
            <ul className={styles.productsList}>
              {getHangerProducts.map((product, index) => (
                <li className={styles.product}>
                  {!selectedOrder && (
                    <div className={styles.productCheck}>
                      <CheckInput
                        id={`hanger${index}`}
                        value={hangerProductsCheckboxes[index]}
                        onChange={(val) => {
                          const checkboxes = [...hangerProductsCheckboxes];
                          checkboxes[index] = val;
                          setHangerProductsCheckboxes(checkboxes);
                        }}
                      />
                    </div>
                  )}
                  <div
                    className={styles.imageContainer}
                    style={{
                      backgroundColor: product.pantone_color
                        ? product.pantone_color
                        : '#808d9e',
                    }}
                  >
                    {product.print_image_url && (
                      <img src={product.print_image_url} alt="print" />
                    )}
                  </div>
                  <div className={styles.info}>
                    <div className={styles.code}>{product.print_code}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {clientProducts.length > 0 && (
        <>
          <div className={styles.actionsContainer}>
            {!selectedOrder ? (
              <button
                type="button"
                className={styles.defaultRoundedDeleteButton}
                onClick={clearCart}
              >
                {translate('cancel', language)}
              </button>
            ) : (
              <div />
            )}
            {!selectedOrder && (
              <button
                className={styles.defaultRoundedActionButton}
                type="button"
                onClick={() => createOrder('OPEN')}
              >
                {translate('effectuate', language)}*
              </button>
            )}
            <strong>No. Total Items: {getTotalsItems()}</strong>
          </div>
          {!selectedOrder && (
            <div className={styles.selectPrintsWarning}>
              {translate('selectPrintsToContinue', language)}*
            </div>
          )}
        </>
      )}
      {clientOrders.length > 0 && (
        <ul className={styles.clientOrders}>{getClientOrders}</ul>
      )}
      {clientOrders.length === 0 && (
        <div className={styles.selectClientWarning}>
          {translate('emptyClientSummary', language)}
        </div>
      )}

      {fabricsModal && (
        <>
          <div className={styles.fabricsModalContainer}>
            <div className={styles.modal}>
              <h1>{translate('chooseAFabric', language)}</h1>
              <button
                type="button"
                className={styles.close}
                onClick={() => setFabricsModal(false)}
              >
                <CloseIcon />
              </button>
              <input
                type="search"
                placeholder="Search"
                value={fabricQuery}
                onChange={(e) => setFabricQuery(e.currentTarget.value)}
              />
              <ul className={styles.fabricsList}>
                {filteredFabrics.map((fab) => (
                  <li>
                    <button type="button" onClick={() => applyFabric(fab)}>
                      <img src={fab.image} alt={fab.name} />
                      <div className={styles.fabricInfoContainer}>
                        <div className={styles.fabricName}>{fab.name}</div>
                        <div className={styles.fabricInfo}>
                          <div className={styles.item}>
                            <span>{translate('grammage', language)}</span>:{' '}
                            {fab.grammage} g/m<sup>2</sup>
                          </div>
                          <div className={styles.item}>
                            <span>{translate('width', language)}</span>:{' '}
                            {fab.width} cm
                          </div>
                          <div className={styles.item}>
                            <span>{translate('composition', language)}</span>:{' '}
                            {fab.mixture}
                          </div>
                          <div className={styles.item}>
                            <span>{translate('yield', language)}</span>:{' '}
                            {fab.throughput} M/KG
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {loading && (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      )}
      {purchaseSuccess && (
        <button
          type="button"
          className={styles.purchaseSuccess}
          onClick={returnToPresentation}
        >
          <h1>{translate('processedOrder', language)} :)</h1>
          <p>{translate('goBackToPresentation', language)}.</p>
        </button>
      )}
    </div>
  );
}

export default Cart;

Cart.propTypes = {
  close: PropTypes.func.isRequired,
};
