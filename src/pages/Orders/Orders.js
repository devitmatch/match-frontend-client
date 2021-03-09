import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import styles from './Orders.module.scss';
import translate from '../../libs/i18n';
import Api from '../../libs/Api';
import useOutsideClick from '../../libs/useOutsideClick';

import DateRange from '../../components/DateRange/DateRange';
import ListSelector from '../../components/ListSelector/ListSelector';
import OrderCart from '../../components/OrderCart/OrderCart';
import Loading from '../../components/Loading/Loading';
import CloseIcon from '../../assets/icons/Close';
import ArrowRightIcon from '../../assets/icons/Arrow';

function Orders() {
  const language = useSelector((state) => state.settings.language);
  const [section, setSection] = useState('OPEN');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProductionType, setSelectedProductionType] = useState();
  const [productionTypeSelector, setProductionTypeSelector] = useState(
    'closed'
  );
  const [orders, setOrders] = useState([]);
  const [initialDate, setInitialDate] = useState();
  const [finalDate, setFinalDate] = useState();
  const [ordersFilter, setOrdersFilter] = useState('');
  const [loadingMoreOrders, setLoadingMoreOrders] = useState(false);

  // const loadMoreRef = useRef();
  const productionTypeSelectorRef = useRef();

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
    if (ordersFilter) {
      setLoadingMoreOrders(true);
      Api.getClientOrders(ordersFilter)
        .then((res) => {
          setOrders(res.results);
        })
        .finally(() => {
          setLoadingMoreOrders(false);
        });
    }
  }, [ordersFilter]);

  useEffect(() => {
    let filter = '';

    if (initialDate) {
      filter = `${filter}&init_date=${moment(initialDate).format(
        'MM-DD-YYYY'
      )}`;
    }

    if (finalDate) {
      filter = `${filter}&final_date=${moment(finalDate).format('MM-DD-YYYY')}`;
    }

    if (section === 'OPEN') {
      filter = `${filter}&status=OPEN,REP`;
    }
    if (section === 'PROD') {
      filter = `${filter}&status=APP,PROD,DISP`;
    }
    if (section === 'FINA') {
      filter = `${filter}&status=FINA`;
    }

    if (selectedProductionType) {
      filter = `${filter}&po_type=${selectedProductionType.value}`;
    }

    setOrdersFilter(filter);
  }, [selectedProductionType, section, initialDate, finalDate, ordersFilter]);

  useOutsideClick(productionTypeSelectorRef, () => {
    setProductionTypeSelector('closed');
  });

  useEffect(() => {
    setProductionTypeSelector('closed');
  }, [selectedProductionType]);

  return (
    <>
      <div className={styles.myOrders}>
        <div className={styles.filterOrdersWrapper}>
          <div className={styles.filterOrders}>
            <div className={styles.dateRangeWrapper}>
              <DateRange
                selectInitialDate={setInitialDate}
                selectFinalDate={setFinalDate}
              />
            </div>
            <div className={styles.listSelectorClientWrapper}>
              <div
                className={styles.clientNameSection}
                ref={productionTypeSelectorRef}
              >
                <button
                  id=""
                  type="button"
                  className={`${styles.defaultSelectInput} ${styles.selectInput}`}
                  onClick={() => setProductionTypeSelector('opened')}
                >
                  {selectedProductionType
                    ? selectedProductionType.name
                    : translate('typeOfProduction', language)}
                  {selectedProductionType && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProductionType();
                      }}
                      className={styles.clearClient}
                    >
                      <CloseIcon />
                    </button>
                  )}
                </button>
                {productionTypeSelector === 'opened' && (
                  <span>
                    <ListSelector
                      label={translate('typeOfProduction', language)}
                      selectLabel={translate('choose', language)}
                      items={productionTypeOptions}
                      onSelect={setSelectedProductionType}
                      value={selectedProductionType}
                      fullWidth
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.sections}>
          <button
            type="button"
            className={section === 'OPEN' && styles.active}
            onClick={() => setSection('OPEN')}
          >
            {translate('orderApproval', language)}
          </button>
          <button
            type="button"
            className={section === 'PROD' && styles.active}
            onClick={() => setSection('PROD')}
          >
            {translate('orderInProgress', language)}
          </button>
          <button
            type="button"
            className={section === 'FINA' && styles.active}
            onClick={() => setSection('FINA')}
          >
            {translate('orderFinished', language)}
          </button>
        </div>
        {orders && orders.length > 0 ? (
          orders.map((order, index) => {
            const orderKey = `order-${order.id}-${index}`;

            return (
              <div key={orderKey} className={styles.orderItem}>
                <div className={styles.clientName}>
                  {order.status === 'REP' && (
                    <span className={styles.disapprovedIcon} />
                  )}
                  {order.client_name}
                </div>
                <div
                  className={`${styles.orderDescription} ${
                    styles[order.status]
                  }`}
                >
                  {order && order.status && (
                    <span
                      className={`${
                        order.status === 'REP' ? styles.disapproved : ''
                      } ${styles.descriptionInfo}`}
                    >
                      {translate(`descriptionInfo${order.status}`, language)}
                    </span>
                  )}
                </div>
                <div className={styles.orderNumber}>
                  Nº {order.id}-{new Date(order.date).getTime()}
                </div>
                <div>
                  <button
                    type="button"
                    className={styles.seeDetails}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <span>{translate('seeDetails', language)}</span>
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <>
            {!loadingMoreOrders && (
              <div className={styles.noOrders}>
                {translate('noOrders', language)}
              </div>
            )}
          </>
        )}
      </div>
      {loadingMoreOrders && <Loading line />}
      {selectedOrder && (
        <OrderCart
          orderPage
          currentOrder={selectedOrder}
          close={() => setSelectedOrder(false)}
        />
      )}
    </>
  );
}

export default Orders;
