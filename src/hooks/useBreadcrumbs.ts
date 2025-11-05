import { useEffect } from 'react'
import { useNavigation, Breadcrumb } from '../contexts/NavigationContext'

export function useBreadcrumbs(breadcrumbs: Breadcrumb[], pageTitle?: string) {
  const { setBreadcrumbs, setPageTitle } = useNavigation()

  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
    if (pageTitle) {
      setPageTitle(pageTitle)
    }

    return () => {
      setBreadcrumbs([])
      setPageTitle('')
    }
  }, [breadcrumbs, pageTitle, setBreadcrumbs, setPageTitle])
}
