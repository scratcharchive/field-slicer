import React, { FunctionComponent, useCallback } from 'react';
import { WorkspaceViewProps } from '../../pluginInterface/WorkspaceViewPlugin';

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

  switch (workspaceRoute.page) {
    case 'fieldModels': return (
      <div>Field models</div>
    )
  }
}

export default WorkspaceView