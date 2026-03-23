"use client";

import { useEffect, useMemo, useState } from "react";
import type { PrayerItem } from "@/lib/content/types";

type PrayerApiResponse = {
  ok: boolean;
  schedule: PrayerItem[];
  timezone: string;
  locationName?: string;
};

type PrayerTodaySectionProps = {
  initialSchedule: PrayerItem[];
};

function getTimezoneLabel(timezone: string) {
  if (timezone === "Asia/Makassar") {
    return "WITA";
  }
  if (timezone === "Asia/Jakarta") {
    return "WIB";
  }
  if (timezone === "Asia/Jayapura") {
    return "WIT";
  }
  return "Lokal";
}

function getCurrentClockInTimezone(timezone: string) {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formatter.format(new Date());
}

function getCurrentMinutesInTimezone(timezone: string) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

function minutesFromTime(value: string) {
  const [h, m] = value.split(":").map((part) => Number(part));
  if (!Number.isFinite(h) || !Number.isFinite(m)) {
    return 0;
  }
  return h * 60 + m;
}

function getActivePrayerName(schedule: PrayerItem[], timezone: string) {
  if (!schedule.length) {
    return null;
  }

  const now = getCurrentMinutesInTimezone(timezone);
  const times = schedule.map((item) => minutesFromTime(item.time));
  const firstIndex = times.findIndex((time) => now < time);

  if (firstIndex === -1) {
    return schedule[schedule.length - 1]?.name ?? null;
  }
  if (firstIndex === 0) {
    return schedule[schedule.length - 1]?.name ?? null;
  }
  return schedule[firstIndex - 1]?.name ?? null;
}

export function PrayerTodaySection({ initialSchedule }: PrayerTodaySectionProps) {
  const [schedule, setSchedule] = useState<PrayerItem[]>(initialSchedule);
  const [timezone, setTimezone] = useState("Asia/Makassar");
  const [runningClock, setRunningClock] = useState(getCurrentClockInTimezone("Asia/Makassar"));
  const [locationText, setLocationText] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "denied">("idle");

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const response = await fetch(`/api/prayer?lat=${lat}&lon=${lon}`, {
            method: "GET",
            cache: "no-store",
          });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const data = (await response.json()) as PrayerApiResponse;
          if (!data.ok || !Array.isArray(data.schedule)) {
            throw new Error("Invalid prayer API response");
          }
          setSchedule(data.schedule);
          setTimezone(data.timezone || "Asia/Makassar");
          if (data.locationName) {
            setLocationText(data.locationName);
          }
          setLocationStatus("success");
        } catch {
          setLocationStatus("denied");
        }
      },
      () => {
        setLocationStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  }, []);

  useEffect(() => {
    setRunningClock(getCurrentClockInTimezone(timezone));

    const timer = window.setInterval(() => {
      setRunningClock(getCurrentClockInTimezone(timezone));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timezone]);

  const nextPrayer = useMemo(
    () => schedule.find((item) => item.status === "next") ?? schedule.at(0),
    [schedule],
  );
  const activePrayerName = getActivePrayerName(schedule, timezone);
  const tzLabel = getTimezoneLabel(timezone);

  return (
    <section id="shalat-hari-ini" className="mx-auto mt-8 max-w-5xl border-t border-[var(--border)] pt-8">
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold tracking-[-0.02em]">Shalat hari ini</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Berikutnya: <span className="font-semibold text-[var(--foreground)]">{nextPrayer?.name ?? "Belum tersedia"}</span>{" "}
          ({nextPrayer?.time ?? "--:--"} {tzLabel})
        </p>
        <p className="mt-1 text-xs font-medium text-[var(--muted)]">Jam sekarang: {runningClock} ({tzLabel})</p>
        {locationText ? <p className="mt-1 text-xs text-[var(--muted)]">Lokasi: {locationText}</p> : null}
        {locationStatus === "loading" ? <p className="mt-1 text-xs text-[var(--muted)]">Mendeteksi lokasi...</p> : null}
        {locationStatus === "denied" ? <p className="mt-1 text-xs text-[var(--muted)]">Lokasi tidak diizinkan, pakai jadwal default.</p> : null}
      </div>

      <div className="surface-card rounded-[24px] p-4 sm:p-5">
        <div className="space-y-2">
          {schedule.map((item) => (
            <div
              key={item.name}
              className={`interactive-row flex items-center justify-between rounded-xl border px-4 py-3 ${
                item.name === activePrayerName
                  ? "border-[var(--accent)] bg-[var(--accent-soft)]/45"
                  : "border-[var(--border)]"
              }`}
            >
              <span className="font-medium">{item.name}</span>
              <div className="flex items-center gap-3">
                {item.name === activePrayerName ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--accent)]">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
                    Aktif
                  </span>
                ) : null}
                {item.status ? (
                  <span
                    aria-label={item.status === "next" ? "Waktu shalat berikutnya" : "Waktu shalat sudah lewat"}
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      item.status === "next" ? "bg-[var(--accent)]" : "bg-[var(--muted)]/45"
                    }`}
                    title={item.status === "next" ? "Waktu berikutnya" : "Sudah lewat"}
                  />
                ) : (
                  <span
                    aria-label="Waktu shalat mendatang"
                    className="inline-block h-2.5 w-2.5 rounded-full border border-[var(--border)]"
                    title="Belum masuk waktu"
                  />
                )}
                <span
                  className={`w-[4.2ch] text-right tabular-nums ${
                    item.status === "next" ? "text-sm font-semibold text-[var(--accent)]" : "text-sm font-semibold"
                  }`}
                >
                  {item.time}
                </span>
                {item.status === "next" ? <span className="sr-only">Waktu shalat berikutnya</span> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
