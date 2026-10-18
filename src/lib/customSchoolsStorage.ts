import type { SchoolItem } from "../data/schoolsData";

export const LOCAL_STORAGE_CUSTOM_SCHOOLS_KEY = "ssb_custom_schools";
export const LOCAL_STORAGE_DELETED_SCHOOLS_KEY = "ssb_deleted_school_ids";
export const LOCAL_STORAGE_SITE_CONTENT_KEY = "ssb_custom_site_content";

/**
 * Retrieve user-added or edited schools stored locally in the browser
 */
export function getCustomSchools(): SchoolItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_SCHOOLS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((s) => ({
      ...s,
      published: s.published !== false, // default true
    }));
  } catch (err) {
    console.warn("Could not read custom schools from localStorage:", err);
    return [];
  }
}

/**
 * Retrieve list of deleted school IDs to suppress from demo/fallback lists
 */
export function getDeletedSchoolIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DELETED_SCHOOLS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist or update a custom school in browser localStorage
 */
export function saveCustomSchool(school: SchoolItem): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCustomSchools();
    const cleanSchool: SchoolItem = {
      ...school,
      published: school.published !== false, // ensure visible unless explicitly false
    };

    const index = existing.findIndex((s) => s.id === cleanSchool.id);
    let updated: SchoolItem[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = cleanSchool;
    } else {
      updated = [cleanSchool, ...existing];
    }

    localStorage.setItem(LOCAL_STORAGE_CUSTOM_SCHOOLS_KEY, JSON.stringify(updated));

    // Also remove from deleted IDs if it was previously deleted
    const deletedIds = getDeletedSchoolIds().filter((id) => id !== cleanSchool.id);
    localStorage.setItem(LOCAL_STORAGE_DELETED_SCHOOLS_KEY, JSON.stringify(deletedIds));

    // Notify listeners across app
    window.dispatchEvent(new CustomEvent("ssb_schools_updated", { detail: cleanSchool }));
  } catch (err) {
    console.error("Failed to save school to localStorage:", err);
  }
}

/**
 * Remove a school locally and record its ID as deleted
 */
export function deleteCustomSchool(schoolId: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCustomSchools().filter((s) => s.id !== schoolId);
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_SCHOOLS_KEY, JSON.stringify(existing));

    const deletedIds = Array.from(new Set([...getDeletedSchoolIds(), schoolId]));
    localStorage.setItem(LOCAL_STORAGE_DELETED_SCHOOLS_KEY, JSON.stringify(deletedIds));

    window.dispatchEvent(
      new CustomEvent("ssb_schools_updated", { detail: { id: schoolId, deleted: true } })
    );
  } catch (err) {
    console.error("Failed to delete school from localStorage:", err);
  }
}

/**
 * Merge a base list of schools (from Firestore or DEMO_SCHOOLS) with browser-persisted changes
 */
export function mergeSchoolsWithLocal(baseSchools: SchoolItem[]): SchoolItem[] {
  if (typeof window === "undefined") return baseSchools;

  const deletedIds = new Set(getDeletedSchoolIds());
  const customSchools = getCustomSchools();

  // Filter out deleted schools
  const filteredBase = baseSchools.filter((s) => !deletedIds.has(s.id));

  // Merge custom schools (override existing base by ID or prepend newly added)
  const baseMap = new Map<string, SchoolItem>();
  filteredBase.forEach((s) => baseMap.set(s.id, s));

  customSchools.forEach((custom) => {
    if (!deletedIds.has(custom.id)) {
      baseMap.set(custom.id, custom);
    }
  });

  return Array.from(baseMap.values());
}

/**
 * Retrieve custom site content saved in admin (home / about)
 */
export function getCustomSiteContent<T = any>(section: "home" | "about"): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SITE_CONTENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return (parsed && parsed[section]) || null;
  } catch {
    return null;
  }
}

/**
 * Save custom site content in admin (home / about)
 */
export function saveCustomSiteContent(section: "home" | "about", data: any): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SITE_CONTENT_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    existing[section] = data;
    localStorage.setItem(LOCAL_STORAGE_SITE_CONTENT_KEY, JSON.stringify(existing));

    window.dispatchEvent(
      new CustomEvent("ssb_site_content_updated", { detail: { section, data } })
    );
  } catch (err) {
    console.error("Failed to save site content to localStorage:", err);
  }
}
