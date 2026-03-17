import { NextResponse } from "next/server";
import {
  createDefaultReservationPayload,
  DEFAULT_RESERVATION_SPECIAL_DATES,
  DEFAULT_RESERVATION_TABLES,
  DEFAULT_RESERVATION_TIME_SLOTS,
} from "@/lib/reservation-settings-defaults";
import {
  getReservationSettingsFromStore,
  replaceReservationSettingsInStore,
} from "@/lib/server-store";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOT_TYPES = ["Regular", "Lunch", "Dinner", "Weekend", "Brunch", "Happy Hour"];
const TABLE_SHAPES = ["circle", "square", "rectangle"];
const TABLE_STATUSES = ["available", "reserved", "occupied"];
const SPECIAL_DATE_TYPES = ["event", "holiday", "special", "maintenance"];

const normalizeText = (value, maxLength = 120) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value, min, max, fallback) =>
  Math.max(min, Math.min(max, toNumber(value, fallback)));

const normalizeTime = (value, fallback = "00:00") => {
  const raw = normalizeText(value, 5);
  return /^\d{2}:\d{2}$/.test(raw) ? raw : fallback;
};

const normalizeDateOnly = (value, fallback = "2026-01-01") => {
  const raw = normalizeText(value, 30);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const parsed = new Date(value).getTime();
  if (!Number.isFinite(parsed)) return fallback;
  return new Date(parsed).toISOString().slice(0, 10);
};

const sanitizeSettings = (value) => {
  const defaults = createDefaultReservationPayload().settings;
  const source = value && typeof value === "object" ? value : {};
  const next = { ...defaults };

  for (const [key, defaultValue] of Object.entries(defaults)) {
    const incoming = source[key];
    if (typeof defaultValue === "boolean") {
      next[key] =
        typeof incoming === "boolean"
          ? incoming
          : typeof incoming === "string"
          ? incoming === "true"
          : defaultValue;
      continue;
    }

    if (typeof defaultValue === "number") {
      next[key] = toNumber(incoming, defaultValue);
      continue;
    }

    next[key] = normalizeText(incoming ?? defaultValue, 40) || defaultValue;
  }

  next.maxPartySize = clamp(next.maxPartySize, 1, 100, defaults.maxPartySize);
  next.advanceBookingDays = clamp(
    next.advanceBookingDays,
    1,
    365,
    defaults.advanceBookingDays
  );
  next.depositAmount = clamp(next.depositAmount, 0, 100000, defaults.depositAmount);
  next.cancellationWindow = clamp(
    next.cancellationWindow,
    0,
    168,
    defaults.cancellationWindow
  );
  next.prepaymentPercentage = clamp(
    next.prepaymentPercentage,
    0,
    100,
    defaults.prepaymentPercentage
  );
  next.tableTurnoverTime = clamp(
    next.tableTurnoverTime,
    15,
    360,
    defaults.tableTurnoverTime
  );
  next.bufferTime = clamp(next.bufferTime, 0, 120, defaults.bufferTime);
  next.maxReservationsPerSlot = clamp(
    next.maxReservationsPerSlot,
    1,
    100,
    defaults.maxReservationsPerSlot
  );

  return next;
};

const sanitizeTimeSlots = (value) => {
  const source = Array.isArray(value) ? value : [];
  const sanitized = source
    .map((slot, index) => {
      const fallback = DEFAULT_RESERVATION_TIME_SLOTS[index] || {};
      const days = Array.isArray(slot?.days)
        ? slot.days.filter((day) => DAYS_OF_WEEK.includes(day))
        : [];
      const type = SLOT_TYPES.includes(slot?.type)
        ? slot.type
        : normalizeText(slot?.type, 30) || fallback.type || "Regular";

      return {
        id: normalizeText(slot?.id, 64) || `slot-${index + 1}`,
        startTime: normalizeTime(slot?.startTime, fallback.startTime || "11:00"),
        endTime: normalizeTime(slot?.endTime, fallback.endTime || "15:00"),
        capacity: clamp(slot?.capacity, 1, 500, fallback.capacity || 20),
        isActive:
          typeof slot?.isActive === "boolean"
            ? slot.isActive
            : Boolean(fallback.isActive),
        days: days.length ? days : fallback.days || ["Mon"],
        type,
      };
    })
    .filter(Boolean);

  return sanitized.length
    ? sanitized
    : createDefaultReservationPayload().timeSlots;
};

const sanitizeTables = (value) => {
  const source = Array.isArray(value) ? value : [];
  const sanitized = source
    .map((table, index) => {
      const fallback = DEFAULT_RESERVATION_TABLES[index] || {};
      const shape = TABLE_SHAPES.includes(table?.shape)
        ? table.shape
        : fallback.shape || "circle";
      const status = TABLE_STATUSES.includes(table?.status)
        ? table.status
        : fallback.status || "available";

      return {
        id: normalizeText(table?.id, 64) || `table-${index + 1}`,
        number: Math.floor(clamp(table?.number, 1, 1000, fallback.number || index + 1)),
        seats: Math.floor(clamp(table?.seats, 1, 20, fallback.seats || 2)),
        shape,
        status,
        section: normalizeText(table?.section || fallback.section || "Main", 40),
        x: clamp(table?.x, 0, 800, fallback.x || 0),
        y: clamp(table?.y, 0, 400, fallback.y || 0),
      };
    })
    .filter(Boolean);

  return sanitized.length ? sanitized : createDefaultReservationPayload().tables;
};

const sanitizeSpecialDates = (value) => {
  const source = Array.isArray(value) ? value : [];
  const sanitized = source
    .map((specialDate, index) => {
      const fallback = DEFAULT_RESERVATION_SPECIAL_DATES[index] || {};
      const type = SPECIAL_DATE_TYPES.includes(specialDate?.type)
        ? specialDate.type
        : fallback.type || "event";
      const hours = Array.isArray(specialDate?.specialHours)
        ? specialDate.specialHours
            .map((hour) => ({
              start: normalizeTime(hour?.start, "09:00"),
              end: normalizeTime(hour?.end, "17:00"),
            }))
            .filter((hour) => hour.start && hour.end)
        : [];

      return {
        id: normalizeText(specialDate?.id, 64) || `special-date-${index + 1}`,
        date: normalizeDateOnly(specialDate?.date, fallback.date || "2026-01-01"),
        name: normalizeText(specialDate?.name || fallback.name || "Special Day", 80),
        type,
        closed:
          typeof specialDate?.closed === "boolean"
            ? specialDate.closed
            : Boolean(fallback.closed),
        specialHours: hours,
      };
    })
    .filter((specialDate) => specialDate.name.length >= 2);

  return sanitized.length
    ? sanitized
    : createDefaultReservationPayload().specialDates;
};

const sanitizeReservationPayload = (value) => {
  const source = value && typeof value === "object" ? value : {};
  return {
    settings: sanitizeSettings(source.settings),
    timeSlots: sanitizeTimeSlots(source.timeSlots),
    tables: sanitizeTables(source.tables),
    specialDates: sanitizeSpecialDates(source.specialDates),
  };
};

export async function GET() {
  try {
    const payload = await getReservationSettingsFromStore();
    return NextResponse.json(sanitizeReservationPayload(payload));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch reservation settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Reservation settings payload must be an object" },
        { status: 400 }
      );
    }

    const sanitized = sanitizeReservationPayload(body);
    const saved = await replaceReservationSettingsInStore(sanitized);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json(
      { error: "Failed to save reservation settings" },
      { status: 500 }
    );
  }
}
