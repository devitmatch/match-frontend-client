import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Loading from '../../components/Loading/Loading';
import ClientForm from '../../components/ClientForm/ClientForm';
import { registerUser } from '../../store/actions/user';

import Api from '../../libs/Api';

import styles from './Register.module.scss';

function Register() {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [currentClient, setCurrentClient] = useState([]);
  const [clientRegister, setClientRegister] = useState();
  const [isNationalClient, setIsNationalClient] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      Api.getUser().then((updatedUser) => {
        if (updatedUser.is_client) {
          dispatch(registerUser({ ...updatedUser, clientId: user.clientId }));
        }
      });
    };
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);

    Api.getClient(user.id)
      .then((res) => setClients(res.result))
      .finally(() => setLoading(false));
  }, [user.id]);

  useEffect(() => {
    if (clients && clients.length) {
      setCurrentClient(clients[0]);
    }
  }, [clients]);

  useEffect(() => {
    if (currentClient && currentClient.id) {
      setLoading(true);

      Api.getClientById(currentClient.id)
        .then((res) => {
          setClientRegister(res);
        })
        .finally(() => setLoading(false));
    }
  }, [currentClient]);

  useEffect(() => {
    if (clientRegister && clientRegister.vat && clientRegister.vat.length) {
      setIsNationalClient(false);
    }
  }, [clientRegister]);

  return (
    <>
      {clientRegister && (
        <ClientForm
          isNational={isNationalClient}
          setIsNational={setIsNationalClient}
          client={clientRegister}
        />
      )}
      {loading && (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      )}
    </>
  );
}

export default Register;
