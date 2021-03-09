import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import ListSelector from '../ListSelector/ListSelector';
import Loading from '../Loading/Loading';

import Api from '../../libs/Api';
import translate from '../../libs/i18n';
import useOutsideClick from '../../libs/useOutsideClick';

import PlusIcon from '../../assets/icons/Plus';
import ArrowIcon from '../../assets/icons/Arrow';

import styles from './ClientForm.module.scss';

export default function ClientForm({ isNational, setIsNational, client }) {
  const [language] = useSelector((state) => [state.settings.language]);

  const countrySelectorRef = useRef();
  const regionsSelectorRef = useRef();

  const [clientId, setClientId] = useState();
  const [brandingName, setBrandingName] = useState('');
  const [registers, setRegisters] = useState([
    {
      social_reason: '',
      state_registration: '',
      cnpj: '',
      delivery_address: '',
    },
  ]);
  const [selectedCountry, setSelectedCountry] = useState();
  const [selectedRegions, setSelectedRegions] = useState();
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email, setEmail] = useState('');
  // const [vat, setVat] = useState('');
  const [responsibleContact, setResponsibleContact] = useState('');
  const [responsibleEmail, setResponsibleEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [profileImage, setProfileImage] = useState([]);
  const [filePreview, setFilePreview] = useState();
  const [profileImageFile, setProfileImageFile] = useState();
  const [countries, setCountries] = useState([]);
  const [countrySelector, setCountrySelector] = useState(false);
  const [regions, setRegions] = useState([]);
  const [regionsSelector, setRegionsSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedClient, setUpdatedClient] = useState();

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    setCountrySelector(false);
  }, [selectedCountry]);

  useOutsideClick(regionsSelectorRef, () => {
    setRegionsSelector(!regionsSelector);
  });

  useEffect(() => {
    const clientData = updatedClient || client;

    if (clientData) {
      setLoading(true);

      if (clientData.id) {
        setClientId(clientData.id);
      }

      if (clientData.name && clientData.name.length) {
        setBrandingName(clientData.name);
      }

      if (
        clientData.registrations.length &&
        clientData.registrations.filter(
          (r) =>
            r.id > 0 ||
            r.social_reason.length > 0 ||
            r.state_registration.length > 0 ||
            r.cnpj.length > 0 ||
            r.delivery_address.length > 0 ||
            r.vat.length > 0 ||
            r.country
        ).length > 0
      ) {
        setRegisters(clientData.registrations);
      }

      if (clientData.country && clientData.country.length) {
        const country = countries.find((c) => c.id === clientData.country);

        if (country) {
          setSelectedCountry(country);
        }
      }

      if (clientData.state && clientData.state && clientData.state.length) {
        const region = regions.find((r) => r.id === clientData.state);

        if (region) {
          setSelectedRegions(region);
        }
      }

      if (clientData.address && clientData.address.length) {
        setAddress(clientData.address);
      }

      if (clientData.zip_code && clientData.zip_code.length) {
        setZipCode(clientData.zip_code);
      }

      if (clientData.email && clientData.email.length) {
        setEmail(clientData.email);
      }

      if (
        clientData.registrations.length &&
        clientData.registrations[0].country
      ) {
        setIsNational(false);
      }

      if (clientData.contact && clientData.contact.length) {
        setResponsibleContact(clientData.contact);
      }

      if (clientData.contact_email && clientData.contact_email.length) {
        setResponsibleEmail(clientData.contact_email);
      }

      if (clientData.contact_phone && clientData.contact_phone.length) {
        setPhoneNumber(clientData.contact_phone);
      }

      if (clientData.instagram && clientData.instagram.length) {
        setInstagram(clientData.instagram);
      }

      if (clientData.site && clientData.site.length) {
        setWebsite(clientData.site);
      }

      if (clientData.notes && clientData.notes.length) {
        setNotes(clientData.notes);
      }

      if (clientData.image_url && client.image_url.length) {
        setProfileImage(client.image_url);
      }

      setLoading(false);
    }
  }, [client, updatedClient]);

  const addRegistration = () => {
    const updatedRegistrations = [...registers];

    updatedRegistrations.push({
      social_reason: '',
      state_registration: '',
      cnpj: '',
      delivery_address: '',
      vat: '',
      post_code: '',
      country: '',
    });

    setRegisters(updatedRegistrations);
  };

  const removeRegistration = (index) => {
    const updatedRegistrations = [...registers];

    updatedRegistrations.splice(index, 1);
    setRegisters(updatedRegistrations);
  };

  const onSelectFile = (event) => {
    let newFilePreview;
    const file = event.currentTarget.files[0];

    const loadImagePreview = (f) => {
      const reader = new FileReader();

      try {
        reader.readAsDataURL(f);
        reader.onloadend = () => {
          newFilePreview = { name: f.name, src: reader.result };

          setFilePreview(newFilePreview);
        };
      } catch (err) {
        // console.log(err);
      }
    };

    loadImagePreview(file);
    setProfileImageFile(file);
  };

  const onSubmitClientForm = () => {
    const clientData = {};

    if (brandingName && brandingName.length) {
      clientData.name = brandingName;
    }

    if (
      registers &&
      registers.length &&
      registers.filter(
        (r) =>
          r.id > 0 ||
          r.social_reason.length > 0 ||
          r.state_registration.length > 0 ||
          r.cnpj.length > 0 ||
          r.delivery_address.length > 0
      ).length > 0
    ) {
      clientData.registrations = registers;
    }

    if (selectedCountry && selectedCountry.id) {
      clientData.country = selectedCountry.id;
    }

    if (selectedRegions && selectedRegions.id) {
      clientData.state = selectedRegions.id;
    }

    clientData.address = address;
    clientData.zip_code = zipCode;
    clientData.email = email;
    // clientData.vat = vat;
    clientData.contact = responsibleContact;
    clientData.contact_email = responsibleEmail;
    clientData.contact_phone = phoneNumber;
    clientData.instagram = instagram;
    clientData.site = website;
    clientData.notes = notes;

    if (
      clientData.registrations.length &&
      clientData.registrations[0].country
    ) {
      setIsNational(false);
    }

    setLoading(true);

    if (clientId) {
      clientData.id = clientId;

      Api.updateClient(
        clientId,
        profileImageFile ? clientData : { ...clientData, image: null }
      )
        .then(() => {
          if (!profileImageFile) {
            toast(translate('successUpdatingClient', language), {
              type: 'success',
            });
          } else {
            const formData = new FormData();

            formData.append('id', clientId);
            formData.append('image', profileImageFile);

            Api.updateClient(clientId, formData)
              .then(() => {
                toast(translate('successUpdatingClient', language), {
                  type: 'success',
                });
              })
              .catch(() => {
                toast(translate('failUpdatingClient', language), {
                  type: 'error',
                });
              })
              .finally(() => setLoading(false));
          }
        })
        .catch(() => {
          toast(translate('failUpdatingClient', language), {
            type: 'error',
          });
        })
        .finally(() => {
          if (!profileImageFile) {
            setLoading(false);
          }
        });
    } else {
      Api.createClient(clientData)
        .then((res) => {
          if (res && res.id && profileImageFile) {
            const formData = new FormData();

            formData.append('id', clientId);
            formData.append('image', profileImageFile);

            Api.updateClient(clientId, formData)
              .then(() => {
                toast(translate('successUpdatingClient', language), {
                  type: 'success',
                });
              })
              .catch(() => {
                toast(translate('failUpdatingClient', language), {
                  type: 'error',
                });
              })
              .finally(() => setLoading(false));
          } else {
            setUpdatedClient(res);

            toast(translate('successCreatingClient', language), {
              type: 'success',
            });
          }
        })
        .catch(() => {
          toast(translate('failCreatingClient', language), {
            type: 'error',
          });
        })
        .finally(() => {
          if (!profileImageFile) {
            setLoading(false);
          }
        });
    }
  };

  const renderProfileImage = useCallback(() => {
    if (filePreview) {
      return <img src={filePreview.src} alt={filePreview.name} />;
    }

    if (profileImage && profileImage.length) {
      return <img src={profileImage} alt="Client Avatar" />;
    }

    if (brandingName && brandingName.length) {
      return (
        <span>
          {brandingName
            .split(' ')
            .map((word) => (word && word[0] ? word[0].toUpperCase() : ''))}
        </span>
      );
    }

    return null;
  }, [filePreview, profileImage, brandingName]);

  return (
    <div className={styles.clientFormModal}>
      <header>
        <Link className={styles.closeButton} to="/">
          <div className={styles.backIcon}>
            <ArrowIcon color="white" />
          </div>
          {translate('goBack', language)}
        </Link>
      </header>
      <div className={styles.clientForm}>
        <div className={styles.clientFormHead}>
          <div className={styles.clientName}>{brandingName}</div>
          <div className={styles.clientLocal}>
            {isNational ? (
              translate('national', language)
            ) : (
              <button
                className={styles.switchClienteType}
                type="button"
                onClick={() => setIsNational(true)}
              >
                {translate('national', language)}
              </button>
            )}
            <span className={styles.switchSeparator}>{' | '}</span>
            {!isNational ? (
              translate('international', language)
            ) : (
              <button
                className={styles.switchClienteType}
                type="button"
                onClick={() => setIsNational(false)}
              >
                {translate('international', language)}
              </button>
            )}
          </div>
        </div>
        <hr className={styles.formHeaderSeparator} />
        <form>
          <section>
            <label htmlFor="nameField">
              {translate('brandName', language)}
              <input
                id="nameField"
                name="nameField"
                type="text"
                value={brandingName}
                onChange={(event) => setBrandingName(event.currentTarget.value)}
              />
            </label>
            <hr />
            {registers.map((register, index) => {
              return (
                <div key={register.id || 0}>
                  {index !== 0 ? <hr /> : null}
                  <label htmlFor={`socialReasonField-${index}`}>
                    {translate(
                      isNational ? 'companyName' : 'subBrand',
                      language
                    )}
                    <input
                      id={`socialReasonField-${index}`}
                      name={`socialReasonField-${index}`}
                      type="text"
                      value={register.social_reason}
                      onChange={(event) => {
                        const updatedRegistrations = [...registers];
                        const { value } = event.currentTarget;

                        updatedRegistrations[index].social_reason = value;
                        setRegisters(updatedRegistrations);
                      }}
                    />
                  </label>
                  {isNational && (
                    <label htmlFor={`stateRegistrationField-${index}`}>
                      {translate('stateRegistration', language)}
                      <input
                        id={`stateRegistrationField-${index}`}
                        name={`stateRegistrationField-${index}`}
                        type="text"
                        value={register.state_registration}
                        onChange={(event) => {
                          const updatedRegistrations = [...registers];
                          const { value } = event.currentTarget;

                          updatedRegistrations[
                            index
                          ].state_registration = value;
                          setRegisters(updatedRegistrations);
                        }}
                      />
                    </label>
                  )}
                  {!isNational && (
                    <label htmlFor={`vatField-${index}`}>
                      VAT
                      <input
                        id={`vatField-${index}`}
                        name={`vatField-${index}`}
                        type="text"
                        value={register.vat}
                        onChange={(event) => {
                          const updatedRegistrations = [...registers];
                          const { value } = event.currentTarget;

                          updatedRegistrations[index].vat = value;
                          setRegisters(updatedRegistrations);
                        }}
                      />
                    </label>
                  )}
                  {isNational ? (
                    <label htmlFor={`cnpjField-${index}`}>
                      {translate('cnpj', language)}
                      <input
                        id={`cnpjField-${index}`}
                        name={`cnpjField-${index}`}
                        type="text"
                        value={register.cnpj}
                        onChange={(event) => {
                          const updatedRegistrations = [...registers];
                          const { value } = event.currentTarget;

                          updatedRegistrations[index].cnpj = value;
                          setRegisters(updatedRegistrations);
                        }}
                      />
                    </label>
                  ) : null}
                  <label htmlFor={`deliveryAddressField-${index}`}>
                    {translate('deliveryAddress', language)}
                    <input
                      id={`deliveryAddressField-${index}`}
                      name={`deliveryAddressField-${index}`}
                      type="text"
                      value={register.delivery_address}
                      onChange={(event) => {
                        const updatedRegistrations = [...registers];
                        const { value } = event.currentTarget;

                        updatedRegistrations[index].delivery_address = value;
                        setRegisters(updatedRegistrations);
                      }}
                    />
                  </label>
                  {!isNational && (
                    <label htmlFor={`deliveryZipCode-${index}`}>
                      {translate('deliveryPostCode', language)}
                      <input
                        id={`deliveryZipCode-${index}`}
                        name={`deliveryZipCode-${index}`}
                        type="text"
                        value={register.zip_code}
                        onChange={(event) => {
                          const updatedRegistrations = [...registers];
                          const { value } = event.currentTarget;

                          updatedRegistrations[index].zip_code = value;
                          setRegisters(updatedRegistrations);
                        }}
                      />
                    </label>
                  )}
                  {!isNational && (
                    <label htmlFor={`deliveryCountry-${index}`}>
                      {translate('deliveryCountry', language)}
                      <input
                        id={`deliveryCountry-${index}`}
                        name={`deliveryCountry-${index}`}
                        type="text"
                        value={register.country}
                        onChange={(event) => {
                          const updatedRegistrations = [...registers];
                          const { value } = event.currentTarget;

                          updatedRegistrations[index].country = value;
                          setRegisters(updatedRegistrations);
                        }}
                      />
                    </label>
                  )}
                  {registers && registers.length && registers.length > 1 ? (
                    <div className={styles.deleteContainer}>
                      <button
                        className={styles.delete}
                        type="button"
                        onClick={() => removeRegistration(index)}
                      >
                        {translate('delete', language)}
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
            <hr />
            <button
              type="button"
              className={styles.addRegister}
              onClick={addRegistration}
            >
              <PlusIcon color="black" width="12" />{' '}
              {translate('addRegister', language)}
            </button>
          </section>
          <section>
            <label htmlFor="countryField">
              {translate('country', language)}
              <div className={styles.locationSelectors}>
                <button
                  type="button"
                  className={`${styles.defaultSelectInput} ${styles.regionInput}`}
                  onClick={() => setCountrySelector(true)}
                >
                  {selectedCountry
                    ? selectedCountry.name
                    : translate('chooseCountry', language)}
                </button>
                {countrySelector && (
                  <span ref={countrySelectorRef}>
                    <ListSelector
                      items={countries}
                      selectLabel={translate('choose', language)}
                      value={selectedCountry}
                      search
                      onSelect={setSelectedCountry}
                    />
                  </span>
                )}
              </div>
              {selectedCountry && selectedCountry.value === 'BRA' && (
                <div className={styles.selectorContainer}>
                  <p className={styles.sectionLabel}>
                    {translate('state', language)}
                  </p>
                  <button
                    type="button"
                    className={`${styles.defaultSelectInput} ${styles.regionInput}`}
                    onClick={() => setRegionsSelector(true)}
                  >
                    {selectedRegions
                      ? selectedRegions.name
                      : translate('all', language)}
                  </button>
                  {regionsSelector && (
                    <span ref={regionsSelectorRef}>
                      <ListSelector
                        items={regions}
                        selectLabel={translate('choose', language)}
                        value={selectedRegions}
                        search
                        onSelect={setSelectedRegions}
                      />
                    </span>
                  )}
                </div>
              )}
            </label>
            <label htmlFor="addressField">
              {translate('address', language)}
              <textarea
                id="addressField"
                name="addressField"
                value={address}
                onChange={(event) => setAddress(event.currentTarget.value)}
              />
            </label>
            <label htmlFor="zipCodeField">
              {translate(isNational ? 'zipCode' : 'postCode', language)}
              <input
                id="zipCodeField"
                name="zipCodeField"
                type="text"
                value={zipCode}
                onChange={(event) => setZipCode(event.currentTarget.value)}
              />
            </label>
            <label htmlFor="emailField">
              {translate('email', language)}
              <input
                id="emailField"
                name="emailField"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
              />
            </label>
            {/* {!isNational ? (
              <label htmlFor="vatField">
                VAT
                <input
                  id="vatField"
                  name="vatField"
                  type="text"
                  value={vat}
                  onChange={(event) => setVat(event.currentTarget.value)}
                />
              </label>
            ) : null} */}
            <hr />
            <label htmlFor="responsibleField">
              {translate('responsibleContact', language)}
              <input
                id="responsibleField"
                name="responsibleField"
                type="text"
                value={responsibleContact}
                onChange={(event) =>
                  setResponsibleContact(event.currentTarget.value)
                }
              />
            </label>
            <label htmlFor="responsibleEmailField">
              {translate('responsibleEmail', language)}
              <input
                id="responsibleEmailField"
                name="responsibleEmailField"
                type="email"
                value={responsibleEmail}
                onChange={(event) =>
                  setResponsibleEmail(event.currentTarget.value)
                }
              />
            </label>
            <label htmlFor="responsiblePhoneField">
              {translate('responsiblePhone', language)}
              <input
                id="responsiblePhoneField"
                name="responsiblePhoneField"
                type="text"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.currentTarget.value)}
              />
            </label>
            <hr />
            <label htmlFor="instagramField">
              {translate('instagram', language)}
              <input
                id="instagramField"
                name="instagramField"
                type="text"
                value={instagram}
                onChange={(event) => setInstagram(event.currentTarget.value)}
              />
            </label>
            <label htmlFor="websiteField">
              {translate('website', language)}
              <input
                id="websiteField"
                name="websiteField"
                type="text"
                value={website}
                onChange={(event) => setWebsite(event.currentTarget.value)}
              />
            </label>
            <label htmlFor="notesField">
              {translate('notes', language)}
              <textarea
                id="notesField"
                name="notesField"
                value={notes}
                onChange={(event) => setNotes(event.currentTarget.value)}
              />
            </label>
          </section>
          <section>
            <label htmlFor="imagemPerfilField">
              {translate('profileImage', language)}
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
                    {translate('profileImageAdvice', language)}{' '}
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
                    {translate('delete', language)}
                  </button>
                </div>
              </div>
            </label>
          </section>
        </form>
        <button
          type="button"
          className={styles.defaultActionButton}
          onClick={onSubmitClientForm}
        >
          {clientId
            ? translate('updateClient', language)
            : translate('registerClient', language)}
        </button>
      </div>
      {loading && (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      )}
    </div>
  );
}

ClientForm.propTypes = {
  isNational: PropTypes.bool,
  setIsNational: PropTypes.func,
  client: PropTypes.shape(),
};

ClientForm.defaultProps = {
  isNational: true,
  setIsNational: null,
  client: {},
};
