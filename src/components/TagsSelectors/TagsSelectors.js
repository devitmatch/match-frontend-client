import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import styles from './TagsSelectors.module.scss';

import TagListSelector from '../ListSelector/ListSelector';

function TagsSelectors({
  tags,
  selectLabel,
  selectTags,
  collections,
  clients,
  artFinalists,
  designers,
  complete,
  selectCollections,
  selectClients,
  selectArtFinalists,
  selectDesigners,
  selectProveniences,
  chromatic,
  uniqueClient,
  profiles,
  selectProfiles,
  clearFilters,
  setClearFilters,
  startSelectedCollections,
  startSelectedClients,
  startSelectedDesigners,
  startSelectedArtFinalists,
  startSelectedProveniences,
  startSelectedTags,
}) {
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState();
  const [selectedArtFinalists, setSelectedArtFinalists] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedProveniences, setSelectedProveniences] = useState([]);

  const [proveniences] = useState([
    { name: 'La Estampa Home', value: 'HOM', id: 1 },
    { name: 'La Estampa/ARTS', value: 'ART', id: 2 },
    { name: 'Internacional', value: 'INT', id: 3 },
    {
      name: 'Desenvolvimento Exclusivo',
      value: 'EXC',
      id: 4,
    },
    { name: 'Estampa Cliente', value: 'CLI', id: 5 },
    { name: 'Le Collection', value: 'LE', id: 6 },
  ]);

  const handleSelectedTags = (handledTags) => {
    setSelectedTags(handledTags);

    if (selectTags) {
      selectTags(handledTags);
    }
  };

  const handleSelectedCollections = (handledCollections) => {
    setSelectedCollections(handledCollections);

    if (selectCollections) {
      selectCollections(handledCollections);
    }
  };

  const handleSelectedClients = (handledClients) => {
    setSelectedClients(handledClients);

    if (selectClients) {
      selectClients(handledClients);
    }
  };

  const handleSelectedClient = (handledClient) => {
    setSelectedClient(handledClient);
    selectClients(handledClient);

    if (selectClients) {
      selectClients(handledClient);
    }
  };

  const handleSelectedArtFinalists = (handledArtFinalists) => {
    setSelectedArtFinalists(handledArtFinalists);

    if (selectArtFinalists) {
      selectArtFinalists(handledArtFinalists);
    }
  };
  const handleSelectedDesigners = (handledDesigners) => {
    setSelectedDesigners(handledDesigners);

    if (selectDesigners) {
      selectDesigners(handledDesigners);
    }
  };

  const handleSelectedProfiles = (handledProfiles) => {
    setSelectedProfiles(handledProfiles);

    if (selectProfiles) {
      selectProfiles(handledProfiles);
    }
  };

  const handleSelectedProveniences = (handledProveniences) => {
    setSelectedProveniences(handledProveniences);
    selectProveniences(handledProveniences);

    if (selectProveniences) {
      selectProveniences(handledProveniences);
    }
  };

  useEffect(() => {
    if (clearFilters) {
      handleSelectedTags([]);
      handleSelectedCollections([]);
      handleSelectedClients([]);
      handleSelectedClient([]);
      handleSelectedArtFinalists([]);
      handleSelectedDesigners([]);
      handleSelectedProfiles([]);
      handleSelectedProveniences([]);
    }
  }, [clearFilters]);

  useEffect(() => {
    if (clearFilters && setClearFilters) {
      setClearFilters(false);
    }
  }, [
    clearFilters,
    setClearFilters,
    selectedTags,
    selectedCollections,
    selectedClients,
    selectedClient,
    selectedArtFinalists,
    selectedDesigners,
    selectedProfiles,
    selectedProveniences,
  ]);

  useEffect(() => {
    if (startSelectedCollections) {
      setSelectedCollections(startSelectedCollections);
    }

    if (startSelectedClients) {
      setSelectedClients(startSelectedClients);
    }

    if (startSelectedDesigners) {
      setSelectedDesigners(startSelectedDesigners);
    }

    if (startSelectedArtFinalists) {
      setSelectedArtFinalists(startSelectedArtFinalists);
    }

    if (startSelectedProveniences) {
      setSelectedProveniences(startSelectedProveniences);
    }

    if (startSelectedTags) {
      setSelectedTags(startSelectedTags);
    }
  }, [
    startSelectedCollections,
    startSelectedClients,
    startSelectedDesigners,
    startSelectedArtFinalists,
    startSelectedProveniences,
    startSelectedTags,
  ]);

  const groupByCategories = (tagsArray) => {
    const result = {};
    if (tagsArray) {
      if (chromatic) {
        result.Cor = [];
        tagsArray.forEach((tag) => {
          if (tag.category === 'Cor') {
            result.Cor.push({ ...tag });
          }
        });
      } else {
        tagsArray.forEach((tag) => {
          if (!result[tag.category]) {
            result[tag.category] = [];
          }
          result[tag.category].push({ ...tag });
        });
      }
    }
    return result;
  };

  const categorySelectedTags = (category) => {
    const tagsNumber = selectedTags.filter((tag) => tag.category === category)
      .length;
    return tagsNumber || '';
  };

  return (
    <div
      className={`${styles.tagSelectors} ${
        complete === true && styles.complete
      }`}
    >
      {collections.length > 0 && (
        <div className={styles.tagSelectorContainer}>
          <div
            className={`${selectedCollections.length ? styles.active : ''} ${
              styles.selector
            }`}
          >
            Coleção{' '}
            {selectedCollections.length > 0 &&
              `(${selectedCollections.length})`}
          </div>
          <span className={styles.tagList}>
            <TagListSelector
              items={collections}
              onSelect={handleSelectedCollections}
              selectLabel={selectLabel}
              multiple
              values={selectedCollections}
              search
            />
          </span>
        </div>
      )}
      {clients.length > 0 && (
        <div className={styles.tagSelectorContainer}>
          <div
            className={`${selectedClients.length ? styles.active : ''} ${
              styles.selector
            } ${uniqueClient && selectedClient ? styles.active : ''}`}
          >
            Clientes{' '}
            {selectedClients.length > 0 && `(${selectedClients.length})`}
          </div>
          <span className={styles.tagList}>
            <TagListSelector
              items={clients}
              onSelect={
                uniqueClient ? handleSelectedClient : handleSelectedClients
              }
              selectLabel={selectLabel}
              multiple={!uniqueClient}
              remove={uniqueClient}
              values={selectedClients}
              value={selectedClient}
              search
            />
          </span>
        </div>
      )}
      {designers.length > 0 && (
        <div className={styles.tagSelectorContainer}>
          <div
            className={`${selectedDesigners.length ? styles.active : ''} ${
              styles.selector
            }`}
          >
            Designers{' '}
            {selectedDesigners.length > 0 && `(${selectedDesigners.length})`}
          </div>
          <span className={styles.tagList}>
            <TagListSelector
              items={designers}
              onSelect={handleSelectedDesigners}
              selectLabel={selectLabel}
              multiple
              values={selectedDesigners}
              search
            />
          </span>
        </div>
      )}
      {artFinalists.length > 0 && (
        <div className={styles.tagSelectorContainer}>
          <div
            className={`${selectedArtFinalists.length ? styles.active : ''} ${
              styles.selector
            }`}
          >
            Arte finalista{' '}
            {selectedArtFinalists.length > 0 &&
              `(${selectedArtFinalists.length})`}
          </div>
          <span className={styles.tagList}>
            <TagListSelector
              items={artFinalists}
              onSelect={handleSelectedArtFinalists}
              selectLabel={selectLabel}
              multiple
              values={selectedArtFinalists}
              search
            />
          </span>
        </div>
      )}
      {profiles.length > 0 && (
        <div className={styles.tagSelectorContainer}>
          <div
            className={`${selectedProfiles.length ? styles.active : ''} ${
              styles.selector
            }`}
          >
            Perfil{' '}
            {selectedProfiles.length > 0 && `(${selectedProfiles.length})`}
          </div>
          <span className={styles.tagList}>
            <TagListSelector
              items={profiles}
              onSelect={handleSelectedProfiles}
              selectLabel={selectLabel}
              multiple
              values={selectedProfiles}
              search
            />
          </span>
        </div>
      )}
      {complete && (
        <div className={styles.tagSelectorContainer}>
          <div
            className={`${selectedProveniences.length ? styles.active : ''} ${
              styles.selector
            }`}
          >
            Procedência{' '}
            {selectedProveniences.length > 0 &&
              `(${selectedProveniences.length})`}
          </div>
          <span className={styles.tagList}>
            <TagListSelector
              items={proveniences}
              onSelect={handleSelectedProveniences}
              selectLabel={selectLabel}
              multiple
              values={selectedProveniences}
            />
          </span>
        </div>
      )}
      {Object.keys(groupByCategories(tags)).map((category) => (
        <div key={category} className={styles.tagSelectorContainer}>
          <div
            className={`${
              categorySelectedTags(category) ? styles.active : ''
            } ${styles.selector}`}
          >
            {category}{' '}
            {categorySelectedTags(category)
              ? `(${categorySelectedTags(category)})`
              : ''}
          </div>
          <span className={styles.tagList}>
            <TagListSelector
              items={groupByCategories(tags)[category]}
              selectLabel={selectLabel}
              onSelect={handleSelectedTags}
              multiple
              values={selectedTags}
              search
            />
          </span>
        </div>
      ))}
    </div>
  );
}

TagsSelectors.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectLabel: PropTypes.string.isRequired,
  selectTags: PropTypes.func.isRequired,
  collections: PropTypes.arrayOf(PropTypes.object),
  clients: PropTypes.arrayOf(PropTypes.object),
  artFinalists: PropTypes.arrayOf(PropTypes.object),
  designers: PropTypes.arrayOf(PropTypes.object),
  complete: PropTypes.bool,
  selectCollections: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  selectClients: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  selectDesigners: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  selectArtFinalists: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  selectProveniences: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  chromatic: PropTypes.bool,
  profiles: PropTypes.arrayOf(PropTypes.object),
  selectProfiles: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  uniqueClient: PropTypes.bool,
  clearFilters: PropTypes.bool,
  setClearFilters: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  startSelectedCollections: PropTypes.arrayOf(PropTypes.object),
  startSelectedClients: PropTypes.arrayOf(PropTypes.object),
  startSelectedDesigners: PropTypes.arrayOf(PropTypes.object),
  startSelectedArtFinalists: PropTypes.arrayOf(PropTypes.object),
  startSelectedProveniences: PropTypes.arrayOf(PropTypes.object),
  startSelectedTags: PropTypes.arrayOf(PropTypes.object),
};

TagsSelectors.defaultProps = {
  collections: [],
  clients: [],
  artFinalists: [],
  designers: [],
  complete: false,
  selectCollections: false,
  selectClients: false,
  selectDesigners: false,
  selectArtFinalists: false,
  selectProveniences: false,
  chromatic: false,
  uniqueClient: false,
  profiles: [],
  selectProfiles: false,
  clearFilters: false,
  setClearFilters: false,
  startSelectedCollections: [],
  startSelectedClients: [],
  startSelectedDesigners: [],
  startSelectedArtFinalists: [],
  startSelectedProveniences: [],
  startSelectedTags: [],
};

export default React.memo(TagsSelectors);
