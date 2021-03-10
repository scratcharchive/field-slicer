import { FunctionComponent, useCallback } from "react";
import Hyperlink from "../../common/Hyperlink";
import { FieldModel, WorkspaceRouteDispatch } from "../../pluginInterface";
import FieldModelSlicesView from "./FieldModelSlicesView";

type Props = {
    fieldModel: FieldModel
    workspaceRouteDispatch: WorkspaceRouteDispatch
}

const FieldModelView: FunctionComponent<Props> = ({fieldModel, workspaceRouteDispatch}) => {
    const handleBack = useCallback(() => {
        workspaceRouteDispatch({type: 'gotoFieldModelsPage'})
    }, [workspaceRouteDispatch])
    if (!fieldModel) return <div>No field model</div>
    return (
        <div>
            <Hyperlink onClick={handleBack}>Back to field models</Hyperlink>
            <div>
                <h3>Field model: {fieldModel.fieldModelId} ({fieldModel.fieldModelLabel})</h3>
            </div>
            <FieldModelSlicesView
                fieldModel={fieldModel}
            />
        </div>
    )
}

export default FieldModelView