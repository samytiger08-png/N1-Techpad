/**
 * Simple helper to track Meta Pixel events.
 * Note: The actual Pixel script should be in index.html or injected.
 * But here we just define the window.fbq calls.
 */

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export const Pixel = {
  pageView: () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
      console.log("[Meta Pixel] PageView fired");
    } else {
      console.warn("[Meta Pixel] window.fbq is undefined");
    }
  },
  viewContent: (data: { value: number; currency: string; content_name: string; content_type: string }) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', data);
      console.log("[Meta Pixel] ViewContent fired");
    } else {
      console.warn("[Meta Pixel] window.fbq is undefined");
    }
  },
  purchase: (data: { value: number; currency: string; content_name: string; content_type: string }) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', data);
      console.log("[Meta Pixel] Purchase fired");
    } else {
      console.warn("[Meta Pixel] window.fbq is undefined");
    }
  }
};
