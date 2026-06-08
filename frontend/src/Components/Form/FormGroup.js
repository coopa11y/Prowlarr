import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'Helpers/elementChildren';
import { sizes } from 'Helpers/Props';
import FormLabel from './FormLabel';
import styles from './FormGroup.css';

function FormGroup(props) {
  const {
    className,
    children,
    size,
    advancedSettings,
    isAdvanced,
    ...otherProps
  } = props;

  if (!advancedSettings && isAdvanced) {
    return null;
  }

  const childProps = isAdvanced ? { isAdvanced } : {};
  const childrenArray = React.Children.toArray(children);
  const inputChild = childrenArray.find((child) => {
    if (!React.isValidElement(child) || child.type === FormLabel) {
      return false;
    }

    return typeof child.props.name === 'string';
  });
  const labelName = React.isValidElement(inputChild) && typeof inputChild.props.name === 'string' ?
    inputChild.props.name :
    undefined;

  return (
    <div
      className={classNames(
        className,
        styles[size]
      )}
      {...otherProps}
    >
      {
        map(childrenArray, (child) => {
          if (React.isValidElement(child) && child.type === FormLabel && !child.props.name && labelName) {
            return React.cloneElement(child, {
              ...childProps,
              name: labelName
            });
          }

          return React.cloneElement(child, childProps);
        })
      }
    </div>
  );
}

FormGroup.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(sizes.all).isRequired,
  advancedSettings: PropTypes.bool.isRequired,
  isAdvanced: PropTypes.bool.isRequired
};

FormGroup.defaultProps = {
  className: styles.group,
  size: sizes.SMALL,
  advancedSettings: false,
  isAdvanced: false
};

export default FormGroup;
