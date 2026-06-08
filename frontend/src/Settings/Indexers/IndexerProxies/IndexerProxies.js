import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import AddIndexerProxyModal from './AddIndexerProxyModal';
import EditIndexerProxyModalConnector from './EditIndexerProxyModalConnector';
import IndexerProxy from './IndexerProxy';
import styles from './IndexerProxies.css';

class IndexerProxies extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isAddIndexerProxyModalOpen: false,
      isEditIndexerProxyModalOpen: false,
      testingIndexerProxyId: null
    };
  }

  //
  // Listeners

  onAddIndexerProxyPress = () => {
    this.setState({ isAddIndexerProxyModalOpen: true });
  };

  onAddIndexerProxyModalClose = ({ indexerProxySelected = false } = {}) => {
    this.setState({
      isAddIndexerProxyModalOpen: false,
      isEditIndexerProxyModalOpen: indexerProxySelected
    });
  };

  onEditIndexerProxyModalClose = () => {
    this.setState({ isEditIndexerProxyModalOpen: false });
  };

  onTestIndexerProxyPress = (id) => {
    this.setState({ testingIndexerProxyId: id });
    this.props.onTestIndexerProxyPress(id);
  };

  //
  // Render

  render() {
    const {
      items,
      tagList,
      indexerList,
      isTesting,
      saveError,
      onConfirmDeleteIndexerProxy,
      ...otherProps
    } = this.props;

    const {
      isAddIndexerProxyModalOpen,
      isEditIndexerProxyModalOpen,
      testingIndexerProxyId
    } = this.state;

    return (
      <FieldSet legend={translate('IndexerProxies')}>
        <PageSectionContent
          errorMessage={translate('UnableToLoadIndexerProxies')}
          {...otherProps}
        >
          <div className={styles.indexerProxies}>
            {
              items.map((item) => {
                return (
                  <IndexerProxy
                    key={item.id}
                    {...item}
                    tagList={tagList}
                    indexerList={indexerList}
                    isTesting={isTesting && testingIndexerProxyId === item.id}
                    testError={testingIndexerProxyId === item.id ? saveError : null}
                    onConfirmDeleteIndexerProxy={onConfirmDeleteIndexerProxy}
                    onTestIndexerProxyPress={this.onTestIndexerProxyPress}
                  />
                );
              })
            }

            <Card
              className={styles.addIndexerProxy}
              onPress={this.onAddIndexerProxyPress}
            >
              <div className={styles.center}>
                <Icon
                  name={icons.ADD}
                  size={45}
                />
              </div>
            </Card>
          </div>

          <AddIndexerProxyModal
            isOpen={isAddIndexerProxyModalOpen}
            onModalClose={this.onAddIndexerProxyModalClose}
          />

          <EditIndexerProxyModalConnector
            isOpen={isEditIndexerProxyModalOpen}
            onModalClose={this.onEditIndexerProxyModalClose}
          />
        </PageSectionContent>
      </FieldSet>
    );
  }
}

IndexerProxies.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.object,
  saveError: PropTypes.object,
  isTesting: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  tagList: PropTypes.arrayOf(PropTypes.object).isRequired,
  indexerList: PropTypes.arrayOf(PropTypes.object).isRequired,
  onConfirmDeleteIndexerProxy: PropTypes.func.isRequired,
  onTestIndexerProxyPress: PropTypes.func.isRequired
};

export default IndexerProxies;
