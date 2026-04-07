
DROP POLICY "Authenticated users can manage cars" ON public.cars;
DROP POLICY "Authenticated users can update cars" ON public.cars;
DROP POLICY "Authenticated users can delete cars" ON public.cars;

CREATE POLICY "Anyone can manage cars" ON public.cars FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update cars" ON public.cars FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete cars" ON public.cars FOR DELETE TO public USING (true);

DROP POLICY "Authenticated users can update bookings" ON public.bookings;
DROP POLICY "Authenticated users can delete bookings" ON public.bookings;

CREATE POLICY "Anyone can update bookings" ON public.bookings FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete bookings" ON public.bookings FOR DELETE TO public USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage car images" ON public.car_images;
DROP POLICY IF EXISTS "Authenticated users can update car images" ON public.car_images;
DROP POLICY IF EXISTS "Authenticated users can delete car images" ON public.car_images;

CREATE POLICY "Anyone can manage car images" ON public.car_images FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update car images" ON public.car_images FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete car images" ON public.car_images FOR DELETE TO public USING (true);
