-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'admin');

-- Create tenant enum for multi-tenancy
CREATE TYPE public.tenant_type AS ENUM ('engineering', 'medical');

-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Create exam status enum
CREATE TYPE public.exam_status AS ENUM ('draft', 'scheduled', 'active', 'completed');

-- Create sensor type enum
CREATE TYPE public.sensor_type AS ENUM ('temperature', 'humidity', 'occupancy', 'air-quality');

-- Create shuttle status enum
CREATE TYPE public.shuttle_status AS ENUM ('active', 'idle', 'maintenance');

-- Create notification type enum
CREATE TYPE public.notification_type AS ENUM ('info', 'success', 'warning', 'error');

-- ============================================
-- PROFILES TABLE (User data linked to auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  tenant public.tenant_type NOT NULL DEFAULT 'engineering',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER ROLES TABLE (Separate from profiles for security)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'student',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROOMS TABLE
-- ============================================
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 10,
  building TEXT NOT NULL,
  floor INTEGER NOT NULL DEFAULT 1,
  amenities TEXT[] DEFAULT '{}',
  tenant public.tenant_type NOT NULL DEFAULT 'engineering',
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  purpose TEXT NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PRODUCTS TABLE (Marketplace)
-- ============================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  tenant public.tenant_type NOT NULL DEFAULT 'engineering',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status public.order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- EXAMS TABLE
-- ============================================
CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  course_id TEXT NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  questions JSONB NOT NULL DEFAULT '[]',
  status public.exam_status NOT NULL DEFAULT 'draft',
  tenant public.tenant_type NOT NULL DEFAULT 'engineering',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- ============================================
-- EXAM SUBMISSIONS TABLE
-- ============================================
CREATE TABLE public.exam_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  score INTEGER,
  UNIQUE (exam_id, student_id)
);

ALTER TABLE public.exam_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SENSOR DATA TABLE (IoT)
-- ============================================
CREATE TABLE public.sensor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id TEXT NOT NULL,
  type public.sensor_type NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  location TEXT NOT NULL,
  tenant public.tenant_type NOT NULL DEFAULT 'engineering',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SHUTTLES TABLE
-- ============================================
CREATE TABLE public.shuttles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shuttle_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  speed DECIMAL(5,2) NOT NULL DEFAULT 0,
  heading INTEGER NOT NULL DEFAULT 0,
  status public.shuttle_status NOT NULL DEFAULT 'idle',
  route TEXT NOT NULL,
  next_stop TEXT NOT NULL,
  eta INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shuttles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type public.notification_type NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CART TABLE
-- ============================================
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECURITY DEFINER FUNCTIONS
-- ============================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's tenant
CREATE OR REPLACE FUNCTION public.get_user_tenant(_user_id UUID)
RETURNS tenant_type
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant
  FROM public.profiles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Rooms policies (viewable by all authenticated users in same tenant)
CREATE POLICY "Users can view rooms in their tenant" ON public.rooms
  FOR SELECT TO authenticated
  USING (tenant = public.get_user_tenant(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage rooms" ON public.rooms
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookings" ON public.bookings
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Products policies (viewable by all in same tenant)
CREATE POLICY "Users can view products in their tenant" ON public.products
  FOR SELECT TO authenticated
  USING (tenant = public.get_user_tenant(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers can create products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own products" ON public.products
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own products" ON public.products
  FOR DELETE USING (auth.uid() = seller_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Users can create order items for own orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Exams policies
CREATE POLICY "Students can view scheduled/active exams in tenant" ON public.exams
  FOR SELECT TO authenticated
  USING (
    (status IN ('scheduled', 'active') AND tenant = public.get_user_tenant(auth.uid()))
    OR teacher_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Teachers can create exams" ON public.exams
  FOR INSERT WITH CHECK (
    auth.uid() = teacher_id AND public.has_role(auth.uid(), 'teacher')
  );

CREATE POLICY "Teachers can update own exams" ON public.exams
  FOR UPDATE USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own exams" ON public.exams
  FOR DELETE USING (auth.uid() = teacher_id);

-- Exam submissions policies
CREATE POLICY "Students can view own submissions" ON public.exam_submissions
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can create submissions" ON public.exam_submissions
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can view submissions for their exams" ON public.exam_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.exams WHERE exams.id = exam_submissions.exam_id AND exams.teacher_id = auth.uid())
  );

-- Sensor data policies (viewable by all authenticated users in tenant)
CREATE POLICY "Users can view sensor data in tenant" ON public.sensor_data
  FOR SELECT TO authenticated
  USING (tenant = public.get_user_tenant(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert sensor data" ON public.sensor_data
  FOR INSERT TO authenticated WITH CHECK (true);

-- Shuttles policies (public read)
CREATE POLICY "Anyone can view shuttles" ON public.shuttles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage shuttles" ON public.shuttles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Cart items policies
CREATE POLICY "Users can view own cart" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exams_updated_at
  BEFORE UPDATE ON public.exams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name, tenant)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'tenant')::tenant_type, 'engineering')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student')
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA FOR ROOMS
-- ============================================
INSERT INTO public.rooms (name, capacity, building, floor, amenities, tenant, is_available) VALUES
('Lecture Hall A', 150, 'Main Building', 1, ARRAY['projector', 'whiteboard', 'microphone'], 'engineering', true),
('Computer Lab 101', 30, 'Tech Center', 1, ARRAY['computers', 'projector', 'air-conditioning'], 'engineering', true),
('Study Room 1', 10, 'Library', 2, ARRAY['whiteboard', 'power-outlets'], 'engineering', true),
('Conference Room B', 20, 'Admin Building', 3, ARRAY['video-conferencing', 'projector', 'whiteboard'], 'engineering', true),
('Anatomy Lab', 40, 'Medical Sciences', 1, ARRAY['specimens', 'projector', 'sinks'], 'medical', true),
('Simulation Center', 15, 'Medical Sciences', 2, ARRAY['mannequins', 'monitoring-equipment'], 'medical', true),
('Seminar Room M1', 25, 'Medical Sciences', 1, ARRAY['projector', 'whiteboard', 'video-conferencing'], 'medical', true);

-- ============================================
-- SEED DATA FOR SHUTTLES
-- ============================================
INSERT INTO public.shuttles (shuttle_id, name, latitude, longitude, speed, heading, status, route, next_stop, eta) VALUES
('SH-001', 'Campus Express 1', 40.7128, -74.0060, 25.5, 180, 'active', 'Main Campus Loop', 'Engineering Building', 5),
('SH-002', 'Campus Express 2', 40.7138, -74.0070, 0, 90, 'idle', 'Medical Campus Route', 'Medical Center', 0),
('SH-003', 'Night Shuttle', 40.7148, -74.0050, 30.0, 270, 'active', 'Dormitory Route', 'West Dormitory', 8);