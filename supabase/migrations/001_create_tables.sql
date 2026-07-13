-- =====================================================
-- Pesantren Ar-Rahmah - Database Schema
-- Run this SQL in Supabase SQL Editor to set up tables
-- =====================================================

-- Create berita table
CREATE TABLE IF NOT EXISTS berita (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  ringkasan TEXT NOT NULL,
  konten TEXT,
  kategori TEXT NOT NULL DEFAULT 'Umum',
  gambar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create galeri table
CREATE TABLE IF NOT EXISTS galeri (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  gambar_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access on berita" ON berita FOR SELECT USING (true);
CREATE POLICY "Allow public read access on galeri" ON galeri FOR SELECT USING (true);

-- Create policies to allow service role full access
CREATE POLICY "Allow service role full access on berita" ON berita FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on galeri" ON galeri FOR ALL USING (auth.role() = 'service_role');

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('pesantren-images', 'pesantren-images', true) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Allow public read access on pesantren-images" ON storage.objects FOR SELECT USING (bucket_id = 'pesantren-images');
CREATE POLICY "Allow service role upload on pesantren-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pesantren-images' AND auth.role() = 'service_role');
CREATE POLICY "Allow service role update on pesantren-images" ON storage.objects FOR UPDATE USING (bucket_id = 'pesantren-images' AND auth.role() = 'service_role');
CREATE POLICY "Allow service role delete on pesantren-images" ON storage.objects FOR DELETE USING (bucket_id = 'pesantren-images' AND auth.role() = 'service_role');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER berita_updated_at BEFORE UPDATE ON berita FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER galeri_updated_at BEFORE UPDATE ON galeri FOR EACH ROW EXECUTE FUNCTION update_updated_at();
