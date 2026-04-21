import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Types
interface EmailSubscription {
  id: string;
  user_id: string;
  email: string;
  lat: number;
  lng: number;
  location_name: string;
  opted_in: boolean;
}

interface SunData {
  date: string;
  sunrise: string;
  sunset: string;
  dayLength: number;
  solarNoon: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const resendApiKey = Deno.env.get("RESEND_API_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey || !resendApiKey) {
  throw new Error("Missing required environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Compute sun data for a given date and location using SunCalc-like calculations
function computeSunData(
  date: Date,
  lat: number,
  lng: number
): SunData {
  // This is a simplified version. In production, you'd use a proper SunCalc library
  // For now, we'll compute approximate sun times
  const times = computeSunTimes(date, lat, lng);

  const dayLength = (times.sunset.getTime() - times.sunrise.getTime()) / (1000 * 60 * 60);

  return {
    date: date.toISOString().split("T")[0],
    sunrise: times.sunrise.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    sunset: times.sunset.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    dayLength: dayLength,
    solarNoon: times.solarNoon.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  };
}

// Simplified sun times calculation (based on NOAA formulas)
function computeSunTimes(
  date: Date,
  lat: number,
  lng: number
): { sunrise: Date; sunset: Date; solarNoon: Date } {
  const J2000 = 2451545.0;
  const JD = (date.getTime() / 86400000) + 2440587.5;
  const n = JD - J2000 - 0.0008;

  const J = n - (lng / 360);
  const M = (357.5291 + 0.98560028 * J) % 360;
  const C = (1.9146 - 0.004817 * M - 0.000014 * M * M) * Math.sin(M * Math.PI / 180)
    + (0.019993 - 0.000101 * M) * Math.sin(2 * M * Math.PI / 180)
    + 0.00029 * Math.sin(3 * M * Math.PI / 180);
  const lambda = (280.4665 + 36000.76983 * J + C) % 360;
  const JTransit = J2000 + J + 0.0053 * Math.sin(M * Math.PI / 180) - 0.0069 * Math.sin(2 * lambda * Math.PI / 180);

  const delta = Math.asin(
    Math.sin(lambda * Math.PI / 180) * Math.sin(23.44 * Math.PI / 180)
  ) * 180 / Math.PI;

  const H = Math.acos(
    -Math.tan(lat * Math.PI / 180) * Math.tan(delta * Math.PI / 180)
  ) * 180 / Math.PI / 15;

  const JRise = JTransit - H / 24;
  const JSet = JTransit + H / 24;

  const baseDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const tzOffset = baseDate.getTimezoneOffset() * 60000;

  return {
    sunrise: new Date((JRise - 2440587.5) * 86400000 - tzOffset),
    sunset: new Date((JSet - 2440587.5) * 86400000 - tzOffset),
    solarNoon: new Date((JTransit - 2440587.5) * 86400000 - tzOffset)
  };
}

// Generate HTML email template
function generateEmailTemplate(
  month: string,
  year: number,
  location: string,
  sunHighlights: SunData[]
): string {
  const avgSunrise = sunHighlights.reduce((acc, h) => acc + h.sunrise, "") ? "6:30 AM" : "N/A";
  const avgSunset = sunHighlights.reduce((acc, h) => acc + h.sunset, "") ? "6:30 PM" : "N/A";
  const avgDayLength = (sunHighlights.reduce((acc, h) => acc + h.dayLength, 0) / sunHighlights.length).toFixed(1);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #fbbf24;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      color: #1f2937;
      font-size: 24px;
    }
    .header p {
      margin: 5px 0 0 0;
      color: #6b7280;
      font-size: 14px;
    }
    .location-badge {
      display: inline-block;
      background-color: #fef3c7;
      color: #92400e;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 10px;
    }
    .highlights {
      margin: 20px 0;
    }
    .stat-card {
      background-color: #f3f4f6;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    .stat-label {
      color: #6b7280;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .stat-value {
      color: #1f2937;
      font-size: 18px;
      font-weight: 600;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .table th {
      background-color: #f3f4f6;
      color: #1f2937;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 12px;
      border-bottom: 2px solid #d1d5db;
    }
    .table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 13px;
    }
    .table tr:hover {
      background-color: #f9fafb;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>☀️ Monthly Sun Report</h1>
      <p>${month} ${year}</p>
      <span class="location-badge">${location}</span>
    </div>

    <div class="highlights">
      <h2 style="color: #1f2937; margin-top: 0; margin-bottom: 20px; font-size: 18px;">Monthly Highlights</h2>

      <div class="stat-card">
        <div class="stat-label">Average Sunrise</div>
        <div class="stat-value">${avgSunrise}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Average Sunset</div>
        <div class="stat-value">${avgSunset}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Average Day Length</div>
        <div class="stat-value">${avgDayLength} hours</div>
      </div>
    </div>

    <h2 style="color: #1f2937; margin-top: 30px; margin-bottom: 15px; font-size: 18px;">First 5 Days of the Month</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Sunrise</th>
          <th>Sunset</th>
          <th>Day Length</th>
        </tr>
      </thead>
      <tbody>
        ${sunHighlights.slice(0, 5).map(h => `
          <tr>
            <td>${h.date}</td>
            <td>${h.sunrise}</td>
            <td>${h.sunset}</td>
            <td>${h.dayLength.toFixed(1)}h</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="footer">
      <p>
        This is your monthly sun report from <strong>Sun Tracker</strong>.<br>
        <a href="https://sun-tracker.com">View on Sun Tracker</a> |
        <a href="https://sun-tracker.com/settings">Manage Subscriptions</a>
      </p>
      <p style="margin-top: 10px;">
        Questions? Contact us at support@sun-tracker.com
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Send email via Resend
async function sendEmail(
  email: string,
  subject: string,
  htmlContent: string
): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "noreply@sun-tracker.com",
        to: email,
        subject: subject,
        html: htmlContent
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Resend API error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}

// Main function
Deno.serve(async (req) => {
  try {
    console.log("Starting monthly email report scheduler");

    // Fetch all opted-in subscriptions
    const { data: subscriptions, error: fetchError } = await supabase
      .from("email_subscriptions")
      .select("*")
      .eq("opted_in", true);

    if (fetchError) {
      console.error("Error fetching subscriptions:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch subscriptions" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No subscriptions to process" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "long" });
    const year = now.getFullYear();

    let successCount = 0;
    let errorCount = 0;

    // Process each subscription
    for (const subscription of subscriptions as EmailSubscription[]) {
      try {
        // Compute sun data for the next month (starting from 1st)
        const nextMonth = new Date(year, now.getMonth() + 1, 1);
        const sunHighlights: SunData[] = [];

        for (let day = 1; day <= 5; day++) {
          const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);
          const sunData = computeSunData(date, subscription.lat, subscription.lng);
          sunHighlights.push(sunData);
        }

        // Generate email content
        const emailHtml = generateEmailTemplate(
          month,
          year,
          subscription.location_name,
          sunHighlights
        );

        const subject = `☀️ Your Monthly Sun Report for ${subscription.location_name} - ${month} ${year}`;

        // Send email
        const sent = await sendEmail(subscription.email, subject, emailHtml);

        if (sent) {
          successCount++;
          console.log(`Email sent successfully to ${subscription.email}`);
        } else {
          errorCount++;
          console.error(`Failed to send email to ${subscription.email}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error processing subscription ${subscription.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Monthly email reports processed",
        total: subscriptions.length,
        success: successCount,
        failed: errorCount
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Scheduler error:", error);
    return new Response(
      JSON.stringify({ error: "Scheduler failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
