"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Dish } from "@/types";
import QRCode from "qrcode";
import { cn } from "@/lib/utils";

// Premium Stats for the Bento Grid
const STATS = [
  { label: "Total Dishes", value: "42", trend: "+4 this month", color: "text-primary" },
  { label: "Live in AR", value: "38", trend: "90% Coverage", color: "text-on-surface" },
  { label: "3D Asset Health", value: "Optimal", trend: "Low Latency", color: "text-on-surface" },
  { label: "Avg. Interaction", value: "2.4m", trend: "Per User", color: "text-on-surface" },
];

// AR Cloud Storage Data
const STORAGE = { used: 2.1, total: 5, unit: "GB", files: 38 };

export default function AdminDashboardScreen() {
  // Data state
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const restaurantId = "test-restaurant"; // Hardcoded for demo slug
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [editingDish, setEditingDish] = useState<Partial<Dish> | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const closeModal = () => {
    if (loading) return;
    setIsModalClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsModalClosing(false);
    }, 350);
  };

  useEffect(() => {
    fetchDishes();
    generateQR();
  }, []);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("dishes")
        .select("*, restaurants!inner(slug)")
        .eq("restaurants.slug", restaurantId);

      if (error) throw error;
      setDishes(data as Dish[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateQR = async () => {
    try {
      const url = `${window.location.origin}/r/${restaurantId}`;
      const dataUrl = await QRCode.toDataURL(url, { 
        width: 400, 
        margin: 2, 
        color: { dark: '#131313', light: '#FFBF00' } 
      });
      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingDish({
      name: "", category: "", price: 0, description: "", status: "draft", sku: `SKU-${Math.floor(Math.random()*10000)}`
    });
    setThumbFile(null);
    setModelFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dish: Dish) => {
    setEditingDish(dish);
    setThumbFile(null);
    setModelFile(null);
    setIsModalOpen(true);
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    setUploadProgress(10);
    const fileName = `${Date.now()}-${file.name}`;
    const fullPath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("aroma-assets")
      .upload(fullPath, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) throw error;
    setUploadProgress(100);

    const { data: { publicUrl } } = supabase.storage
      .from("aroma-assets")
      .getPublicUrl(fullPath);

    return publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;
    try {
      setLoading(true);
      let thumbUrl = editingDish.thumbnail_url || "";
      let modelUrl = editingDish.model_url || "";

      if (thumbFile) thumbUrl = await uploadFile(thumbFile, "thumbnails");
      if (modelFile) modelUrl = await uploadFile(modelFile, "models");

      const { data: restData, error: restErr } = await supabase
        .from("restaurants")
        .select("id")
        .eq("slug", restaurantId)
        .single();
      
      if (restErr) throw restErr;

      const dishData = { 
        name: editingDish.name,
        category: editingDish.category,
        price: editingDish.price,
        description: editingDish.description,
        status: editingDish.status,
        sku: editingDish.sku,
        thumbnail_url: thumbUrl, 
        model_url: modelUrl,
        restaurant_id: restData.id
      };

      if (editingDish.id) {
        const { error } = await supabase.from("dishes").update(dishData).eq("id", editingDish.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("dishes").insert([dishData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchDishes();
    } catch (err: any) {
      alert(err.message || "Error saving dish details.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-xl px-10 h-24 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-on-surface tracking-editorial">Menu Management</h1>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-label mt-1 font-bold">Inventory & Digital Assets</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-5 py-2.5 rounded-md transition-all text-sm font-bold shadow-sm">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filter
          </button>
          <button onClick={openAddModal} className="flex items-center gap-2 bg-primary-container hover:bg-primary text-on-primary-container px-6 py-3 rounded-md transition-all shadow-lg shadow-primary-container/10 active:scale-95 text-sm font-extrabold">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            Add New Dish
          </button>
        </div>
      </header>

        <div className="p-10 space-y-10 pb-32">
          {/* 2-column equal grid: AR Storage | QR Code */}
          <div className="grid grid-cols-2 gap-6">

            {/* AR Cloud Storage */}
            <div className="bg-surface-container-low rounded-xl p-6 flex flex-col justify-between border border-outline-variant/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-label block mb-1">AR Cloud Storage</span>
                  <p className="text-2xl font-heading font-bold text-on-surface">{STORAGE.used} <span className="text-base font-normal text-on-surface-variant">/ {STORAGE.total} {STORAGE.unit}</span></p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-label block mb-1">3D Assets Stored</span>
                  <p className="text-2xl font-heading font-bold text-primary-container">{STORAGE.files}</p>
                </div>
              </div>
              <div className="mt-auto space-y-2">
                <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container rounded-full transition-all duration-1000" style={{ width: `${(STORAGE.used / STORAGE.total) * 100}%` }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-on-surface-variant">{((STORAGE.used / STORAGE.total) * 100).toFixed(0)}% used</span>
                  <span className="text-[10px] text-on-surface-variant">{(STORAGE.total - STORAGE.used).toFixed(1)} {STORAGE.unit} remaining</span>
                </div>
              </div>
            </div>

            {/* Live QR Code */}
            <div className="bg-surface-container-low rounded-xl p-6 flex flex-col items-center justify-center text-center border border-primary-container/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4 z-10">Live Table Access</p>
              {qrCodeDataUrl ? (
                <div className="bg-white p-3 rounded-xl mb-4 z-10 shadow-xl group-hover:scale-105 transition-transform duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrCodeDataUrl} alt="Store QR code" className="w-[140px] h-[140px] rounded-lg object-contain" />
                </div>
              ) : (
                <div className="w-36 h-36 bg-surface-container-high rounded-xl mb-4 animate-pulse flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary/20 text-4xl">qr_code_2</span>
                </div>
              )}
              <div className="z-10">
                <p className="text-xs font-bold text-on-surface mb-1">r/{restaurantId}</p>
                <button onClick={() => window.open(`${window.location.origin}/r/${restaurantId}`, '_blank')} className="text-[10px] font-extrabold text-primary-container uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity mx-auto">
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  Verify Live Link
                </button>
              </div>
            </div>
          </div>


          {/* Main Table Container */}
          <div className="bg-surface-container-low rounded-lg overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high/50">
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-label">Dish Detail</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-label">Category</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-label">Price</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-label">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-label">3D Model (.glb)</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-label text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="">
                  {loading && dishes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-on-surface-variant">
                         <span className="material-symbols-outlined animate-spin-arc text-3xl">refresh</span>
                      </td>
                    </tr>
                  ) : dishes.map((dish) => (
                    <tr key={dish.id} className="hover:bg-surface-container-high/30 transition-all duration-200 group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-md bg-surface-container overflow-hidden relative shrink-0">
                            {dish.thumbnail_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={dish.thumbnail_url} alt={dish.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-on-surface-variant/30 text-xl flex items-center justify-center h-full w-full">image</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-on-surface text-sm">{dish.name}</p>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-label">SKU: {dish.sku || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant">{dish.category}</td>
                      <td className="px-8 py-5 text-sm font-medium text-primary">${dish.price.toFixed(2)}</td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-label",
                          dish.status === "live" ? "bg-primary-container/10 text-primary" : "bg-surface-container-highest text-on-surface-variant"
                        )}>
                          {dish.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {dish.model_url ? (
                          <div className="flex items-center gap-2 group">
                             <span className="material-symbols-outlined text-primary text-lg">view_in_ar</span>
                             <span className="text-xs font-mono text-on-surface-variant group-hover:text-primary transition-colors cursor-pointer truncate max-w-[120px]">Asset Ready</span>
                          </div>
                        ) : (
                          <button onClick={() => openEditModal(dish)} className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-label hover:opacity-80 transition-opacity">
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            Upload 3D
                          </button>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => openEditModal(dish)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant hover:text-primary">
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dishes.length === 0 && !loading && (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                   <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">restaurant</span>
                   <p className="text-on-surface-variant/60 font-medium">No dishes found. Add your first masterpiece.</p>
                </div>
              )}
            </div>
      {/* Pagination Shell */}
      <div className="px-6 py-4 flex items-center justify-between bg-surface-container-high/20 border-t border-outline-variant/10">
        <p className="text-[10px] text-on-surface-variant uppercase tracking-label font-medium">Showing {dishes.length} of {dishes.length} dishes</p>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary-container text-on-primary-container font-bold text-xs">1</button>
        </div>
      </div>
    </div>
  </div>

      {/* Edit/Add Modal - High Fidelity */}
      {isModalOpen && editingDish && (
        <div className={`fixed inset-0 z-100 flex items-center justify-center p-6 ${isModalClosing ? "animate-backdrop-out" : "animate-backdrop"}`}>
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-xl" onClick={closeModal} />
          <div className={`relative bg-surface-container-low w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] border border-outline-variant/20 shadow-2xl flex flex-col custom-scrollbar ${isModalClosing ? "animate-modal-down" : "animate-spring-pop"}`}>
            <div className="sticky top-0 bg-surface-container-low/95 backdrop-blur-md px-10 py-8 border-b border-outline-variant/10 flex items-center justify-between z-10">
              <div>
                <span className="text-[10px] font-extrabold text-primary-container uppercase tracking-widest mb-1 block">{editingDish.id ? "Inventory Modification" : "New Creation"}</span>
                <h3 className="text-2xl font-heading font-extrabold text-on-surface tracking-tight">
                  {editingDish.id ? "Edit Dish Details" : "Create New Dish"}
                </h3>
              </div>
              <button disabled={loading} onClick={closeModal} className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all active:scale-90">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest ml-1">Dish Name</label>
                  <input required disabled={loading} type="text" value={editingDish.name || ""} onChange={(e) => setEditingDish(prev => ({...prev!, name: e.target.value}))} className="w-full px-5 py-4 bg-surface-container-high rounded-2xl text-on-surface border border-outline-variant/10 focus:border-primary-container/50 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest ml-1">Category</label>
                  <input required disabled={loading} type="text" value={editingDish.category || ""} onChange={(e) => setEditingDish(prev => ({...prev!, category: e.target.value}))} className="w-full px-5 py-4 bg-surface-container-high rounded-2xl text-on-surface border border-outline-variant/10 focus:border-primary-container/50 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest ml-1">Price ($)</label>
                  <input required disabled={loading} type="number" step="0.01" value={editingDish.price || ""} onChange={(e) => setEditingDish(prev => ({...prev!, price: parseFloat(e.target.value) || 0}))} className="w-full px-5 py-4 bg-surface-container-high rounded-2xl text-on-surface border border-outline-variant/10 focus:border-primary-container/50 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest ml-1">Availability Status</label>
                  <select disabled={loading} value={editingDish.status || "draft"} onChange={(e) => setEditingDish(prev => ({...prev!, status: e.target.value as "live" | "draft"}))} className="w-full px-5 py-4 bg-surface-container-high rounded-2xl text-on-surface border border-outline-variant/10 focus:border-primary-container/50 outline-none transition-all appearance-none cursor-pointer">
                    <option value="draft">📁 Draft (Hidden)</option>
                    <option value="live">🌐 Live in AR</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest ml-1">Menu Description</label>
                <textarea required disabled={loading} rows={4} value={editingDish.description || ""} onChange={(e) => setEditingDish(prev => ({...prev!, description: e.target.value}))} className="w-full px-5 py-4 bg-surface-container-high rounded-2xl text-on-surface border border-outline-variant/10 focus:border-primary-container/50 outline-none transition-all resize-none" />
              </div>

              <div className="pt-6 border-t border-outline-variant/10 space-y-3">
                <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest ml-1 block">Dish Photo</label>
                <div className="relative group overflow-hidden rounded-2xl border border-dashed border-outline-variant/30 hover:border-primary-container/50 transition-all p-6 flex items-center gap-4 cursor-pointer bg-surface-container-high/30 hover:bg-surface-container-high/60">
                  <input disabled={loading} type="file" accept="image/*" onChange={(e) => setThumbFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant/40 group-hover:text-primary-container transition-all shrink-0">add_photo_alternate</span>
                  <div>
                    <p className="text-sm font-bold text-on-surface group-hover:text-on-surface transition-all">
                      {thumbFile ? thumbFile.name : "Click to upload dish photo"}
                    </p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">JPG, PNG or WEBP · Used as thumbnail in the menu</p>
                  </div>
                </div>
              </div>

              {/* 3D Model Upload */}
              <div className="pt-6 border-t border-outline-variant/10 space-y-3">
                <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest ml-1 block">3D Model File</label>
                <div className="relative group overflow-hidden rounded-2xl border border-dashed border-outline-variant/30 hover:border-primary-container/50 transition-all p-6 flex items-center gap-4 cursor-pointer bg-surface-container-high/30 hover:bg-surface-container-high/60">
                  <input disabled={loading} type="file" accept=".glb,.gltf" onChange={(e) => setModelFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant/40 group-hover:text-primary-container transition-all shrink-0">view_in_ar</span>
                  <div>
                    <p className="text-sm font-bold text-on-surface group-hover:text-on-surface transition-all">
                      {modelFile ? modelFile.name : editingDish?.model_url ? "✅ Model assigned — upload new to replace" : "Click to upload 3D model"}
                    </p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">.GLB or .GLTF · Under 20MB for best AR performance</p>
                  </div>
                </div>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-primary-container">Uploading Digital Assets...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary-container h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" disabled={loading} onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-xl font-extrabold text-xs uppercase tracking-widest text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-10 py-4 rounded-xl font-extrabold text-xs uppercase tracking-widest text-on-primary-container bg-primary-container hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-container/20">
                  {loading ? <span className="material-symbols-outlined animate-spin-arc text-lg">refresh</span> : <span className="material-symbols-outlined text-lg">save</span>}
                  Synchronize Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
