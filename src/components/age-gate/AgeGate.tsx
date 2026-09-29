import { ageGateConfig } from '@/config/age-gate.config';
import { ageGateHeadScript } from '@/lib/age-gate/storage';
import { AgeGateDialog } from './AgeGateDialog';

/** Inline <head> script that marks unverified visitors before first paint. */
export function AgeGateHeadScript() {
  if (!ageGateConfig.enabled) return null;
  return <script dangerouslySetInnerHTML={{ __html: ageGateHeadScript(ageGateConfig.version) }} />;
}

/**
 * The scrim is plain CSS (visible while <html data-age-gate="pending">), so the page is
 * covered from the first paint; the dialog opens on hydration.
 */
export function AgeGate() {
  const config = ageGateConfig;
  if (!config.enabled) return null;
  return (
    <>
      <div aria-hidden="true" className="age-gate-scrim" />
      <AgeGateDialog
        version={config.version}
        rememberDays={config.rememberDays}
        exitUrl={config.exitUrl}
        copy={{
          eyebrow: config.eyebrow,
          title: config.title,
          description: config.description,
          confirmLabel: config.confirmLabel,
          rejectLabel: config.rejectLabel,
          rejected: config.rejected,
          responsibleGamingLabel: config.responsibleGamingLabel,
          responsibleGamingUrl: config.responsibleGamingUrl,
        }}
      />
    </>
  );
}
