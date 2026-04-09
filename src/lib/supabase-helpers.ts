import { api } from "./api";

export type Car = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price_per_day: number;
  image_url: string | null;
  description: string | null;
  seats: number;
  transmission: string;
  fuel_type: string;
  is_available: number;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: number;
  car_id: number;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  cin: string | null;
  driver_license: string | null;
  start_date: string;
  end_date: string;
  total_price: number;
  payment_method: string;
  status: string;
  created_at: string;
  car_name?: string;
  car_brand?: string;
};

export type User = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  city: string | null;
  role: string;
  created_at: string;
};

export type CarInsert = Omit<Car, "id" | "created_at" | "updated_at">;
export type BookingInsert = Omit<Booking, "id" | "created_at" | "car_name" | "car_brand">;

export const fetchCars = (params?: { category?: string; available?: boolean }) => {
  const q = new URLSearchParams();
  if (params?.category) q.set("category", params.category);
  if (params?.available !== undefined) q.set("available", String(params.available));
  return api(`/cars${q.toString() ? "?" + q : ""}`);
};

export const fetchCarById = (id: string | number) => api(`/cars/${id}`);

export const fetchCarImages = (id: string | number) => api(`/cars/${id}/images`);

export const fetchBookings = () => api("/bookings");

export const fetchBookingsForCar = (carId: string | number) => api(`/bookings/car/${carId}`);

export const fetchMyBookings = () => api("/bookings/my");

export const createBooking = (booking: Partial<BookingInsert>) =>
  api("/bookings", { method: "POST", body: JSON.stringify(booking) });

export const upsertCar = (car: Partial<CarInsert> & { id?: number }) =>
  car.id
    ? api(`/cars/${car.id}`, { method: "PUT", body: JSON.stringify(car) })
    : api("/cars", { method: "POST", body: JSON.stringify(car) });

export const deleteCar = (id: number) => api(`/cars/${id}`, { method: "DELETE" });

export const deleteBooking = (id: number) => api(`/bookings/${id}`, { method: "DELETE" });

export const updateBookingStatus = (id: number, status: string) =>
  api(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });

export const fetchMe = () => api("/users/me");

export const updateMe = (data: Partial<User>) =>
  api("/users/me", { method: "PUT", body: JSON.stringify(data) });

export const fetchAllUsers = () => api(`/users?t=${Date.now()}`);

export const fetchAnalytics = () => api("/users/analytics");

export const CAR_CATEGORIES = ["Renault", "Audi", "Volkswagen", "Skoda", "BMW", "Dacia", "Hyundai", "Peugeot"] as const;
