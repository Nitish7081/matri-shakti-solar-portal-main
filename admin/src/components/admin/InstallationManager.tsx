import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Camera,
  Search,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Building2,
  Star,
  Upload,
  Image as ImageIcon,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  Zap,
} from "lucide-react";

export interface IInstallationItem {
  id: string;
  _id?: string;
  title: string;
  customerName?: string;
  projectId?: string;
  location: string;
  city: string;
  companyName: string;
  capacityKW: number;
  installationDate: string;
  description?: string;
  images: string[];
  featured: boolean;
  active: boolean;
  technicianName?: string;
  installationStatus: "COMPLETED" | "IN_PROGRESS" | "COMMISSIONED";
  createdAt: string;
}

interface InstallationManagerProps {
  onRefreshStats?: () => void;
}

// Client-side image compression for instant uploads & lightning-fast page loading
function compressImage(file: File, maxWidth = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function InstallationManager({ onRefreshStats }: InstallationManagerProps) {
  const [installations, setInstallations] = useState<IInstallationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instToEdit, setInstToEdit] = useState<IInstallationItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formImagePreview, setFormImagePreview] = useState<string>("");

  // Dedicated Photo Update Modal State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [instForPhotoUpdate, setInstForPhotoUpdate] = useState<IInstallationItem | null>(null);
  const [newPhotoData, setNewPhotoData] = useState<string>("");
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: "",
    customerName: "",
    projectId: "",
    location: "",
    city: "Maharajganj",
    companyName: "Tata Power Solar",
    capacityKW: 5,
    installationDate: new Date().toISOString().split("T")[0],
    description: "",
    imagesText: "/gallery-1.jpg",
    featured: false,
    active: true,
    technicianName: "",
    installationStatus: "COMPLETED" as "COMPLETED" | "IN_PROGRESS" | "COMMISSIONED",
  });

  // Delete State
  const [instToDelete, setInstToDelete] = useState<IInstallationItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const fetchInstallations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/installations/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load showcase installations");
      setInstallations(data.installations || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch installations");
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchInstallations();
  }, [fetchInstallations]);

  const openAddModal = () => {
    setInstToEdit(null);
    setFormImagePreview("/gallery-1.jpg");
    setForm({
      title: "",
      customerName: "",
      projectId: "",
      location: "",
      city: "Maharajganj",
      companyName: "Tata Power Solar",
      capacityKW: 5,
      installationDate: new Date().toISOString().split("T")[0],
      description: "",
      imagesText: "/gallery-1.jpg",
      featured: false,
      active: true,
      technicianName: "",
      installationStatus: "COMPLETED",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: IInstallationItem) => {
    setInstToEdit(item);
    const firstImg = item.images && item.images.length > 0 ? item.images[0] : "/gallery-1.jpg";
    setFormImagePreview(firstImg);
    setForm({
      title: item.title,
      customerName: item.customerName || "",
      projectId: item.projectId || "",
      location: item.location,
      city: item.city,
      companyName: item.companyName,
      capacityKW: item.capacityKW,
      installationDate: item.installationDate,
      description: item.description || "",
      imagesText: (item.images || []).join("\n"),
      featured: item.featured,
      active: item.active,
      technicianName: item.technicianName || "",
      installationStatus: item.installationStatus,
    });
    setIsModalOpen(true);
  };

  // Open Quick Photo Update Modal
  const openPhotoUpdateModal = (item: IInstallationItem) => {
    setInstForPhotoUpdate(item);
    const currentImg = item.images && item.images.length > 0 ? item.images[0] : "/gallery-1.jpg";
    setNewPhotoData(currentImg);
    setIsPhotoModalOpen(true);
  };

  // Handle Photo selection from Computer/Mobile
  const handleSelectPhotoForUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP)");
      return;
    }

    try {
      setIsPhotoUploading(true);
      toast.info("Optimizing photo for fast website loading...");
      const compressedBase64 = await compressImage(file, 1600, 0.82);
      setNewPhotoData(compressedBase64);
      toast.success("Photo selected! Click 'Save & Update Gallery' to apply.");
    } catch (err) {
      toast.error("Failed to process image file");
    } finally {
      setIsPhotoUploading(false);
    }
  };

  // Handle Photo selection in Add/Edit modal
  const handleSelectModalPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      toast.info("Optimizing photo...");
      const compressedBase64 = await compressImage(file, 1600, 0.82);
      setFormImagePreview(compressedBase64);
      setForm((prev) => ({
        ...prev,
        imagesText: compressedBase64,
      }));
      toast.success("Photo uploaded successfully!");
    } catch {
      toast.error("Failed to load photo");
    }
  };

  // Save updated photo directly to installation
  const handleSavePhotoUpdate = async () => {
    if (!instForPhotoUpdate) return;
    if (!newPhotoData.trim()) {
      return toast.error("Please select or enter a photo");
    }

    setIsPhotoUploading(true);
    try {
      const itemId = instForPhotoUpdate._id || instForPhotoUpdate.id;
      const res = await fetch(`${baseUrl}/api/installations/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify({
          images: [newPhotoData],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update photo");

      toast.success("Photo updated successfully! Website gallery updated live.");
      setIsPhotoModalOpen(false);
      setInstForPhotoUpdate(null);
      fetchInstallations();
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to update photo");
    } finally {
      setIsPhotoUploading(false);
    }
  };

  const handleSaveInstallation = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.location.trim()) return toast.error("Location is required");

    const images = form.imagesText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (images.length === 0) {
      return toast.error("Please upload or provide at least one photo");
    }

    setIsSaving(true);
    try {
      const payload = {
        title: form.title,
        customerName: form.customerName,
        projectId: form.projectId,
        location: form.location,
        city: form.city,
        companyName: form.companyName,
        capacityKW: Number(form.capacityKW) || 5,
        installationDate: form.installationDate,
        description: form.description,
        images,
        featured: form.featured,
        active: form.active,
        technicianName: form.technicianName,
        installationStatus: form.installationStatus,
      };

      const isEdit = !!instToEdit;
      const itemId = instToEdit?._id || instToEdit?.id;
      const url = isEdit ? `${baseUrl}/api/installations/${itemId}` : `${baseUrl}/api/installations`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save installation showcase");

      toast.success(isEdit ? "Installation updated successfully" : "Installation added to gallery showcase!");
      setIsModalOpen(false);
      fetchInstallations();
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteInstallation = async () => {
    if (!instToDelete) return;
    setIsSaving(true);
    try {
      const itemId = instToDelete._id || instToDelete.id;
      const res = await fetch(`${baseUrl}/api/installations/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete installation");

      toast.success("Installation removed from gallery");
      setIsDeleteModalOpen(false);
      setInstToDelete(null);
      fetchInstallations();
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredInstallations = installations.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.city.toLowerCase().includes(search.toLowerCase()) ||
      item.companyName.toLowerCase().includes(search.toLowerCase());

    const matchesCity = cityFilter === "ALL" || item.city.toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <Card className="border-border/60 bg-card shadow-sm">
        <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search showcase title, city, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="h-9 px-2 text-xs rounded-md border border-input bg-background text-foreground"
            >
              <option value="ALL">All Cities</option>
              <option value="Maharajganj">Maharajganj</option>
              <option value="Gorakhpur">Gorakhpur</option>
              <option value="Kushinagar">Kushinagar</option>
              <option value="Deoria">Deoria</option>
              <option value="Basti">Basti</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchInstallations()}
              disabled={isLoading}
              className="h-9 text-xs gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            {/* View Mode Toggle: Table View vs Card View */}
            <div className="flex items-center border border-input rounded-md overflow-hidden bg-background">
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                title="Table view with Photo Update column"
              >
                <TableIcon className="h-3.5 w-3.5" />
                Table View
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Cards
              </button>
            </div>
          </div>

          <Button
            size="sm"
            onClick={openAddModal}
            className="h-9 text-xs gap-1.5 bg-primary text-white hover:bg-primary/90 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Installation Showcase
          </Button>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
          Loading installations showcase...
        </div>
      ) : filteredInstallations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-12 text-center bg-card">
          <Camera className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-sm font-bold text-foreground">No Showcase Installations Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            All old dummy records have been cleared. Upload your real completed solar rooftop installations with photos here to display on the public website Gallery!
          </p>
          <Button size="sm" onClick={openAddModal} className="mt-4 text-xs gap-1.5 bg-primary text-white hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Upload First Installation Photo
          </Button>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW WITH DEDICATED PHOTO UPDATE COLUMN */
        <Card className="border-border/60 bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3 w-28">Photo</th>
                  <th className="p-3 min-w-[220px]">Project & Showcase Title</th>
                  <th className="p-3">Location & City</th>
                  <th className="p-3">Company & Capacity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 min-w-[170px] bg-primary/5 text-primary font-bold">
                    📸 Photo Update Column
                  </th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredInstallations.map((item, idx) => {
                  const firstImage = item.images && item.images.length > 0 ? item.images[0] : "/gallery-1.jpg";
                  return (
                    <tr key={item._id || item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-center text-muted-foreground font-mono">{idx + 1}</td>

                      {/* Photo Thumbnail */}
                      <td className="p-3">
                        <div
                          className="relative h-14 w-20 rounded-lg overflow-hidden border border-border/80 bg-muted cursor-pointer group shadow-sm"
                          onClick={() => openPhotoUpdateModal(item)}
                          title="Click to update photo"
                        >
                          <img
                            src={firstImage}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/gallery-1.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium">
                            <Camera className="h-3.5 w-3.5 mr-1" /> Change
                          </div>
                        </div>
                      </td>

                      {/* Showcase Title */}
                      <td className="p-3">
                        <div className="font-semibold text-foreground text-sm leading-tight flex items-center gap-1.5">
                          {item.title}
                          {item.featured && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-current" /> Top
                            </span>
                          )}
                        </div>
                        {item.customerName && (
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            Client: <span className="text-foreground font-medium">{item.customerName}</span>
                          </div>
                        )}
                        {item.description && (
                          <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {item.description}
                          </div>
                        )}
                      </td>

                      {/* Location & City */}
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-foreground font-medium">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{item.location}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground pl-4.5">{item.city}</div>
                      </td>

                      {/* Company & Capacity */}
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-foreground font-medium">
                          <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{item.companyName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-primary font-bold mt-0.5">
                          <Zap className="h-3 w-3 fill-current" />
                          {item.capacityKW} KW Capacity
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.installationStatus === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.installationStatus === "COMMISSIONED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.installationStatus}
                        </span>
                        <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="h-2.5 w-2.5" />
                          {item.installationDate}
                        </div>
                      </td>

                      {/* DEDICATED PHOTO UPDATE COLUMN */}
                      <td className="p-3 bg-primary/5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openPhotoUpdateModal(item)}
                          className="h-8 text-xs font-semibold bg-white border-primary/40 text-primary hover:bg-primary hover:text-white shadow-xs transition-all gap-1.5 w-full justify-center"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          <span>Update Photo</span>
                        </Button>
                        <div className="text-[10px] text-muted-foreground text-center mt-1">
                          {item.images?.length || 0} photo{(item.images?.length || 0) > 1 ? "s" : ""} uploaded
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => openEditModal(item)}
                            title="Edit details"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                            onClick={() => {
                              setInstToDelete(item);
                              setIsDeleteModalOpen(true);
                            }}
                            title="Delete installation"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInstallations.map((item) => {
            const firstImage = item.images && item.images.length > 0 ? item.images[0] : "/gallery-1.jpg";
            return (
              <Card
                key={item._id || item.id}
                className="border-border/60 bg-card shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md"
              >
                <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                  <img
                    src={firstImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/gallery-1.jpg";
                    }}
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="font-bold text-[10px] bg-secondary/90 text-white px-2 py-0.5 rounded shadow">
                      {item.capacityKW} KW
                    </span>
                    {item.featured && (
                      <span className="font-bold text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" /> Featured
                      </span>
                    )}
                  </div>
                  {!item.active && (
                    <div className="absolute top-2 right-2 font-bold text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded shadow">
                      Hidden
                    </div>
                  )}

                  {/* Quick Photo Update Overlay Button on Card */}
                  <button
                    onClick={() => openPhotoUpdateModal(item)}
                    className="absolute bottom-2 right-2 bg-black/75 hover:bg-primary text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1 shadow-md transition-colors"
                  >
                    <Camera className="h-3 w-3" /> Update Photo
                  </button>
                </div>

                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
                  <div>
                    <h3 className="font-bold text-foreground text-sm leading-tight">{item.title}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-[11px] mt-1">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      <span>{item.location}, {item.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-[11px] mt-1">
                      <Building2 className="h-3 w-3 text-primary shrink-0" />
                      <span>{item.companyName}</span>
                      <span className="opacity-40">•</span>
                      <Calendar className="h-3 w-3 text-primary shrink-0" />
                      <span>{item.installationDate}</span>
                    </div>
                    {item.description && (
                      <p className="text-muted-foreground mt-2 line-clamp-2 text-[11px]">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openPhotoUpdateModal(item)}
                      className="h-7 text-[11px] px-2 text-primary border-primary/30 hover:bg-primary hover:text-white"
                    >
                      <Camera className="h-3 w-3 mr-1" /> Change Photo
                    </Button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => openEditModal(item)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                        onClick={() => {
                          setInstToDelete(item);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* DEDICATED QUICK PHOTO UPDATE MODAL */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Camera className="h-5 w-5 text-primary" />
              Update Installation Photo
            </DialogTitle>
            <DialogDescription className="text-xs">
              Upload a new photo for <strong className="text-foreground">{instForPhotoUpdate?.title}</strong>. It will immediately appear on the public website Gallery!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Live Preview of Photo */}
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border-2 border-dashed border-primary/40 bg-muted/50 flex flex-col items-center justify-center">
              {newPhotoData ? (
                <img
                  src={newPhotoData}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/gallery-1.jpg";
                  }}
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground text-xs">No image selected</p>
                </div>
              )}
            </div>

            {/* Direct Device Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleSelectPhotoForUpdate}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPhotoUploading}
                className="w-full h-10 border-primary text-primary hover:bg-primary hover:text-white font-semibold gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose Photo from Computer / Phone
              </Button>
              <p className="text-[11px] text-muted-foreground text-center mt-1">
                Supports JPG, PNG, WEBP. Automatically optimized for ultra-fast loading.
              </p>
            </div>

            {/* URL Option */}
            <div className="pt-2 border-t border-border/50">
              <label className="font-medium text-foreground block mb-1">
                Or Enter Photo URL / Path:
              </label>
              <Input
                placeholder="/gallery-1.jpg or https://..."
                value={newPhotoData.startsWith("data:") ? "(Photo file uploaded from device)" : newPhotoData}
                onChange={(e) => setNewPhotoData(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPhotoModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSavePhotoUpdate}
              disabled={isPhotoUploading}
              className="text-xs bg-primary text-white hover:bg-primary/90 gap-1.5"
            >
              {isPhotoUploading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Save & Update Gallery
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Showcase Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              {instToEdit ? "Edit Installation Showcase" : "Add Project to Gallery"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Project photos and technical specifications will be visible on the public website gallery.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">
                Showcase Title <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. 5 KW Residential Rooftop Installation"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-medium text-foreground block mb-1">
                  Location / Area <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Paniyara"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <label className="font-medium text-foreground block mb-1">City / District</label>
                <Input
                  placeholder="e.g. Maharajganj"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-medium text-foreground block mb-1">Solar Company</label>
                <Input
                  placeholder="Tata Power Solar"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <label className="font-medium text-foreground block mb-1">Capacity (KW)</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={form.capacityKW}
                  onChange={(e) => setForm({ ...form, capacityKW: Number(e.target.value) })}
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <label className="font-medium text-foreground block mb-1">Install Date</label>
                <Input
                  type="date"
                  value={form.installationDate}
                  onChange={(e) => setForm({ ...form, installationDate: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Photo Section with Direct Device Upload */}
            <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-2">
              <label className="font-medium text-foreground block">
                Installation Photo <span className="text-rose-500">*</span>
              </label>

              {formImagePreview && (
                <div className="relative aspect-[16/9] w-full max-h-40 rounded-md overflow-hidden bg-muted border border-border">
                  <img
                    src={formImagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/gallery-1.jpg";
                    }}
                  />
                </div>
              )}

              <input
                ref={modalFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleSelectModalPhoto}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => modalFileInputRef.current?.click()}
                className="w-full text-xs font-semibold gap-1.5 border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Upload className="h-3.5 w-3.5" />
                Choose Photo from Device (Computer / Mobile)
              </Button>

              <div className="pt-1">
                <span className="text-[10px] text-muted-foreground block mb-1">
                  Or enter photo URLs / relative path (one per line):
                </span>
                <Textarea
                  placeholder="/gallery-1.jpg&#10;/gallery-2.jpg"
                  value={form.imagesText.startsWith("data:") ? "(Uploaded image file)" : form.imagesText}
                  onChange={(e) => {
                    setForm({ ...form, imagesText: e.target.value });
                    setFormImagePreview(e.target.value.split("\n")[0]);
                  }}
                  className="text-xs min-h-[50px]"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">Description & Specs</label>
              <Textarea
                placeholder="Rooftop type, generation output, net metering details..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="text-xs min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <span className="font-medium text-foreground">Feature at Top of Gallery</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <span className="font-medium text-foreground">Visible to Public</span>
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveInstallation}
              disabled={isSaving}
              className="text-xs bg-primary text-white hover:bg-primary/90"
            >
              {isSaving ? "Saving..." : instToEdit ? "Update Showcase" : "Publish to Gallery"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-rose-600 flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Remove from Showcase?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to remove <strong className="text-foreground">{instToDelete?.title}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteInstallation}
              disabled={isSaving}
              className="text-xs"
            >
              {isSaving ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
