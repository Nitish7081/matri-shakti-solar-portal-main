import { useState, useEffect, useCallback } from "react";
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

export function InstallationManager({ onRefreshStats }: InstallationManagerProps) {
  const [installations, setInstallations] = useState<IInstallationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instToEdit, setInstToEdit] = useState<IInstallationItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSaveInstallation = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.location.trim()) return toast.error("Location is required");

    const images = form.imagesText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (images.length === 0) {
      return toast.error("Please provide at least one photo URL or path (e.g. /gallery-1.jpg)");
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

      {/* Grid of Installations */}
      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
          Loading installations showcase...
        </div>
      ) : filteredInstallations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-12 text-center">
          <Camera className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No Showcase Projects Found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Add completed rooftop solar projects with photos to showcase on the public Gallery page.
          </p>
          <Button size="sm" onClick={openAddModal} className="mt-4 text-xs gap-1.5 bg-primary text-white">
            <Plus className="h-4 w-4" /> Add First Showcase Project
          </Button>
        </div>
      ) : (
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
                    <span className="text-[11px] text-muted-foreground">
                      Photos: <strong className="text-foreground">{item.images?.length || 0}</strong>
                    </span>

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

            <div>
              <label className="font-medium text-foreground block mb-1">
                Photo URLs or Paths (One per line) <span className="text-rose-500">*</span>
              </label>
              <Textarea
                placeholder="/gallery-1.jpg&#10;/gallery-2.jpg"
                value={form.imagesText}
                onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
                className="text-xs min-h-[60px]"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                You can use relative assets like /gallery-1.jpg or secure https image links.
              </span>
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
