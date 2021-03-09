import React from 'react';
import PropTypes from 'prop-types';

function Avatar({ width, height, img }) {
  const styles = {
    width,
    height,
    borderRadius: '50%',
    backgroundColor: '#FFF',
    overflow: 'hidden',
  };
  const imageStyles = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <div style={styles}>
      {img && <img style={imageStyles} alt="avatar" src={img} />}
    </div>
  );
}

Avatar.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  img: PropTypes.string,
};

Avatar.defaultProps = {
  width: 39,
  height: 39,
  img: '',
};

export default React.memo(Avatar);
