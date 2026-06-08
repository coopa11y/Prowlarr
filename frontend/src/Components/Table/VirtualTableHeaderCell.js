import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import useKeyboardActivation from 'Helpers/Hooks/useKeyboardActivation';
import { icons, sortDirections } from 'Helpers/Props';
import styles from './VirtualTableHeaderCell.css';

export function headerRenderer(headerProps) {
  const {
    columnData = {},
    dataKey,
    label
  } = headerProps;

  return (

    // eslint-disable-next-line no-use-before-define
    <VirtualTableHeaderCell
      name={dataKey}
      {...columnData}
    >
      {label}
    </VirtualTableHeaderCell>
  );
}

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

class VirtualTableHeaderCell extends Component {

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
      isSortable,
      sortKey,
      sortDirection,
      fixedSortDirection,
      children,
      label,
      columnLabel,
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
        <SortableVirtualHeaderLink
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
        </SortableVirtualHeaderLink> :

        <div className={className}>
          {children}
        </div>
    );
  }
}

function SortableVirtualHeaderLink(props) {
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
      component="div"
      className={className}
      role="button"
      tabIndex={0}
      aria-sort={ariaSort}
      aria-label={sortLabel}
      title={title}
      onKeyDown={onKeyDown}
      onPress={onPress}
      {...otherProps}
    >
      {children}
    </Link>
  );
}

SortableVirtualHeaderLink.propTypes = {
  className: PropTypes.string,
  ariaSort: PropTypes.string.isRequired,
  sortLabel: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  onPress: PropTypes.func.isRequired
};

VirtualTableHeaderCell.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  columnLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  isSortable: PropTypes.bool,
  sortKey: PropTypes.string,
  fixedSortDirection: PropTypes.string,
  sortDirection: PropTypes.string,
  children: PropTypes.node,
  'aria-label': PropTypes.string,
  onSortPress: PropTypes.func
};

VirtualTableHeaderCell.defaultProps = {
  className: styles.headerCell,
  isSortable: false
};

export default VirtualTableHeaderCell;
