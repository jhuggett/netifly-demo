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

import React, { useMemo, useState, useCallback, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import content from './home.json'
import { useForm, usePlugins, useCMS } from 'tinacms'
import { useEditMode } from './components/EditMode'
import { useGithubEditing, useGithubToolbarPlugins } from 'react-tinacms-github'
import { useGithubFile } from './util/useGithubFile'

const App: React.FC = () => {
  const { enterEditMode, exitEditMode } = useGithubEditing()
  const [editMode] = useEditMode()
  useGithubToolbarPlugins()
  const cms = useCMS()

  const { loadData, commit } = useGithubFile({
    path: 'src/home.json',
    parse: JSON.parse,
    serialize: JSON.stringify,
  })

  const formConfig = {
    id: 'home-content',
    label: 'Content',
    onSubmit: (values: any) => commit(values),
    fields: [
      {
        name: 'title',
        label: 'Title',
        component: 'text',
      },
      {
        name: 'spin',
        label: 'Spin Direction',
        component: 'select',
        options: ['clockwise', 'counter-clockwise'],
      },
      {
        name: 'link',
        label: 'Link',
        component: 'group',
        fields: [
          {
            name: 'url',
            label: 'URL',
            component: 'text',
          },
          {
            name: 'text',
            label: 'Text',
            component: 'text',
          },
        ],
      },
    ],
    loadInitialValues: editMode ? loadData : async () => content,
  }

  const [tinaContent, form] = useForm(formConfig)
  usePlugins(form)
  const layoutContent = useMemo(() => {
    if (Object.keys(tinaContent).length > 0) {
      return tinaContent
    }
    return content
  }, [tinaContent])
  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          data-spin={layoutContent.spin}
          alt="logo"
        />
        <p>{layoutContent.title}</p>
        <a
          className="App-link"
          href={layoutContent.link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {layoutContent.link.text}
        </a>
        <button
          type="button"
          style={{
            marginTop: '2rem',
            padding: '0.5rem 1rem',
            fontSize: '1.2rem',
          }}
          onClick={(e) => {
            e.preventDefault()
            if (editMode) exitEditMode()
            else enterEditMode()
          }}
        >
          {editMode ? 'Exit' : 'Enter'} Edit Mode
        </button>
      </header>
    </div>
  )
}

export default App
