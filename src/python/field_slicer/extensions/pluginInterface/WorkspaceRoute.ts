import { ServerInfo } from 'labbox/lib/LabboxProvider'
import QueryString from 'querystring'

type Page = 'fieldModels'
export const isWorkspacePage = (x: string): x is Page => {
    return ['fieldModels'].includes(x)
}

type WorkspaceFieldModelsRoute = {
    page: 'fieldModels',
    workspaceUri?: string
}
export type WorkspaceRoute = WorkspaceFieldModelsRoute
type GotoFieldModelsPageAction = {
    type: 'gotoFieldModelsPage'
}
export type WorkspaceRouteAction = GotoFieldModelsPageAction
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
        default: return {
            workspaceUri,
            page: 'fieldModels'
        }
    }
}

export const locationFromRoute = (route: WorkspaceRoute) => {
    const queryParams: { [key: string]: string } = {}
    if (route.workspaceUri) {
        queryParams['workspace'] = route.workspaceUri
    }
    switch (route.page) {
        case 'fieldModels': return {
            pathname: `/`,
            search: queryString(queryParams)
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
    }
    return newRoute
}