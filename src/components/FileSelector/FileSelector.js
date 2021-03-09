/* eslint-disable react/destructuring-assignment */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

import styles from './FileSelector.module.scss';
import translate from '../../libs/i18n';

import CloseIcon from '../../assets/icons/Close';
import UploadIcon from '../../assets/icons/Upload';

function FileSelector({
  files,
  label,
  onSelect,
  multiple,
  icon,
  error,
  jpg,
  button,
  fullWidth,
  clearPreviews,
  backgroundColor,
}) {
  const language = useSelector((state) => state.settings.language);
  const [filePreviews, setFilePreviews] = useState([]);
  const fileInput = useRef();

  useEffect(() => {
    if (clearPreviews) {
      setFilePreviews([]);
    }
  }, [clearPreviews]);

  const onSelectFile = (e) => {
    const fileArray = Array.from(e.currentTarget.files);
    const newFilePreviews = [...filePreviews];
    const numberOfFiles = Array.from(e.currentTarget.files).length;
    let counter = 0;

    const loadImagePreview = (f) => {
      const reader = new FileReader();
      try {
        reader.readAsDataURL(f);

        reader.onloadend = () => {
          if (jpg) {
            newFilePreviews.push({ name: f.name, src: reader.result });
            counter += 1;
            if (counter < numberOfFiles) {
              loadImagePreview(fileArray[counter]);
            } else {
              setFilePreviews(newFilePreviews);
              onSelect([...files, ...fileArray]);
            }
          } else {
            onSelect([...files, ...fileArray]);
          }
        };
      } catch (err) {
        // console.log(err);
      }
    };
    loadImagePreview(fileArray[counter]);
  };

  const onRemove = (fileName) => {
    setFilePreviews(filePreviews.filter((f) => f.name !== fileName));
    onSelect(files.filter((f) => f.name !== fileName));
    fileInput.current.value = '';
  };

  if (icon) {
    return (
      <div className={styles.inputContainer}>
        <span className={styles.icon}>
          <UploadIcon />
        </span>
        <input
          type="file"
          data-title=""
          className={`${styles.fileInput} ${styles.iconContainer}`}
          onChange={onSelectFile}
        />
      </div>
    );
  }

  if (button) {
    return (
      <input
        type="file"
        data-title={files.length && !multiple ? files[0].name : label}
        className={`${styles.actionButton}`}
        onChange={onSelectFile}
        multiple={multiple}
        ref={fileInput}
      />
    );
  }

  return (
    <>
      <div className={styles.inputArea}>
        <input
          type="file"
          data-title={files.length && !multiple ? files[0].name : label}
          className={`${styles.fileInput}
        ${error ? styles.error : ''} ${fullWidth ? styles.fullWidth : ''}`}
          onChange={onSelectFile}
          multiple={multiple}
          ref={fileInput}
        />
        {!files.length && (
          <span className={styles.icon}>
            <UploadIcon />
          </span>
        )}
      </div>
      {!jpg && files.length === 1 && (
        <button
          type="button"
          className={styles.removeFile}
          onClick={() => onRemove(files[0].name)}
        >
          <CloseIcon color="#202730" />
        </button>
      )}

      <ul className={styles.imageList}>
        {jpg &&
          filePreviews.map((imageRef) => (
            <li
              key={imageRef.name}
              className={`${styles.imageItem} ${
                files.length === 1 ? styles.main : ''
              } ${button ? styles.mini : ''}`}
            >
              <div style={{ backgroundColor: backgroundColor || '#FFFFFF' }}>
                <img src={imageRef.src} alt={imageRef.name} />
              </div>

              <button
                className={styles.delete}
                type="button"
                onClick={() => onRemove(imageRef.name)}
              >
                {translate('delete', language)}
              </button>
            </li>
          ))}
      </ul>
    </>
  );
}

FileSelector.propTypes = {
  files: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  label: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  icon: PropTypes.bool,
  error: PropTypes.bool,
  jpg: PropTypes.bool,
  button: PropTypes.bool,
  fullWidth: PropTypes.bool,
  clearPreviews: PropTypes.bool,
  backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

FileSelector.defaultProps = {
  files: false,
  multiple: false,
  label: '',
  icon: false,
  error: false,
  jpg: false,
  button: false,
  fullWidth: false,
  clearPreviews: false,
  backgroundColor: false,
};

export default React.memo(FileSelector);
