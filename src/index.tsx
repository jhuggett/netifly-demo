/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import React, { useMemo, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { TinaProvider, TinaCMS } from 'tinacms'
import { EditModeProvider, useEditMode } from './components/EditMode'
import { TinacmsGithubProvider, GithubMediaStore } from 'react-tinacms-github'
import { GithubClient } from './util/GithubClient'
import { HashRouter as Router } from 'react-router-dom'
import { PageCreatorPlugin } from './util/PageCreatorPlugin'
import { BrowserStorageClient } from '@tinacms/browser-storage-client'

const ghClient = new GithubClient({
  proxy: '/api/proxy-github',
  authCallbackRoute: '/.netlify/functions/create-github-access-token',
  clientId: process.env.REACT_APP_APP_CLIENT_ID ?? '',
  baseRepoFullName: process.env.REACT_APP_REPO_FULL_NAME ?? '', // e.g: tinacms/tinacms.org,
  authScope: 'repo',
})

const CMSWrapper = ({ children }: { children: any }) => {
  const [editMode, setEditMode] = useEditMode()
  const enterEditMode = useCallback(() => {
    setEditMode(true)
  }, [setEditMode])
  const exitEditMode = useCallback(() => {
    setEditMode(false)
  }, [setEditMode])
  const cms = useMemo(() => {
    return new TinaCMS({
      apis: {
        github: ghClient,
        storage: new BrowserStorageClient(window.localStorage, 'tina-demo-cra'),
      },
      media: {
        store: new GithubMediaStore(ghClient),
      },
      sidebar: {
        hidden: !editMode,
      },
      //@ts-ignore
      toolbar: {
        hidden: !editMode,
      },
      plugins: [PageCreatorPlugin],
    })
  }, [editMode])
  return (
    <TinaProvider cms={cms}>
      <TinacmsGithubProvider
        editMode={editMode}
        enterEditMode={enterEditMode}
        exitEditMode={exitEditMode}
      >
        {children}
      </TinacmsGithubProvider>
    </TinaProvider>
  )
}

ReactDOM.render(
  <EditModeProvider value={false}>
    <CMSWrapper>
      <Router>
        <App />
      </Router>
    </CMSWrapper>
  </EditModeProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
