import { useCallback, useEffect, useState } from 'react'
import { AppConfig } from '@/common/config/AppConfig'
import { ContentView } from './ContentView'
import { fetchMaintenanceMode } from './startup/maintenanceMode'
import { MaintenanceScreen } from './startup/MaintenanceScreen'

type Phase = 'checking' | 'maintenance' | 'app'

/**
 * The app root: reads the maintenance flag, then shows maintenance or the navigation. While the flag
 * loads (usually a few milliseconds, at most `remoteConfigTimeoutMs`) the page shows only its background.
 */
export function App() {
  const [phase, setPhase] = useState<Phase>('checking')
  const [isRetrying, setIsRetrying] = useState(false)

  const loadMaintenanceMode = useCallback(
    () => fetchMaintenanceMode(AppConfig.remoteConfigUrl, AppConfig.remoteConfigTimeoutMs),
    [],
  )

  useEffect(() => {
    let isCurrent = true
    void loadMaintenanceMode().then((maintenanceEnabled) => {
      if (isCurrent) setPhase(maintenanceEnabled ? 'maintenance' : 'app')
    })
    return () => {
      isCurrent = false
    }
  }, [loadMaintenanceMode])

  const retry = async () => {
    setIsRetrying(true)
    const maintenanceEnabled = await loadMaintenanceMode()
    setIsRetrying(false)
    if (!maintenanceEnabled) setPhase('app')
  }

  if (phase === 'checking') return <main className="h-full bg-background" aria-busy="true" aria-label="Loading GJP Lab" />
  if (phase === 'maintenance') return <MaintenanceScreen onRetry={() => void retry()} isRetrying={isRetrying} />
  return <ContentView />
}
