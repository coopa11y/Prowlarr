import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { kinds } from 'Helpers/Props';
import styles from './Alert.css';

function Alert(props) {
  const { className, kind, role, children, ...otherProps } = props;
  let alertRole = role;

  if (!alertRole && kind === kinds.DANGER) {
    alertRole = 'alert';
  } else if (!alertRole && kind === kinds.WARNING) {
    alertRole = 'status';
  }

  let ariaLive = undefined;

  if (alertRole === 'alert') {
    ariaLive = 'assertive';
  } else if (alertRole === 'status') {
    ariaLive = 'polite';
  }

  return (
    <div
      className={classNames(
        className,
        styles[kind]
      )}
      role={alertRole}
      aria-live={ariaLive}
      {...otherProps}
    >
      {children}
    </div>
  );
}

Alert.propTypes = {
  className: PropTypes.string,
  kind: PropTypes.oneOf(kinds.all),
  role: PropTypes.oneOf(['alert', 'status']),
  children: PropTypes.node.isRequired
};

Alert.defaultProps = {
  className: styles.alert,
  kind: kinds.INFO
};

export default Alert;
