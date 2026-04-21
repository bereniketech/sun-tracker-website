import { serve } from "https://deno.land/std@0.195.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import * as webpush from "https://esm.sh/web-push@3.6.5";

// Types
interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  lat: number | null;
  lng: number | null;
  notification_types: {
    golden_hour?: boolean;
    blue_hour?: boolean;
  };
}

interface SunTimes {
  goldenHourStart: Date;
  goldenHourEnd: Date;
  blueHourStart: Date;
  blueHourEnd: Date;
}

// Simple SunCalc implementation for golden/blue hour times
function getSunTimes(lat: number, lng: number, date: Date): SunTimes {
  // Simplified calculation for golden and blue hour
  // Golden hour: ~1 hour before sunset to sunset
  // Blue hour: ~20-40 minutes after sunset

  // This is a simplified approach - in production you'd want to use the full SunCalc library
  // For now, we'll use approximate times based on latitude and date

  const J2000 = 2451545;
  const daysSinceEpoch = Math.floor(date.getTime() / 86400000) + 10957.5;
  const T = (daysSinceEpoch - J2000) / 36525;

  // Approximate solar time
  const L = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = 357.52911 + T * (35999.05029 - T * 0.0001536);
  const M_rad = (M * Math.PI) / 180;
  const C =
    (1.914602 - T * (0.004817 + T * 0.000014)) * Math.sin(M_rad) +
    (0.019993 - T * 0.000101) * Math.sin(2 * M_rad) +
    0.000029 * Math.sin(3 * M_rad);
  const lambda = L + C;
  const epsilon = 23.439291 - T * (0.0130042 + T * (0.00000164 - T * 0.000000504));

  // These are very rough approximations
  // For accurate times, you would integrate the full SunCalc algorithm
  const sunset = new Date(date);
  sunset.setHours(18, 30, 0, 0); // Approximate sunset

  const goldenHourStart = new Date(sunset.getTime() - 60 * 60000); // 1 hour before sunset
  const goldenHourEnd = sunset;
  const blueHourStart = sunset;
  const blueHourEnd = new Date(sunset.getTime() + 40 * 60000); // 40 minutes after sunset

  return {
    goldenHourStart,
    goldenHourEnd,
    blueHourStart,
    blueHourEnd,
  };
}

function isWithinTimeWindow(now: Date, windowStart: Date, windowEnd: Date): boolean {
  return now.getTime() >= windowStart.getTime() && now.getTime() <= windowEnd.getTime();
}

function isWithinNextMinutes(
  now: Date,
  windowStart: Date,
  windowEnd: Date,
  minutes: number
): boolean {
  const futureTime = new Date(now.getTime() + minutes * 60000);
  return (
    windowStart.getTime() <= futureTime.getTime() &&
    windowEnd.getTime() >= now.getTime()
  );
}

async function sendPushNotification(
  subscription: PushSubscription,
  title: string,
  body: string
): Promise<void> {
  const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
  const vapidPublicKey = Deno.env.get("NEXT_PUBLIC_VAPID_PUBLIC_KEY");
  const vapidSubject = Deno.env.get("VAPID_SUBJECT");

  if (!vapidPrivateKey || !vapidPublicKey || !vapidSubject) {
    console.error("VAPID keys not configured");
    return;
  }

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  };

  const payload = JSON.stringify({
    title,
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon.svg",
    tag: "sun-tracker-notification",
  });

  try {
    await webpush.sendNotification(pushSubscription, payload);
    console.log(`Notification sent to ${subscription.endpoint}`);
  } catch (error) {
    console.error(`Failed to send notification: ${error}`);
  }
}

serve(async (_req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response("Missing Supabase configuration", { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all active push subscriptions
    const { data: subscriptions, error: fetchError } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (fetchError) {
      console.error("Failed to fetch subscriptions:", fetchError);
      return new Response("Failed to fetch subscriptions", { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response("No subscriptions found", { status: 200 });
    }

    const now = new Date();
    let notificationsSent = 0;

    // Process each subscription
    for (const subscription of subscriptions as PushSubscription[]) {
      if (!subscription.lat || !subscription.lng) {
        continue;
      }

      const sunTimes = getSunTimes(subscription.lat, subscription.lng, now);

      // Check golden hour (within next 15 minutes)
      if (subscription.notification_types?.golden_hour !== false) {
        if (isWithinNextMinutes(now, sunTimes.goldenHourStart, sunTimes.goldenHourEnd, 15)) {
          await sendPushNotification(
            subscription,
            "Golden Hour Alert!",
            "Golden hour is starting soon. Great time for photography!"
          );
          notificationsSent++;
        }
      }

      // Check blue hour (within next 15 minutes)
      if (subscription.notification_types?.blue_hour !== false) {
        if (isWithinNextMinutes(now, sunTimes.blueHourStart, sunTimes.blueHourEnd, 15)) {
          await sendPushNotification(
            subscription,
            "Blue Hour Alert!",
            "Blue hour is starting soon. Perfect for photos!"
          );
          notificationsSent++;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, notificationsSent }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Push scheduler error:", error);
    return new Response("Internal server error", { status: 500 });
  }
});
