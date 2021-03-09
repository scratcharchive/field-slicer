// This file was automatically generated. Do not edit directly.


import { FSExtensionContext } from './python/field_slicer/extensions/pluginInterface'

const registerExtensions = async (context: FSExtensionContext) => {
    const {activate: activate_mainwindow} = await import('./python/field_slicer/extensions/mainwindow/mainwindow')
    activate_mainwindow(context)
    const {activate: activate_workspaceview} = await import('./python/field_slicer/extensions/workspaceview/workspaceview')
    activate_workspaceview(context)
    }

export default registerExtensions