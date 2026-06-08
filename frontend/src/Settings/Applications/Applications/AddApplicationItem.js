import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ActionCard from 'Components/Link/ActionCard';
import Button from 'Components/Link/Button';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { sizes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import AddApplicationPresetMenuItem from './AddApplicationPresetMenuItem';
import styles from './AddApplicationItem.css';

class AddApplicationItem extends Component {

  //
  // Listeners

  onApplicationSelect = () => {
    const {
      implementation,
      implementationName
    } = this.props;

    this.props.onApplicationSelect({ implementation, implementationName });
  };

  //
  // Render

  render() {
    const {
      implementation,
      implementationName,
      infoLink,
      presets,
      onApplicationSelect
    } = this.props;

    const hasPresets = !!presets && !!presets.length;

    return (
      <ActionCard
        className={styles.application}
        underlayClassName={styles.underlay}
        overlayClassName={styles.overlay}
        nameClassName={styles.name}
        actionsClassName={styles.actions}
        label={`${translate('AddApplication')}: ${implementationName}`}
        name={implementationName}
        title={implementationName}
        onPress={this.onApplicationSelect}
      >
        {
          hasPresets &&
            <span>
              <Button
                size={sizes.SMALL}
                onPress={this.onApplicationSelect}
              >
                Custom
              </Button>

              <Menu className={styles.presetsMenu}>
                <Button
                  className={styles.presetsMenuButton}
                  size={sizes.SMALL}
                >
                  Presets
                </Button>

                <MenuContent>
                  {
                    presets.map((preset) => {
                      return (
                        <AddApplicationPresetMenuItem
                          key={preset.name}
                          name={preset.name}
                          implementation={implementation}
                          implementationName={implementationName}
                          onPress={onApplicationSelect}
                        />
                      );
                    })
                  }
                </MenuContent>
              </Menu>
            </span>
        }

        <Button
          to={infoLink}
          size={sizes.SMALL}
        >
          {translate('MoreInfo')}
        </Button>
      </ActionCard>
    );
  }
}

AddApplicationItem.propTypes = {
  implementation: PropTypes.string.isRequired,
  implementationName: PropTypes.string.isRequired,
  infoLink: PropTypes.string.isRequired,
  presets: PropTypes.arrayOf(PropTypes.object),
  onApplicationSelect: PropTypes.func.isRequired
};

export default AddApplicationItem;
