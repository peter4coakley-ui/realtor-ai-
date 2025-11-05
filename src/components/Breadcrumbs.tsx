import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigation } from '../contexts/NavigationContext'

export function Breadcrumbs() {
  const { breadcrumbs } = useNavigation()

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm px-4 py-2 bg-gray-800/30">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1
        const Icon = crumb.icon

        return (
          <React.Fragment key={crumb.path}>
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}

            {isLast ? (
              <span className="flex items-center gap-1.5 text-gray-400 font-medium truncate max-w-xs">
                {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                <span className="truncate">{crumb.label}</span>
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="flex items-center gap-1.5 text-gray-500 hover:text-teal-400 transition-colors truncate max-w-xs"
              >
                {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                <span className="truncate">{crumb.label}</span>
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
