import { describe, it } from "node:test";
import assert from "node:assert";

// Polyfill window & localStorage for Node test runner
const mockStorage = new Map();
global.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

global.window = {
  dispatchEvent: () => true,
};

global.CustomEvent = class CustomEvent {
  constructor(type, init) {
    this.type = type;
    this.detail = init?.detail;
  }
};

const {
  getCustomCampaigns,
  saveCustomCampaign,
  deleteCustomCampaign,
  mergeCampaignsWithLocal,
} = await import("../src/lib/customCampaignStorage.ts");

describe("Custom Campaign Storage & Frame Settings Test Suite", () => {
  it("Test 1: Saves custom campaign poster with frameSettings", () => {
    mockStorage.clear();
    const testItem = {
      id: "camp-test-1",
      type: "poster",
      title_hi: "परीक्षण पोस्टर",
      title_en: "Test Poster",
      description_hi: "विवरण",
      description_en: "Description",
      mediaUrl: "https://example.com/poster.jpg",
      thumbnailUrl: "https://example.com/poster.jpg",
      date: "2026-10-20",
      tags: ["Test"],
      published: true,
      frameSettings: {
        objectFit: "contain",
        objectPosition: "50% 20%",
        scale: 1.25,
        posX: 50,
        posY: 20,
      },
    };

    saveCustomCampaign(testItem);
    const campaigns = getCustomCampaigns();
    assert.strictEqual(campaigns.length, 1);
    assert.strictEqual(campaigns[0].id, "camp-test-1");
    assert.strictEqual(campaigns[0].frameSettings.objectFit, "contain");
    assert.strictEqual(campaigns[0].frameSettings.scale, 1.25);
    assert.strictEqual(campaigns[0].frameSettings.posY, 20);
  });

  it("Test 2: Merges custom campaign with base dataset without duplicates", () => {
    const baseItems = [
      {
        id: "camp-01",
        type: "poster",
        title_hi: "बेस 1",
        title_en: "Base 1",
        description_hi: "",
        description_en: "",
        mediaUrl: "",
        thumbnailUrl: "",
        date: "2026-10-01",
        tags: [],
        published: true,
      },
    ];

    const merged = mergeCampaignsWithLocal(baseItems);
    assert.strictEqual(merged.length, 2);
    const foundCustom = merged.find((m) => m.id === "camp-test-1");
    assert.ok(foundCustom);
    assert.strictEqual(foundCustom.frameSettings.scale, 1.25);
  });

  it("Test 3: Updates an existing campaign item frameSettings", () => {
    const updated = {
      id: "camp-test-1",
      type: "poster",
      title_hi: "अपडेटेड पोस्टर",
      title_en: "Updated Poster",
      description_hi: "",
      description_en: "",
      mediaUrl: "https://example.com/poster2.jpg",
      thumbnailUrl: "https://example.com/poster2.jpg",
      date: "2026-10-20",
      tags: ["Updated"],
      published: true,
      frameSettings: {
        objectFit: "cover",
        objectPosition: "70% 30%",
        scale: 1.5,
        posX: 70,
        posY: 30,
      },
    };

    saveCustomCampaign(updated);
    const campaigns = getCustomCampaigns();
    assert.strictEqual(campaigns.length, 1);
    assert.strictEqual(campaigns[0].title_en, "Updated Poster");
    assert.strictEqual(campaigns[0].frameSettings.objectFit, "cover");
    assert.strictEqual(campaigns[0].frameSettings.scale, 1.5);
    assert.strictEqual(campaigns[0].frameSettings.posX, 70);
  });

  it("Test 4: Deleting a campaign removes it and suppresses from merge", () => {
    deleteCustomCampaign("camp-test-1");
    const campaigns = getCustomCampaigns();
    assert.strictEqual(campaigns.length, 0);

    const merged = mergeCampaignsWithLocal([{ id: "camp-test-1", type: "poster" }]);
    assert.strictEqual(merged.length, 0);
  });
});
