import type { CampaignItem } from "../data/campaignData";

export const LOCAL_STORAGE_CUSTOM_CAMPAIGNS_KEY = "ssb_custom_campaigns";
export const LOCAL_STORAGE_DELETED_CAMPAIGNS_KEY = "ssb_deleted_campaign_ids";

/**
 * Retrieve user-added or edited campaign items stored locally in the browser
 */
export function getCustomCampaigns(): CampaignItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_CAMPAIGNS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((c) => ({
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
  } catch (err) {
    console.warn("Could not read custom campaigns from localStorage:", err);
    return [];
  }
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
 * Persist or update a custom campaign item in browser localStorage
 */
export function saveCustomCampaign(campaign: CampaignItem): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCustomCampaigns();
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

    const index = existing.findIndex((c) => c.id === cleanItem.id);
    let updated: CampaignItem[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = cleanItem;
    } else {
      updated = [cleanItem, ...existing];
    }

    localStorage.setItem(LOCAL_STORAGE_CUSTOM_CAMPAIGNS_KEY, JSON.stringify(updated));

    // Remove from deleted list if re-saving
    const deleted = getDeletedCampaignIds();
    if (deleted.includes(cleanItem.id)) {
      const remainingDeleted = deleted.filter((id) => id !== cleanItem.id);
      localStorage.setItem(LOCAL_STORAGE_DELETED_CAMPAIGNS_KEY, JSON.stringify(remainingDeleted));
    }

    window.dispatchEvent(new CustomEvent("ssb_campaign_updated", { detail: { id: cleanItem.id } }));
  } catch (err) {
    console.error("Failed to save custom campaign to localStorage:", err);
  }
}

/**
 * Delete a campaign item by ID (persists to deleted list and removes from custom list)
 */
export function deleteCustomCampaign(campaignId: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCustomCampaigns();
    const filtered = existing.filter((c) => c.id !== campaignId);
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_CAMPAIGNS_KEY, JSON.stringify(filtered));

    const deleted = getDeletedCampaignIds();
    if (!deleted.includes(campaignId)) {
      deleted.push(campaignId);
      localStorage.setItem(LOCAL_STORAGE_DELETED_CAMPAIGNS_KEY, JSON.stringify(deleted));
    }

    window.dispatchEvent(new CustomEvent("ssb_campaign_updated", { detail: { id: campaignId, deleted: true } }));
  } catch (err) {
    console.error("Failed to delete custom campaign from localStorage:", err);
  }
}

/**
 * Merge base campaign items with locally stored custom items,
 * suppressing any deleted ones.
 */
export function mergeCampaignsWithLocal(baseItems: CampaignItem[]): CampaignItem[] {
  const custom = getCustomCampaigns();
  const deletedIds = new Set(getDeletedCampaignIds());

  const mergedMap = new Map<string, CampaignItem>();

  // Add base items not deleted
  for (const item of baseItems) {
    if (!deletedIds.has(item.id)) {
      mergedMap.set(item.id, {
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

  // Merge custom items (overwriting base if same id, or prepending new)
  for (const item of custom) {
    if (!deletedIds.has(item.id)) {
      mergedMap.set(item.id, item);
    }
  }

  return Array.from(mergedMap.values());
}
