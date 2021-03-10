import { ServerInfo } from 'labbox/lib/LabboxProvider'
import QueryString from 'querystring'

type Page = 'fieldModels' | 'fieldModel'
export const isWorkspacePage = (x: string): x is Page => {
    return ['fieldModels', 'fieldModel'].includes(x)
}

type WorkspaceFieldModelsRoute = {
    page: 'fieldModels'
    workspaceUri?: string
}
type WorkspaceFieldModelRoute = {
    page: 'fieldModel'
    fieldModelId: string
    workspaceUri?: string
}
export type WorkspaceRoute = WorkspaceFieldModelsRoute | WorkspaceFieldModelRoute
type GotoFieldModelsPageAction = {
    type: 'gotoFieldModelsPage'
}
type GotoFieldModelPageAction = {
    type: 'gotoFieldModelPage'
    fieldModelId: string
}
export type WorkspaceRouteAction = GotoFieldModelsPageAction | GotoFieldModelPageAction
export type WorkspaceRouteDispatch = (a: WorkspaceRouteAction) => void

export interface LocationInterface {
    pathname: string
    search: string
}

export interface HistoryInterface {
    location: LocationInterface
    push: (x: LocationInterface) => void
}

export const routeFromLocation = (location: LocationInterface, serverInfo: ServerInfo | null): WorkspaceRoute => {
    const pathList = location.pathname.split('/')

    const query = QueryString.parse(location.search.slice(1));
    const workspace = (query.workspace as string) || 'default'
    const defaultFeedId = serverInfo?.defaultFeedId
    const workspaceUri = workspace.startsWith('workspace://') ? workspace : (defaultFeedId ? `workspace://${defaultFeedId}/${workspace}` : undefined)

    const page = pathList[1] || 'fieldModels'
    if (!isWorkspacePage(page)) throw Error(`Invalid page: ${page}`)
    switch (page) {
        case 'fieldModels': return {
            workspaceUri,
            page
        }
        case 'fieldModel': return {
            workspaceUri,
            page,
            fieldModelId: pathList[2]
        }
        default: return {
            workspaceUri,
            page: 'fieldModels'
        }
    }
}

const qs = (params: {[key: string]: any}) => {
    const list = []
    for (let k in params) {
        list.push(`${k}=${params[k]}`)
    }
    return list.join('&')
}

export const locationFromRoute = (route: WorkspaceRoute) => {
    const queryParams: { [key: string]: string } = {}
    if (route.workspaceUri) {
        queryParams['workspace'] = route.workspaceUri
    }
    const search = qs(queryParams)
    switch (route.page) {
        case 'fieldModels': return {
            pathname: `/`,
            search
        }
        case 'fieldModel': return {
            pathname: `/fieldModel/${route.fieldModelId}`,
            search
        }
    }
}

var queryString = (params: { [key: string]: string }) => {
    const keys = Object.keys(params)
    if (keys.length === 0) return ''
    return '?' + (
        keys.map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&')
    )
}

export const workspaceRouteReducer = (s: WorkspaceRoute, a: WorkspaceRouteAction): WorkspaceRoute => {
    let newRoute: WorkspaceRoute = s
    switch (a.type) {
        case 'gotoFieldModelsPage': newRoute = {
            page: 'fieldModels',
            workspaceUri: s.workspaceUri
        }; break;
        case 'gotoFieldModelPage': newRoute = {
            page: 'fieldModel',
            fieldModelId: a.fieldModelId,
            workspaceUri: s.workspaceUri
        }
    }
    return newRoute
}