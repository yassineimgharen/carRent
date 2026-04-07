
CREATE TABLE public.car_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.car_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Car images are viewable by everyone" ON public.car_images FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage car images" ON public.car_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update car images" ON public.car_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete car images" ON public.car_images FOR DELETE TO authenticated USING (true);
