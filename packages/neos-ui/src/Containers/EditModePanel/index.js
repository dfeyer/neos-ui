import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get, $or} from 'plow-js';
import {memoize} from 'ramda';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import Panel from './Panel';
import style from './style.css';

@connect($transform({
    isFringedLeft: $get('ui.leftSideBar.isHidden'),
    isFringedRight: $get('ui.rightSideBar.isHidden'),
    editPreviewMode: selectors.UI.EditPreviewMode.currentEditPreviewMode,
    isHidden: $or(
        $get('ui.editModePanel.isHidden'),
        $get('ui.fullScreen.isFullScreen')
    )
}), {
    setEditPreviewMode: actions.UI.EditPreviewMode.set
})
@neos(globalRegistry => ({
    editPreviewModes: globalRegistry.get('frontendConfiguration').get('editPreviewModes'),
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class EditModePanel extends PureComponent {
    static propTypes = {
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        editPreviewMode: PropTypes.string.isRequired,
        isHidden: PropTypes.bool.isRequired,
        setEditPreviewMode: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,

        editPreviewModes: PropTypes.object.isRequired
    };

    handleEditPreviewModeClick = memoize(mode => () => {
        const {setEditPreviewMode} = this.props;

        setEditPreviewMode(mode);
    });

    render() {
        const {
            isFringedLeft,
            isFringedRight,
            editPreviewMode,
            isHidden,
            editPreviewModes,
            i18nRegistry
        } = this.props;
        const classNames = mergeClassNames({
            [style.editModePanel]: true,
            [style['editModePanel--isFringeLeft']]: isFringedLeft,
            [style['editModePanel--isFringeRight']]: isFringedRight,
            [style['editModePanel--isHidden']]: isHidden
        });

        const currentEditMode = editPreviewModes[editPreviewMode];

        const editPreviewModesList = Object.keys(editPreviewModes).map(key => {
            const element = editPreviewModes[key];
            if (element) {
                element.id = key;
            }
            return element;
        });

        const editingModes = editPreviewModesList.filter(mode => mode !== null && mode.isEditingMode && mode.id !== mode);
        const previewModes = editPreviewModesList.filter(mode => mode !== null && mode.isPreviewMode && mode.id !== mode);

        return (
            <div className={classNames}>
                <div className={style.editModePanel__wrapper}>
                    { editingModes.length ?
                    <Panel
                        title={i18nRegistry.translate('content.components.editPreviewPanel.modes', 'Editing Modes')}
                        className={style.editModePanel__editingModes}
                        modes={editingModes}
                        current={editPreviewMode}
                        currentMode={currentEditMode.isEditingMode ? currentEditMode : null}
                        style={style}
                        onPreviewModeClick={this.handleEditPreviewModeClick}
                        /> : null }
                    { previewModes.length ?
                    <Panel
                        title={i18nRegistry.translate('content.components.editPreviewPanel.previewCentral', 'Preview Central')}
                        className={style.editModePanel__previewModes}
                        modes={previewModes}
                        current={editPreviewMode}
                        currentMode={currentEditMode.isPreviewMode ? currentEditMode : null}
                        style={style}
                        onPreviewModeClick={this.handleEditPreviewModeClick}
                        /> : null }
                </div>
            </div>
        );
    }
}
