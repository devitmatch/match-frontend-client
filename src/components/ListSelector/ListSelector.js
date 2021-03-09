import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import styles from './ListSelector.module.scss';

import SearchIcon from '../../assets/icons/Search';

function ListSelector({
  items,
  label,
  selectLabel,
  onSelect,
  value,
  values,
  multiple,
  actionText,
  action,
  customValue,
  search,
  remove,
  fullWidth,
}) {
  const [searchString, setSearchString] = useState('');

  const selectItem = (item) => {
    if (multiple && values) {
      onSelect([...values, item]);
    } else {
      onSelect(item);
    }
  };

  const removeItem = (item) => {
    if (multiple && values) {
      onSelect(values.filter((val) => val.id !== item.id));
    } else if (remove) {
      onSelect();
    }
  };

  const isSelected = (itemId) => {
    if (multiple && values && values.find((val) => val.id === itemId)) {
      return true;
    }
    if (value && value.id === itemId) {
      return true;
    }
    return false;
  };

  const renderList = useCallback(() => {
    if (!searchString) {
      return items;
    }
    if (customValue) {
      return items.filter((item) => {
        if (item[customValue]) {
          return item[customValue]
            .toLowerCase()
            .includes(searchString.toLowerCase());
        }
        return null;
      });
    }
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchString.toLowerCase())
    );
  }, [customValue, items, searchString]);

  return (
    <div
      className={`${styles.itemsSelector} ${
        fullWidth === true && styles.fullWidth
      }`}
    >
      {search && (
        <div className={styles.inputContainer}>
          <span className={styles.icon}>
            <SearchIcon color="#9ba7b7" />
          </span>
          <input
            value={searchString}
            onChange={(e) => setSearchString(e.currentTarget.value)}
            className={styles.searchInput}
          />
        </div>
      )}
      {label && <div className={styles.listTitle}>{label}</div>}

      <ul className={styles.itemsList}>
        {renderList().map((item) => {
          if (customValue) {
            if (item[customValue]) {
              return (
                <li
                  key={item.id}
                  className={`
            ${isSelected(item.id) ? styles.selected : ''} ${
                    multiple ? styles.multiple : ''
                  }`}
                >
                  <span>{customValue ? item[customValue] : item.name}</span>
                  {isSelected(item.id) ? (
                    (multiple || remove) && (
                      <button
                        className={`${styles.remove} ${
                          multiple ? styles.white : styles.dark
                        }`}
                        type="button"
                        onClick={() => removeItem(item)}
                      />
                    )
                  ) : (
                    <button
                      type="button"
                      className={styles.select}
                      onClick={() => selectItem(item)}
                    >
                      {selectLabel}
                    </button>
                  )}
                </li>
              );
            }
            return null;
          }
          return (
            <li
              key={item.id}
              className={`
            ${isSelected(item.id) ? styles.selected : ''} ${
                multiple ? styles.multiple : ''
              }`}
            >
              <span>{customValue ? item[customValue] : item.name}</span>
              {isSelected(item.id) ? (
                (remove || multiple) && (
                  <button
                    className={`${styles.remove} ${
                      multiple ? styles.white : styles.dark
                    }`}
                    type="button"
                    onClick={() => removeItem(item)}
                  />
                )
              ) : (
                <button
                  type="button"
                  className={styles.select}
                  onClick={() => selectItem(item)}
                >
                  {selectLabel}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {action && (
        <button
          type="button"
          className={`${styles.defaultActionButton} ${styles.actionButton}`}
          onClick={action}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

ListSelector.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.string,
  value: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.string),
    ])
  ),
  values: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(
      PropTypes.objectOf(
        PropTypes.oneOfType([
          PropTypes.string.isRequired,
          PropTypes.number,
          PropTypes.arrayOf(PropTypes.string),
        ])
      )
    ),
  ]),
  selectLabel: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  actionText: PropTypes.string,
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  customValue: PropTypes.string,
  search: PropTypes.bool,
  remove: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

ListSelector.defaultProps = {
  value: {},
  values: false,
  label: '',
  multiple: false,
  actionText: '',
  action: false,
  customValue: '',
  search: false,
  remove: false,
  fullWidth: false,
};

export default ListSelector;
