-- Add visible column to all product tables
-- Default value is true so existing products remain visible

-- Helados
ALTER TABLE public.helados ADD COLUMN visible BOOLEAN DEFAULT true NOT NULL;

-- Palitos
ALTER TABLE public.palitos ADD COLUMN visible BOOLEAN DEFAULT true NOT NULL;

-- Postres
ALTER TABLE public.postres ADD COLUMN visible BOOLEAN DEFAULT true NOT NULL;

-- Crocker
ALTER TABLE public.crocker ADD COLUMN visible BOOLEAN DEFAULT true NOT NULL;

-- Dietéticos
ALTER TABLE public.dieteticos ADD COLUMN visible BOOLEAN DEFAULT true NOT NULL;

-- Buffet
ALTER TABLE public.buffet ADD COLUMN visible BOOLEAN DEFAULT true NOT NULL;

-- Softs y Yogurts
ALTER TABLE public.softs ADD COLUMN visible BOOLEAN DEFAULT true NOT NULL;

-- Dulces
ALTER TABLE public.dulces ADD COLUMN visible BOOLEAN DEFAULT true NOT NULL;

-- Paletas
ALTER TABLE public.paletas ADD COLUMN visible BOOLEAN DEFAULT true NOT NULL;

-- Bites
ALTER TABLE public.bites ADD COLUMN visible BOOLEAN DEFAULT true NOT NULL;

-- Barritas
ALTER TABLE public.barritas ADD COLUMN visible BOOLEAN DEFAULT true NOT NULL;

-- Térmicos
ALTER TABLE public.termicos ADD COLUMN visible BOOLEAN DEFAULT true NOT NULL;
