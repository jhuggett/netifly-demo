import React from 'react'
import { NavLink } from 'react-router-dom'
import navItems from '../navigation.json'
import './Nav.css'

export const Nav = () => {
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
