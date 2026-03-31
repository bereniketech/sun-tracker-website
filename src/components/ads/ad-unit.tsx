"use client";

import { useEffect, useRef } from "react";

type AdFormat = "auto" | "horizontal" | "vertical" | "rectangle";

interface AdUnitProps {
  adSlot: string;
  adFormat?: AdFormat;
  className?: string;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export function AdUnit({ adSlot, adFormat = "auto", className }: AdUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT_ID || pushed.current) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script not loaded yet — safe to ignore
    }
  }, []);

  if (!CLIENT_ID) {
    return null;
  }

  return (
    <div className={className} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
