import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Icon from 'Components/Icon';
import SpinnerButton from 'Components/Link/SpinnerButton';
import { icons, kinds } from 'Helpers/Props';
import styles from './SpinnerErrorButton.css';

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

function getTextContent(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return `${node}`;
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join(' ').trim();
  }

  if (React.isValidElement(node)) {
    return getTextContent(node.props.children);
  }

  return '';
}

function getMessagesFromBody(body) {
  if (Array.isArray(body)) {
    return body.map((failure) => failure.errorMessage).filter(Boolean);
  }

  if (body && typeof body === 'object') {
    if (body.message) {
      return [body.message];
    }

    if (body.details) {
      return [body.details];
    }
  }

  return [];
}

function getErrorMessages(error) {
  if (!error) {
    return [];
  }

  if (typeof error === 'string') {
    return [error];
  }

  return getMessagesFromBody(error.responseJSON || error.statusBody);
}

function getStatusAnnouncement(actionLabel, result, error) {
  const label = actionLabel || 'Action';
  const [firstErrorMessage] = getErrorMessages(error);

  if (result.wasSuccessful) {
    return `${label} completed successfully.`;
  }

  if (result.hasWarning) {
    return firstErrorMessage ?
      `${label} completed with warnings. ${firstErrorMessage}` :
      `${label} completed with warnings.`;
  }

  if (result.hasError) {
    return firstErrorMessage ?
      `${label} failed. ${firstErrorMessage}` :
      `${label} failed.`;
  }

  return '';
}

function getTestResult(error) {
  if (!error) {
    return {
      wasSuccessful: true,
      hasWarning: false,
      hasError: false
    };
  }

  if (error.status !== 400) {
    return {
      wasSuccessful: false,
      hasWarning: false,
      hasError: true
    };
  }

  const failures = error.responseJSON;

  const hasWarning = _.some(failures, { isWarning: true });
  const hasError = _.some(failures, (failure) => !failure.isWarning);

  return {
    wasSuccessful: false,
    hasWarning,
    hasError
  };
}

class SpinnerErrorButton extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this._testResultTimeout = null;

    this.state = {
      wasSuccessful: false,
      hasWarning: false,
      hasError: false,
      announcement: ''
    };
  }

  componentDidUpdate(prevProps) {
    const {
      isSpinning,
      error
    } = this.props;

    if (prevProps.isSpinning && !isSpinning) {
      const testResult = getTestResult(error);

      this.setState(testResult, () => {
        const {
          wasSuccessful,
          hasWarning,
          hasError
        } = testResult;

        if (wasSuccessful || hasWarning || hasError) {
          this._testResultTimeout = setTimeout(this.resetState, 3000);
        }
      });

      this.setState({
        announcement: getStatusAnnouncement(getTextContent(this.props.children), testResult, error)
      });
    }
  }

  componentWillUnmount() {
    if (this._testResultTimeout) {
      clearTimeout(this._testResultTimeout);
    }
  }

  //
  // Control

  resetState = () => {
    this.setState({
      wasSuccessful: false,
      hasWarning: false,
      hasError: false,
      announcement: ''
    });
  };

  //
  // Render

  render() {
    const {
      kind,
      isSpinning,
      error,
      children,
      ...otherProps
    } = this.props;

    const {
      wasSuccessful,
      hasWarning,
      hasError,
      announcement
    } = this.state;

    const showIcon = wasSuccessful || hasWarning || hasError;

    let iconName = icons.CHECK;
    let iconKind = kind === kinds.PRIMARY ? kinds.DEFAULT : kinds.SUCCESS;

    if (hasWarning) {
      iconName = icons.WARNING;
      iconKind = kinds.WARNING;
    }

    if (hasError) {
      iconName = icons.DANGER;
      iconKind = kinds.DANGER;
    }

    return (
      <>
        <SpinnerButton
          kind={kind}
          isSpinning={isSpinning}
          {...otherProps}
        >
          <span className={showIcon ? styles.showIcon : undefined}>
            {
              showIcon &&
                <span className={styles.iconContainer}>
                  <Icon
                    name={iconName}
                    kind={iconKind}
                  />
                </span>
            }

            {
              <span className={styles.label}>
                {
                  children
                }
              </span>
            }
          </span>
        </SpinnerButton>

        <span
          aria-live="polite"
          aria-atomic="true"
          style={screenReaderOnlyStyle}
        >
          {announcement}
        </span>
      </>
    );
  }
}

SpinnerErrorButton.propTypes = {
  kind: PropTypes.oneOf(kinds.all),
  isSpinning: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  children: PropTypes.node.isRequired
};

export default SpinnerErrorButton;
