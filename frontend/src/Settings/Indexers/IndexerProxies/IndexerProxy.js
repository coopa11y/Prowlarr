import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Card from 'Components/Card';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TagList from 'Components/TagList';
import { icons, kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import EditIndexerProxyModalConnector from './EditIndexerProxyModalConnector';
import styles from './IndexerProxy.css';

class IndexerProxy extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isEditIndexerProxyModalOpen: false,
      isDeleteIndexerProxyModalOpen: false
    };
  }

  //
  // Listeners

  onEditIndexerProxyPress = () => {
    this.setState({ isEditIndexerProxyModalOpen: true });
  };

  onEditIndexerProxyModalClose = () => {
    this.setState({ isEditIndexerProxyModalOpen: false });
  };

  onDeleteIndexerProxyPress = () => {
    this.setState({
      isEditIndexerProxyModalOpen: false,
      isDeleteIndexerProxyModalOpen: true
    });
  };

  onDeleteIndexerProxyModalClose= () => {
    this.setState({ isDeleteIndexerProxyModalOpen: false });
  };

  onConfirmDeleteIndexerProxy = () => {
    this.props.onConfirmDeleteIndexerProxy(this.props.id);
  };

  //
  // Render

  render() {
    const {
      id,
      name,
      tags,
      tagList,
      indexerList,
      isTesting,
      testError,
      onTestIndexerProxyPress
    } = this.props;

    return (
      <Card
        className={styles.indexerProxy}
        overlayContent={true}
        onPress={this.onEditIndexerProxyPress}
      >
        <div className={styles.nameContainer}>
          <div className={styles.name}>
            {name}
          </div>

          <div className={styles.actionButtons}>
            <IconButton
              className={styles.actionButton}
              name={icons.TEST}
              title={translate('Test')}
              actionLabel={translate('Test')}
              context={name}
              isSpinning={isTesting}
              isDisabled={isTesting}
              announceCompletion={true}
              error={testError}
              onPress={() => onTestIndexerProxyPress(id)}
            />
          </div>
        </div>

        <TagList
          tags={tags}
          tagList={tagList}
        />

        <div className={styles.indexers}>
          {
            tags.map((t) => {
              const indexers = _.filter(indexerList, { tags: [t] });

              if (!indexers || indexers.length === 0) {
                return null;
              }

              return indexers.map((i) => {
                return (
                  <Label
                    key={i.name}
                    kind={kinds.SUCCESS}
                  >
                    {i.name}
                  </Label>
                );
              });
            })
          }
        </div>

        {
          !tags || tags.length === 0 ?
            <Label
              kind={kinds.DISABLED}
              outline={true}
            >
              {translate('Disabled')}
            </Label> :
            null
        }

        <EditIndexerProxyModalConnector
          id={id}
          isOpen={this.state.isEditIndexerProxyModalOpen}
          onModalClose={this.onEditIndexerProxyModalClose}
          onDeleteIndexerProxyPress={this.onDeleteIndexerProxyPress}
        />

        <ConfirmModal
          isOpen={this.state.isDeleteIndexerProxyModalOpen}
          kind={kinds.DANGER}
          title={translate('DeleteIndexerProxy')}
          message={translate('DeleteIndexerProxyMessageText', { name })}
          confirmLabel={translate('Delete')}
          onConfirm={this.onConfirmDeleteIndexerProxy}
          onCancel={this.onDeleteIndexerProxyModalClose}
        />
      </Card>
    );
  }
}

IndexerProxy.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.number).isRequired,
  tagList: PropTypes.arrayOf(PropTypes.object).isRequired,
  indexerList: PropTypes.arrayOf(PropTypes.object).isRequired,
  isTesting: PropTypes.bool.isRequired,
  testError: PropTypes.object,
  onConfirmDeleteIndexerProxy: PropTypes.func.isRequired,
  onTestIndexerProxyPress: PropTypes.func.isRequired
};

export default IndexerProxy;
