import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Car as CarIcon, Eye, DollarSign, Users as UsersIcon, Calendar, TrendingUp, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/Navbar";
import { fetchCars, fetchBookings, fetchAllUsers, fetchAnalytics, upsertCar, deleteCar, deleteBooking, updateBookingStatus, CAR_CATEGORIES, type Car } from "@/lib/supabase-helpers";
import { api } from "@/lib/api";

const emptyForm = {
  name: "", brand: "", category: "Sedan", price_per_day: 0,
  image_url: "", description: "", seats: 5, transmission: "Automatic",
  fuel_type: "Gasoline", is_available: 1, is_featured: 0,
};

const AdminPage = () => {
  const { user, loading } = useAuth();
  const qc = useQueryClient();

  if (loading) return null;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  const [formData, setFormData] = useState<any>(emptyForm);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customerInfoOpen, setCustomerInfoOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  const [userEditOpen, setUserEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [dailyPeriod, setDailyPeriod] = useState("today");
  const [monthlyPeriod, setMonthlyPeriod] = useState("thisMonth");
  const [yearlyPeriod, setYearlyPeriod] = useState("thisYear");
  const [uploadedImages, setUploadedImages] = useState<Array<{url: string, filename: string}>>([]);

  const { data: cars } = useQuery({ queryKey: ["cars"], queryFn: fetchCars });
  const { data: bookings } = useQuery({ queryKey: ["bookings"], queryFn: fetchBookings });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: fetchAllUsers });
  const { data: analytics } = useQuery({ queryKey: ["analytics"], queryFn: fetchAnalytics });
  const { data: messages } = useQuery({ 
    queryKey: ["contact-messages"], 
    queryFn: () => api("/contact"),
  });

  const carMutation = useMutation({
    mutationFn: async (carData: any) => {
      const savedCar = await upsertCar(carData);
      if (uploadedImages.length > 0) {
        const carId = savedCar.id || carData.id;
        if (carId) {
          await api("/cars/save-images", {
            method: "POST",
            body: JSON.stringify({
              car_id: carId,
              existing_images: uploadedImages.map((img) => img.filename),
            }),
          });
        }
      }
      return savedCar;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cars"] }); setDialogOpen(false); setUploadedImages([]); toast.success("Car saved!"); },
    onError: (error: any) => toast.error(error.message || "Failed to save car"),
  });

  const deleteCarMutation = useMutation({
    mutationFn: (id: number) => deleteCar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cars"] }); toast.success("Car deleted"); },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: (id: number) => deleteBooking(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["bookings"] }); toast.success("Booking deleted"); },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (id: number) => api(`/contact/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["contact-messages"] }); toast.success("Message deleted"); },
  });

  const updateMessageStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      api(`/contact/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["contact-messages"] }); toast.success("Status updated"); },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateBookingStatus(id, status),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["bookings"] }); 
      qc.invalidateQueries({ queryKey: ["analytics"] }); 
      toast.success("Status updated"); 
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      console.log('=== UPDATE USER MUTATION ===');
      console.log('User ID:', id);
      console.log('Data being sent:', data);
      return api(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
    },
    onSuccess: async (data) => {
      console.log('=== UPDATE SUCCESS ===');
      console.log('Response from server:', data);
      await qc.invalidateQueries({ queryKey: ["users"] });
      await qc.invalidateQueries({ queryKey: ["analytics"] });
      await qc.refetchQueries({ queryKey: ["users"] });
      setUserEditOpen(false);
      toast.success("User updated!");
    },
    onError: (error: any) => {
      console.error('=== UPDATE ERROR ===');
      console.error('Error:', error);
      toast.error("Failed to update user: " + (error.message || "Unknown error"));
    },
  });

  const openEdit = (car: Car) => {
    setFormData({ id: car.id, name: car.name, brand: car.brand, category: car.category, price_per_day: car.price_per_day, image_url: car.image_url || "", description: car.description || "", seats: car.seats, transmission: car.transmission, fuel_type: car.fuel_type, is_available: car.is_available, is_featured: (car as any).is_featured || 0 });
    setUploadedImages([]);
    setDialogOpen(true);
  };

  const openNew = () => { setFormData(emptyForm); setUploadedImages([]); setDialogOpen(true); };
  const set = (key: string, value: unknown) => setFormData((prev: any) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append("images", file));
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/cars/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      const newImages = data.images.map((img: any) => ({ 
        url: `http://localhost:4000${img.image_url}`,
        filename: img.filename 
      }));
      setUploadedImages(prev => [...prev, ...newImages]);
      toast.success(`${files.length} image(s) uploaded!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload images");
    }
  };

  const filteredBookings = (bookings ?? []).filter((b: any) => {
    const q = searchQuery.toLowerCase();
    return b.customer_name.toLowerCase().includes(q) ||
           b.customer_email.toLowerCase().includes(q) ||
           b.car_name.toLowerCase().includes(q) ||
           b.car_brand.toLowerCase().includes(q) ||
           b.id.toString().includes(q);
  });

  const filteredUsers = (users ?? []).filter((u: any) => {
    const q = searchQuery.toLowerCase();
    return u.email.toLowerCase().includes(q) ||
           (u.first_name && u.first_name.toLowerCase().includes(q)) ||
           (u.last_name && u.last_name.toLowerCase().includes(q)) ||
           (u.city && u.city.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-16 space-y-6">
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="cars">Cars ({cars?.length ?? 0})</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({bookings?.length ?? 0})</TabsTrigger>
            <TabsTrigger value="users">Users ({users?.length ?? 0})</TabsTrigger>
            <TabsTrigger value="messages">Messages ({messages?.filter((m: any) => m.status === 'unread').length ?? 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Daily Revenue</p>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <p className="font-display text-3xl font-bold">
                  ${dailyPeriod === "yesterday" ? (analytics?.yesterday ?? 0) : (analytics?.daily ?? 0)}
                </p>
                <Select value={dailyPeriod} onValueChange={setDailyPeriod}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="glass-card p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <p className="font-display text-3xl font-bold">
                  ${monthlyPeriod === "lastMonth" ? (analytics?.lastMonth ?? 0) : (analytics?.monthly ?? 0)}
                </p>
                <Select value={monthlyPeriod} onValueChange={setMonthlyPeriod}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="glass-card p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Yearly Revenue</p>
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <p className="font-display text-3xl font-bold">
                  ${yearlyPeriod === "lastYear" ? (analytics?.lastYear ?? 0) : (analytics?.yearly ?? 0)}
                </p>
                <Select value={yearlyPeriod} onValueChange={setYearlyPeriod}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thisYear">This Year</SelectItem>
                    <SelectItem value="lastYear">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="glass-card p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <p className="font-display text-3xl font-bold">${analytics?.total ?? 0}</p>
                <p className="text-xs text-muted-foreground">All Time</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass-card p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <Calendar className="h-5 w-5 text-amber-500" />
                </div>
                <p className="font-display text-3xl font-bold">{analytics?.bookings ?? 0}</p>
              </div>
              <div className="glass-card p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <UsersIcon className="h-5 w-5 text-cyan-500" />
                </div>
                <p className="font-display text-3xl font-bold">{analytics?.users ?? 0}</p>
              </div>
              <div className="glass-card p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total Cars</p>
                  <CarIcon className="h-5 w-5 text-pink-500" />
                </div>
                <p className="font-display text-3xl font-bold">{analytics?.cars ?? 0}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cars" className="space-y-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNew} className="rounded-full font-display">
                  <Plus className="mr-2 h-4 w-4" /> Add Car
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display">{formData.id ? "Edit Car" : "Add New Car"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); carMutation.mutate({ ...formData, image_url: uploadedImages[0]?.url || formData.image_url }); }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Name *</Label><Input value={formData.name} onChange={(e) => set("name", e.target.value)} required /></div>
                    <div className="space-y-2"><Label>Brand *</Label><Input value={formData.brand} onChange={(e) => set("brand", e.target.value)} required /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(v) => set("category", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{CAR_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Price/Day *</Label><Input type="number" value={formData.price_per_day} onChange={(e) => set("price_per_day", +e.target.value)} required /></div>
                  </div>
                  <div className="space-y-2"><Label>Image URL</Label><Input value={formData.image_url || ""} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." /></div>
                  <div className="space-y-2">
                    <Label>Upload Images</Label>
                    <Input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {uploadedImages.map((img, i) => (
                          <div key={i} className="relative group">
                            <img src={img.url} className="w-full h-20 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description || ""} onChange={(e) => set("description", e.target.value)} /></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Seats</Label><Input type="number" value={formData.seats} onChange={(e) => set("seats", +e.target.value)} /></div>
                    <div className="space-y-2">
                      <Label>Transmission</Label>
                      <Select value={formData.transmission} onValueChange={(v) => set("transmission", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Automatic">Automatic</SelectItem><SelectItem value="Manual">Manual</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fuel Type</Label>
                      <Select value={formData.fuel_type} onValueChange={(v) => set("fuel_type", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Gasoline">Gasoline</SelectItem><SelectItem value="Diesel">Diesel</SelectItem><SelectItem value="Electric">Electric</SelectItem><SelectItem value="Hybrid">Hybrid</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={!!formData.is_available} onCheckedChange={(v) => set("is_available", v ? 1 : 0)} />
                    <Label>Available</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={!!formData.is_featured} onCheckedChange={(v) => set("is_featured", v ? 1 : 0)} />
                    <Label>Featured on Homepage</Label>
                  </div>
                  <Button type="submit" className="w-full rounded-full font-display" disabled={carMutation.isPending}>
                    {carMutation.isPending ? "Saving..." : "Save Car"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <div className="glass-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Car</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(cars ?? []).map((car) => (
                    <TableRow key={car.id} className="border-border/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-14 rounded-md bg-secondary overflow-hidden flex-shrink-0">
                            {car.image_url ? <img src={car.image_url} className="h-full w-full object-cover" alt="" /> : <CarIcon className="h-full w-full p-2 text-muted-foreground" />}
                          </div>
                          <div>
                            <p>{car.name}</p>
                            <p className="text-xs text-muted-foreground">{car.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary">{car.category}</Badge></TableCell>
                      <TableCell className="font-display font-semibold">${car.price_per_day}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={car.is_available ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}>
                          {car.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(car)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteCarMutation.mutate(car.id)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!cars || cars.length === 0) && (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No cars yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Search bookings by customer, car, or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  qc.invalidateQueries({ queryKey: ["bookings"] });
                  qc.invalidateQueries({ queryKey: ["analytics"] });
                }}
              >
                Refresh
              </Button>
            </div>
            <div className="glass-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Customer</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((b: any) => (
                    <TableRow key={b.id} className="border-border/30">
                      <TableCell>
                        <p className="font-medium">{b.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{b.customer_email}</p>
                      </TableCell>
                      <TableCell>{b.car_brand} {b.car_name}</TableCell>
                      <TableCell className="text-sm">{b.start_date} → {b.end_date}</TableCell>
                      <TableCell className="font-display font-semibold">${b.total_price}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={b.payment_method === "cash" ? "border-amber-500/30 text-amber-400" : "border-blue-500/30 text-blue-400"}>
                          {b.payment_method === "cash" ? "Cash" : "Card"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={["pending", "confirmed", "completed"].includes(b.status) ? b.status : "pending"} 
                          onValueChange={(v) => statusMutation.mutate({ id: b.id, status: v })}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Pending" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedBooking(b); setCustomerInfoOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteBookingMutation.mutate(b.id)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredBookings.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{searchQuery ? "No bookings match your search" : "No bookings yet"}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <Dialog open={customerInfoOpen} onOpenChange={setCustomerInfoOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display">Customer Information</DialogTitle>
                </DialogHeader>
                {selectedBooking && (
                  <div className="space-y-4">
                    <div className="glass-card p-4 space-y-3">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase">Booking Details</h3>
                      <div className="space-y-2">
                        <div><span className="text-sm text-muted-foreground">Booking ID:</span> <span className="font-medium">#{selectedBooking.id}</span></div>
                        <div><span className="text-sm text-muted-foreground">Car:</span> <span className="font-medium">{selectedBooking.car_brand} {selectedBooking.car_name}</span></div>
                        <div><span className="text-sm text-muted-foreground">Dates:</span> <span className="font-medium">{selectedBooking.start_date} → {selectedBooking.end_date}</span></div>
                        <div><span className="text-sm text-muted-foreground">Total Price:</span> <span className="font-display font-semibold text-primary">${selectedBooking.total_price}</span></div>
                        <div><span className="text-sm text-muted-foreground">Payment:</span> <Badge variant="outline" className="ml-2">{selectedBooking.payment_method}</Badge></div>
                      </div>
                    </div>

                    <div className="glass-card p-4 space-y-3">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase">Contact Information</h3>
                      <div className="space-y-2">
                        <div><span className="text-sm text-muted-foreground">Name:</span> <span className="font-medium">{selectedBooking.customer_name}</span></div>
                        <div className="flex items-center justify-between">
                          <div><span className="text-sm text-muted-foreground">Email:</span> <span className="font-medium">{selectedBooking.customer_email}</span></div>
                          <button
                            onClick={() => {
                              const subject = `Booking #${selectedBooking.id} - ${selectedBooking.car_brand} ${selectedBooking.car_name}`;
                              window.open(`mailto:${selectedBooking.customer_email}?subject=${encodeURIComponent(subject)}`, '_blank');
                            }}
                            className="h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-md transition-all hover:scale-110"
                            style={{ borderRadius: '20%' }}
                            aria-label="Send Email"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                              <rect x="2" y="4" width="20" height="16" rx="2"/>
                              <path d="m2 7 10 7 10-7"/>
                            </svg>
                          </button>
                        </div>
                        {selectedBooking.customer_phone && (
                          <div className="flex items-center justify-between">
                            <div><span className="text-sm text-muted-foreground">Phone:</span> <span className="font-medium">{selectedBooking.customer_phone}</span></div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const phone = selectedBooking.customer_phone.replace(/[^0-9+]/g, '');
                                  window.open(`tel:${phone}`, '_self');
                                }}
                                className="h-8 w-8 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-md transition-all hover:scale-110"
                                style={{ borderRadius: '20%' }}
                                aria-label="Call Phone"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  const phone = selectedBooking.customer_phone.replace(/[^0-9+]/g, '');
                                  window.open(`https://wa.me/${phone}`, '_blank');
                                }}
                                className="h-8 w-8 bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-md transition-all hover:scale-110"
                                style={{ borderRadius: '20%' }}
                                aria-label="Contact via WhatsApp"
                              >
                                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                        {selectedBooking.user_phone && !selectedBooking.customer_phone && (
                          <div className="flex items-center justify-between">
                            <div><span className="text-sm text-muted-foreground">Phone:</span> <span className="font-medium">{selectedBooking.user_phone}</span></div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const phone = selectedBooking.user_phone.replace(/[^0-9+]/g, '');
                                  window.open(`tel:${phone}`, '_self');
                                }}
                                className="h-8 w-8 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-md transition-all hover:scale-110"
                                style={{ borderRadius: '20%' }}
                                aria-label="Call Phone"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  const phone = selectedBooking.user_phone.replace(/[^0-9+]/g, '');
                                  window.open(`https://wa.me/${phone}`, '_blank');
                                }}
                                className="h-8 w-8 bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-md transition-all hover:scale-110"
                                style={{ borderRadius: '20%' }}
                                aria-label="Contact via WhatsApp"
                              >
                                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedBooking.user_id && (
                      <div className="glass-card p-4 space-y-3 border-primary/20">
                        <h3 className="font-semibold text-sm text-primary uppercase">Registered User Account</h3>
                        <div className="space-y-2">
                          <div><span className="text-sm text-muted-foreground">Account Name:</span> <span className="font-medium">{selectedBooking.user_first_name} {selectedBooking.user_last_name}</span></div>
                          <div><span className="text-sm text-muted-foreground">Account Email:</span> <span className="font-medium">{selectedBooking.user_email}</span></div>
                          {selectedBooking.user_phone && (
                            <div><span className="text-sm text-muted-foreground">Account Phone:</span> <span className="font-medium">{selectedBooking.user_phone}</span></div>
                          )}
                          {selectedBooking.user_city && (
                            <div><span className="text-sm text-muted-foreground">City:</span> <span className="font-medium">{selectedBooking.user_city}</span></div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground text-center pt-2">
                      Booked on {new Date(selectedBooking.created_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Search users by name, email, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => qc.invalidateQueries({ queryKey: ["users"] })}
              >
                Refresh
              </Button>
            </div>
            <div className="glass-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u: any) => (
                    <TableRow key={u.id} className="border-border/30">
                      <TableCell>
                        <div>
                          <p className="font-medium">{u.first_name} {u.last_name}</p>
                          <p className="text-xs text-muted-foreground">ID: {u.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{u.email}</p>
                          {u.phone && <p className="text-xs text-muted-foreground">{u.phone}</p>}
                        </div>
                      </TableCell>
                      <TableCell>{u.city || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{u.booking_count}</TableCell>
                      <TableCell className="font-display font-semibold text-primary">${u.total_spent}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(u); setUserEditOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">{searchQuery ? "No users match your search" : "No users yet"}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <Dialog open={userEditOpen} onOpenChange={setUserEditOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display">Edit User</DialogTitle>
                </DialogHeader>
                {selectedUser && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const dataToSend = {
                      first_name: selectedUser.first_name,
                      last_name: selectedUser.last_name,
                      email: selectedUser.email,
                      phone: selectedUser.phone,
                      city: selectedUser.city,
                      role: selectedUser.role,
                    };
                    updateUserMutation.mutate({ 
                      id: selectedUser.id, 
                      data: dataToSend
                    });
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input value={selectedUser.first_name || ""} onChange={(e) => setSelectedUser({...selectedUser, first_name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input value={selectedUser.last_name || ""} onChange={(e) => setSelectedUser({...selectedUser, last_name: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={selectedUser.email} onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={selectedUser.phone || ""} onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})} placeholder="+212 XXX XXX XXX" />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={selectedUser.city || ""} onChange={(e) => setSelectedUser({...selectedUser, city: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={selectedUser.role} onValueChange={(v) => setSelectedUser({...selectedUser, role: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="glass-card p-3 space-y-2">
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Statistics</p>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Total Bookings (Read-only)</Label>
                          <Input value={selectedUser.booking_count} disabled className="bg-secondary" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Total Spent ($)</Label>
                          <Input 
                            type="number" 
                            step="0.01"
                            value={selectedUser.total_spent || 0} 
                            disabled
                            className="bg-secondary"
                          />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" className="w-full rounded-full font-display" disabled={updateUserMutation.isPending}>
                      {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <div className="glass-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>From</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(messages ?? []).map((msg: any) => (
                    <TableRow key={msg.id} className="border-border/30">
                      <TableCell>
                        <div>
                          <p className="font-medium">{msg.name}</p>
                          <p className="text-xs text-muted-foreground">{msg.email}</p>
                          {msg.phone && <p className="text-xs text-muted-foreground">{msg.phone}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm line-clamp-2">{msg.message}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={msg.status} 
                          onValueChange={(v) => updateMessageStatusMutation.mutate({ id: msg.id, status: v })}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unread">Unread</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="replied">Replied</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => window.open(`mailto:${msg.email}?subject=Re: Your message to DriveX&body=Hi ${msg.name},%0D%0A%0D%0A`, '_blank')}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive" 
                          onClick={() => deleteMessageMutation.mutate(msg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!messages || messages.length === 0) && (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No messages yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
