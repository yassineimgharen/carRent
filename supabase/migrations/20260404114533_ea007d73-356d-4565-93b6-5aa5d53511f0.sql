
DROP POLICY "Bookings are viewable by authenticated users" ON public.bookings;
CREATE POLICY "Bookings are viewable by everyone" ON public.bookings FOR SELECT TO public USING (true);
