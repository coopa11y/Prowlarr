import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { icons } from 'Helpers/Props';
import styles from './PageToolbarButton.css';

const screenReaderOnlyStyle = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0
};

function getErrorMessages(error) {
  if (!error) {
    return [];
  }

  if (typeof error === 'string') {
    return [error];
  }

  if (typeof error !== 'object') {
    return [];
  }

  const body = error.responseJSON || error.statusBody;

  if (Array.isArray(body)) {
    return body
      .map((failure) => {
        return typeof failure?.errorMessage === 'string' ?
          failure.errorMessage :
          undefined;
      })
      .filter(Boolean);
  }

  if (body && typeof body === 'object') {
    if (typeof body.message === 'string') {
      return [body.message];
    }

    if (typeof body.details === 'string') {
      return [body.details];
    }
  }

  return [];
}

function getStatusAnnouncement(label, error) {
  const [firstErrorMessage] = getErrorMessages(error);

  if (!error) {
    return `${label} completed successfully.`;
  }

  return firstErrorMessage ?
    `${label} failed. ${firstErrorMessage}` :
    `${label} failed.`;
}

function PageToolbarButton(props) {
  const {
    label,
    iconName,
    spinningName,
    announceCompletion,
    error,
    isDisabled,
    isSpinning,
    ...otherProps
  } = props;
  const wasSpinning = usePrevious(isSpinning);
  const [announcement, setAnnouncement] = useState('');
  const clearTimeoutRef = useRef();

  useEffect(() => {
    if (!announceCompletion) {
      return;
    }

    if (!wasSpinning && isSpinning) {
      setAnnouncement('');
    }

    if (wasSpinning && !isSpinning) {
      setAnnouncement(getStatusAnnouncement(label, error));

      clearTimeoutRef.current = setTimeout(() => {
        setAnnouncement('');
      }, 5000);
    }
  }, [announceCompletion, error, isSpinning, label, wasSpinning]);

  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <Link
        className={classNames(
          styles.toolbarButton,
          isDisabled && styles.isDisabled
        )}
        isDisabled={isDisabled || isSpinning}
        title={label}
        {...otherProps}
      >
        <Icon
          name={isSpinning ? (spinningName || iconName) : iconName}
          isSpinning={isSpinning}
          size={21}
        />

        <div className={styles.labelContainer}>
          <div className={styles.label}>
            {label}
          </div>
        </div>
      </Link>

      {
        announceCompletion ?
          <span
            aria-live="polite"
            aria-atomic="true"
            style={screenReaderOnlyStyle}
          >
            {announcement}
          </span> :
          null
      }
    </>
  );
}

PageToolbarButton.propTypes = {
  label: PropTypes.string.isRequired,
  iconName: PropTypes.object.isRequired,
  spinningName: PropTypes.object,
  announceCompletion: PropTypes.bool,
  error: PropTypes.any,
  isSpinning: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onPress: PropTypes.func
};

PageToolbarButton.defaultProps = {
  spinningName: icons.SPINNER,
  announceCompletion: false,
  isDisabled: false,
  isSpinning: false
};

export default PageToolbarButton;
