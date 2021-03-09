import { BasePlugin } from "labbox";
import { FunctionComponent } from "react";
import { WorkspaceDispatch, WorkspaceState } from "./workspaceReducer";
import { WorkspaceRoute, WorkspaceRouteDispatch } from "./WorkspaceRoute";

export type WorkspaceViewProps = {
    workspace: WorkspaceState
    workspaceDispatch: WorkspaceDispatch
    workspaceRoute: WorkspaceRoute
    workspaceRouteDispatch: WorkspaceRouteDispatch
    width: number
    height: number
}

export interface WorkspaceViewPlugin extends BasePlugin {
    type: 'WorkspaceView'
    component: FunctionComponent<WorkspaceViewProps>
}