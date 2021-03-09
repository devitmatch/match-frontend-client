/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment/locale/pt-br';

import styles from './Home.module.scss';

import Api from '../../libs/Api';
import translate from '../../libs/i18n';
import { setFirstOpen } from '../../store/actions/settings';
import FormModal from '../../components/FormModal/FormModal';
import Arrow from '../../assets/icons/Arrow';
import OrderCart from '../../components/OrderCart/OrderCart';
import CardClient from '../../assets/images/card_client.jpg';

function Home() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.settings.language);
  const firstOpen = useSelector((state) => state.settings.firstOpen);

  const [firstOpenVideo, setFirstOpenVideo] = useState(false);
  const [lastAttendance, setLastAttendance] = useState();
  const [lastOrders, setLastOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [ordersExclusivities, setOrdersExclusivities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [briefingCover, setBriefingCover] = useState();
  const [orderCover, setOrderCover] = useState();
  const [attendanceCover, setAttendanceCover] = useState();
  const [printCover, setPrintCover] = useState();

  const closeBeforeStart = () => {
    dispatch(setFirstOpen(true));
    setFirstOpenVideo(false);
  };

  useEffect(() => {
    Api.getLastAttendance().then((res) => {
      setLastAttendance(res);
    });
    Api.getLastOrders().then((res) => {
      setLastOrders(res.result);
    });
    Api.getLastOrder().then((res) => {
      if (res && res.id) {
        setLastOrder(res);
      }
    });
    Api.getRegions().then((res) => {
      setRegions(res);
    });
    Api.getCountries().then((res) => {
      setCountries(res);
    });
    Api.getCoverImages().then((res) => {
      setBriefingCover(res.briefing_cover_url);
      setOrderCover(res.order_cover_url);
      setAttendanceCover(res.attendance_cover_url);
      setPrintCover(res.print_cover_url);
    });
  }, []);

  useEffect(() => {
    if (lastOrder) {
      const getExclusivities = [];
      lastOrder.productorder_set.forEach((product) => {
        getExclusivities.push(product.print_id);
      });
      Api.getPrintsExclusivities(getExclusivities.toString()).then((res) => {
        setOrdersExclusivities(res.results);
      });
    }
  }, [lastOrder]);

  useEffect(() => {
    if (!firstOpen) {
      setFirstOpenVideo(true);
    }
  }, [firstOpen]);

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

  const getExclusivityInfo = (printId) => {
    if ((countries, regions)) {
      const productExclusivity = ordersExclusivities.find(
        (order) => order.print === printId
      );
      if (productExclusivity) {
        return (
          <>
            <span>
              {getExclusivityVarValue(productExclusivity.exclusivity_var)}
            </span>
            <span>
              {translate('exclusivity', language)}{' '}
              {getExclusivityName(productExclusivity.exclusivity)}
            </span>
            <span>
              {productExclusivity.exclusivity_cont
                .map((cont) => getExclusivityCont(cont))
                .toString()}
            </span>
            <span>
              {productExclusivity.exclusivity_int
                .map((int) => getExclusivityInt(int))
                .toString()}
            </span>
            <span>
              {productExclusivity.exclusivity_reg
                .map((reg) => getExclusivityReg(reg))
                .toString()}
            </span>
          </>
        );
      }
    }

    return '';
  };

  return (
    <div className={styles.home}>
      <div className={styles.lastAttendance}>
        {lastAttendance && (
          <>
            <div className={styles.title}>
              {translate('lastAttendance', language)}
            </div>
            <div className={styles.attendance}>
              <div className={styles.name}>{lastAttendance.name}</div>
              <div className={styles.date}>
                {translate('attendanceReady', language)}{' '}
                <Moment locale={language} format="HH:mm">
                  {lastAttendance.date_creation}
                </Moment>
                {' - '}
                <Moment locale={language} format="LL">
                  {lastAttendance.date_creation}
                </Moment>
              </div>
              <Link
                className={styles.link}
                to={`/attendances/${lastAttendance.id}`}
              >
                <span className={styles.text}>
                  {translate('seeProject', language)}
                </span>
                <span className={styles.icon}>
                  <Arrow />
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
      <div className={styles.cardLinks}>
        <Link
          to="/briefings"
          className={styles.card}
          style={{
            backgroundImage: `url(${briefingCover || CardClient})`,
          }}
        >
          <div className={styles.info}>
            <div className={styles.title}>
              {translate('briefings', language)}
            </div>
            <div className={styles.description}>
              {translate('writeBriefing', language)}
            </div>
          </div>
        </Link>
        <Link
          to="/orders"
          className={styles.card}
          style={{
            backgroundImage: `url(${orderCover || CardClient})`,
          }}
        >
          <div className={styles.info}>
            <div className={styles.title}>
              {translate('myRequests', language)}
            </div>
            <div className={styles.description}>
              {translate('allRequests', language)}
            </div>
          </div>
        </Link>
        <Link
          to="/attendances"
          className={styles.card}
          style={{
            backgroundImage: `url(${attendanceCover || CardClient})`,
          }}
        >
          <div className={styles.info}>
            <div className={styles.title}>
              {translate('myAttendances', language)}
            </div>
            <div className={styles.description}>
              {translate('reviewAttendances', language)}
            </div>
          </div>
        </Link>
        <Link
          to="/my-prints"
          className={styles.card}
          style={{
            backgroundImage: `url(${printCover || CardClient})`,
          }}
        >
          <div className={styles.info}>
            <div className={styles.title}>
              {translate('myShopping', language)}
            </div>
            <div className={styles.description}>
              {translate('yourPrints', language)}
            </div>
          </div>
        </Link>
      </div>
      {lastOrders.length > 0 && (
        <div className={styles.ordersInProgress}>
          <div className={styles.title}>
            {translate('ordersInProgress', language)}
          </div>
          <div className={styles.ordersContainer}>
            {lastOrders.map((order) => (
              <div className={styles.order}>
                <span className={styles.clientName}>{order.client_name}</span>
                <span className={styles.status}>
                  {order.status === 'OPEN' &&
                    translate('underAnalysis', language)}
                  {order.status === 'APP' &&
                    translate('approvedOrder', language)}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className={styles.seeDetails}
                >
                  {translate('seeDetails', language)}
                  <span className={styles.icon}>
                    <Arrow />
                  </span>
                </button>
              </div>
            ))}
          </div>
          <Link
            to="/orders"
            className={`${styles.defaultRoundedActionButton} ${styles.seeAllOrders}`}
          >
            {translate('seeAll', language)}
          </Link>
        </div>
      )}

      <div className={styles.lastOrder}>
        <div className={styles.title}>{translate('lastOrder', language)}</div>
        {lastOrder ? (
          <div className={styles.lastOrderContainer}>
            <div className={styles.header}>
              <div className={styles.orderNumber}>
                <span className={styles.label}>
                  {translate('orderNumber', language)}
                </span>
                Nº {lastOrder.id}-{new Date(lastOrder.date).getTime()}
              </div>
              <div className={styles.orderDate}>
                {lastOrder.status === 'OPEN' && translate('openOrder')}
                {lastOrder.status === 'APP' && translate('approvedOrder')}
                {lastOrder.status === 'FINA' &&
                  translate('completedOrder')}-{' '}
                <Moment locale={language} format="LL">
                  {lastOrder.date}
                </Moment>
              </div>
            </div>

            <div className={styles.products}>
              {lastOrder.productorder_set.map((product) => (
                <>
                  <div className={styles.product} key={product.id}>
                    <div className={styles.productInfo}>
                      <div
                        className={styles.image}
                        style={{
                          backgroundColor:
                            product.flat_background_color ||
                            product.pantone_color,
                        }}
                      >
                        {product.print_image_url && (
                          <img
                            src={product.print_image_url}
                            alt={product.print_name}
                          />
                        )}
                      </div>
                      <div className={styles.description}>
                        <span className={styles.code}>
                          {product.print_code}
                        </span>
                        <span className={styles.exclusivity}>
                          {getExclusivityInfo(product.print_id)}
                        </span>

                        <span className={styles.fabric}>
                          {translate('fabric', language)} {product.fabric_name}{' '}
                          - {product.meters}m{' '}
                          {product.category === 'SIM' &&
                            ` - ${translate('simple', language)}`}
                          {product.category === 'REP' &&
                            ` - ${translate('repetition', language)}`}
                          {product.category === 'BOT' &&
                            ` - ${translate('simpleRepetition', language)}`}
                        </span>
                      </div>
                    </div>
                    <div className={styles.price}>
                      {product.price_per_meter !== '0.00' &&
                        (lastOrder.currency === 'brl'
                          ? `R$ ${product.price_per_meter}`
                          : `$ ${product.price_per_meter}`)}
                    </div>
                  </div>
                </>
              ))}
            </div>
            <button
              className={`${styles.defaultRoundedActionButton} ${styles.seeMore}`}
              type="button"
              onClick={() => setSelectedOrder(lastOrder)}
            >
              {translate('seeMore', language)}
            </button>
          </div>
        ) : (
          <div className={styles.noOrderContainer}>
            <span className={styles.noOrders}>
              {translate('noOrders', language)}
            </span>
            <span className={styles.ordersHere}>
              {translate('ordersHere', language)}
            </span>
          </div>
        )}
      </div>
      {firstOpenVideo && (
        <FormModal spaced onCancel={closeBeforeStart}>
          <video src="" />
          <p className={styles.beforeStartMessage}>
            {translate('beforeStart', language)}
          </p>
        </FormModal>
      )}
      {selectedOrder && (
        <OrderCart
          currentOrder={selectedOrder}
          close={() => setSelectedOrder(false)}
        />
      )}
    </div>
  );
}

export default Home;
