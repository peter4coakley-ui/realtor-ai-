import React, { ReactNode } from 'react'
import { AppNav } from './AppNav'
import { Breadcrumbs } from './Breadcrumbs'
import { MobileMenu } from './MobileMenu'

interface AppLayoutProps {
  children: ReactNode
  showBreadcrumbs?: boolean
  showActions?: boolean
  className?: string
}

export function AppLayout({
  children,
  showBreadcrumbs = true,
  showActions = true,
  className = ''
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <AppNav showActions={showActions} />
      {showBreadcrumbs && <Breadcrumbs />}
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <MobileMenu />
    </div>
  )
}
