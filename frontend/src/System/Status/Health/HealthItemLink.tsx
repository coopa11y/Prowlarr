import React from 'react';
import IconButton from 'Components/Link/IconButton';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

interface HealthItemLinkProps {
  source: string;
  context?: string;
}

function HealthItemLink(props: HealthItemLinkProps) {
  const { source, context } = props;

  switch (source) {
    case 'ApplicationStatusCheck':
    case 'ApplicationLongTermStatusCheck':
      return (
        <IconButton
          name={icons.SETTINGS}
          title={translate('Settings')}
          actionLabel={translate('Settings')}
          context={context}
          to="/settings/applications"
        />
      );
    case 'DownloadClientStatusCheck':
      return (
        <IconButton
          name={icons.SETTINGS}
          title={translate('Settings')}
          actionLabel={translate('Settings')}
          context={context}
          to="/settings/downloadclients"
        />
      );
    case 'NotificationStatusCheck':
      return (
        <IconButton
          name={icons.SETTINGS}
          title={translate('Settings')}
          actionLabel={translate('Settings')}
          context={context}
          to="/settings/connect"
        />
      );
    case 'IndexerProxyStatusCheck':
      return (
        <IconButton
          name={icons.SETTINGS}
          title={translate('Settings')}
          actionLabel={translate('Settings')}
          context={context}
          to="/settings/indexers"
        />
      );
    case 'IndexerRssCheck':
    case 'IndexerSearchCheck':
    case 'IndexerStatusCheck':
    case 'IndexerLongTermStatusCheck':
      return (
        <IconButton
          name={icons.SETTINGS}
          title={translate('Settings')}
          actionLabel={translate('Settings')}
          context={context}
          to="/"
        />
      );
    case 'UpdateCheck':
      return (
        <IconButton
          name={icons.UPDATE}
          title={translate('Updates')}
          actionLabel={translate('Updates')}
          context={context}
          to="/system/updates"
        />
      );
    default:
      return null;
  }
}

export default HealthItemLink;
