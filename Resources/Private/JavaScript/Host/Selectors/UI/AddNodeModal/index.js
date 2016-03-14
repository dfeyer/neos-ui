import {$get} from 'plow-js';
import {createSelector} from 'reselect';
import {storedNodeByContextPath} from '../../CR/Nodes/';
import {groupedAllowedNodeTypesSelector} from '../../CR/Constraints/';

const referenceNodeContextPathSelector = state => $get('ui.addNodeModal.referenceNode', state);

export const referenceNodeSelector = createSelector(
    [
        referenceNodeContextPathSelector,
        storedNodeByContextPath
    ],
    (referenceNodeContextPath, getNodeByContextPath) =>
        getNodeByContextPath(referenceNodeContextPath)
);

const modeSelector = state => $get('ui.addNodeModal.mode', state);

export const nodeTypesForAddNodeModalSelector = createSelector(
    [
        referenceNodeSelector,
        modeSelector,
        groupedAllowedNodeTypesSelector
    ],
    (referenceNode, mode, getGroupedAllowedNodeTypes) => getGroupedAllowedNodeTypes(referenceNode, mode)
);