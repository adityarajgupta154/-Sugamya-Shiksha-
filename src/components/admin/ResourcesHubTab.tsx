"use client";

import React, { useState, useEffect } from "react";
import {
  ResourceItem,
  ResourceCategory,
  RESOURCE_CATEGORIES,
  INITIAL_RESOURCES,
} from "@/data/resourcesData";
import {
  INCLUSIVE_EDUCATION_TOPICS,
  InclusiveEducationTopic,
} from "@/data/inclusiveEducationData";
import {
  ResearchUpdate,
  INITIAL_RESEARCH_UPDATES,
} from "@/data/researchUpdatesData";
import { db } from "@/lib/firebase/firestore";
import { storage } from "@/lib/firebase/storage";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  FolderDown,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  UploadCloud,
  FileText,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";

interface ResourcesHubTabProps {
  isHindi: boolean;
}

export function ResourcesHubTab({ isHindi }: ResourcesHubTabProps) {
  const [subTab, setSubTab] = useState<"resources" | "inclusive" | "research">("resources");

  // Resources State
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [isEditingResource, setIsEditingResource] = useState(false);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [deleteResourceId, setDeleteResourceId] = useState<string | null>(null);

  // Inclusive Hub State
  const [inclusiveTopics, setInclusiveTopics] = useState<InclusiveEducationTopic[]>(INCLUSIVE_EDUCATION_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<InclusiveEducationTopic | null>(null);
  const [isEditingTopic, setIsEditingTopic] = useState(false);

  // Research Updates State
  const [researchList, setResearchList] = useState<ResearchUpdate[]>(INITIAL_RESEARCH_UPDATES);
  const [selectedResearch, setSelectedResearch] = useState<ResearchUpdate | null>(null);
  const [isEditingResearch, setIsEditingResearch] = useState(false);
  const [isAddingResearch, setIsAddingResearch] = useState(false);
  const [deleteResearchId, setDeleteResearchId] = useState<string | null>(null);

  // Status message
  const [statusMessage, setStatusMessage] = useState<string>("");

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 4500);
  };

  // Load live data from Firestore
  useEffect(() => {
    async function loadData() {
      if (!db) return;
      try {
        // Resources
        const resSnap = await getDocs(collection(db, "resources"));
        if (!resSnap.empty) {
          const list: ResourceItem[] = [];
          resSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as ResourceItem));
          setResources(list);
        }

        // Inclusive Education
        const incSnap = await getDocs(collection(db, "inclusiveEducation"));
        if (!incSnap.empty) {
          const list: InclusiveEducationTopic[] = [];
          incSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as InclusiveEducationTopic));
          setInclusiveTopics(list);
        }

        // Research Reports
        const repSnap = await getDocs(collection(db, "researchReports"));
        if (!repSnap.empty) {
          const list: ResearchUpdate[] = [];
          repSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as ResearchUpdate));
          setResearchList(list);
        }
      } catch (err) {
        console.warn("Using local defaults in Resources & Hub tab:", err);
      }
    }
    loadData();
  }, []);

  // -------------------------------------------------------------
  // RESOURCE HANDLERS
  // -------------------------------------------------------------
  const BLANK_RESOURCE: ResourceItem = {
    id: `res-${Date.now()}`,
    title_hi: "",
    title_en: "",
    category: "guidelines",
    description_hi: "",
    description_en: "",
    fileUrl: "",
    fileType: "PDF",
    fileSize: "1.0 MB",
    downloadCount: 0,
    sourceOrg_hi: "शिक्षा विभाग, बिहार सरकार",
    sourceOrg_en: "Education Department, Govt of Bihar",
    published: true,
    updatedAt: new Date().toISOString().split("T")[0],
  };

  const handleStartAddResource = () => {
    setSelectedResource({ ...BLANK_RESOURCE, id: `res-${Date.now()}` });
    setIsAddingResource(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedResource) return;

    setIsUploading(true);
    try {
      if (storage) {
        const fileRef = ref(storage, `resources/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        setSelectedResource((curr) =>
          curr
            ? {
                ...curr,
                fileUrl: url,
                fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                fileType: file.name.split(".").pop()?.toUpperCase() as any || "PDF",
              }
            : null
        );
        showStatus(isHindi ? "फ़ाइल सफलतापूर्वक अपलोड हुई!" : "File uploaded to Firebase Storage!");
      } else {
        // Fallback simulate
        const fakeUrl = URL.createObjectURL(file);
        setSelectedResource((curr) =>
          curr
            ? {
                ...curr,
                fileUrl: fakeUrl,
                fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                fileType: file.name.split(".").pop()?.toUpperCase() as any || "PDF",
              }
            : null
        );
        showStatus(isHindi ? "फ़ाइल चयन पूर्ण (स्थानीय पूर्वावलोकन)" : "File selected (Local preview)");
      }
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource) return;

    try {
      if (db) {
        await setDoc(doc(db, "resources", selectedResource.id), selectedResource);
      }
      setResources((prev) => {
        const exists = prev.some((r) => r.id === selectedResource.id);
        if (exists) {
          return prev.map((r) => (r.id === selectedResource.id ? selectedResource : r));
        } else {
          return [selectedResource, ...prev];
        }
      });
      setIsAddingResource(false);
      setIsEditingResource(false);
      setSelectedResource(null);
      showStatus(isHindi ? "संसाधन सफलतापूर्वक सहेजा गया!" : "Resource saved successfully!");
    } catch (err: any) {
      alert("Save failed: " + err.message);
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      if (db) {
        await deleteDoc(doc(db, "resources", id));
      }
      setResources((prev) => prev.filter((r) => r.id !== id));
      setDeleteResourceId(null);
      showStatus(isHindi ? "संसाधन हटा दिया गया।" : "Resource deleted.");
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  // -------------------------------------------------------------
  // INCLUSIVE EDUCATION TOPIC HANDLERS
  // -------------------------------------------------------------
  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic) return;

    try {
      if (db) {
        await setDoc(doc(db, "inclusiveEducation", selectedTopic.id), selectedTopic);
      }
      setInclusiveTopics((prev) =>
        prev.map((t) => (t.id === selectedTopic.id ? selectedTopic : t))
      );
      setIsEditingTopic(false);
      setSelectedTopic(null);
      showStatus(isHindi ? "समावेशी शिक्षा स्तंभ सहेजा गया!" : "Inclusive education pillar updated!");
    } catch (err: any) {
      alert("Topic save failed: " + err.message);
    }
  };

  // -------------------------------------------------------------
  // RESEARCH UPDATE HANDLERS
  // -------------------------------------------------------------
  const BLANK_RESEARCH: ResearchUpdate = {
    id: `rep-${Date.now()}`,
    slug: `field-note-${Date.now()}`,
    title_hi: "",
    title_en: "",
    date: new Date().toISOString().split("T")[0],
    category: "Field Note",
    category_hi: "क्षेत्रीय अध्ययन नोट",
    summary_hi: "",
    summary_en: "",
    detailedNotes_hi: "",
    detailedNotes_en: "",
    location: "दानापुर प्रखंड, पटना (Danapur Block, Patna)",
    author_hi: "आदित्य कुमार (एनसीपीईडीपी रिसर्च फेलो)",
    author_en: "Aditya Kumar (NCPEDP Research Fellow)",
    keyFindings_hi: [""],
    keyFindings_en: [""],
    fileUrl: "#",
    published: true,
  };

  const handleStartAddResearch = () => {
    setSelectedResearch({ ...BLANK_RESEARCH });
    setIsAddingResearch(true);
  };

  const handleSaveResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResearch) return;

    try {
      if (db) {
        await setDoc(doc(db, "researchReports", selectedResearch.id), selectedResearch);
      }
      setResearchList((prev) => {
        const exists = prev.some((r) => r.id === selectedResearch.id);
        if (exists) {
          return prev.map((r) => (r.id === selectedResearch.id ? selectedResearch : r));
        } else {
          return [selectedResearch, ...prev];
        }
      });
      setIsAddingResearch(false);
      setIsEditingResearch(false);
      setSelectedResearch(null);
      showStatus(isHindi ? "शोध रिपोर्ट सहेजी गई!" : "Research update saved successfully!");
    } catch (err: any) {
      alert("Research save failed: " + err.message);
    }
  };

  const handleDeleteResearch = async (id: string) => {
    try {
      if (db) {
        await deleteDoc(doc(db, "researchReports", id));
      }
      setResearchList((prev) => prev.filter((r) => r.id !== id));
      setDeleteResearchId(null);
      showStatus(isHindi ? "शोध रिपोर्ट हटाई गई।" : "Research update deleted.");
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  // Filtered resources
  const filteredResources = resources.filter(
    (r) => resourceCategoryFilter === "all" || r.category === resourceCategoryFilter
  );

  return (
    <div className="space-y-6 pt-4">
      {/* Header and Sub-Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-800">
            {isHindi ? "संसाधन व हब प्रबंधन" : "Resources, Inclusive Hub & Research"}
          </h2>
          <p className="text-xs text-slate-500">
            {isHindi
              ? "डाउनलोड केंद्र, समावेशी शिक्षा पृष्ठ एवं शोध रिपोर्ट प्रबंधित करें"
              : "Manage downloadable resources, inclusive education pillars, and fellowship research notes"}
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setSubTab("resources")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              subTab === "resources"
                ? "bg-white text-navy-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isHindi ? "संसाधन (डाउनलोड)" : "Resources"} ({resources.length})
          </button>
          <button
            onClick={() => setSubTab("inclusive")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              subTab === "inclusive"
                ? "bg-white text-navy-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isHindi ? "समावेशी शिक्षा हब" : "Inclusive Hub"} ({inclusiveTopics.length})
          </button>
          <button
            onClick={() => setSubTab("research")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              subTab === "research"
                ? "bg-white text-navy-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isHindi ? "शोध अपडेट" : "Research"} ({researchList.length})
          </button>
        </div>
      </div>

      {/* Global Status Banner */}
      {statusMessage && (
        <div
          role="status"
          className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 1: RESOURCES & DOWNLOAD CENTRE                        */}
      {/* ------------------------------------------------------------- */}
      {subTab === "resources" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setResourceCategoryFilter("all")}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  resourceCategoryFilter === "all"
                    ? "bg-navy-800 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {isHindi ? "सभी श्रेणियां" : "All Categories"}
              </button>
              {RESOURCE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setResourceCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    resourceCategoryFilter === cat.id
                      ? "bg-navy-800 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {isHindi ? cat.label_hi.split(" ")[0] : cat.label_en.split(" ")[0]}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              onClick={handleStartAddResource}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {isHindi ? "नया संसाधन जोड़ें" : "Add Resource"}
            </Button>
          </div>

          {/* Resources Table / List */}
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">{isHindi ? "शीर्षक (Title)" : "Title"}</th>
                  <th className="p-3">{isHindi ? "श्रेणी" : "Category"}</th>
                  <th className="p-3">{isHindi ? "प्रकार / आकार" : "Type / Size"}</th>
                  <th className="p-3">{isHindi ? "डाउनलोड" : "Downloads"}</th>
                  <th className="p-3">{isHindi ? "स्थिति" : "Status"}</th>
                  <th className="p-3 text-right">{isHindi ? "कार्रवाई" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResources.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-semibold text-navy-900">
                        {isHindi ? item.title_hi : item.title_en}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-xs">
                        {item.fileUrl}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="default" className="text-[10px]">
                        {RESOURCE_CATEGORIES.find((c) => c.id === item.category)?.label_en || item.category}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono text-slate-600">
                      {item.fileType} • {item.fileSize}
                    </td>
                    <td className="p-3 font-mono font-semibold text-teal-700">
                      {item.downloadCount || 0}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.published
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {item.published ? (isHindi ? "प्रकाशित" : "Published") : (isHindi ? "ड्राफ्ट" : "Draft")}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedResource(item);
                            setIsEditingResource(true);
                          }}
                          aria-label={isHindi ? "संपादित करें" : "Edit resource"}
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteResourceId(item.id)}
                          aria-label={isHindi ? "हटाएं" : "Delete resource"}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 2: INCLUSIVE EDUCATION HUB TOPICS                     */}
      {/* ------------------------------------------------------------- */}
      {subTab === "inclusive" && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-900">
            {isHindi
              ? "समावेशी शिक्षा हब के 5 मुख्य स्तंभ (RPwD Act 2016 व NEP 2020) के अंतर्गत सूचीबद्ध हैं। आप उनकी सामग्री व कानूनी संदर्भ संपादित कर सकते हैं।"
              : "The 5 pillars of the Inclusive Education Hub are mapped to statutory provisions. You can customize descriptions, taglines, and action steps."}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inclusiveTopics.map((topic, idx) => (
              <div
                key={topic.id}
                className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-600 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      Pillar 0{idx + 1}
                    </span>
                    <Badge variant="default" className="text-[10px]">
                      {topic.slug}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-navy-800">
                    {isHindi ? topic.title_hi : topic.title_en}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {isHindi ? topic.summary_hi : topic.summary_en}
                  </p>
                  <div className="pt-2 text-[11px] text-slate-500 font-mono">
                    <strong>Ref:</strong> {topic.officialReference}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {topic.actionSteps_en?.length || 0} Action steps
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTopic(topic);
                      setIsEditingTopic(true);
                    }}
                    leftIcon={<Edit className="w-3.5 h-3.5" />}
                  >
                    {isHindi ? "संपादित करें" : "Edit Content"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 3: RESEARCH UPDATES                                    */}
      {/* ------------------------------------------------------------- */}
      {subTab === "research" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {isHindi
                ? "दानापुर फेलोशिप के अंतर्गत प्रकाशित फील्ड नोट्स, अंतरिम रिपोर्ट एवं वर्किंग पेपर्स।"
                : "Danapur NCPEDP fellowship field notes, interim reports, and technical working papers."}
            </p>
            <Button
              size="sm"
              onClick={handleStartAddResearch}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {isHindi ? "नया शोध नोट जोड़ें" : "Add Research Update"}
            </Button>
          </div>

          <div className="space-y-3">
            {researchList.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-teal-600 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-[10px]">
                      {isHindi ? item.category_hi : item.category}
                    </Badge>
                    <span className="text-xs font-mono text-slate-500">{item.date}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        item.published ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-navy-900">
                    {isHindi ? item.title_hi : item.title_en}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {isHindi ? item.summary_hi : item.summary_en}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedResearch(item);
                      setIsEditingResearch(true);
                    }}
                    leftIcon={<Edit className="w-3.5 h-3.5" />}
                  >
                    {isHindi ? "संपादित करें" : "Edit"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteResearchId(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT RESOURCE                                    */}
      {/* ------------------------------------------------------------- */}
      {selectedResource && (isAddingResource || isEditingResource) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsAddingResource(false);
            setIsEditingResource(false);
            setSelectedResource(null);
          }}
          title={
            isAddingResource
              ? isHindi
                ? "नया संसाधन जोड़ें"
                : "Add New Resource"
              : isHindi
              ? `संसाधन संपादन: ${selectedResource.title_hi}`
              : `Edit Resource: ${selectedResource.title_en}`
          }
          size="lg"
        >
          <form onSubmit={handleSaveResource} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "शीर्षक (हिन्दी)" : "Title (Hindi)"}
                required
                value={selectedResource.title_hi}
                onChange={(e) =>
                  setSelectedResource({ ...selectedResource, title_hi: e.target.value })
                }
              />
              <Input
                label={isHindi ? "शीर्षक (अंग्रेज़ी)" : "Title (English)"}
                required
                value={selectedResource.title_en}
                onChange={(e) =>
                  setSelectedResource({ ...selectedResource, title_en: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? "संसाधन श्रेणी (Category)" : "Category"}
                </label>
                <select
                  value={selectedResource.category}
                  onChange={(e) =>
                    setSelectedResource({
                      ...selectedResource,
                      category: e.target.value as ResourceCategory,
                    })
                  }
                  className="w-full text-xs rounded-md border border-slate-300 p-2 bg-white"
                >
                  {RESOURCE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isHindi ? c.label_hi : c.label_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? "फ़ाइल प्रकार" : "File Type"}
                </label>
                <select
                  value={selectedResource.fileType}
                  onChange={(e) =>
                    setSelectedResource({
                      ...selectedResource,
                      fileType: e.target.value as any,
                    })
                  }
                  className="w-full text-xs rounded-md border border-slate-300 p-2 bg-white"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="XLSX">XLSX</option>
                  <option value="ZIP">ZIP</option>
                </select>
              </div>

              <Input
                label={isHindi ? "फ़ाइल का आकार (Size)" : "File Size"}
                value={selectedResource.fileSize}
                onChange={(e) =>
                  setSelectedResource({ ...selectedResource, fileSize: e.target.value })
                }
              />
            </div>

            {/* Storage File Upload or Direct URL */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <label className="block text-xs font-bold text-navy-900">
                {isHindi ? "फ़ाइल स्रोत (Firebase Storage या URL)" : "File Source (Firebase Storage or URL)"}
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    label="File URL"
                    hideLabel
                    placeholder="https://..."
                    value={selectedResource.fileUrl}
                    onChange={(e) =>
                      setSelectedResource({ ...selectedResource, fileUrl: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <input
                    type="file"
                    id="resource-file-input"
                    className="sr-only"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="resource-file-input"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isUploading ? "Uploading..." : isHindi ? "फ़ाइल चुनें" : "Upload File"}</span>
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                {isHindi
                  ? "सीधे डिवाइस से फ़ाइल अपलोड करें (Firebase Storage) या आधिकारिक पोर्टल का URL दर्ज करें।"
                  : "Upload directly to Firebase Storage or enter official external URL."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label={isHindi ? "विवरण (हिन्दी)" : "Description (Hindi)"}
                rows={2}
                value={selectedResource.description_hi}
                onChange={(e) =>
                  setSelectedResource({ ...selectedResource, description_hi: e.target.value })
                }
              />
              <Textarea
                label={isHindi ? "विवरण (अंग्रेज़ी)" : "Description (English)"}
                rows={2}
                value={selectedResource.description_en}
                onChange={(e) =>
                  setSelectedResource({ ...selectedResource, description_en: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "स्रोत संस्था (हिन्दी)" : "Source Org (Hindi)"}
                value={selectedResource.sourceOrg_hi}
                onChange={(e) =>
                  setSelectedResource({ ...selectedResource, sourceOrg_hi: e.target.value })
                }
              />
              <Input
                label={isHindi ? "स्रोत संस्था (अंग्रेज़ी)" : "Source Org (English)"}
                value={selectedResource.sourceOrg_en}
                onChange={(e) =>
                  setSelectedResource({ ...selectedResource, sourceOrg_en: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="resource-published"
                checked={selectedResource.published}
                onChange={(e) =>
                  setSelectedResource({ ...selectedResource, published: e.target.checked })
                }
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="resource-published" className="text-xs font-semibold text-slate-800">
                {isHindi ? "सार्वजनिक रूप से प्रदर्शित करें (Published)" : "Publish on website"}
              </label>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsAddingResource(false);
                  setIsEditingResource(false);
                  setSelectedResource(null);
                }}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                {isHindi ? "सहेजें" : "Save Resource"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT INCLUSIVE EDUCATION TOPIC                         */}
      {/* ------------------------------------------------------------- */}
      {selectedTopic && isEditingTopic && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsEditingTopic(false);
            setSelectedTopic(null);
          }}
          title={
            isHindi
              ? `स्तंभ संपादन: ${selectedTopic.title_hi}`
              : `Edit Pillar: ${selectedTopic.title_en}`
          }
          size="lg"
        >
          <form onSubmit={handleSaveTopic} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "शीर्षक (हिन्दी)" : "Title (Hindi)"}
                required
                value={selectedTopic.title_hi}
                onChange={(e) =>
                  setSelectedTopic({ ...selectedTopic, title_hi: e.target.value })
                }
              />
              <Input
                label={isHindi ? "शीर्षक (अंग्रेज़ी)" : "Title (English)"}
                required
                value={selectedTopic.title_en}
                onChange={(e) =>
                  setSelectedTopic({ ...selectedTopic, title_en: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "टैगलाइन (हिन्दी)" : "Tagline (Hindi)"}
                value={selectedTopic.tagline_hi}
                onChange={(e) =>
                  setSelectedTopic({ ...selectedTopic, tagline_hi: e.target.value })
                }
              />
              <Input
                label={isHindi ? "टैगलाइन (अंग्रेज़ी)" : "Tagline (English)"}
                value={selectedTopic.tagline_en}
                onChange={(e) =>
                  setSelectedTopic({ ...selectedTopic, tagline_en: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label={isHindi ? "संक्षिप्त सारांश (हिन्दी)" : "Summary (Hindi)"}
                rows={2}
                value={selectedTopic.summary_hi}
                onChange={(e) =>
                  setSelectedTopic({ ...selectedTopic, summary_hi: e.target.value })
                }
              />
              <Textarea
                label={isHindi ? "संक्षिप्त सारांश (अंग्रेज़ी)" : "Summary (English)"}
                rows={2}
                value={selectedTopic.summary_en}
                onChange={(e) =>
                  setSelectedTopic({ ...selectedTopic, summary_en: e.target.value })
                }
              />
            </div>

            <Textarea
              label={isHindi ? "विस्तृत विवरण (हिन्दी)" : "Detailed Content (Hindi)"}
              rows={3}
              value={selectedTopic.detailedContent_hi}
              onChange={(e) =>
                setSelectedTopic({ ...selectedTopic, detailedContent_hi: e.target.value })
              }
            />

            <Textarea
              label={isHindi ? "विस्तृत विवरण (अंग्रेज़ी)" : "Detailed Content (English)"}
              rows={3}
              value={selectedTopic.detailedContent_en}
              onChange={(e) =>
                setSelectedTopic({ ...selectedTopic, detailedContent_en: e.target.value })
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "आधिकारिक वैधानिक संदर्भ" : "Official Reference Citation"}
                value={selectedTopic.officialReference}
                onChange={(e) =>
                  setSelectedTopic({ ...selectedTopic, officialReference: e.target.value })
                }
              />
              <Input
                label={isHindi ? "आधिकारिक पोर्टल लिंक (URL)" : "Official Reference Portal URL"}
                value={selectedTopic.officialReferenceUrl || ""}
                onChange={(e) =>
                  setSelectedTopic({ ...selectedTopic, officialReferenceUrl: e.target.value })
                }
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsEditingTopic(false);
                  setSelectedTopic(null);
                }}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                {isHindi ? "सहेजें" : "Save Pillar"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT RESEARCH UPDATE                             */}
      {/* ------------------------------------------------------------- */}
      {selectedResearch && (isAddingResearch || isEditingResearch) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsAddingResearch(false);
            setIsEditingResearch(false);
            setSelectedResearch(null);
          }}
          title={
            isAddingResearch
              ? isHindi
                ? "नया शोध नोट जोड़ें"
                : "Add Research Update"
              : isHindi
              ? `शोध संपादन: ${selectedResearch.title_hi}`
              : `Edit Research: ${selectedResearch.title_en}`
          }
          size="lg"
        >
          <form onSubmit={handleSaveResearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "शीर्षक (हिन्दी)" : "Title (Hindi)"}
                required
                value={selectedResearch.title_hi}
                onChange={(e) =>
                  setSelectedResearch({ ...selectedResearch, title_hi: e.target.value })
                }
              />
              <Input
                label={isHindi ? "शीर्षक (अंग्रेज़ी)" : "Title (English)"}
                required
                value={selectedResearch.title_en}
                onChange={(e) =>
                  setSelectedResearch({ ...selectedResearch, title_en: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label={isHindi ? "दिनांक (Date)" : "Date"}
                type="date"
                value={selectedResearch.date}
                onChange={(e) =>
                  setSelectedResearch({ ...selectedResearch, date: e.target.value })
                }
              />
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? "श्रेणी" : "Category"}
                </label>
                <select
                  value={selectedResearch.category}
                  onChange={(e) => {
                    const cat = e.target.value as any;
                    const catHi =
                      cat === "Field Note"
                        ? "क्षेत्रीय अध्ययन नोट"
                        : cat === "Interim Report"
                        ? "अंतरिम रिपोर्ट"
                        : cat === "Working Paper"
                        ? "कार्यकारी शोध पत्र"
                        : "केस स्टडी";
                    setSelectedResearch({
                      ...selectedResearch,
                      category: cat,
                      category_hi: catHi,
                    });
                  }}
                  className="w-full text-xs rounded-md border border-slate-300 p-2 bg-white"
                >
                  <option value="Field Note">Field Note (क्षेत्रीय अध्ययन नोट)</option>
                  <option value="Interim Report">Interim Report (अंतरिम रिपोर्ट)</option>
                  <option value="Working Paper">Working Paper (कार्यकारी शोध पत्र)</option>
                  <option value="Case Study">Case Study (केस स्टडी)</option>
                </select>
              </div>

              <Input
                label={isHindi ? "स्थान" : "Location"}
                value={selectedResearch.location}
                onChange={(e) =>
                  setSelectedResearch({ ...selectedResearch, location: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label={isHindi ? "सारांश (हिन्दी)" : "Summary (Hindi)"}
                rows={2}
                value={selectedResearch.summary_hi}
                onChange={(e) =>
                  setSelectedResearch({ ...selectedResearch, summary_hi: e.target.value })
                }
              />
              <Textarea
                label={isHindi ? "सारांश (अंग्रेज़ी)" : "Summary (English)"}
                rows={2}
                value={selectedResearch.summary_en}
                onChange={(e) =>
                  setSelectedResearch({ ...selectedResearch, summary_en: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isHindi ? "लेखक (हिन्दी)" : "Author (Hindi)"}
                value={selectedResearch.author_hi}
                onChange={(e) =>
                  setSelectedResearch({ ...selectedResearch, author_hi: e.target.value })
                }
              />
              <Input
                label={isHindi ? "लेखक (अंग्रेज़ी)" : "Author (English)"}
                value={selectedResearch.author_en}
                onChange={(e) =>
                  setSelectedResearch({ ...selectedResearch, author_en: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="research-published"
                checked={selectedResearch.published}
                onChange={(e) =>
                  setSelectedResearch({ ...selectedResearch, published: e.target.checked })
                }
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="research-published" className="text-xs font-semibold text-slate-800">
                {isHindi ? "वेबसाइट पर प्रकाशित करें" : "Publish on website"}
              </label>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsAddingResearch(false);
                  setIsEditingResearch(false);
                  setSelectedResearch(null);
                }}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                {isHindi ? "सहेजें" : "Save Report"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal for Resources */}
      {deleteResourceId && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteResourceId(null)}
          title={isHindi ? "संसाधन हटाएं?" : "Delete Resource?"}
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {isHindi
                ? "क्या आप निश्चित रूप से इस संसाधन को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।"
                : "Are you sure you want to delete this resource? This action cannot be undone."}
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => setDeleteResourceId(null)}>
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteResource(deleteResourceId)}
              >
                {isHindi ? "हटाएं" : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal for Research */}
      {deleteResearchId && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteResearchId(null)}
          title={isHindi ? "शोध रिपोर्ट हटाएं?" : "Delete Research Update?"}
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {isHindi
                ? "क्या आप निश्चित रूप से इस शोध रिपोर्ट को हटाना चाहते हैं?"
                : "Are you sure you want to delete this research report?"}
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => setDeleteResearchId(null)}>
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteResearch(deleteResearchId)}
              >
                {isHindi ? "हटाएं" : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
