import { FSExtensionContext } from "../pluginInterface";
import WorkspaceView from "./WorkspaceView";

export function activate(context: FSExtensionContext) {
    context.registerPlugin({
        type: 'WorkspaceView',
        name: 'WorkspaceView',
        label: 'Workspace View',
        component: WorkspaceView
    })
}