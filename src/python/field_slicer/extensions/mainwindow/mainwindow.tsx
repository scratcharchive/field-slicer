import { FSExtensionContext } from "../pluginInterface";
import MainWindow from "./MainWindow/MainWindow";

export function activate(context: FSExtensionContext) {
    context.registerPlugin({
        type: 'MainWindow',
        name: 'MainWindow',
        label: 'Main Window',
        component: MainWindow
    })
}