import { BasePlugin, ExtensionContext, usePlugins } from 'labbox'
import { FunctionComponent, useMemo } from "react"
import { WorkspaceDispatch, WorkspaceState } from './workspaceReducer'
import { WorkspaceRoute, WorkspaceRouteDispatch } from './WorkspaceRoute'
import { WorkspaceViewPlugin } from './WorkspaceViewPlugin'
export type { default as FieldModel } from './FieldModel'
export { default as workspaceReducer } from './workspaceReducer'
export type { WorkspaceAction } from './workspaceReducer'
export type { WorkspaceRoute, WorkspaceRouteDispatch } from './WorkspaceRoute'

export type MainWindowProps = {
    workspace: WorkspaceState
    workspaceDispatch: WorkspaceDispatch
    workspaceRoute: WorkspaceRoute
    workspaceRouteDispatch: WorkspaceRouteDispatch
    version: string
    width?: number
    height?: number
}
export interface MainWindowPlugin extends BasePlugin {
    type: 'MainWindow'
    component: FunctionComponent<MainWindowProps>
}

export type FSPlugin = MainWindowPlugin | WorkspaceViewPlugin

export type FSExtensionContext = ExtensionContext<FSPlugin>

export const useWorkspaceViewPlugins = (): WorkspaceViewPlugin[] => {
    const plugins = usePlugins<FSPlugin>()
    return useMemo(() => (
        plugins.filter(p => (p.type === 'WorkspaceView')).map(p => (p as any as WorkspaceViewPlugin))
    ), [plugins])
}