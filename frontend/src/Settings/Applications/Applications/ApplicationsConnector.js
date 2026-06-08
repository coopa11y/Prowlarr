import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { deleteApplication, fetchApplications, testApplication } from 'Store/Actions/settingsActions';
import createSortedSectionSelector from 'Store/Selectors/createSortedSectionSelector';
import createTagsSelector from 'Store/Selectors/createTagsSelector';
import sortByProp from 'Utilities/Array/sortByProp';
import Applications from './Applications';

function createMapStateToProps() {
  return createSelector(
    createSortedSectionSelector('settings.applications', sortByProp('name')),
    createTagsSelector(),
    (applications, tagList) => {
      return {
        ...applications,
        tagList
      };
    }
  );
}

const mapDispatchToProps = {
  fetchApplications,
  deleteApplication,
  testApplication
};

class ApplicationsConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.fetchApplications();
  }

  //
  // Listeners

  onConfirmDeleteApplication = (id) => {
    this.props.deleteApplication({ id });
  };

  onTestApplicationPress = (id) => {
    this.props.testApplication({ id });
  };

  //
  // Render

  render() {
    return (
      <Applications
        {...this.props}
        onConfirmDeleteApplication={this.onConfirmDeleteApplication}
        onTestApplicationPress={this.onTestApplicationPress}
      />
    );
  }
}

ApplicationsConnector.propTypes = {
  fetchApplications: PropTypes.func.isRequired,
  deleteApplication: PropTypes.func.isRequired,
  testApplication: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(ApplicationsConnector);
