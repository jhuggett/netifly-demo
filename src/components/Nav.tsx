import React, { useState, useEffect, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import navigation from '../navigation.json'
import './Nav.css'
import { useEditMode } from './EditMode'
import { useGithubFile } from '../util/useGithubFile'

export const Nav = () => {
  const [editMode] = useEditMode()
  const { loadData } = useGithubFile({
    path: 'src/navigation.json',
    parse: JSON.parse,
    serialize: JSON.stringify,
  })

  const [githubNavItems, setGithubNavItems] = useState(navigation)

  useEffect(() => {
    if (!editMode) return
    loadData().then(setGithubNavItems)
  }, [editMode])

  const navItems = useMemo(() => {
    if (editMode) {
      return githubNavItems
    }
    return navigation
  }, [editMode, navigation, githubNavItems])

  return (
    <div className="nav-wrapper">
      <div className="nav-wrapper-inner">
        <nav className="main-nav">
          {navItems.map((navItem) => (
            <NavLink
              className="main-nav-item"
              activeClassName="active"
              to={navItem.slug}
              isActive={(match: any, location: any) => {
                return match && match.isExact
              }}
            >
              {navItem.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
