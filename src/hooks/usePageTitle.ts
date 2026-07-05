import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — tiny mchwa`
    return () => { document.title = 'tiny mchwa 🐜' }
  }, [title])
}
