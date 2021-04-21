import { MuiThemeProvider } from '@material-ui/core';
import { LabboxProviderContext, usePlugins, useSubfeed } from 'labbox';
import QueryString from 'querystring';
import React, { useCallback, useContext, useMemo, useReducer } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FSPlugin, MainWindowPlugin, workspaceReducer, WorkspaceAction } from './python/field_slicer/extensions/pluginInterface';
import { parseWorkspaceUri } from './python/field_slicer/extensions/pluginInterface/misc';
import { locationFromRoute, routeFromLocation, WorkspaceRoute, WorkspaceRouteAction, workspaceRouteReducer } from './python/field_slicer/extensions/pluginInterface/WorkspaceRoute';
import theme from './python/field_slicer/extensions/theme';

function App({version}: {version: string}) {
  const plugins = usePlugins<FSPlugin>()
  const mainWindowPlugin = plugins.filter(p => (p.name === 'MainWindow'))[0] as any as MainWindowPlugin

  const { serverInfo } = useContext(LabboxProviderContext)

  const location = useLocation()
  const history = useHistory()
  const workspaceUri = useMemo(() => {
    const query = QueryString.parse(location.search.slice(1));
    const workspace = (query.workspace as string) || 'default'
    const defaultFeedId = serverInfo?.defaultFeedId
    const workspaceUri = workspace.startsWith('workspace://') ? workspace : (defaultFeedId ? `workspace://${defaultFeedId}/${workspace}` : undefined)
    return workspaceUri
  }, [location.search, serverInfo])

  const workspaceRoute: WorkspaceRoute = useMemo(() => {
    return routeFromLocation(location, serverInfo)
  }, [location, serverInfo])

  // const [workspaceRoute, workspaceRouteDispatch] = useReducer(workspaceRouteReducer, {page: 'main'})

  const workspaceRouteDispatch = useCallback(
    (a: WorkspaceRouteAction) => {
      const newRoute: WorkspaceRoute = workspaceRouteReducer(workspaceRoute, a)
      const newLocation = locationFromRoute(newRoute)
      if ((location.pathname !== newLocation.pathname) || (location.search !== newLocation.search)) {
        history.push({ ...location, ...newLocation })
      }
    },
    [workspaceRoute, history, location]
  )

  const [workspace, workspaceDispatch2] = useReducer(workspaceReducer, useMemo(() => ({ fieldModels: [] }), []))
  const handleWorkspaceSubfeedMessages = useCallback((messages: any[]) => {
    messages.forEach(msg => workspaceDispatch2(msg))
  }, [])

  const { feedUri, workspaceName } = parseWorkspaceUri(workspaceUri)

  const subfeedName = useMemo(() => ({ workspaceName }), [workspaceName])

  const { appendMessages: appendWorkspaceMessages } = useSubfeed({ feedUri, subfeedName, onMessages: handleWorkspaceSubfeedMessages })
  const workspaceDispatch = useCallback((a: WorkspaceAction) => {
    appendWorkspaceMessages([a])
  }, [appendWorkspaceMessages])

  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          {
            mainWindowPlugin ? (
              <mainWindowPlugin.component
              {...{ workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, version }}
              />
            ) : (<div>No main window plugin</div>)
          }
        </header>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
