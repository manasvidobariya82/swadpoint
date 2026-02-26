const SETTINGS_STORAGE_KEY = "swadpointProductSettings";
const ACCOUNT_STORAGE_KEY = "swadpointAccountProfile";

const DEFAULT_BUSINESS_PROFILE = {
  brandName: "SwadPoint Restaurant",
  branchName: "Main Branch",
  ownerName: "Restaurant Owner",
  supportPhone: "+91 90000 00000",
  supportEmail: "owner@swadpoint.com",
  city: "Surat",
  address: "",
  website: "",
  gstNumber: "",
};

const readJSON = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const normalize = (value) => String(value || "").trim();

const pickFirst = (...values) => {
  for (const value of values) {
    const normalized = normalize(value);
    if (normalized) return normalized;
  }
  return "";
};

export const getBusinessProfile = () => {
  const account = readJSON(ACCOUNT_STORAGE_KEY, {});
  const settings = readJSON(SETTINGS_STORAGE_KEY, {});
  const restaurant = settings && typeof settings === "object"
    ? settings.restaurant || {}
    : {};

  return {
    brandName: pickFirst(
      account.brandName,
      restaurant.brandName,
      DEFAULT_BUSINESS_PROFILE.brandName
    ),
    branchName: pickFirst(
      account.branchName,
      restaurant.branchName,
      DEFAULT_BUSINESS_PROFILE.branchName
    ),
    ownerName: pickFirst(account.ownerName, DEFAULT_BUSINESS_PROFILE.ownerName),
    supportPhone: pickFirst(
      account.phone,
      restaurant.supportPhone,
      DEFAULT_BUSINESS_PROFILE.supportPhone
    ),
    supportEmail: pickFirst(
      account.email,
      restaurant.supportEmail,
      DEFAULT_BUSINESS_PROFILE.supportEmail
    ),
    city: pickFirst(account.city, restaurant.city, DEFAULT_BUSINESS_PROFILE.city),
    address: pickFirst(account.address, DEFAULT_BUSINESS_PROFILE.address),
    website: pickFirst(account.website, DEFAULT_BUSINESS_PROFILE.website),
    gstNumber: pickFirst(
      account.gstNumber,
      restaurant.gstNumber,
      DEFAULT_BUSINESS_PROFILE.gstNumber
    ),
  };
};

