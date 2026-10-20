"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase/firestore";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { storage } from "@/lib/firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  CommunityVoiceItem,
  CommunityRole,
  DEMO_COMMUNITY_VOICES,
} from "@/data/communityVoicesData";
import {
  CampaignItem,
  CampaignType,
  CAMPAIGN_TYPE_META,
  DEMO_CAMPAIGN_ITEMS,
  ImageFrameSettings,
} from "@/data/campaignData";
import {
  saveCustomCampaign,
  deleteCustomCampaign,
  mergeCampaignsWithLocal,
  compressImageFile,
  getCloudinaryConfig,
  saveCloudinaryConfig,
  uploadToCloudinary,
  CloudinaryConfig,
} from "@/lib/customCampaignStorage";
import {
  Heart,
  Megaphone,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Lock,
  ShieldCheck,
  Eye,
  FileText,
  AlertTriangle,
  X,
  Save,
  Upload,
  Crop,
  Film,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  Check,
  ZoomIn,
  Move,
  Loader2,
  Cloud,
  Settings2,
} from "lucide-react";

interface Props {
  isHindi: boolean;
}

const DEFAULT_FRAME_SETTINGS: ImageFrameSettings = {
  objectFit: "cover",
  objectPosition: "50% 50%",
  scale: 1,
  posX: 50,
  posY: 50,
};

export function CommunityVoicesAdvocacyTab({ isHindi }: Props) {
  const [subTab, setSubTab] = useState<"voices" | "campaign">("campaign");
  const [feedback, setFeedback] = useState<string>("");

  // Voices state
  const [voices, setVoices] = useState<CommunityVoiceItem[]>(DEMO_COMMUNITY_VOICES);
  const [editingVoice, setEditingVoice] = useState<CommunityVoiceItem | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Campaign state
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(() =>
    mergeCampaignsWithLocal(DEMO_CAMPAIGN_ITEMS)
  );
  const [editingCampaign, setEditingCampaign] = useState<CampaignItem | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // Media upload & frame adjustment states
  const [mediaInputMode, setMediaInputMode] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cloudinary Settings State
  const [cloudinaryConfig, setCloudinaryConfig] = useState<CloudinaryConfig>(() =>
    getCloudinaryConfig() || { cloudName: "", uploadPreset: "" }
  );
  const [showCloudinarySettings, setShowCloudinarySettings] = useState(false);

  // Quick frame editor modal (for direct frame adjustment from list)
  const [quickFrameItem, setQuickFrameItem] = useState<CampaignItem | null>(null);

  // Sync with Firestore & localStorage
  useEffect(() => {
    async function loadData() {
      // 1. First merge from localStorage immediately
      setCampaigns((prev) => mergeCampaignsWithLocal(prev.length > 0 ? prev : DEMO_CAMPAIGN_ITEMS));

      if (!db) return;
      try {
        const vSnap = await getDocs(collection(db, "communityVoices"));
        if (!vSnap.empty) {
          const list: CommunityVoiceItem[] = [];
          vSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as CommunityVoiceItem));
          setVoices(list);
        }
        const cSnap = await getDocs(collection(db, "campaignItems"));
        if (!cSnap.empty) {
          const list: CampaignItem[] = [];
          cSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as CampaignItem));
          setCampaigns(mergeCampaignsWithLocal(list));
        }
      } catch (e) {
        console.warn("Using fallback dataset for voices/advocacy admin:", e);
      }
    }
    loadData();

    // Listen to local sync events across tabs / windows
    const handleSync = () => {
      setCampaigns((prev) => mergeCampaignsWithLocal(prev));
    };
    window.addEventListener("ssb_campaign_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("ssb_campaign_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 3500);
  };

  const isImageType = (type: CampaignType) =>
    type === "poster" || type === "workshop" || type === "mobilisation";

  // Toggle Voice Publish
  const handleToggleVoicePublish = async (item: CommunityVoiceItem) => {
    if (!item.consentRecorded && !item.published) {
      alert(
        isHindi
          ? "त्रुटि: बिना रिकॉर्डेड सहमति (Recorded Consent) के कहानी को प्रकाशित नहीं किया जा सकता।"
          : "Error: Cannot publish a story without documented consent flag."
      );
      return;
    }

    const nextState = !item.published;
    if (db) {
      try {
        await updateDoc(doc(db, "communityVoices", item.id), { published: nextState });
      } catch (e) {
        console.warn("Firestore update error:", e);
      }
    }
    setVoices((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, published: nextState } : v))
    );
    notify(nextState ? "कहानी प्रकाशित की गई!" : "कहानी अप्रकाशित की गई।");
  };

  // Delete Voice
  const handleDeleteVoice = async (id: string) => {
    if (db) {
      try {
        await deleteDoc(doc(db, "communityVoices", id));
      } catch (e) {
        console.warn("Firestore delete error:", e);
      }
    }
    setVoices((prev) => prev.filter((v) => v.id !== id));
    notify("कहानी हटा दी गई।");
  };

  // Save Voice (Add/Edit)
  const handleSaveVoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVoice) return;

    const id = editingVoice.id || `voice-${Date.now()}`;
    const cleanItem = { ...editingVoice, id };

    if (db) {
      try {
        await setDoc(doc(db, "communityVoices", id), cleanItem, { merge: true });
      } catch (e) {
        console.warn("Firestore save error:", e);
      }
    }

    setVoices((prev) => {
      const idx = prev.findIndex((v) => v.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = cleanItem;
        return copy;
      }
      return [cleanItem, ...prev];
    });

    setIsVoiceModalOpen(false);
    setEditingVoice(null);
    notify("कहानी सुरक्षित सहेज ली गई!");
  };

  // Toggle Campaign Publish
  const handleToggleCampaignPublish = async (item: CampaignItem) => {
    const nextState = !item.published;
    const updated = { ...item, published: nextState };

    if (db) {
      try {
        await updateDoc(doc(db, "campaignItems", item.id), { published: nextState });
      } catch (e) {
        console.warn("Firestore update error:", e);
      }
    }
    saveCustomCampaign(updated);

    setCampaigns((prev) =>
      prev.map((c) => (c.id === item.id ? updated : c))
    );
    notify(nextState ? "अभियान सामग्री प्रकाशित की गई!" : "अभियान सामग्री अप्रकाशित की गई।");
  };

  // Delete Campaign Item
  const handleDeleteCampaign = async (id: string) => {
    if (db) {
      try {
        await deleteDoc(doc(db, "campaignItems", id));
      } catch (e) {
        console.warn("Firestore delete error:", e);
      }
    }
    deleteCustomCampaign(id);
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    notify("अभियान सामग्री हटा दी गई।");
  };

  // Save Campaign Item (Add/Edit)
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    const id = editingCampaign.id || `camp-${Date.now()}`;
    const isImg = isImageType(editingCampaign.type);

    const cleanItem: CampaignItem = {
      ...editingCampaign,
      id,
      published: editingCampaign.published !== false,
      frameSettings: isImg
        ? editingCampaign.frameSettings || DEFAULT_FRAME_SETTINGS
        : undefined, // Frame settings ONLY for images
    };

    if (db) {
      try {
        await setDoc(doc(db, "campaignItems", id), cleanItem, { merge: true });
      } catch (e) {
        console.warn("Firestore save error:", e);
      }
    }

    saveCustomCampaign(cleanItem);

    setCampaigns((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = cleanItem;
        return copy;
      }
      return [cleanItem, ...prev];
    });

    setIsCampaignModalOpen(false);
    setEditingCampaign(null);
    notify("अभियान सामग्री सहेज ली गई और मुख्य वेबसाइट पर लाइव है!");
  };

  // Direct File Upload Handler (with In-browser Auto Compression & Cloudinary/Firebase support)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    expectedCategory: "image" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (expectedCategory === "image" && !file.type.startsWith("image/")) {
      alert(
        isHindi
          ? "कृपया केवल वैध इमेज फाइल चुनें (JPG, PNG, WebP, SVG)।"
          : "Please select a valid image file (JPG, PNG, WebP, SVG)."
      );
      return;
    }

    if (expectedCategory === "video" && !file.type.startsWith("video/")) {
      alert(
        isHindi
          ? "कृपया केवल वैध वीडियो फाइल चुनें (MP4, WebM, MOV)।"
          : "Please select a valid video file (MP4, WebM, MOV)."
      );
      return;
    }

    setIsUploading(true);

    try {
      if (expectedCategory === "image") {
        setUploadProgress(
          isHindi
            ? "फोटो को ऑटो-कंप्रेस किया जा रहा है..."
            : "Compressing image for instant loading..."
        );

        // 1. High-quality client-side canvas compression: scales to web dimensions (max 1280px)
        // Reduces 5MB-10MB photos to ~70KB-90KB WebP data URL
        const compressedDataUrl = await compressImageFile(file, 1280, 800, 0.82);

        setEditingCampaign((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            mediaUrl: compressedDataUrl,
            thumbnailUrl: compressedDataUrl,
            frameSettings: prev.frameSettings || DEFAULT_FRAME_SETTINGS,
          };
        });

        // 2. Check if Cloudinary is configured (Unsigned Preset)
        if (cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset) {
          try {
            setUploadProgress(
              isHindi ? "Cloudinary पर अपलोड हो रहा है..." : "Uploading to Cloudinary..."
            );
            const cloudUrl = await uploadToCloudinary(
              file,
              cloudinaryConfig.cloudName,
              cloudinaryConfig.uploadPreset
            );
            setEditingCampaign((prev) => (prev ? { ...prev, mediaUrl: cloudUrl } : null));
            notify(
              isHindi
                ? "Cloudinary CDN पर सफलतापूर्वक अपलोड हुआ!"
                : "Uploaded to Cloudinary CDN successfully!"
            );
          } catch (cloudErr) {
            console.warn("Cloudinary upload issue, retaining compressed data URL:", cloudErr);
            notify(
              isHindi
                ? "तस्वीर कंप्रेस होकर तैयार है (लोकल प्रीव्यू सक्रिय)!"
                : "Image compressed and ready!"
            );
          }
        } else if (storage) {
          // 3. Or if Firebase Storage bucket is available
          try {
            setUploadProgress(
              isHindi
                ? "क्लाउड स्टोरेज में सुरक्षित किया जा रहा है..."
                : "Uploading to cloud storage..."
            );
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const storageRef = ref(storage, `campaignMedia/${Date.now()}_${safeName}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(snapshot.ref);

            setEditingCampaign((prev) => (prev ? { ...prev, mediaUrl: downloadUrl } : null));
            notify(
              isHindi
                ? "क्लाउड स्टोरेज पर मीडिया सुरक्षित हुआ!"
                : "Media saved to cloud storage!"
            );
          } catch (err) {
            console.warn("Firebase Storage permission notice, using compressed copy:", err);
            notify(
              isHindi
                ? "तस्वीर कंप्रेस होकर तैयार है (Zero API Key आवश्यक)!"
                : "Image ready with auto-compression!"
            );
          }
        } else {
          notify(
            isHindi
              ? "तस्वीर कंप्रेस होकर तैयार है!"
              : "Image compressed and ready!"
          );
        }
      } else {
        // VIDEO FILE UPLOAD
        setUploadProgress(
          isHindi ? "वीडियो लोड हो रहा है..." : "Loading video file..."
        );
        const reader = new FileReader();
        reader.onload = async (event) => {
          const videoDataUrl = event.target?.result as string;
          setEditingCampaign((prev) => (prev ? { ...prev, mediaUrl: videoDataUrl } : null));

          if (storage) {
            try {
              setUploadProgress(
                isHindi ? "वीडियो क्लाउड में अपलोड हो रहा है..." : "Uploading video to cloud..."
              );
              const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
              const storageRef = ref(storage, `campaignMedia/${Date.now()}_${safeName}`);
              const snapshot = await uploadBytes(storageRef, file);
              const downloadUrl = await getDownloadURL(snapshot.ref);
              setEditingCampaign((prev) => (prev ? { ...prev, mediaUrl: downloadUrl } : null));
              notify(isHindi ? "वीडियो सफलतापूर्वक अपलोड हुआ!" : "Video uploaded successfully!");
            } catch (err) {
              console.warn("Firebase video storage upload:", err);
            }
          }
          setIsUploading(false);
          setUploadProgress("");
        };
        reader.onerror = () => {
          alert(isHindi ? "वीडियो पढ़ने में त्रुटि हुई।" : "Failed to read video file.");
          setIsUploading(false);
          setUploadProgress("");
        };
        reader.readAsDataURL(file);
        return;
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(isHindi ? "अपलोड में त्रुटि हुई।" : "Failed to process upload.");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  // Quick Frame Save
  const handleSaveQuickFrame = async () => {
    if (!quickFrameItem) return;

    if (db) {
      try {
        await updateDoc(doc(db, "campaignItems", quickFrameItem.id), {
          frameSettings: quickFrameItem.frameSettings,
        });
      } catch (e) {
        console.warn("Firestore frame update error:", e);
      }
    }

    saveCustomCampaign(quickFrameItem);

    setCampaigns((prev) =>
      prev.map((c) => (c.id === quickFrameItem.id ? quickFrameItem : c))
    );

    setQuickFrameItem(null);
    notify(isHindi ? "फ्रेम एडजस्टमेंट सहेज लिया गया!" : "Frame settings saved!");
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between gap-4 border-b pb-3 flex-wrap">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSubTab("campaign")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === "campaign"
                ? "bg-teal-700 text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>
              {isHindi
                ? `जागरूकता व अभियान सामग्री (${campaigns.length})`
                : `Awareness & Advocacy (${campaigns.length})`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("voices")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === "voices"
                ? "bg-teal-700 text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>
              {isHindi
                ? `सामुदायिक आवाज़ें (${voices.length})`
                : `Community Voices (${voices.length})`}
            </span>
          </button>
        </div>

        {subTab === "campaign" ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCloudinarySettings(!showCloudinarySettings)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              title="Cloudinary Cloud Storage Settings"
            >
              <Cloud className="w-4 h-4 text-sky-600" />
              <span>{isHindi ? "Cloudinary सेटिंग्स" : "Cloudinary Settings"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingCampaign({
                  id: "",
                  type: "poster",
                  title_hi: "",
                  title_en: "",
                  description_hi: "",
                  description_en: "",
                  mediaUrl: "",
                  thumbnailUrl: "",
                  date: new Date().toISOString().split("T")[0],
                  tags: ["Advocacy"],
                  published: true,
                  frameSettings: { ...DEFAULT_FRAME_SETTINGS },
                });
                setMediaInputMode("upload");
                setIsCampaignModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>
                {isHindi
                  ? "नया फोटो / वीडियो आइटम जोड़ें"
                  : "Add Photo / Video Item"}
              </span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditingVoice({
                id: "",
                role: "student",
                title_hi: "",
                title_en: "",
                story_hi: "",
                story_en: "",
                keyTheme_hi: "सुगम्यता अनुभव",
                keyTheme_en: "Accessibility Experience",
                isAnonymous: true,
                authorDisplayName_hi: "एक छात्र (पटना)",
                authorDisplayName_en: "A Student (Patna)",
                consentRecorded: true,
                consentDetails: {
                  consentDate: new Date().toISOString().split("T")[0],
                  consentType: "written",
                  isMinor: false,
                  hasPhotoConsent: false,
                },
                published: true,
                createdAt: new Date().toISOString(),
              });
              setIsVoiceModalOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? "नई कहानी जोड़ें" : "Add Story"}</span>
          </button>
        )}
      </div>

      {/* Optional Cloudinary Settings Panel */}
      {showCloudinarySettings && (
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs space-y-3 animate-fade-in shadow-xs">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-sky-700" />
              <h4 className="font-bold text-sky-950">
                {isHindi
                  ? "Cloudinary क्लाउड स्टोरेज (वैकल्पिक / Optional)"
                  : "Cloudinary Cloud Storage (Optional CDN)"}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowCloudinarySettings(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-slate-600 text-[11px] leading-relaxed">
            {isHindi
              ? "ℹ️ नोट: Cloudinary की आवश्यकता अनिवार्य नहीं है! हमारा सिस्टम इन-ब्राउज़र ऑटो-कंप्रेशन से बिना किसी API Key के फोटो तुरंत वेबसाइट पर दिखाता है। अगर आप Cloudinary पर परमानेंट होस्टिंग चाहते हैं तो केवल Free Unsigned Upload Preset का नाम दर्ज करें:"
              : "ℹ️ Note: Cloudinary is NOT mandatory. The portal works out-of-the-box with in-browser compression without any API keys. If you wish to host files on your Cloudinary account, enter your free unsigned preset details:"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Cloud Name:
              </label>
              <input
                type="text"
                value={cloudinaryConfig.cloudName}
                onChange={(e) =>
                  setCloudinaryConfig({ ...cloudinaryConfig, cloudName: e.target.value.trim() })
                }
                placeholder="e.g. dxyz123abc"
                className="w-full p-2 border rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Unsigned Upload Preset:
              </label>
              <input
                type="text"
                value={cloudinaryConfig.uploadPreset}
                onChange={(e) =>
                  setCloudinaryConfig({
                    ...cloudinaryConfig,
                    uploadPreset: e.target.value.trim(),
                  })
                }
                placeholder="e.g. sugamya_advocacy"
                className="w-full p-2 border rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                saveCloudinaryConfig(null);
                setCloudinaryConfig({ cloudName: "", uploadPreset: "" });
                notify(isHindi ? "Cloudinary सेटिंग्स हटा दी गईं।" : "Cloudinary config cleared.");
              }}
              className="px-3 py-1.5 border rounded-lg bg-white text-slate-600 font-medium"
            >
              {isHindi ? "साफ़ करें" : "Clear"}
            </button>
            <button
              type="button"
              onClick={() => {
                saveCloudinaryConfig(cloudinaryConfig);
                setShowCloudinarySettings(false);
                notify(isHindi ? "Cloudinary सेटिंग्स सहेज ली गईं!" : "Cloudinary settings saved!");
              }}
              className="px-4 py-1.5 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg"
            >
              {isHindi ? "सहेजें" : "Save Config"}
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* CAMPAIGN SUB-TAB (Photos & Videos Manager) */}
      {subTab === "campaign" && (
        <div className="space-y-4">
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-950 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-600 text-white">
                <Crop className="w-4 h-4" />
              </span>
              <span>
                {isHindi
                  ? "फोटो और वीडियो अपलोड करें। इन-ब्राउज़र ऑटो-कंप्रेशन सक्रिय है। फोटो के लिए 16:9 कार्ड फ्रेम में ज़ूम व स्थिति एडजस्ट करने का विकल्प उपलब्ध है।"
                  : "Upload photos & videos. Client-side auto-compression active. 16:9 card frame adjustment is available specifically for photos."}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {campaigns.map((c) => {
              const meta = CAMPAIGN_TYPE_META[c.type];
              const isImg = isImageType(c.type);
              const frame = c.frameSettings || DEFAULT_FRAME_SETTINGS;

              return (
                <div
                  key={c.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    {/* Visual Media Thumbnail with applied frame */}
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200 shadow-xs">
                      {isImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.mediaUrl}
                          alt={c.title_hi || "Campaign thumbnail"}
                          style={{
                            objectFit: frame.objectFit || "cover",
                            objectPosition: `${frame.posX ?? 50}% ${frame.posY ?? 50}%`,
                            transform:
                              frame.scale && frame.scale > 1
                                ? `scale(${frame.scale})`
                                : undefined,
                          }}
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
                          <Film className="w-6 h-6 text-purple-400 mb-0.5" />
                          <span className="text-[9px] font-mono text-purple-200 uppercase">
                            Video
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1">
                        <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-black/70 text-white">
                          16:9
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${meta.badgeClass}`}
                        >
                          {meta.icon} {isHindi ? meta.label_hi : meta.label_en}
                        </span>
                        {c.published ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {isHindi ? "प्रकाशित" : "Published"}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                            {isHindi ? "अप्रकाशित" : "Unpublished"}
                          </span>
                        )}
                        {isImg && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                            <Crop className="w-3 h-3 text-sky-600" />
                            <span>
                              {frame.objectFit} • {frame.scale ?? 1}x
                            </span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {c.date}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-navy-900 truncate">
                        {isHindi ? c.title_hi : c.title_en}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {isHindi ? c.description_hi : c.description_en}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                    {/* Quick Frame Adjust Button (STRICTLY FOR IMAGES ONLY) */}
                    {isImg && (
                      <button
                        type="button"
                        onClick={() =>
                          setQuickFrameItem({
                            ...c,
                            frameSettings: c.frameSettings || { ...DEFAULT_FRAME_SETTINGS },
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title={isHindi ? "फ्रेम एडजस्ट करें" : "Adjust Card Frame"}
                      >
                        <Crop className="w-3.5 h-3.5 text-teal-700" />
                        <span>{isHindi ? "फ्रेम एडजस्ट" : "Adjust Frame"}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleCampaignPublish(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        c.published
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          : "bg-teal-700 hover:bg-teal-800 text-white"
                      }`}
                    >
                      {c.published
                        ? isHindi
                          ? "अप्रकाशित करें"
                          : "Unpublish"
                        : isHindi
                        ? "प्रकाशित करें"
                        : "Publish"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingCampaign({
                          ...c,
                          frameSettings: isImg
                            ? c.frameSettings || { ...DEFAULT_FRAME_SETTINGS }
                            : undefined,
                        });
                        setMediaInputMode(c.mediaUrl?.startsWith("data:") ? "upload" : "url");
                        setIsCampaignModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                      title={isHindi ? "संपादित करें" : "Edit Item"}
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCampaign(c.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                      title={isHindi ? "हटाएं" : "Delete Item"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VOICES SUB-TAB */}
      {subTab === "voices" && (
        <div className="space-y-3">
          {voices.map((v) => (
            <div
              key={v.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                    {v.role}
                  </span>
                  {v.isAnonymous ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Anonymous
                    </span>
                  ) : null}
                  {v.consentRecorded ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Consent OK
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      No Consent
                    </span>
                  )}
                  {v.published ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Published
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                      Unpublished
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-navy-900 leading-snug">
                  {isHindi ? v.title_hi : v.title_en}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {isHindi ? v.story_hi : v.story_en}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleVoicePublish(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    v.published
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      : "bg-teal-700 hover:bg-teal-800 text-white"
                  }`}
                >
                  {v.published
                    ? isHindi
                      ? "अप्रकाशित करें"
                      : "Unpublish"
                    : isHindi
                    ? "प्रकाशित करें"
                    : "Publish"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingVoice(v);
                    setIsVoiceModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteVoice(v.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Voice Add/Edit Modal */}
      {isVoiceModalOpen && editingVoice && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-navy-900">
                {editingVoice.id ? "कहानी संपादित करें" : "नई कहानी जोड़ें"}
              </h3>
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVoice} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">भूमिका (Role):</label>
                  <select
                    value={editingVoice.role}
                    onChange={(e) =>
                      setEditingVoice({
                        ...editingVoice,
                        role: e.target.value as CommunityRole,
                      })
                    }
                    className="w-full mt-1 p-2 border rounded-lg"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="advocate">Advocate</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">सहमति रिकॉर्ड (Consent):</label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingVoice.consentRecorded}
                      onChange={(e) =>
                        setEditingVoice({
                          ...editingVoice,
                          consentRecorded: e.target.checked,
                        })
                      }
                      className="rounded text-teal-600"
                    />
                    <span className="font-medium">Consent Confirmed</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">शीर्षक (हिन्दी):</label>
                <input
                  type="text"
                  required
                  value={editingVoice.title_hi}
                  onChange={(e) =>
                    setEditingVoice({ ...editingVoice, title_hi: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Title (English):</label>
                <input
                  type="text"
                  required
                  value={editingVoice.title_en}
                  onChange={(e) =>
                    setEditingVoice({ ...editingVoice, title_en: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">अनुभव / कहानी (हिन्दी):</label>
                <textarea
                  rows={3}
                  required
                  value={editingVoice.story_hi}
                  onChange={(e) =>
                    setEditingVoice({ ...editingVoice, story_hi: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Story (English):</label>
                <textarea
                  rows={3}
                  required
                  value={editingVoice.story_en}
                  onChange={(e) =>
                    setEditingVoice({ ...editingVoice, story_en: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsVoiceModalOpen(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-700 text-white font-bold rounded-lg"
                >
                  Save Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Campaign Add/Edit Modal (with Upload and Frame Adjustment for Images) */}
      {isCampaignModalOpen && editingCampaign && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
        >
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-2xl w-full max-h-[92vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-teal-700" />
                  <span>
                    {editingCampaign.id
                      ? isHindi
                        ? "अभियान सामग्री संपादन"
                        : "Edit Campaign Item"
                      : isHindi
                      ? "नया अभियान आइटम जोड़ें"
                      : "Add New Campaign Item"}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  {isHindi
                    ? "फोटो या वीडियो अपलोड करें और विवरण भरें।"
                    : "Upload photo or video media and specify metadata."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCampaignModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
              {/* Type and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    प्रकार (Format):
                  </label>
                  <select
                    value={editingCampaign.type}
                    onChange={(e) => {
                      const nextType = e.target.value as CampaignType;
                      const nextIsImg = isImageType(nextType);
                      setEditingCampaign({
                        ...editingCampaign,
                        type: nextType,
                        frameSettings: nextIsImg
                          ? editingCampaign.frameSettings || { ...DEFAULT_FRAME_SETTINGS }
                          : undefined,
                      });
                    }}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 font-medium text-slate-800"
                  >
                    <option value="poster">🖼️ Poster (इमेज)</option>
                    <option value="workshop">📷 Workshop Photo (इमेज)</option>
                    <option value="mobilisation">📢 Community Mobilisation (इमेज)</option>
                    <option value="video">🎬 Video Explainer (वीडियो)</option>
                    <option value="reel">📱 Reels / Shorts (वीडियो)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    दिनांक (Date):
                  </label>
                  <input
                    type="date"
                    value={editingCampaign.date}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, date: e.target.value })
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              {/* MEDIA UPLOAD SECTION */}
              <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    {isImageType(editingCampaign.type) ? (
                      <>
                        <ImageIcon className="w-4 h-4 text-teal-700" />
                        <span>फोटो चयन (Photo Upload / URL)</span>
                      </>
                    ) : (
                      <>
                        <Film className="w-4 h-4 text-purple-700" />
                        <span>वीडियो चयन (Video Upload / URL)</span>
                      </>
                    )}
                  </span>

                  {/* Mode switcher */}
                  <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setMediaInputMode("upload")}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        mediaInputMode === "upload"
                          ? "bg-teal-700 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>{isHindi ? "फ़ाइल अपलोड करें" : "Upload File"}</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaInputMode("url")}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        mediaInputMode === "url"
                          ? "bg-teal-700 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>{isHindi ? "URL लिंक दर्ज करें" : "Paste URL"}</span>
                    </button>
                  </div>
                </div>

                {mediaInputMode === "upload" ? (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={isImageType(editingCampaign.type) ? "image/*" : "video/*"}
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(
                          e,
                          isImageType(editingCampaign.type) ? "image" : "video"
                        )
                      }
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer border-2 border-dashed border-teal-400 hover:border-teal-600 hover:bg-teal-50/80 rounded-xl p-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 bg-white"
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                          <span className="text-teal-900 font-bold text-xs">
                            {uploadProgress}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="p-2.5 rounded-full bg-teal-100 text-teal-800">
                            {isImageType(editingCampaign.type) ? (
                              <Upload className="w-5 h-5" />
                            ) : (
                              <Film className="w-5 h-5" />
                            )}
                          </div>
                          <span className="font-bold text-slate-800 text-xs">
                            {isHindi
                              ? isImageType(editingCampaign.type)
                                ? "फोटो अपलोड करने के लिए यहां क्लिक करें"
                                : "वीडियो अपलोड करने के लिए यहां क्लिक करें"
                              : isImageType(editingCampaign.type)
                              ? "Click to choose an Image (JPG, PNG, WebP)"
                              : "Click to choose a Video (MP4, WebM)"}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {isImageType(editingCampaign.type)
                              ? "ऑटो-कंप्रेशन सक्रिय • किसी API key की आवश्यकता नहीं"
                              : "समर्थित प्रारूप: MP4, WebM, MOV"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      required
                      value={editingCampaign.mediaUrl}
                      onChange={(e) =>
                        setEditingCampaign({ ...editingCampaign, mediaUrl: e.target.value })
                      }
                      placeholder={
                        isImageType(editingCampaign.type)
                          ? "https://images.unsplash.com/..."
                          : "https://...video.mp4"
                      }
                      className="w-full p-2.5 border rounded-xl bg-white font-mono text-[11px]"
                    />
                  </div>
                )}

                {/* ============================================================== */}
                {/* STRICT REQUIREMENT: FRAME ADJUSTMENT FOR IMAGES ONLY           */}
                {/* When media is an image, display live 16:9 frame preview & fit controls */}
                {/* For videos, display standard video player preview (no frame edit)     */}
                {/* ============================================================== */}
                {editingCampaign.mediaUrl && (
                  <div className="pt-2 border-t border-teal-200/60">
                    {isImageType(editingCampaign.type) ? (
                      /* IMAGE FRAME ADJUSTER */
                      <div className="space-y-3 bg-white p-3.5 rounded-xl border border-teal-300 shadow-xs">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-1.5">
                            <Crop className="w-4 h-4 text-teal-700" />
                            <span className="font-black text-slate-900 text-xs">
                              {isHindi
                                ? "फ़्रेम में कैसा दिखेगा (16:9 कार्ड एडजस्टमेंट)"
                                : "Card Frame Preview & Adjust (16:9 Image)"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingCampaign({
                                ...editingCampaign,
                                frameSettings: { ...DEFAULT_FRAME_SETTINGS },
                              });
                            }}
                            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{isHindi ? "डिफ़ॉल्ट रीसेट" : "Reset Frame"}</span>
                          </button>
                        </div>

                        {/* Live 16:9 Frame Preview Box */}
                        <div className="relative aspect-video w-full max-w-md mx-auto rounded-xl overflow-hidden bg-slate-950 border-2 border-dashed border-teal-500 shadow-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={editingCampaign.mediaUrl}
                            alt="Frame Preview"
                            style={{
                              objectFit:
                                editingCampaign.frameSettings?.objectFit || "cover",
                              objectPosition: `${
                                editingCampaign.frameSettings?.posX ?? 50
                              }% ${editingCampaign.frameSettings?.posY ?? 50}%`,
                              transform:
                                editingCampaign.frameSettings?.scale &&
                                editingCampaign.frameSettings.scale > 1
                                  ? `scale(${editingCampaign.frameSettings.scale})`
                                  : undefined,
                            }}
                            className="w-full h-full transition-all duration-150"
                          />

                          {/* Overlay tag */}
                          <div className="absolute top-2 left-2 z-10 pointer-events-none">
                            <span className="px-2 py-0.5 rounded-md bg-black/75 text-white text-[9px] font-bold tracking-wide backdrop-blur-xs flex items-center gap-1">
                              <span>16:9</span>
                              <span>
                                {isHindi
                                  ? "वेबसाइट कार्ड पर ऐसा दिखेगा"
                                  : "Public Card Framing"}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Fit Mode Toggle */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingCampaign({
                                ...editingCampaign,
                                frameSettings: {
                                  ...(editingCampaign.frameSettings || DEFAULT_FRAME_SETTINGS),
                                  objectFit: "cover",
                                },
                              })
                            }
                            className={`p-2 rounded-lg text-xs font-bold border transition-all text-center ${
                              (editingCampaign.frameSettings?.objectFit || "cover") === "cover"
                                ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {isHindi ? "पूरा भरें (Cover / Fill)" : "Cover (Fill Frame)"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setEditingCampaign({
                                ...editingCampaign,
                                frameSettings: {
                                  ...(editingCampaign.frameSettings || DEFAULT_FRAME_SETTINGS),
                                  objectFit: "contain",
                                },
                              })
                            }
                            className={`p-2 rounded-lg text-xs font-bold border transition-all text-center ${
                              editingCampaign.frameSettings?.objectFit === "contain"
                                ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {isHindi
                              ? "पूरी फोटो दिखाएं (Contain / Fit)"
                              : "Contain (Fit Full Image)"}
                          </button>
                        </div>

                        {/* Zoom / Scale Slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                            <span className="flex items-center gap-1">
                              <ZoomIn className="w-3.5 h-3.5 text-teal-700" />
                              <span>{isHindi ? "ज़ूम स्तर (Scale):" : "Zoom / Scale:"}</span>
                            </span>
                            <span className="font-mono text-teal-800">
                              {(editingCampaign.frameSettings?.scale ?? 1).toFixed(2)}x
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="2"
                            step="0.05"
                            value={editingCampaign.frameSettings?.scale ?? 1}
                            onChange={(e) => {
                              const scale = parseFloat(e.target.value);
                              setEditingCampaign({
                                ...editingCampaign,
                                frameSettings: {
                                  ...(editingCampaign.frameSettings || DEFAULT_FRAME_SETTINGS),
                                  scale,
                                },
                              });
                            }}
                            className="w-full accent-teal-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Horizontal & Vertical Pan Sliders */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                              <span>{isHindi ? "बाएं - दाएं (X Position):" : "Left - Right (X):"}</span>
                              <span className="font-mono text-teal-800">
                                {editingCampaign.frameSettings?.posX ?? 50}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              value={editingCampaign.frameSettings?.posX ?? 50}
                              onChange={(e) => {
                                const posX = parseInt(e.target.value, 10);
                                const posY = editingCampaign.frameSettings?.posY ?? 50;
                                setEditingCampaign({
                                  ...editingCampaign,
                                  frameSettings: {
                                    ...(editingCampaign.frameSettings || DEFAULT_FRAME_SETTINGS),
                                    posX,
                                    objectPosition: `${posX}% ${posY}%`,
                                  },
                                });
                              }}
                              className="w-full accent-teal-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                              <span>{isHindi ? "ऊपर - नीचे (Y Position):" : "Top - Bottom (Y):"}</span>
                              <span className="font-mono text-teal-800">
                                {editingCampaign.frameSettings?.posY ?? 50}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              value={editingCampaign.frameSettings?.posY ?? 50}
                              onChange={(e) => {
                                const posY = parseInt(e.target.value, 10);
                                const posX = editingCampaign.frameSettings?.posX ?? 50;
                                setEditingCampaign({
                                  ...editingCampaign,
                                  frameSettings: {
                                    ...(editingCampaign.frameSettings || DEFAULT_FRAME_SETTINGS),
                                    posY,
                                    objectPosition: `${posX}% ${posY}%`,
                                  },
                                });
                              }}
                              className="w-full accent-teal-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Quick Presets */}
                        <div className="pt-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            {isHindi ? "त्वरित स्थिति प्रीसेट:" : "Quick Focal Presets:"}
                          </label>
                          <div className="grid grid-cols-5 gap-1 text-[10px] font-bold text-center">
                            {[
                              { label: "Top", x: 50, y: 15 },
                              { label: "Center", x: 50, y: 50 },
                              { label: "Bottom", x: 50, y: 85 },
                              { label: "Left", x: 15, y: 50 },
                              { label: "Right", x: 85, y: 50 },
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() =>
                                  setEditingCampaign({
                                    ...editingCampaign,
                                    frameSettings: {
                                      ...(editingCampaign.frameSettings || DEFAULT_FRAME_SETTINGS),
                                      posX: preset.x,
                                      posY: preset.y,
                                      objectPosition: `${preset.x}% ${preset.y}%`,
                                    },
                                  })
                                }
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* VIDEO PREVIEW (NO FRAME ADJUSTMENT OPTION FOR VIDEO) */
                      <div className="space-y-2 bg-slate-900 p-3.5 rounded-xl border border-slate-700 text-white">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                          <Film className="w-4 h-4" />
                          <span>
                            {isHindi ? "वीडियो प्लेयर पूर्वावलोकन" : "Video Player Preview"}
                          </span>
                        </div>
                        <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden bg-black shadow-inner">
                          <video
                            controls
                            src={editingCampaign.mediaUrl}
                            className="w-full h-full object-contain"
                          >
                            Your browser does not support HTML5 video.
                          </video>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {isHindi
                            ? "ℹ️ वीडियो के लिए फ्रेम एडजस्टमेंट लागू नहीं है — यह वीडियो प्लेयर कंट्रोल्स और सबटाइटल्स के साथ सार्वजनिक पेज पर पूरा दिखाया जाएगा।"
                            : "ℹ️ Frame adjustment is not applicable for video — it plays with native player controls and subtitles on the public portal."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Title Hi & En */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    शीर्षक (हिन्दी):
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCampaign.title_hi}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, title_hi: e.target.value })
                    }
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Title (English):
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCampaign.title_en}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, title_en: e.target.value })
                    }
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              {/* Description Hi & En */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    विवरण (हिन्दी):
                  </label>
                  <textarea
                    rows={2}
                    value={editingCampaign.description_hi}
                    onChange={(e) =>
                      setEditingCampaign({
                        ...editingCampaign,
                        description_hi: e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Description (English):
                  </label>
                  <textarea
                    rows={2}
                    value={editingCampaign.description_en}
                    onChange={(e) =>
                      setEditingCampaign({
                        ...editingCampaign,
                        description_en: e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              {/* Video Specific: Accessible Transcript */}
              {!isImageType(editingCampaign.type) && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    सुलभ प्रतिलेख / सबटाइटल्स (Transcript for deaf / screen reader users):
                  </label>
                  <textarea
                    rows={2}
                    value={editingCampaign.transcript_hi || ""}
                    onChange={(e) =>
                      setEditingCampaign({
                        ...editingCampaign,
                        transcript_hi: e.target.value,
                      })
                    }
                    placeholder="Video transcript for screen readers..."
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {isHindi ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isHindi ? "आइटम सहेजें" : "Save Item"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK FRAME ADJUST MODAL (STRICTLY FOR IMAGES FROM LIST) */}
      {quickFrameItem && isImageType(quickFrameItem.type) && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-lg w-full max-h-[92vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                  <Crop className="w-4 h-4 text-teal-700" />
                  <span>{isHindi ? "कार्ड फ्रेम एडजस्ट करें" : "Adjust Card Frame"}</span>
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-sm">
                  {isHindi ? quickFrameItem.title_hi : quickFrameItem.title_en}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuickFrameItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* 16:9 Frame Preview */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border-2 border-dashed border-teal-500 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={quickFrameItem.mediaUrl}
                  alt="Frame Preview"
                  style={{
                    objectFit: quickFrameItem.frameSettings?.objectFit || "cover",
                    objectPosition: `${quickFrameItem.frameSettings?.posX ?? 50}% ${
                      quickFrameItem.frameSettings?.posY ?? 50
                    }%`,
                    transform:
                      quickFrameItem.frameSettings?.scale &&
                      quickFrameItem.frameSettings.scale > 1
                        ? `scale(${quickFrameItem.frameSettings.scale})`
                        : undefined,
                  }}
                  className="w-full h-full transition-all duration-150"
                />
                <div className="absolute top-2 left-2 pointer-events-none">
                  <span className="px-2 py-0.5 rounded bg-black/75 text-white text-[9px] font-bold">
                    16:9 Card Preview
                  </span>
                </div>
              </div>

              {/* Fit Mode Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setQuickFrameItem({
                      ...quickFrameItem,
                      frameSettings: {
                        ...(quickFrameItem.frameSettings || DEFAULT_FRAME_SETTINGS),
                        objectFit: "cover",
                      },
                    })
                  }
                  className={`p-2 rounded-lg text-xs font-bold border transition-all text-center ${
                    (quickFrameItem.frameSettings?.objectFit || "cover") === "cover"
                      ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {isHindi ? "पूरा भरें (Cover)" : "Cover (Fill Frame)"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setQuickFrameItem({
                      ...quickFrameItem,
                      frameSettings: {
                        ...(quickFrameItem.frameSettings || DEFAULT_FRAME_SETTINGS),
                        objectFit: "contain",
                      },
                    })
                  }
                  className={`p-2 rounded-lg text-xs font-bold border transition-all text-center ${
                    quickFrameItem.frameSettings?.objectFit === "contain"
                      ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {isHindi ? "पूरी फोटो दिखाएं (Contain)" : "Contain (Fit Full)"}
                </button>
              </div>

              {/* Zoom Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-teal-700" />
                    <span>{isHindi ? "ज़ूम स्तर:" : "Zoom / Scale:"}</span>
                  </span>
                  <span className="font-mono text-teal-800">
                    {(quickFrameItem.frameSettings?.scale ?? 1).toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.05"
                  value={quickFrameItem.frameSettings?.scale ?? 1}
                  onChange={(e) => {
                    const scale = parseFloat(e.target.value);
                    setQuickFrameItem({
                      ...quickFrameItem,
                      frameSettings: {
                        ...(quickFrameItem.frameSettings || DEFAULT_FRAME_SETTINGS),
                        scale,
                      },
                    });
                  }}
                  className="w-full accent-teal-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Position Sliders */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                    <span>X (बाएं - दाएं):</span>
                    <span className="font-mono text-teal-800">
                      {quickFrameItem.frameSettings?.posX ?? 50}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={quickFrameItem.frameSettings?.posX ?? 50}
                    onChange={(e) => {
                      const posX = parseInt(e.target.value, 10);
                      const posY = quickFrameItem.frameSettings?.posY ?? 50;
                      setQuickFrameItem({
                        ...quickFrameItem,
                        frameSettings: {
                          ...(quickFrameItem.frameSettings || DEFAULT_FRAME_SETTINGS),
                          posX,
                          objectPosition: `${posX}% ${posY}%`,
                        },
                      });
                    }}
                    className="w-full accent-teal-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                    <span>Y (ऊपर - नीचे):</span>
                    <span className="font-mono text-teal-800">
                      {quickFrameItem.frameSettings?.posY ?? 50}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={quickFrameItem.frameSettings?.posY ?? 50}
                    onChange={(e) => {
                      const posY = parseInt(e.target.value, 10);
                      const posX = quickFrameItem.frameSettings?.posX ?? 50;
                      setQuickFrameItem({
                        ...quickFrameItem,
                        frameSettings: {
                          ...(quickFrameItem.frameSettings || DEFAULT_FRAME_SETTINGS),
                          posY,
                          objectPosition: `${posX}% ${posY}%`,
                        },
                      });
                    }}
                    className="w-full accent-teal-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Presets */}
              <div className="pt-1">
                <div className="grid grid-cols-5 gap-1 text-[10px] font-bold text-center">
                  {[
                    { label: "Top", x: 50, y: 15 },
                    { label: "Center", x: 50, y: 50 },
                    { label: "Bottom", x: 50, y: 85 },
                    { label: "Left", x: 15, y: 50 },
                    { label: "Right", x: 85, y: 50 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() =>
                        setQuickFrameItem({
                          ...quickFrameItem,
                          frameSettings: {
                            ...(quickFrameItem.frameSettings || DEFAULT_FRAME_SETTINGS),
                            posX: preset.x,
                            posY: preset.y,
                            objectPosition: `${preset.x}% ${preset.y}%`,
                          },
                        })
                      }
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex justify-between items-center pt-3 border-t">
                <button
                  type="button"
                  onClick={() =>
                    setQuickFrameItem({
                      ...quickFrameItem,
                      frameSettings: { ...DEFAULT_FRAME_SETTINGS },
                    })
                  }
                  className="px-3 py-1.5 rounded-lg border text-slate-600 hover:bg-slate-50 font-medium flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isHindi ? "रीसेट" : "Reset"}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickFrameItem(null)}
                    className="px-3 py-1.5 border rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {isHindi ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveQuickFrame}
                    className="px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isHindi ? "फ्रेम सहेजें" : "Save Frame"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
