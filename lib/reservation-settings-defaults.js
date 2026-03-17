export const DEFAULT_RESERVATION_SETTINGS = {
  autoConfirm: true,
  maxPartySize: 20,
  advanceBookingDays: 30,
  depositRequired: false,
  depositAmount: 0,
  cancellationWindow: 24,
  prepaymentRequired: false,
  prepaymentPercentage: 20,
  tableTurnoverTime: 90,
  allowWalkIns: true,
  smsNotifications: true,
  emailNotifications: true,
  bufferTime: 15,
  maxReservationsPerSlot: 8,
  waitlistEnabled: true,
  waitlistAutoFill: true,
  specialRequests: true,
  birthdayAlerts: true,
  anniversaryAlerts: true,
  theme: "light",
  language: "en",
  timezone: "UTC+5:30",
  currency: "INR",
};

export const DEFAULT_RESERVATION_TIME_SLOTS = [
  {
    id: "1",
    startTime: "11:00",
    endTime: "15:00",
    capacity: 50,
    isActive: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    type: "Lunch",
  },
  {
    id: "2",
    startTime: "18:00",
    endTime: "22:00",
    capacity: 70,
    isActive: true,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    type: "Dinner",
  },
  {
    id: "3",
    startTime: "12:00",
    endTime: "23:00",
    capacity: 90,
    isActive: true,
    days: ["Sat", "Sun"],
    type: "Weekend",
  },
];

export const DEFAULT_RESERVATION_TABLES = [
  {
    id: "1",
    number: 1,
    seats: 2,
    shape: "circle",
    status: "available",
    section: "Window",
    x: 100,
    y: 100,
  },
  {
    id: "2",
    number: 2,
    seats: 4,
    shape: "square",
    status: "available",
    section: "Window",
    x: 300,
    y: 100,
  },
  {
    id: "3",
    number: 3,
    seats: 6,
    shape: "rectangle",
    status: "reserved",
    section: "Main",
    x: 500,
    y: 100,
  },
  {
    id: "4",
    number: 4,
    seats: 8,
    shape: "rectangle",
    status: "occupied",
    section: "Private",
    x: 100,
    y: 300,
  },
];

export const DEFAULT_RESERVATION_SPECIAL_DATES = [
  {
    id: "1",
    date: "2026-12-25",
    name: "Christmas Day",
    type: "holiday",
    closed: true,
    specialHours: [],
  },
  {
    id: "2",
    date: "2026-12-31",
    name: "New Year's Eve",
    type: "event",
    closed: false,
    specialHours: [{ start: "18:00", end: "23:59" }],
  },
];

export const createDefaultReservationPayload = () => ({
  settings: { ...DEFAULT_RESERVATION_SETTINGS },
  timeSlots: DEFAULT_RESERVATION_TIME_SLOTS.map((slot) => ({
    ...slot,
    days: [...slot.days],
  })),
  tables: DEFAULT_RESERVATION_TABLES.map((table) => ({ ...table })),
  specialDates: DEFAULT_RESERVATION_SPECIAL_DATES.map((date) => ({
    ...date,
    specialHours: Array.isArray(date.specialHours)
      ? date.specialHours.map((hours) => ({ ...hours }))
      : [],
  })),
});
