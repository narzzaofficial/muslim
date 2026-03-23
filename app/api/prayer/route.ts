import { NextResponse } from "next/server";
import { getPrayerScheduleByCoordinates } from "@/lib/content/repository";

async function reverseGeocode(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
    zoom: "10",
    addressdetails: "1",
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: {
      "User-Agent": "muslim-narzza/1.0",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    address?: {
      city?: string;
      town?: string;
      village?: string;
      county?: string;
      state?: string;
      country?: string;
    };
  };

  const city =
    payload.address?.city ??
    payload.address?.town ??
    payload.address?.village ??
    payload.address?.county ??
    payload.address?.state;
  const country = payload.address?.country;

  if (city && country) {
    return `${city}, ${country}`;
  }
  if (city) {
    return city;
  }
  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ ok: false, message: "Latitude and longitude are required." }, { status: 400 });
  }

  const result = await getPrayerScheduleByCoordinates(lat, lon);
  const locationName = (await reverseGeocode(lat, lon)) ?? "Lokasi terdeteksi";

  return NextResponse.json({
    ok: true,
    schedule: result.schedule,
    timezone: result.timezone,
    locationName,
  });
}
