import FieldModel from "./FieldModel"

export type WorkspaceState = {
    fieldModels: FieldModel[]
}

type AddFieldModelWorkspaceAction = {
    type: 'addFieldModel'
    fieldModel: FieldModel
}

type DeleteFieldModelsWorkspaceAction = {
    type: 'deleteFieldModels'
    fieldModelIds: string[]
}

export type WorkspaceAction = AddFieldModelWorkspaceAction | DeleteFieldModelsWorkspaceAction

const workspaceReducer = (s: WorkspaceState, a: WorkspaceAction): WorkspaceState => {
    switch (a.type) {
        case 'addFieldModel': return { ...s, fieldModels: [...s.fieldModels.filter(x => (x.fieldModelId !== a.fieldModel.fieldModelId)), a.fieldModel] }
        case 'deleteFieldModels': return { ...s, fieldModels: s.fieldModels.filter(x => !a.fieldModelIds.includes(x.fieldModelId)) }
        default: return s
    }
}

export type WorkspaceDispatch = (a: WorkspaceAction) => void

const intersection = (a: number[], b: number[]) => (
    a.filter(x => (b.includes(x)))
)
const union = (a: number[], b: number[]) => (
    [...a, ...b.filter(x => (!a.includes(x)))].sort()
)

export default workspaceReducer