import { useCallback, useEffect, useState } from 'react'
import { AppConfig } from '@/common/config/AppConfig'
import { ContentView } from './ContentView'
import { fetchMaintenanceMode } from './startup/maintenanceMode'
import { MaintenanceScreen } from './startup/MaintenanceScreen'
import { SplashScreen } from './startup/SplashScreen'

type Phase = 'splash' | 'maintenance' | 'app'

/**
 * The app root: shows the splash for at least `minimumSplashMs` while the maintenance flag loads, then
 * shows maintenance or the navigation. Both waits run at the same time; the later one decides when the
 * splash ends.
 */
export function App({ minimumSplashMs = AppConfig.minimumSplashMs }: { minimumSplashMs?: number }) {
  const [phase, setPhase] = useState<Phase>('splash')
  const [isRetrying, setIsRetrying] = useState(false)

  const loadMaintenanceMode = useCallback(
    () => fetchMaintenanceMode(AppConfig.remoteConfigUrl, AppConfig.remoteConfigTimeoutMs),
    [],
  )

  useEffect(() => {
    let isCurrent = true
    const minimum = new Promise((resolve) => setTimeout(resolve, minimumSplashMs))
    void Promise.all([loadMaintenanceMode(), minimum]).then(([maintenanceEnabled]) => {
      if (isCurrent) setPhase(maintenanceEnabled ? 'maintenance' : 'app')
    })
    return () => {
      isCurrent = false
    }
  }, [loadMaintenanceMode, minimumSplashMs])

  const retry = async () => {
    setIsRetrying(true)
    const maintenanceEnabled = await loadMaintenanceMode()
    setIsRetrying(false)
    if (!maintenanceEnabled) setPhase('app')
  }

  if (phase === 'splash') return <SplashScreen />
  if (phase === 'maintenance') return <MaintenanceScreen onRetry={() => void retry()} isRetrying={isRetrying} />
  return <ContentView />
}
