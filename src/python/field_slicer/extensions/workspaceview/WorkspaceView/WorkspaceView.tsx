import React, { FunctionComponent, useCallback } from 'react';
import { WorkspaceViewProps } from '../../pluginInterface/WorkspaceViewPlugin';
import FieldModelsView from './FieldModelsView';
import FieldModelView from './FieldModelView';

export interface LocationInterface {
  pathname: string
  search: string
}

export interface HistoryInterface {
  location: LocationInterface
  push: (x: LocationInterface) => void
}

const WorkspaceView: FunctionComponent<WorkspaceViewProps> = ({ workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, width=500, height=500 }) => {
  const handleDeleteFieldModels = useCallback((fieldModelIds: string[]) => {
    workspaceDispatch({
      type: 'deleteFieldModels',
      fieldModelIds
    })
  }, [workspaceDispatch])

  const handleClickFieldModel = useCallback((fieldModelId: string) => {
    workspaceRouteDispatch({
      type: 'gotoFieldModelPage',
      fieldModelId
    })
  }, [workspaceRouteDispatch])

  switch (workspaceRoute.page) {
    case 'fieldModels': return (
      <FieldModelsView fieldModels={workspace.fieldModels} onFieldModelClicked={handleClickFieldModel} onDeleteFieldModels={handleDeleteFieldModels} />
    )
    case 'fieldModel': return (
      <FieldModelView fieldModel={workspace.fieldModels.filter(fm => (fm.fieldModelId === workspaceRoute.fieldModelId))[0]} workspaceRouteDispatch={workspaceRouteDispatch} />
    )
  }
}

export default WorkspaceView