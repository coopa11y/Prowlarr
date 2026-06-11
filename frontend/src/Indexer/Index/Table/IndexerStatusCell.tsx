import React, { CSSProperties } from 'react';
import Icon from 'Components/Icon';
import VirtualTableRowCell from 'Components/Table/Cells/TableRowCell';
import Popover from 'Components/Tooltip/Popover';
import { icons, kinds, tooltipPositions } from 'Helpers/Props';
import { IndexerStatus } from 'Indexer/Indexer';
import translate from 'Utilities/String/translate';
import DisabledIndexerInfo from './DisabledIndexerInfo';
import styles from './IndexerStatusCell.css';

const screenReaderOnlyStyle: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

function getIconKind(enabled: boolean, redirect: boolean) {
  if (enabled) {
    return redirect ? kinds.INFO : kinds.SUCCESS;
  }

  return kinds.DEFAULT;
}

function getIconName(enabled: boolean, redirect: boolean) {
  if (enabled) {
    return redirect ? icons.REDIRECT : icons.CHECK;
  }

  return icons.BLOCKLIST;
}

function getIconTooltip(enabled: boolean, redirect: boolean) {
  if (enabled) {
    return redirect ? translate('EnabledRedirected') : translate('Enabled');
  }

  return translate('Disabled');
}

interface IndexerStatusCellProps {
  className: string;
  enabled: boolean;
  redirect: boolean;
  status?: IndexerStatus;
  longDateFormat: string;
  timeFormat: string;
  component?: React.ElementType;
}

function IndexerStatusCell(props: IndexerStatusCellProps) {
  const {
    className,
    enabled,
    redirect,
    status,
    longDateFormat,
    timeFormat,
    component: Component = VirtualTableRowCell,
    ...otherProps
  } = props;

  const enabledLabel = getIconTooltip(enabled, redirect);
  const statusLabel = status
    ? `${enabledLabel}. ${translate('IndexerDisabled')}`
    : enabledLabel;

  return (
    <Component className={className} aria-label={statusLabel} {...otherProps}>
      <span style={screenReaderOnlyStyle}>{statusLabel}</span>

      <Icon
        className={styles.statusIcon}
        kind={getIconKind(enabled, redirect)}
        name={getIconName(enabled, redirect)}
        title={getIconTooltip(enabled, redirect)}
      />
      {status ? (
        <Popover
          className={styles.indexerStatusTooltip}
          canFlip={true}
          anchor={
            <Icon
              className={styles.statusIcon}
              kind={kinds.DANGER}
              name={icons.WARNING}
            />
          }
          title={translate('IndexerDisabled')}
          body={
            <div>
              <DisabledIndexerInfo
                mostRecentFailure={status.mostRecentFailure}
                initialFailure={status.initialFailure}
                disabledTill={status.disabledTill}
                longDateFormat={longDateFormat}
                timeFormat={timeFormat}
              />
            </div>
          }
          position={tooltipPositions.BOTTOM}
        />
      ) : null}
    </Component>
  );
}

export default IndexerStatusCell;
