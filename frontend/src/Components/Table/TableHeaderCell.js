import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import useKeyboardActivation from 'Helpers/Hooks/useKeyboardActivation';
import { icons, sortDirections } from 'Helpers/Props';
import styles from './TableHeaderCell.css';

function getTextValue(value) {
  return typeof value === 'function' ? value() : value;
}

function getSortLabel(column, ariaSort) {
  if (!column) {
    return undefined;
  }

  if (ariaSort === 'none') {
    return `Sort by ${column}`;
  }

  return `Sort by ${column}. Current sort ${ariaSort}.`;
}

class TableHeaderCell extends Component {

  //
  // Listeners

  onPress = () => {
    const {
      name,
      fixedSortDirection
    } = this.props;

    if (fixedSortDirection) {
      this.props.onSortPress(name, fixedSortDirection);
    } else {
      this.props.onSortPress(name);
    }
  };

  //
  // Render

  render() {
    const {
      className,
      name,
      label,
      columnLabel,
      isSortable,
      isVisible,
      isModifiable,
      sortKey,
      sortDirection,
      fixedSortDirection,
      children,
      'aria-label': ariaLabel,
      onSortPress,
      ...otherProps
    } = this.props;

    const isSorting = isSortable && sortKey === name;
    const sortIcon = sortDirection === sortDirections.ASCENDING ?
      icons.SORT_ASCENDING :
      icons.SORT_DESCENDING;
    let ariaSort = 'none';

    if (isSorting) {
      ariaSort = sortDirection === sortDirections.ASCENDING ? 'ascending' : 'descending';
    }

    const columnLabelText = getTextValue(columnLabel) ||
      (typeof label === 'function' ? label() : undefined) ||
      (typeof children === 'string' ? children : undefined) ||
      name;
    const sortLabel = ariaLabel || getSortLabel(columnLabelText, ariaSort);

    return (
      isSortable ?
        <SortableHeaderLink
          {...otherProps}
          className={className}
          ariaSort={ariaSort}
          sortLabel={sortLabel}
          title={columnLabelText}
          onPress={this.onPress}
        >
          {children}

          {
            isSorting &&
              <Icon
                name={sortIcon}
                className={styles.sortIcon}
              />
          }
        </SortableHeaderLink> :

        <th
          className={className}
          scope="col"
        >
          {children}
        </th>
    );
  }
}

function SortableHeaderLink(props) {
  const {
    className,
    ariaSort,
    sortLabel,
    title,
    children,
    onPress,
    ...otherProps
  } = props;
  const onKeyDown = useKeyboardActivation();

  return (
    <Link
      {...otherProps}
      component="th"
      className={className}
      tabIndex={0}
      scope="col"
      aria-sort={ariaSort}
      aria-label={sortLabel}
      title={title}
      onKeyDown={onKeyDown}
      onPress={onPress}
    >
      {children}
    </Link>
  );
}

SortableHeaderLink.propTypes = {
  className: PropTypes.string,
  ariaSort: PropTypes.string.isRequired,
  sortLabel: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  onPress: PropTypes.func.isRequired
};

TableHeaderCell.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.node]),
  columnLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  isSortable: PropTypes.bool,
  isVisible: PropTypes.bool,
  isModifiable: PropTypes.bool,
  sortKey: PropTypes.string,
  fixedSortDirection: PropTypes.string,
  sortDirection: PropTypes.string,
  children: PropTypes.node,
  'aria-label': PropTypes.string,
  onSortPress: PropTypes.func
};

TableHeaderCell.defaultProps = {
  className: styles.headerCell,
  isSortable: false
};

export default TableHeaderCell;
