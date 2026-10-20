import type { CampaignItem, ImageFrameSettings } from "../data/campaignData";

export const LOCAL_STORAGE_CUSTOM_CAMPAIGNS_KEY = "ssb_custom_campaigns";
export const LOCAL_STORAGE_DELETED_CAMPAIGNS_KEY = "ssb_deleted_campaign_ids";
export const CLOUDINARY_CONFIG_KEY = "ssb_cloudinary_config";

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

/**
 * Retrieve saved Cloudinary configuration (if user wants to use Cloudinary)
 */
export function getCloudinaryConfig(): CloudinaryConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CLOUDINARY_CONFIG_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Save Cloudinary configuration to browser localStorage
 */
export function saveCloudinaryConfig(config: CloudinaryConfig | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!config || !config.cloudName) {
      localStorage.removeItem(CLOUDINARY_CONFIG_KEY);
    } else {
      localStorage.setItem(CLOUDINARY_CONFIG_KEY, JSON.stringify(config));
    }
  } catch (err) {
    console.warn("Could not save Cloudinary config:", err);
  }
}

/**
 * Upload an image file directly to Cloudinary using an unsigned upload preset.
 * No secret API keys required!
 */
export async function uploadToCloudinary(
  file: File,
  cloudName: string,
  uploadPreset: string
): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "sugamya_advocacy");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloudinary upload failed: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data.secure_url || data.url;
}

/**
 * Automatically compress an image file client-side using HTML5 Canvas.
 * Reduces 5MB-10MB camera/phone photos to ~60KB-120KB web-optimized images,
 * preventing browser quota exhaustion and ensuring instant loading!
 */
export function compressImageFile(
  file: File,
  maxWidth = 1280,
  maxHeight = 800,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (readerEvent) => {
      const dataUrl = readerEvent.target?.result as string;
      if (!dataUrl) {
        resolve("");
        return;
      }

      // If file is already small SVG or tiny image (< 80KB), return as is
      if (file.type === "image/svg+xml" || file.size < 80 * 1024) {
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(dataUrl); // fallback to original dataUrl
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for superior compression, fallback to JPEG
        try {
          const webpData = canvas.toDataURL("image/webp", quality);
          if (webpData.startsWith("data:image/webp") && webpData.length > 50) {
            resolve(webpData);
            return;
          }
        } catch {
          // Ignore WebP failure and use JPEG
        }

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * In-memory fallback cache for current browser session
 */
const inMemoryCampaigns = new Map<string, CampaignItem>();

/**
 * Retrieve user-added or edited campaign items stored locally in the browser
 */
export function getCustomCampaigns(): CampaignItem[] {
  if (typeof window === "undefined") return [];

  let items: CampaignItem[] = [];

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_CAMPAIGNS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        items = parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read custom campaigns from localStorage:", err);
  }

  // Merge with any in-memory items (if localStorage was full)
  const map = new Map<string, CampaignItem>();
  for (const item of items) {
    map.set(item.id, item);
  }
  inMemoryCampaigns.forEach((item, id) => {
    if (!map.has(id)) {
      map.set(id, item);
    }
  });

  return Array.from(map.values()).map((c) => ({
    ...c,
    published: c.published !== false,
    frameSettings: c.frameSettings || {
      objectFit: "cover",
      objectPosition: "50% 50%",
      scale: 1,
      posX: 50,
      posY: 50,
    },
  }));
}

/**
 * Retrieve list of deleted campaign IDs to suppress from demo/fallback lists
 */
export function getDeletedCampaignIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DELETED_CAMPAIGNS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist or update a custom campaign item in browser localStorage + memory.
 * Safely handles QuotaExceededError by trimming oversized fields or using in-memory cache.
 */
export function saveCustomCampaign(campaign: CampaignItem): void {
  if (typeof window === "undefined") return;

  const cleanItem: CampaignItem = {
    ...campaign,
    published: campaign.published !== false,
    frameSettings: campaign.frameSettings || {
      objectFit: "cover",
      objectPosition: "50% 50%",
      scale: 1,
      posX: 50,
      posY: 50,
    },
  };

  // Always keep in session memory
  inMemoryCampaigns.set(cleanItem.id, cleanItem);

  try {
    const existing = getCustomCampaigns();
    const index = existing.findIndex((c) => c.id === cleanItem.id);
    let updated: CampaignItem[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = cleanItem;
    } else {
      updated = [cleanItem, ...existing];
    }

    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_CAMPAIGNS_KEY, JSON.stringify(updated));
    } catch (quotaErr) {
      console.warn(
        "LocalStorage quota exceeded when storing campaign items; pruning thumbnails...",
        quotaErr
      );
      // Prune redundant large thumbnailUrls if identical to mediaUrl
      const pruned = updated.map((item) => ({
        ...item,
        thumbnailUrl: item.thumbnailUrl === item.mediaUrl ? "" : item.thumbnailUrl,
      }));
      try {
        localStorage.setItem(LOCAL_STORAGE_CUSTOM_CAMPAIGNS_KEY, JSON.stringify(pruned));
      } catch {
        // If still full, store at least the 5 newest items
        localStorage.setItem(LOCAL_STORAGE_CUSTOM_CAMPAIGNS_KEY, JSON.stringify(pruned.slice(0, 5)));
      }
    }

    // Remove from deleted list if re-saving
    const deleted = getDeletedCampaignIds();
    if (deleted.includes(cleanItem.id)) {
      const remainingDeleted = deleted.filter((id) => id !== cleanItem.id);
      localStorage.setItem(LOCAL_STORAGE_DELETED_CAMPAIGNS_KEY, JSON.stringify(remainingDeleted));
    }
  } catch (err) {
    console.error("Failed to save custom campaign to localStorage:", err);
  } finally {
    // ALWAYS dispatch update event so public page and admin tab re-render instantly
    window.dispatchEvent(
      new CustomEvent("ssb_campaign_updated", { detail: { id: cleanItem.id } })
    );
  }
}

/**
 * Delete a campaign item by ID (persists to deleted list and removes from custom list)
 */
export function deleteCustomCampaign(campaignId: string): void {
  if (typeof window === "undefined") return;

  inMemoryCampaigns.delete(campaignId);

  try {
    const existing = getCustomCampaigns();
    const filtered = existing.filter((c) => c.id !== campaignId);
    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_CAMPAIGNS_KEY, JSON.stringify(filtered));
    } catch {}

    const deleted = getDeletedCampaignIds();
    if (!deleted.includes(campaignId)) {
      deleted.push(campaignId);
      localStorage.setItem(LOCAL_STORAGE_DELETED_CAMPAIGNS_KEY, JSON.stringify(deleted));
    }
  } catch (err) {
    console.error("Failed to delete custom campaign from localStorage:", err);
  } finally {
    window.dispatchEvent(
      new CustomEvent("ssb_campaign_updated", { detail: { id: campaignId, deleted: true } })
    );
  }
}

/**
 * Merge base campaign items with locally stored custom items,
 * suppressing any deleted ones and prepending new custom items at top.
 */
export function mergeCampaignsWithLocal(baseItems: CampaignItem[]): CampaignItem[] {
  const custom = getCustomCampaigns();
  const deletedIds = new Set(getDeletedCampaignIds());

  const baseMap = new Map<string, CampaignItem>();

  // Add base items not deleted
  for (const item of baseItems) {
    if (!deletedIds.has(item.id)) {
      baseMap.set(item.id, {
        ...item,
        frameSettings: item.frameSettings || {
          objectFit: "cover",
          objectPosition: "50% 50%",
          scale: 1,
          posX: 50,
          posY: 50,
        },
      });
    }
  }

  // Separate updated base items vs brand new custom items
  const newCustomItems: CampaignItem[] = [];
  for (const item of custom) {
    if (!deletedIds.has(item.id)) {
      if (baseMap.has(item.id)) {
        baseMap.set(item.id, item);
      } else {
        newCustomItems.push(item);
      }
    }
  }

  // Prepend brand new items at top, then base items (with any edits applied)
  return [...newCustomItems, ...Array.from(baseMap.values())];
}
