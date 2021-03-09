import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Api from '../../libs/Api';
import useOutsideClick from '../../libs/useOutsideClick';
import LoginTemplate from '../../components/LoginTemplate/LoginTemplate';
import DefaultButton from '../../components/DefaultButton/DefaultButton';
import DefaultInput from '../../components/DefaultInput/DefaultInput';
import ListSelector from '../../components/ListSelector/ListSelector';
import translate from '../../libs/i18n';

import styles from './ConfirmSignup.module.scss';

function ConfirmSignup() {
  const language = useSelector((state) => state.settings.language);

  const countrySelectorRef = useRef();
  const regionsSelectorRef = useRef();

  const [token, setToken] = useState();

  const [countrySelector, setCountrySelector] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState();
  const [regionsSelector, setRegionsSelector] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState();

  const [clientInitialInfo, setClientInitialInfo] = useState();
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [brandingName, setBrandingName] = useState('');

  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email, setEmail] = useState('');
  const [vat, setVat] = useState('');
  const [responsibleContact, setResponsibleContact] = useState('');
  const [responsibleEmail, setResponsibleEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [password, setPassword] = useState('');

  const [, setLoading] = useState(false);

  const [clientRegistrations, setClientRegistrations] = useState([]);
  const [clientContact] = useState('');
  const [step, setStep] = useState(0);
  const [maxStep] = useState(3);

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    setCountrySelector(false);
  }, [selectedCountry]);

  useOutsideClick(regionsSelectorRef, () => {
    setRegionsSelector(!regionsSelector);
  });

  useEffect(() => {
    const currentToken = new URLSearchParams(location.search).get('token');
    if (currentToken) {
      setToken(currentToken);
      Api.clientRegister(currentToken).then((res) => {
        setClientInitialInfo(res);
      });
    }
    Api.getCountries().then((res) => {
      const formattedCountries = res.map((country) => ({
        id: country.id,
        name: country.name,
        value: country.id,
      }));
      setCountries(formattedCountries);
    });
    Api.getRegions().then((res) => {
      const formattedRegions = res.map((region) => ({
        id: region.id,
        name: region.name,
        value: region.id,
      }));
      setRegions(formattedRegions);
    });
  }, [location.search]);

  useEffect(() => {
    if (clientInitialInfo) {
      setLoading(true);

      setBrandingName(clientInitialInfo.name);

      if (
        clientInitialInfo.registrations &&
        clientInitialInfo.registrations.length &&
        clientInitialInfo.registrations.filter(
          (r) =>
            r.id > 0 ||
            r.social_reason.length > 0 ||
            r.state_registration.length > 0 ||
            r.cnpj.length > 0 ||
            r.delivery_address.length > 0
        ).length > 0
      ) {
        setClientRegistrations(clientInitialInfo.registrations);
      } else {
        setClientRegistrations([
          {
            social_reason: '',
            state_registration: '',
            cnpj: '',
            delivery_address: '',
          },
        ]);
      }

      // if (clientInitialInfo.profiles && clientInitialInfo.profiles.length) {
      //   setSelectedClientProfiles(clientInitialInfo.profiles);
      // }

      if (clientInitialInfo.country && clientInitialInfo.country.length) {
        const country = countries.find(
          (c) => c.id === clientInitialInfo.country
        );

        if (country) {
          setSelectedCountry(country);
        }
      }

      if (
        clientInitialInfo.state &&
        clientInitialInfo.state &&
        clientInitialInfo.state.length
      ) {
        const region = regions.find((r) => r.id === clientInitialInfo.state);

        if (region) {
          setSelectedRegion(region);
        }
      }

      if (clientInitialInfo.address && clientInitialInfo.address.length) {
        setAddress(clientInitialInfo.address);
      }

      if (clientInitialInfo.zip_code && clientInitialInfo.zip_code.length) {
        setZipCode(clientInitialInfo.zip_code);
      }

      if (clientInitialInfo.email && clientInitialInfo.email.length) {
        setEmail(clientInitialInfo.email);
      }

      if (clientInitialInfo.vat && clientInitialInfo.vat.length) {
        setVat(clientInitialInfo.vat);
      }

      if (clientInitialInfo.contact && clientInitialInfo.contact.length) {
        setResponsibleContact(clientInitialInfo.contact);
      }

      if (
        clientInitialInfo.contact_email &&
        clientInitialInfo.contact_email.length
      ) {
        setResponsibleEmail(clientInitialInfo.contact_email);
      }

      if (
        clientInitialInfo.contact_phone &&
        clientInitialInfo.contact_phone.length
      ) {
        setPhoneNumber(clientInitialInfo.contact_phone);
      }

      if (clientInitialInfo.instagram && clientInitialInfo.instagram.length) {
        setInstagram(clientInitialInfo.instagram);
      }

      if (clientInitialInfo.site && clientInitialInfo.site.length) {
        setWebsite(clientInitialInfo.site);
      }

      if (clientInitialInfo.notes && clientInitialInfo.notes.length) {
        setNotes(clientInitialInfo.notes);
      }

      // if (clientInitialInfo.image_url && clientInitialInfo.length) {
      //   setProfileImage(clientInitialInfo.image_url);
      // }

      // if (clientInitialInfo.image_url && clientInitialInfo.image_url.length) {
      //   setProfileImage(clientInitialInfo.image_url);
      // }

      setLoading(false);
    }
  }, [clientInitialInfo]);

  const onSubmitClientForm = () => {
    if (brandingName && email && password) {
      const clientData = {};

      if (brandingName && brandingName.length) {
        clientData.name = brandingName;
      }

      if (
        clientRegistrations &&
        clientRegistrations.length &&
        clientRegistrations.filter(
          (r) =>
            r.id > 0 ||
            r.social_reason.length > 0 ||
            r.state_registration.length > 0 ||
            r.cnpj.length > 0 ||
            r.delivery_address.length > 0
        ).length > 0
      ) {
        clientData.registrations = clientRegistrations;
      }

      if (selectedCountry && selectedCountry.id && selectedCountry.id.length) {
        clientData.country = selectedCountry.id;
      }

      if (selectedRegion && selectedRegion.id && selectedRegion.id.length) {
        clientData.state = selectedRegion.id;
      }

      if (address && address.length) {
        clientData.address = address;
      }

      if (zipCode && zipCode.length) {
        clientData.zip_code = zipCode;
      }

      if (email && email.length) {
        clientData.email = email;
      }

      if (vat && vat.length) {
        clientData.vat = vat;
      }

      if (responsibleContact && responsibleContact.length) {
        clientData.contact = responsibleContact;
      }

      if (responsibleEmail && responsibleEmail.length) {
        clientData.contact_email = responsibleEmail;
      }

      if (phoneNumber && phoneNumber.length) {
        clientData.contact_phone = phoneNumber;
      }

      if (instagram && instagram.length) {
        clientData.instagram = instagram;
      }

      if (website && website.length) {
        clientData.site = website;
      }

      if (notes && notes.length) {
        clientData.notes = notes;
      }

      clientData.password = password;

      setLoading(true);

      if (clientInitialInfo.id) {
        Api.createClientAccount(clientData, token)
          .then(() => {
            history.push('/login');
            // if (profileImageFile) {
            //   const formData = new FormData();
            //   formData.append('id', clientInitialInfo.id);
            //   formData.append('image', profileImageFile);
            //   Api.updateClient(clientInitialInfo.id, formData)
            //     .then(() => {})
            //     .catch(() => {})
            //     .finally(() => setLoading(false));
            // }
          })
          .catch(() => {})
          .finally(() => {
            // if (!profileImageFile) {
            //   setLoading(false);
            // }
          });
      }
    }
  };

  const onClick = () => {
    const newStep = step + 1;

    if (newStep >= 3) {
      onSubmitClientForm();
    }

    setStep(newStep);
  };

  // const onSelectFile = (event) => {
  //   const file = event.currentTarget.files[0];
  //   let newFilePreview;

  //   const loadImagePreview = (f) => {
  //     const reader = new FileReader();
  //     try {
  //       reader.readAsDataURL(f);
  //       reader.onloadend = () => {
  //         newFilePreview = { name: f.name, src: reader.result };

  //         setFilePreview(newFilePreview);
  //       };
  //     } catch (err) {
  //       // console.log(err);
  //     }
  //   };

  //   loadImagePreview(file);
  //   setProfileImageFile(file);
  // };

  // const renderProfileImage = useCallback(() => {
  //   if (filePreview) {
  //     return <img src={filePreview.src} alt={filePreview.name} />;
  //   }

  //   if (profileImage && profileImage.length) {
  //     return <img src={profileImage} alt="Client Avatar" />;
  //   }

  //   if (brandingName && brandingName.length) {
  //     return (
  //       <span>
  //         {brandingName
  //           .split(' ')
  //           .map((word) => (word && word[0] ? word[0].toUpperCase() : ''))}
  //       </span>
  //     );
  //   }

  //   return null;
  // }, [filePreview, profileImage, brandingName]);

  return (
    <>
      <LoginTemplate>
        <div className={styles.ConfirmSignup}>
          <div className={styles.stepCount}>
            <b>{step + 1}</b>
            {` de ${maxStep}`}
          </div>
          {step <= 0 ? (
            <div>
              {clientContact && clientContact.length ? (
                <h1 className={styles.formTitle}>
                  {`Oi ${clientContact},`}
                  <br />
                  muito legal você por aqui.
                </h1>
              ) : null}

              <h2 className={styles.formSubtitle}>
                Vamos precisar antes validar alguns dados da sua empresa.
              </h2>
              <div className={styles.inputWrapper}>
                <DefaultInput
                  name="brandName"
                  label="Nome da marca"
                  placeholder="Nome da marca"
                  value={brandingName}
                  onChange={(event) =>
                    setBrandingName(event.currentTarget.value)
                  }
                />
              </div>
              <hr />
              {clientRegistrations.map((registration, index) => (
                <div key={`${registration.index}${registration.id}`}>
                  <div className={styles.rowInputWrapper}>
                    <div className={styles.inputWrapper}>
                      <DefaultInput
                        name={`socialReason${index}`}
                        label="Razão Social"
                        placeholder="Razão Social"
                        value={registration.social_reason || ''}
                        onChange={(event) => {
                          const updateClientRegistrations = [
                            ...clientRegistrations,
                          ];
                          const { value } = event.currentTarget;

                          updateClientRegistrations[
                            index
                          ].social_reason = value;
                          setClientRegistrations(updateClientRegistrations);
                        }}
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <DefaultInput
                        name={`cnpj${index}`}
                        label="CNPJ"
                        placeholder="CNPJ"
                        value={registration.cnpj || ''}
                        onChange={(event) => {
                          const updateClientRegistrations = [
                            ...clientRegistrations,
                          ];
                          const { value } = event.currentTarget;

                          updateClientRegistrations[index].cnpj = value;
                          setClientRegistrations(updateClientRegistrations);
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.rowInputWrapper}>
                    <div className={styles.inputWrapper}>
                      <DefaultInput
                        name={`stateRegistration${index}`}
                        label="Inscrição Estadual"
                        placeholder="Inscrição Estadual"
                        value={registration.state_registration || ''}
                        onChange={(event) => {
                          const updateClientRegistrations = [
                            ...clientRegistrations,
                          ];
                          const { value } = event.currentTarget;

                          updateClientRegistrations[
                            index
                          ].state_registration = value;
                          setClientRegistrations(updateClientRegistrations);
                        }}
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <DefaultInput
                        name={`deliveryAddress${index}`}
                        label="Endereço de entrega"
                        placeholder="Endereço de entrega"
                        value={registration.delivery_address || ''}
                        onChange={(event) => {
                          const updateClientRegistrations = [
                            ...clientRegistrations,
                          ];
                          const { value } = event.currentTarget;

                          updateClientRegistrations[
                            index
                          ].delivery_address = value;
                          setClientRegistrations(updateClientRegistrations);
                        }}
                      />
                    </div>
                  </div>
                  {index < clientRegistrations.length - 1 ? <hr /> : null}
                </div>
              ))}
              <hr />
              <button
                type="button"
                className={styles.addNewRegister}
                onClick={() => {
                  const updateClientRegistrations = [...clientRegistrations];
                  updateClientRegistrations.push({
                    social_reason: '',
                    state_registration: '',
                    cnpj: '',
                    delivery_address: '',
                  });

                  setClientRegistrations(updateClientRegistrations);
                }}
              >
                Adicionar outro cadastro
              </button>
            </div>
          ) : null}
          {step === 1 && (
            <>
              <h1 className={styles.formTitle}>
                Ótimo! Agora só mais alguns dados sobre a sua localização e
                contato.
              </h1>
              <div className={styles.rowInputWrapper}>
                <div ref={countrySelectorRef} className={styles.inputWrapper}>
                  <p className={styles.sectionLabel}>País</p>
                  <button
                    type="button"
                    className={`${styles.defaultSelectInput} ${styles.regionInput}`}
                    onClick={() => setCountrySelector(true)}
                  >
                    {selectedCountry ? selectedCountry.name : 'chooseCountry'}
                  </button>

                  {countrySelector && (
                    <ListSelector
                      items={countries}
                      onSelect={setSelectedCountry}
                      selectLabel="choose"
                      value={selectedCountry}
                      search
                    />
                  )}
                </div>
                <div className={styles.inputWrapper}>
                  {selectedCountry && selectedCountry.value === 'BRA' && (
                    <>
                      <p className={styles.sectionLabel}>Estado</p>
                      <button
                        type="button"
                        className={`${styles.defaultSelectInput} ${styles.regionInput}`}
                        onClick={() => setRegionsSelector(true)}
                      >
                        {selectedRegion
                          ? selectedRegion.name
                          : translate('all', language)}
                      </button>

                      {regionsSelector && (
                        <span ref={regionsSelectorRef}>
                          <ListSelector
                            items={regions}
                            onSelect={setSelectedRegion}
                            selectLabel="choose"
                            multiple
                            value={selectedRegion}
                            search
                          />
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className={styles.inputWrapper}>
                <DefaultInput
                  name="deliveryAddress"
                  label="Endereço"
                  placeholder="Endereço"
                  value={address}
                  onChange={(e) => setAddress(e.currentTarget.value)}
                />
              </div>
              <div className={styles.rowInputWrapper}>
                <div className={styles.inputWrapper}>
                  <DefaultInput
                    name="email"
                    label="Email"
                    placeholder="email@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                  />
                </div>
                <div className={styles.inputWrapper}>
                  <DefaultInput
                    name="phoneNumber"
                    label="Telefone"
                    placeholder="+XX(XX)XXXXX-XXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                  />
                </div>
              </div>
              <div className={styles.inputWrapper}>
                <DefaultInput
                  name="password"
                  label="Senha"
                  placeholder="senha"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  type="password"
                />
              </div>
            </>
          )}
          {step >= 2 && (
            <>
              <h1 className={styles.formTitle}>
                Perfeito! Agora para terminar essas últimas informações.
              </h1>
              <div className={styles.inputWrapper}>
                <DefaultInput
                  name="instagram"
                  label="Qual o endereço do seu instagram"
                  placeholder="www.instagram.com/match"
                  value={instagram}
                  onChange={(e) => setInstagram(e.currentTarget.value)}
                />
              </div>

              <div className={styles.inputWrapper}>
                <DefaultInput
                  name="site"
                  label="Home page (se tiver)"
                  placeholder="www.match.com.br"
                  value={website}
                  onChange={(e) => setWebsite(e.currentTarget.value)}
                />
              </div>
              {/* <div className={styles.inputWrapper}>
                <label htmlFor="imagemPerfilField">
                  Subir imagem de profile
                  <div className={styles.profileImageContainer}>
                    <div className={styles.imageContainer}>
                      <div className={styles.imagePlaceholder}>
                        {renderProfileImage()}
                      </div>
                      <input
                        id="imagemPerfilField"
                        name="imagemPerfilField"
                        type="file"
                        onChange={onSelectFile}
                      />
                    </div>
                    <div>
                      <span className={styles.imageInputInstructions}>
                        profileImageAdvice
                        {brandingName
                          .split(' ')
                          .map((word) =>
                            word && word[0] ? word[0].toUpperCase() : ''
                          )}
                      </span>
                      <button
                        className={styles.deleteImage}
                        type="button"
                        onClick={() => {
                          setProfileImage(null);
                          setFilePreview(null);
                        }}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                </label>
              </div> */}
            </>
          )}
          <DefaultButton text="Continuar" onClick={onClick} />
        </div>
      </LoginTemplate>
    </>
  );
}

export default ConfirmSignup;
