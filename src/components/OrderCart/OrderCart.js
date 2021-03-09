/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

import translate from '../../libs/i18n';
import Api from '../../libs/Api';
import {
  addProductsOnClientCart,
  updateProductOnClientCart,
} from '../../store/actions/clientCart';

import styles from './OrderCart.module.scss';

import CloseIcon from '../../assets/icons/Close';
import ArrowIcon from '../../assets/icons/Arrow';
import Loading from '../Loading/Loading';

function SellerCart({ close, currentOrder, orderPage }) {
  const language = useSelector((state) => state.settings.language);
  const clientCarts = useSelector((state) => state.carts);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [fabrics, setFabrics] = useState([]);

  const [clientOrders, setClientOrders] = useState([]);
  const [selectedClient, setSelectedClient] = useState();

  const [selectedOrderId, setSelectedOrderId] = useState();

  const [selectedCurrency, setSelectedCurrency] = useState();

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

  const [selectedProductionType, setSelectedProductionType] = useState();
  const [clientProducts, setClientProducts] = useState([]);

  const [fabricsModal, setFabricsModal] = useState(false);
  const [fabricQuery, setFabricQuery] = useState();
  const [fabricOptions, setFabricOptions] = useState([]);

  const [editingProduct, setEditingProduct] = useState();

  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [discount, setDiscount] = useState();

  useEffect(() => {
    setSelectedOrderId(currentOrder.id);

    setSelectedClient(user);

    Api.getClientOrder(currentOrder.id)
      .then((ord) => {
        setClientOrders([ord]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentOrder, selectedOrderId, user]);

  useEffect(() => {
    const getFabrics = Api.getFabrics().then((res) => {
      setFabrics(res.results);
    });
    const getRegion = Api.getRegion().then((res) => {
      setRegions(res);
    });
    const getCountries = Api.getCountries().then((res) => {
      setCountries(res);
    });
    axios.all([getFabrics, getRegion, getCountries]).finally(() => {
      setLoading(false);
    });
  }, []);

  const order = useMemo(() => {
    if (clientOrders.length && selectedOrderId) {
      return clientOrders.find((co) => co.id === selectedOrderId);
    }
    return null;
  }, [clientOrders, selectedOrderId]);

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
            dispatch(updateProductOnClientCart(allProducts[i], selectedClient));
          }
        });
      });
      setClientProducts(allProducts);
      setSelectedProductionType();
      clearCheckboxes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clientProducts,
    dispatch,
    getCheckedProducts,
    selectedClient,
    selectedProductionType,
  ]);

  const getExclusivityVarValue = (value) => {
    switch (value) {
      case 'COR':
        return translate('color', language);
      case 'DES':
        return translate('drawing', language);
      default:
        return '';
    }
  };

  useEffect(() => {
    const getExclusivityName = (value) => {
      switch (value) {
        case 'INF':
          return translate('eternal', language);

        case 'MON':
          return translate('worldwide', language);

        case 'CON':
          return translate('continental', language);

        case 'NAT':
          return translate('national', language);

        case 'REG':
          return translate('regional', language);

        case 'MKT':
          return translate('laEstampaMarketing', language);

        default:
          return '';
      }
    };

    const getExclusivityInt = (value) => {
      const int = countries.find((c) => c.id === value);
      if (int) {
        return int.name;
      }
      return value;
    };

    const getExclusivityCont = (value) => {
      switch (value) {
        case 'AF':
          return translate('africa', language);
        case 'AM':
          return translate('america', language);
        case 'AN':
          return translate('antarctica', language);
        case 'EU':
          return translate('europe', language);
        case 'AS':
          return translate('asia', language);
        case 'OC':
          return translate('oceania', language);
        default:
          return '';
      }
    };

    const getExclusivityReg = (value) => {
      const reg = regions.find((r) => r.id === value);
      if (reg) {
        return reg.name;
      }
      return value;
    };
    if (selectedOrderId) {
      setLoading(true);
      Api.getClientOrder(selectedOrderId)
        .then((res) => {
          const updatedOrders = [...clientOrders];
          const orderIndex = updatedOrders.findIndex(
            (o) => o.id === selectedOrderId
          );
          updatedOrders[orderIndex] = { ...res };

          const productOrderSet = [...res.productorder_set];

          if (res.discount) {
            setDiscount(parseFloat(res.discount));
          }

          const getExRequest = [];
          productOrderSet.forEach((po, index) => {
            if (po.print_id) {
              const exRequest = Api.getExclusivity(po.print_id).then((r) => {
                productOrderSet[index].print_exclusivity = [];
                productOrderSet[index].print_exclusivity_int = [];
                productOrderSet[index].print_exclusivity_cont = [];
                productOrderSet[index].print_exclusivity_reg = [];
                r.results.forEach((ex) => {
                  if (ex.exclusivity) {
                    productOrderSet[index].print_exclusivity.push({
                      value: ex.exclusivity,
                      name: getExclusivityName(ex.exclusivity),
                    });
                  }
                  if (ex.exclusivity_var) {
                    productOrderSet[index].print_exclusivity_var =
                      ex.exclusivity_var;
                  }
                  ex.exclusivity_int.forEach((int) => {
                    productOrderSet[index].print_exclusivity_int.push({
                      value: int,
                      name: getExclusivityInt(int),
                    });
                  });
                  ex.exclusivity_cont.forEach((cont) => {
                    productOrderSet[index].print_exclusivity_cont.push({
                      value: cont,
                      name: getExclusivityCont(cont),
                    });
                  });
                  ex.exclusivity_reg.forEach((reg) => {
                    productOrderSet[index].print_exclusivity_int.push({
                      value: reg,
                      name: getExclusivityReg(reg),
                    });
                  });
                });
              });
              getExRequest.push(exRequest);
            }
          });
          axios.all(getExRequest).then(() => {
            setClientProducts([...productOrderSet]);
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clientOrders, countries, language, regions, selectedOrderId]);

  useEffect(() => {
    if (!selectedOrderId && selectedClient) {
      const allProducts = [...clientCarts];
      const filteredClientProducts = allProducts.filter(
        (product) => product.client === selectedClient.id
      );
      const updatedProds = [];
      filteredClientProducts.forEach((prod, index) => {
        const getPrint = Api.getMiniPrint(prod.print_id).then((print) => {
          if (print && print.image_url) {
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
  }, [selectedClient, clientCarts, selectedOrderId]);

  const getSectionTotal = (products) => {
    let total = 0;
    products.forEach((prod) => {
      if (prod.price_per_meter && prod.meters) {
        total += parseFloat(
          prod.type === 'HANGER'
            ? prod.price_per_meter
            : prod.price_per_meter * prod.meters
        );
      }
    });
    return total.toFixed(2);
  };

  const getSubtotal = () => {
    const productionTotal = parseFloat(getSectionTotal(getProductionProducts));
    const strikeTotal = parseFloat(getSectionTotal(getStrikeProducts));
    const hangerTotal = parseFloat(getSectionTotal(getHangerProducts));

    const total = productionTotal + strikeTotal + hangerTotal;

    return total;
  };

  const getDiscountedSubtotal = () => {
    const productionTotal = parseFloat(getSectionTotal(getProductionProducts));
    const strikeTotal = parseFloat(getSectionTotal(getStrikeProducts));
    const hangerTotal = parseFloat(getSectionTotal(getHangerProducts));

    const total =
      productionTotal + strikeTotal + hangerTotal - parseFloat(discount || 0);

    return total;
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

    dispatch(
      updateProductOnClientCart(updatedProducts[productIndex], selectedClient)
    );

    setClientProducts(updatedProducts);
    setFabricsModal(false);
    setEditingProduct();
  };

  const getCurrencySymbol = useMemo(() => {
    if (selectedCurrency) {
      switch (selectedCurrency.value) {
        case 'brl':
          return 'R$';
        case 'usd':
          return '$';
        case 'eur':
          return '€';
        default:
          return '';
      }
    }
    return '';
  }, [selectedCurrency]);

  const formatedPrice = (value) => {
    if (selectedCurrency) {
      if (selectedCurrency) {
        switch (selectedCurrency.value) {
          case 'brl':
            return value.replace('.', ',');
          case 'eur':
            return value.replace('.', ',');
          case 'usd':
            return value;
          default:
            return value;
        }
      }
    }
    return value;
  };

  useEffect(() => {
    if (selectedOrderId) {
      if (order) {
        switch (order.currency) {
          case 'brl':
            setSelectedCurrency({
              id: 1,
              name: 'BRL - Real',
              value: 'brl',
            });
            break;
          case 'eur':
            setSelectedCurrency({
              id: 2,
              name: 'EUR - Euro',
              value: 'eur',
            });
            break;
          case 'usd':
            setSelectedCurrency({
              id: 3,
              name: 'USD - Dollar',
              value: 'usd',
            });
            break;
          default:
            break;
        }
      }
    } else {
      setSelectedCurrency({
        id: 1,
        name: 'BRL - Real',
        value: 'brl',
      });
    }
  }, [clientOrders, selectedOrderId, order]);

  const buyAgain = (product) => {
    const newProduct = { ...product, client: selectedClient.id };
    dispatch(addProductsOnClientCart([newProduct]));
    toast(translate('printAddedToCart', language), {
      type: 'success',
    });
  };

  const renderMetersArea = (product) => (
    <div className={styles.metersArea}>
      <span>{product.meters ? `${product.meters}m` : '0m'}</span>
    </div>
  );

  const renderPriceArea = (product) => (
    <div
      className={`${styles.priceArea} ${
        product.type === 'HANGER' && styles.hangerPrice
      }`}
    >
      {parseFloat(product.price_per_meter) !== 0 && (
        <span>
          <div>
            {product.type === 'HANGER'
              ? translate('price', language)
              : translate('pricePerMeter', language)}
          </div>
          <div>
            {product.price_per_meter && product.price_per_meter !== '0.00'
              ? `${getCurrencySymbol}${formatedPrice(
                  parseFloat(product.price_per_meter).toFixed(2)
                )}`
              : ''}
          </div>
        </span>
      )}

      {parseFloat(product.price_per_meter) !== 0 && product.type !== 'HANGER' && (
        <div className={styles.productTotal}>
          {order.status === 'FINA' && product.type !== 'RESERVA' && (
            <button
              className={`${styles.defaultRoundedActionButton} ${styles.buyAgain}`}
              type="button"
              onClick={() => buyAgain(product)}
            >
              {translate('buyAgain', language)}
            </button>
          )}
          <div>{translate('price', language)}:</div>
          <div>
            {product.price_per_meter &&
            product.price_per_meter !== '0.00' &&
            product.meters
              ? `${getCurrencySymbol}${formatedPrice(
                  parseFloat(product.price_per_meter * product.meters).toFixed(
                    2
                  )
                )}`
              : ''}
          </div>
        </div>
      )}
    </div>
  );

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

  const getOrderType = useMemo(() => {
    if (order) {
      switch (order.status) {
        case 'OPEN':
          return translate('approvals', language);
        case 'REP':
          return translate('approvals', language);
        case 'APP':
          return translate('orderInProgress', language);
        case 'PROD':
          return translate('orderInProgress', language);
        case 'DISP':
          return translate('orderInProgress', language);
        case 'FINA':
          return translate('finalized', language);
        default:
          return translate('orders', language);
      }
    }
    return translate('orders', language);
  }, [order, language]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button type="button" className={styles.close} onClick={close}>
          <span>
            <ArrowIcon />
          </span>
          {orderPage ? getOrderType : translate('orders', language)}
        </button>
      </div>
      <div className={styles.orderContent}>
        <div className={styles.draftText}>
          {selectedOrderId && clientOrders.length > 0 && (
            <div>
              Nº {selectedOrderId}-{new Date(order.date).getTime()}
            </div>
          )}
          {selectedClient && (
            <div>
              <span>{translate('client', language)}: </span>{' '}
              {selectedClient.name}
            </div>
          )}
          <div>
            {selectedOrderId ? (
              <>
                {order ? (
                  <>
                    {translate(order.status, language)} -{' '}
                    {language === 'en'
                      ? moment(order.date).format('MM/DD/YYYY')
                      : moment(order.date).format('DD/MM/YYYY')}
                  </>
                ) : (
                  ''
                )}{' '}
              </>
            ) : (
              selectedClient && (
                <>
                  {translate('OPEN', language)}{' '}
                  <span className={styles.draf}>
                    ({translate('draft', language)})
                  </span>
                </>
              )
            )}
          </div>
        </div>

        {getNoClassifiedProducts.length > 0 && (
          <div className={styles.products}>
            <ul className={styles.productsList}>
              {getNoClassifiedProducts.map((product) => (
                <li className={styles.product}>
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
              {translate('production', language)}
            </div>
            <div className={styles.products}>
              <ul className={styles.productsList}>
                {getProductionProducts.map((product) => (
                  <li className={styles.product}>
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
                        {product.fabric_name && !selectedOrderId && (
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
                            {translate('fabric', language)}{' '}
                            {product.fabric_name}
                          </button>
                        )}
                        {product.fabric_name && selectedOrderId && (
                          <>
                            {translate('fabric', language)}{' '}
                            {product.fabric_name}
                          </>
                        )}
                        {!selectedOrderId && !product.fabric_id && (
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
                      <div className={styles.exclusivityInfo}>
                        <div>
                          {getExclusivityVarValue(
                            product.print_exclusivity_var ||
                              product.exclusivity_var
                          )}
                        </div>
                        {product.print_exclusivity &&
                          Array.isArray(product.print_exclusivity) &&
                          product.print_exclusivity.length > 0 && (
                            <div>
                              {translate('exclusivity', language)} :{' '}
                              {product.print_exclusivity.map(
                                (ex) => `${ex.name ? ex.name : ex.value}; `
                              )}
                            </div>
                          )}
                        {product.print_exclusivity_int &&
                          product.print_exclusivity_int.length > 0 && (
                            <div>
                              {product.print_exclusivity_int.map(
                                (ex) => `${ex.name ? ex.name : ex.value}; `
                              )}
                            </div>
                          )}
                        {product.print_exclusivity_reg &&
                          product.print_exclusivity_reg.length > 0 && (
                            <div>
                              {product.print_exclusivity_reg.map(
                                (ex) => `${ex.name ? ex.name : ex.value}; `
                              )}
                            </div>
                          )}
                        {product.print_exclusivity_cont &&
                          product.print_exclusivity_cont.length > 0 && (
                            <div>
                              {product.print_exclusivity_cont.map(
                                (ex) => `${ex.name ? ex.name : ex.value}; `
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                    {renderPriceArea(product)}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {getProductionProducts.length > 0 &&
          getSectionTotal(getProductionProducts) > 0 && (
            <div className={styles.sectionTotals}>
              {translate('productionValue', language)}:{' '}
              <span>{`${getCurrencySymbol}${getSectionTotal(
                getProductionProducts
              )}`}</span>
            </div>
          )}

        {getStrikeProducts.length > 0 && (
          <>
            <div className={styles.section}>
              {translate('strike', language)}
            </div>
            <div className={styles.products}>
              <ul className={styles.productsList}>
                {getStrikeProducts.map((product) => (
                  <li className={styles.product}>
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
                        {product.fabric_name && !selectedOrderId ? (
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
                            {translate('fabric', language)}{' '}
                            {product.fabric_name}
                          </button>
                        ) : (
                          <>
                            {translate('fabric', language)}{' '}
                            {product.fabric_name}
                          </>
                        )}
                        {!product.fabric_id && !selectedOrderId && (
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
                    {renderPriceArea(product)}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {getStrikeProducts.length > 0 &&
          getSectionTotal(getStrikeProducts) > 0 && (
            <div className={styles.sectionTotals}>
              {translate('strikeValue', language)}:{' '}
              <span>{`${getCurrencySymbol}${getSectionTotal(
                getStrikeProducts
              )}`}</span>
            </div>
          )}
        {getReserveProducts.length > 0 && (
          <>
            <div className={styles.section}>
              {translate('reserve', language)}
            </div>
            <div className={styles.products}>
              <ul className={styles.productsList}>
                {getReserveProducts.map((product) => (
                  <li className={styles.product}>
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
                      <div className={styles.exclusivityInfo} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {getHangerProducts.length > 0 && (
          <>
            <div className={styles.section}>
              {translate('hanger', language)}
            </div>
            <div className={styles.products}>
              <ul className={styles.productsList}>
                {getHangerProducts.map((product) => (
                  <li className={styles.product}>
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
                    {renderPriceArea(product)}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {getHangerProducts.length > 0 && getSectionTotal(getHangerProducts) && (
          <div className={styles.sectionTotals}>
            {translate('hangerValue', language)}:{' '}
            <span>{`${getCurrencySymbol}${getSectionTotal(
              getHangerProducts
            )}`}</span>
          </div>
        )}
        {getSubtotal() > 0 && discount > 0 && (
          <div className={`${styles.sectionTotals} ${styles.subTotal}`}>
            <span>Subtotal: {`${getCurrencySymbol}${getSubtotal()}`}</span>
          </div>
        )}

        {discount > 0 && (
          <div className={`${styles.sectionTotals} `}>
            <span className={styles.discount}>
              {translate('discount', language)}: {getCurrencySymbol}
              {discount.toFixed(2)}
            </span>
          </div>
        )}

        {getDiscountedSubtotal() > 0 && (
          <div className={`${styles.sectionTotals}`}>
            <span>
              Subtotal: {`${getCurrencySymbol}${getDiscountedSubtotal()}`}
            </span>
          </div>
        )}
      </div>

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
                    <button
                      className={styles.applyFabric}
                      type="button"
                      onClick={() => applyFabric(fab)}
                    >
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
    </div>
  );
}

export default SellerCart;

SellerCart.propTypes = {
  close: PropTypes.func.isRequired,
  currentOrder: PropTypes.shape.isRequired,
  orderPage: PropTypes.bool,
};

SellerCart.defaultProps = {
  orderPage: false,
};
