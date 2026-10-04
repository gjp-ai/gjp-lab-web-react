import { useEffect, useId, useState } from 'react'
import { serializePolicy, sitePolicy } from '@/common/config/contentSecurityPolicy'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
import { labInputClassName } from '@/common/theme/labInput'
import { browserProbes, type PolicyProbes, type PolicyViolation, type ProbeResult, readDeliveredPolicy, watchViolations } from './cspRepository'
import { type FindingSeverity, reviewPolicy } from './policyReview'

const attempts: { id: keyof PolicyProbes; label: string; rule: string }[] = [
  { id: 'inlineScript', label: 'Run an inline script', rule: 'script-src: no inline code' },
  { id: 'evaluate', label: 'Call new Function()', rule: "script-src: no 'unsafe-eval'" },
  { id: 'inlineStyle', label: 'Add an inline <style>', rule: 'style-src: no inline styles' },
]

/** Tests pass fake `probes`; in the app they act on this page. */
export function CspScreen({ probes = browserProbes() }: { probes?: PolicyProbes }) {
  // Read once: the policy is fixed when the page loads.
  const [delivered] = useState(() => readDeliveredPolicy())
  const [results, setResults] = useState<Partial<Record<keyof PolicyProbes, ProbeResult>>>({})
  const [violations, setViolations] = useState<PolicyViolation[]>([])

  useEffect(() => watchViolations((violation) => setViolations((list) => [...list.slice(-5), violation])), [])

  return (
    <LabDemoPage intro="A Content Security Policy tells the browser where a page's scripts, styles, images, and connections may come from, and blocks everything else. If an attacker manages to inject markup or code, the browser refuses to run it.">
      <LabDemoSection
        title="This site's policy"
        caption="The production build adds this policy to index.html as a <meta> element. Each directive names where one kind of resource may come from."
      >
        <p role="note" className={'rounded-lg px-3 py-2 text-sm ' + (delivered ? 'bg-surface-container text-on-surface' : 'bg-error-container text-on-error-container')}>
          {delivered
            ? 'In force on this page.'
            : 'Not in force: the development server adds inline scripts for hot reload, so only npm run build adds the policy. Run npm run build, then npm run preview, to see it block things.'}
        </p>
        <dl className="flex flex-col divide-y divide-outline-variant/50">
          {sitePolicy.map((directive) => (
            <div key={directive.name} className="flex flex-col gap-0.5 py-2.5">
              <dt className="font-mono text-sm font-semibold">
                {directive.name} <span className="font-normal">{directive.sources.join(' ')}</span>
                {directive.name === 'script-src' && <span className="font-normal text-on-surface-variant"> 'sha256-…'</span>}
              </dt>
              <dd className="text-sm text-on-surface-variant">{directive.purpose}</dd>
            </div>
          ))}
        </dl>
        {delivered && (
          <details className="text-sm">
            <summary className="cursor-pointer font-semibold">Policy as delivered</summary>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-surface-container p-3 font-mono text-xs whitespace-pre-wrap text-on-surface">
              <code>{delivered}</code>
            </pre>
          </details>
        )}
      </LabDemoSection>

      <LabDemoSection title="Try what it blocks" caption="Each button tries something the policy forbids. Blocked attempts also appear under Violation reports.">
        <ul className="flex flex-col gap-3">
          {attempts.map((attempt) => (
            <li key={attempt.id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <LabButton variant="secondary" onClick={() => setResults((current) => ({ ...current, [attempt.id]: probes[attempt.id]() }))}>
                {attempt.label}
              </LabButton>
              <span className="text-sm text-on-surface-variant">{attempt.rule}</span>
              <span aria-live="polite" className="basis-full text-sm font-semibold">
                {describeResult(results[attempt.id], delivered !== undefined)}
              </span>
            </li>
          ))}
        </ul>
      </LabDemoSection>

      <LabDemoSection
        title="Violation reports"
        caption="The browser fires securitypolicyviolation for each blocked attempt. A live site can also send these reports to a server, which needs the policy in an HTTP header."
      >
        <ol aria-label="Violation reports" className="flex flex-col gap-0.5 rounded-lg bg-surface-container p-3 font-mono text-xs text-on-surface">
          {violations.length === 0 ? (
            <li className="text-on-surface-variant">Nothing blocked yet</li>
          ) : (
            violations.map((violation, index) => (
              <li key={index}>
                {violation.directive} blocked {violation.blocked}
              </li>
            ))
          )}
        </ol>
      </LabDemoSection>

      <PolicyCheck initialPolicy={delivered ?? serializePolicy(sitePolicy)} />

      <LabDemoSection title="What a policy cannot do" caption="A policy limits damage; it does not make unsafe code safe.">
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm">
          <li>
            <strong>Header-only rules.</strong> frame-ancestors (stop other sites showing this page in a frame), report-to, and sandbox
            work only in an HTTP header, which the server must send.
          </li>
          <li>
            <strong>Trusted code.</strong> A script the policy allows still runs, even if this site's own files or a package bundled into
            them have been tampered with.
          </li>
          <li>
            <strong>Sending data out.</strong> connect-src allows any HTTPS address so the HTTP Client topics work, so allowed code could
            send data to any HTTPS host.
          </li>
          <li>
            <strong>Development.</strong> npm run dev runs without the policy; check changes with npm run build and npm run preview.
          </li>
        </ul>
      </LabDemoSection>
    </LabDemoPage>
  )
}

function describeResult(result: ProbeResult | undefined, isEnforced: boolean): string {
  if (result === undefined) return ''
  if (result === 'blocked') return 'Blocked by the policy.'
  return isEnforced ? 'Ran: the policy allowed it.' : 'Ran: no policy is in force here.'
}

const severityStyle: Record<FindingSeverity, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-error-container text-on-error-container' },
  medium: { label: 'Medium', className: 'bg-primary-container text-on-surface' },
  info: { label: 'Note', className: 'bg-surface-container text-on-surface-variant' },
}

function PolicyCheck({ initialPolicy }: { initialPolicy: string }) {
  const [policy, setPolicy] = useState(initialPolicy)
  const id = useId()
  // Calculated while rendering, so the findings always match the text.
  const findings = reviewPolicy(policy)

  return (
    <LabDemoSection title="Check a policy" caption="Edit or paste a policy to see common weaknesses. The check runs in this page; nothing is sent.">
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-sm text-on-surface-variant">
          Policy
        </label>
        <textarea
          id={id}
          value={policy}
          onChange={(event) => setPolicy(event.target.value)}
          rows={5}
          spellCheck={false}
          className={labInputClassName + ' font-mono text-sm'}
        />
      </div>
      <div>
        <LabButton variant="secondary" onClick={() => setPolicy(initialPolicy)} disabled={policy === initialPolicy}>
          Reset to this site's policy
        </LabButton>
      </div>
      <ul aria-label="Findings" className="flex flex-col gap-2">
        {findings.map((finding, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className={'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ' + severityStyle[finding.severity].className}>
              {severityStyle[finding.severity].label}
            </span>
            <span>
              {finding.directive !== '—' && <code className="font-mono font-semibold">{finding.directive}</code>}
              {finding.directive !== '—' && ': '}
              {finding.message}
            </span>
          </li>
        ))}
      </ul>
    </LabDemoSection>
  )
}
