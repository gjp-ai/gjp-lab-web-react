import { useEffect, useRef, useState } from 'react'
import type { FeatureNavigation } from '@/app/FeatureDestination'
import { LabButton } from '@/common/theme/LabButton'
import { executeRequest } from './fetchRepository'
import { type HttpMethod, httpMethods, supportsPayload } from './HttpResponse'

const defaultUrl = 'https://www.ganjianping.com/api/open/websites?channel=AI&page=0&size=500&lang=EN'

export function FetchScreen({ navigation }: { navigation: FeatureNavigation }) {
  const [method, setMethod] = useState<HttpMethod>('GET')
  const [url, setUrl] = useState(defaultUrl)
  const [payload, setPayload] = useState('{\n  "example": "value"\n}')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const controller = useRef<AbortController | null>(null)

  // Leaving the screen cancels a request that is still running.
  useEffect(() => () => controller.current?.abort(), [])

  const send = async () => {
    controller.current?.abort()
    const current = new AbortController()
    controller.current = current
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const response = await executeRequest(method, url, payload, { signal: current.signal })
      navigation.showResponse(response)
    } catch (error) {
      if (!current.signal.aborted) setErrorMessage(error instanceof Error ? error.message : 'The request failed.')
    } finally {
      if (controller.current === current) setIsLoading(false)
    }
  }

  const inputClass = 'w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-on-surface'

  return (
    <form
      className="flex flex-col gap-4 px-5 pb-8"
      onSubmit={(event) => {
        event.preventDefault()
        void send()
      }}
    >
      <p className="pt-1 text-on-surface-variant">Build and send an HTTP request with the browser's native fetch API.</p>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-semibold">Method</legend>
        <div className="flex overflow-hidden rounded-full border border-outline-variant">
          {httpMethods.map((option) => (
            <label key={option} className="flex-1">
              <input
                type="radio"
                name="method"
                value={option}
                checked={method === option}
                onChange={() => {
                  setMethod(option)
                  setErrorMessage(null)
                }}
                className="peer sr-only"
              />
              <span className="block cursor-pointer py-2 text-center text-sm font-semibold peer-checked:bg-primary peer-checked:text-on-primary peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-primary">
                {option}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-on-surface-variant">URL</span>
        <textarea
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          rows={2}
          spellCheck={false}
          autoCapitalize="off"
          placeholder="https://example.com/api"
          className={inputClass}
        />
      </label>

      {supportsPayload(method) && (
        <label className="flex flex-col gap-1">
          <span className="text-sm text-on-surface-variant">Request payload</span>
          <textarea
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
            rows={6}
            spellCheck={false}
            className={inputClass + ' font-mono text-sm'}
          />
        </label>
      )}

      {errorMessage !== null && (
        <div role="alert" className="flex items-start gap-3 rounded-xl bg-error-container p-3.5 text-on-error-container">
          <p className="flex-1">{errorMessage}</p>
          <button type="button" onClick={() => setErrorMessage(null)} className="font-semibold">
            Dismiss
          </button>
        </div>
      )}

      <LabButton type="submit" disabled={isLoading || url.trim() === ''} className="w-full">
        {isLoading ? 'Sending…' : 'Send request'}
      </LabButton>
    </form>
  )
}
