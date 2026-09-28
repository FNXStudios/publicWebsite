/**
 * Vendor-neutral product analytics.
 *
 * Components call `track()` with a typed event. Events are pushed to
 * `window.dataLayer` when a tag manager is installed and re-dispatched as a
 * `fnx:analytics` DOM event, so any vendor can subscribe without UI changes.
 * Tracking is deferred and never throws into the UI.
 */
export type AnalyticsEvent =
  | { name: 'game_card_clicked'; props: { slug: string; placement: 'home' | 'games' } }
  | { name: 'game_detail_viewed'; props: { slug: string } }
  | { name: 'game_launch_started'; props: { slug: string } }
  | { name: 'game_iframe_loaded'; props: { slug: string; ms: number } }
  | { name: 'game_iframe_failed'; props: { slug: string; reason: 'timeout' | 'reported' } }
  | { name: 'partner_cta_clicked'; props: { placement: string } }
  | { name: 'contact_submit_started'; props: { interest: string } }
  | { name: 'contact_submit_success'; props: { interest: string } }
  | { name: 'contact_submit_failed'; props: { interest: string; status: number | 'network' } };

export const ANALYTICS_DOM_EVENT = 'fnx:analytics';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  const dispatch = () => {
    try {
      window.dataLayer?.push({ event: event.name, ...event.props });
      window.dispatchEvent(new CustomEvent(ANALYTICS_DOM_EVENT, { detail: event }));
    } catch {
      // Analytics must never break the product.
    }
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(dispatch, { timeout: 2000 });
  else setTimeout(dispatch, 0);
}
