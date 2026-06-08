import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { deleteIndexerProxy, fetchIndexerProxies, testIndexerProxy } from 'Store/Actions/settingsActions';
import createSortedSectionSelector from 'Store/Selectors/createSortedSectionSelector';
import createTagsSelector from 'Store/Selectors/createTagsSelector';
import sortByProp from 'Utilities/Array/sortByProp';
import IndexerProxies from './IndexerProxies';

function createMapStateToProps() {
  return createSelector(
    createSortedSectionSelector('settings.indexerProxies', sortByProp('name')),
    createSortedSectionSelector('indexers', sortByProp('name')),
    createTagsSelector(),
    (indexerProxies, indexers, tagList) => {
      return {
        ...indexerProxies,
        indexerList: indexers.items,
        tagList
      };
    }
  );
}

const mapDispatchToProps = {
  fetchIndexerProxies,
  deleteIndexerProxy,
  testIndexerProxy
};

class IndexerProxiesConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.fetchIndexerProxies();
  }

  //
  // Listeners

  onConfirmDeleteIndexerProxy = (id) => {
    this.props.deleteIndexerProxy({ id });
  };

  onTestIndexerProxyPress = (id) => {
    this.props.testIndexerProxy({ id });
  };

  //
  // Render

  render() {
    return (
      <IndexerProxies
        {...this.props}
        onConfirmDeleteIndexerProxy={this.onConfirmDeleteIndexerProxy}
        onTestIndexerProxyPress={this.onTestIndexerProxyPress}
      />
    );
  }
}

IndexerProxiesConnector.propTypes = {
  fetchIndexerProxies: PropTypes.func.isRequired,
  deleteIndexerProxy: PropTypes.func.isRequired,
  testIndexerProxy: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(IndexerProxiesConnector);
