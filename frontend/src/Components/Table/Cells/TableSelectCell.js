import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CheckInput from 'Components/Form/CheckInput';
import TableRowCell from './TableRowCell';
import styles from './TableSelectCell.css';

class TableSelectCell extends Component {

  //
  // Lifecycle

  componentDidMount() {
    const {
      id,
      isSelected,
      onSelectedChange
    } = this.props;

    onSelectedChange({ id, value: isSelected });
  }

  componentWillUnmount() {
    const {
      id,
      onSelectedChange
    } = this.props;

    onSelectedChange({ id, value: null });
  }

  //
  // Listeners

  onChange = ({ value, shiftKey }, a, b, c, d) => {
    const {
      id,
      onSelectedChange
    } = this.props;

    onSelectedChange({ id, value, shiftKey });
  };

  //
  // Render

  render() {
    const {
      className,
      ariaLabel,
      id,
      isSelected,
      ...otherProps
    } = this.props;

    return (
      <TableRowCell className={className}>
        <CheckInput
          className={styles.input}
          name={id.toString()}
          ariaLabel={ariaLabel}
          value={isSelected}
          {...otherProps}
          onChange={this.onChange}
        />
      </TableRowCell>
    );
  }
}

TableSelectCell.propTypes = {
  className: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelectedChange: PropTypes.func.isRequired
};

TableSelectCell.defaultProps = {
  className: styles.selectCell,
  ariaLabel: 'Select Row',
  isSelected: false
};

export default TableSelectCell;
