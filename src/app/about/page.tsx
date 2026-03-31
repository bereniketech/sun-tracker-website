import type { Metadata } from "next";
import Link from "next/link";
import { AdUnit } from "@/components/ads/ad-unit";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildWebPage,
  buildBreadcrumbList,
  buildFaqPage,
  buildHowTo,
} from "@/lib/schema";
import { EDUCATIONAL_ENTRIES } from "@/lib/educational-content";

export const metadata: Metadata = {
  title: "About Sun Tracker by Helios Chrono - How Solar Tracking Works",
  description:
    "Learn how Sun Tracker by Helios Chrono calculates sunrise, sunset, golden hour, and blue hour times using astronomical algorithms. A complete guide to solar tracking for photographers and astronomers, including glossary, methodology, and photography timing tips.",
  alternates: { canonical: "/about" },
};

const glossaryFaq = Object.values(EDUCATIONAL_ENTRIES).map((entry) => ({
  question: `What is ${entry.term.toLowerCase()} in photography and astronomy?`,
  answer: `${entry.fullExplanation}${entry.photographyTip ? ` Photography tip: ${entry.photographyTip}` : ""}`,
}));

export default function AboutPage() {
  return (
    <article className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <JsonLd
        data={[
          buildWebPage(
            "About Sun Tracker by Helios Chrono - How Solar Tracking Works",
            "Complete guide to solar tracking for photographers and astronomers, including methodology, glossary, and photography timing tips.",
            "/about",
          ),
          buildBreadcrumbList([
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
          ]),
          buildFaqPage(glossaryFaq),
          buildHowTo(
            "How to Plan a Golden Hour Photography Session",
            "Step-by-step guide to using solar tracking data for landscape and portrait photography during golden hour.",
            [
              {
                name: "Choose your location",
                text: "Use the Sun Tracker by Helios Chrono interactive map to select your shooting location. The sun tracker shows real-time sun position, azimuth, and elevation for any point on Earth.",
              },
              {
                name: "Check golden hour timing",
                text: "Golden hour occurs when the sun is below 6° elevation — typically the first hour after sunrise and the last hour before sunset. The dashboard shows exact start and end times for your location.",
              },
              {
                name: "Plan your composition using azimuth",
                text: "Use the sun's azimuth (compass direction) to determine where the sun will be relative to your subject. Position yourself for backlighting, side-lighting, or front-lighting effects.",
              },
              {
                name: "Scout during blue hour",
                text: "Arrive during blue hour (when the sun is between -6° and -18° below the horizon) to set up equipment and scout compositions while the sky displays deep blue tones.",
              },
              {
                name: "Use monthly data for advance planning",
                text: "Check city pages for monthly sunrise, sunset, and golden hour tables to plan shoots weeks or months in advance. Golden hour duration varies by season and latitude.",
              },
            ],
          ),
        ]}
      />

      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
          About
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          About Sun Tracker by Helios Chrono
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-slate-700">
          Sun Tracker by Helios Chrono is a precision solar tracking application that calculates sunrise, sunset,
          golden hour, and blue hour times for any location on Earth using astronomical algorithms.
          It is built for photographers who need to plan shoots around natural light, and astronomers
          who require accurate celestial position data.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Solar Tracking Methodology
        </h2>
        <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">
          <p>
            Sun Tracker by Helios Chrono computes sun positions using the{" "}
            <strong>suncalc</strong> library, which implements algorithms derived
            from the NOAA Solar Calculator and Jean Meeus&apos;s{" "}
            <em>Astronomical Algorithms</em>. These calculations account for
            Earth&apos;s axial tilt (23.44°), orbital eccentricity, and the
            equation of time to produce accurate sunrise, sunset, solar noon,
            azimuth, and elevation values.
          </p>
          <p>
            For any given latitude, longitude, and date, the application computes:
            sunrise and sunset times (when the sun crosses the horizon at -0.833°
            elevation, accounting for atmospheric refraction), golden hour windows
            (sun below 6° elevation), blue hour windows (sun between -4° and -6°
            below the horizon), solar noon (sun at maximum elevation on the local
            meridian), and the analemma — the figure-8 pattern traced by the
            sun&apos;s position at the same time each day over one year.
          </p>
          <p>
            Accuracy is typically within 1–2 minutes for sunrise and sunset times.
            Atmospheric conditions such as temperature inversions, altitude, and
            local terrain can introduce additional variation. All times are
            displayed in the location&apos;s local timezone using IANA timezone
            identifiers.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Glossary of Solar Terms
        </h2>
        <p className="max-w-3xl text-sm text-slate-600 md:text-base">
          Key terms used in solar tracking, photography, and astronomical observation.
        </p>
        <dl className="max-w-3xl divide-y rounded-xl border bg-white">
          {Object.values(EDUCATIONAL_ENTRIES).map((entry) => (
            <div key={entry.term} className="p-4 md:p-5">
              <dt className="text-base font-semibold text-slate-900">
                {entry.term}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-700 md:text-base">
                {entry.fullExplanation}
              </dd>
              {entry.photographyTip && (
                <dd className="mt-2 text-sm italic text-slate-500">
                  Photography tip: {entry.photographyTip}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Photography Timing Guide
        </h2>
        <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">
          <p>
            <strong>Golden hour</strong> produces the most sought-after natural
            light for photography. It occurs when the sun is below 6° elevation,
            creating warm, directional light with soft shadows and a golden or
            amber color temperature (approximately 3,000–4,000K). This light is
            ideal for landscapes, portraits, and architectural photography.
          </p>
          <p>
            <strong>Blue hour</strong> follows sunset (or precedes sunrise) when
            the sun is between approximately -4° and -6° below the horizon. The
            sky turns deep blue while artificial lights balance with ambient
            twilight — perfect for cityscapes, night-to-day transitions, and
            moody compositions.
          </p>
          <p>
            <strong>Solar noon</strong> is generally the least favorable time for
            photography due to harsh, high-contrast light directly overhead. However,
            it can be effective for minimizing shadows in architectural documentation
            or creating dramatic overhead lighting effects.
          </p>
          <p>
            Use the{" "}
            <Link href="/" className="font-medium text-primary underline">
              interactive sun tracker
            </Link>{" "}
            to find exact golden hour and blue hour times for your shooting location,
            or browse{" "}
            <Link href="/city" className="font-medium text-primary underline">
              city pages
            </Link>{" "}
            for precomputed monthly data.
          </p>
        </div>
      </section>

      <AdUnit adSlot="ABOUT_MID" adFormat="horizontal" className="my-2" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Data Sources and Accuracy
        </h2>
        <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">
          <p>
            <strong>Solar position algorithms:</strong> Based on the suncalc
            library (MIT license), which implements methods from the U.S. Naval
            Observatory and NOAA Earth System Research Laboratory. The underlying
            mathematics follow Jean Meeus&apos;s <em>Astronomical Algorithms</em>{" "}
            (2nd edition, 1998).
          </p>
          <p>
            <strong>Geocoding:</strong> Location search uses the Nominatim
            geocoding service from OpenStreetMap, providing worldwide coverage
            with no API key required for reasonable usage.
          </p>
          <p>
            <strong>Timezone data:</strong> Timezones are resolved using IANA
            timezone identifiers stored alongside city coordinates. All displayed
            times account for daylight saving time transitions automatically.
          </p>
          <p>
            <strong>Accuracy margins:</strong> Sunrise and sunset times are
            accurate to within 1–2 minutes under standard atmospheric conditions
            (sea level, 10°C, 1013.25 hPa). Higher altitudes, extreme
            temperatures, and terrain obstructions may cause additional deviation.
            The application uses a standard atmospheric refraction correction of
            0.833° for horizon calculations.
          </p>
        </div>
      </section>
    </article>
  );
}
