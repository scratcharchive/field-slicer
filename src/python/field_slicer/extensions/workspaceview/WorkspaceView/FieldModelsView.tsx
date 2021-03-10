import { FunctionComponent, useCallback, useMemo } from "react";
import Hyperlink from "../../common/Hyperlink";
import NiceTable from "../../common/NiceTable";
import { FieldModel } from "../../pluginInterface";

type Props = {
    fieldModels: FieldModel[]
    onFieldModelClicked: (fieldModelId: string) => void
    onDeleteFieldModels: (fieldModelIds: string[]) => void
}

const FieldModelsView: FunctionComponent<Props> = ({fieldModels, onFieldModelClicked, onDeleteFieldModels}) => {
    const columns = useMemo(() => ([
        {
            key: 'fieldModelId',
            label: 'Field Model'
        },
        {
            key: 'fieldModelLabel',
            label: 'Label'
        }
    ]), [])
    const rows = useMemo(() => (fieldModels.map(fm => ({
        key: fm.fieldModelId,
        columnValues: {
            fieldModelId: {text: fm.fieldModelId, element: <span><FieldModelLink fieldModel={fm} label={fm.fieldModelId} onClick={onFieldModelClicked} />&nbsp;&nbsp;&nbsp;</span>},
            fieldModelLabel: {text: fm.fieldModelLabel, element: <span><FieldModelLink fieldModel={fm} label={fm.fieldModelLabel} onClick={onFieldModelClicked} />&nbsp;&nbsp;&nbsp;</span>},
        }
    }))), [fieldModels, onFieldModelClicked])
    const handleDeleteFieldModel = useCallback((fieldModelId: string) => {
        onDeleteFieldModels([fieldModelId])
    }, [onDeleteFieldModels])
    return (
        <NiceTable
            columns={columns}
            rows={rows}
            onDeleteRow={handleDeleteFieldModel}
        />
    )
}

const FieldModelLink: FunctionComponent<{fieldModel: FieldModel, onClick: (fieldModelId: string) => void, label: string}> = ({fieldModel, onClick, label}) => {
    const handleClick = useCallback(() => {
        onClick(fieldModel.fieldModelId)
    }, [onClick, fieldModel.fieldModelId])
    return <Hyperlink onClick={handleClick}>{label}</Hyperlink>
}

export default FieldModelsView