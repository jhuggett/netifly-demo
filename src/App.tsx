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

import React from 'react'

import './App.css'
import { useEditMode } from './components/EditMode'
import { useGithubEditing, useGithubToolbarPlugins } from 'react-tinacms-github'

import { Home } from './pages/Home'

const App: React.FC = () => {
  useGithubToolbarPlugins()
  const { enterEditMode, exitEditMode } = useGithubEditing()
  const [editMode] = useEditMode()

  return (
    <div className="App">
      <header className="App-header">
        <Home />
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
