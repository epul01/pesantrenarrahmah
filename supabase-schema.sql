-- ============================================
-- Pesantren Ar-Rahmah - Supabase Schema
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Create berita table
CREATE TABLE IF NOT EXISTS berita (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  ringkasan TEXT NOT NULL,
  konten TEXT,
  kategori TEXT NOT NULL DEFAULT 'Kegiatan',
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating updated_at
CREATE TRIGGER update_berita_updated_at
  BEFORE UPDATE ON berita
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_galeri_updated_at
  BEFORE UPDATE ON galeri
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read, authenticated write)
-- For simplicity, we allow all operations (admin will use service role key)
CREATE POLICY "Allow public read on berita" ON berita
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on galeri" ON galeri
  FOR SELECT USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pesantren', 'pesantren', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the pesantren bucket
CREATE POLICY "Allow public read on pesantren storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'pesantren');

CREATE POLICY "Allow authenticated upload on pesantren storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pesantren');

CREATE POLICY "Allow authenticated update on pesantren storage" ON storage.objects
  FOR UPDATE USING (bucket_id = 'pesantren');

CREATE POLICY "Allow authenticated delete on pesantren storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'pesantren');

-- ============================================
-- Seed data (optional - initial berita & galeri)
-- ============================================

INSERT INTO berita (judul, ringkasan, konten, kategori, gambar_url) VALUES
(
  'Pesantren Ar-Rahmah Gelar Mabit dan Halaqah Tahfidz Akbar',
  'Pesantren Ar-Rahmah mengadakan kegiatan Mabit (Malam Bina Iman dan Takwa) dan Halaqah Tahfidz Akbar yang dihadiri oleh seluruh santri dan ustadz pembimbing. Kegiatan ini bertujuan untuk meningkatkan semangat hafalan Al-Qur''an dan mempererat ukhuwah islamiyah antar santri.',
  NULL,
  'Kegiatan',
  '/berita/mabit-tahfidz.png'
),
(
  'Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka',
  'Pesantren Ar-Rahmah Dewan Da''wah secara resmi membuka pendaftaran santri baru untuk tahun ajaran 2026/2027. Tersedia beasiswa hingga 70% bagi santri yatim dan potongan 50% bagi 10 pendaftar pertama. Segera daftarkan putra-putri Anda!',
  NULL,
  'Pendaftaran',
  '/berita/pendaftaran-santri.png'
),
(
  'Santri Ar-Rahmah Raih Juara Musabaqah Hifdzil Qur''an Tingkat Kabupaten',
  'Alhamdulillah, tiga santri Pesantren Ar-Rahmah berhasil meraih prestasi membanggakan pada Musabaqah Hifdzil Qur''an tingkat Kabupaten Sukabumi. Prestasi ini menjadi bukti keseriusan santri dalam menghafal Al-Qur''an dan dedikasi para ustadz pembimbing.',
  NULL,
  'Prestasi',
  '/berita/prestasi-mhq.png'
);

INSERT INTO galeri (judul, deskripsi, gambar_url) VALUES
('Halaqah Tahfidz Al-Qur''an', 'Santri menghafal Al-Qur''an dengan khusyuk di musholla pesantren.', '/gallery/tahfidz-quran.png'),
('Kegiatan Belajar Mengajar', 'Ruang belajar yang nyaman untuk mendukung proses pendidikan santri.', '/gallery/ruang-belajar.png'),
('Masjid Pesantren', 'Masjid yang luas dan indah sebagai pusat kegiatan ibadah santri.', '/gallery/masjid.png'),
('Kegiatan Olahraga', 'Lapangan olahraga yang luas untuk menjaga kesehatan dan kebugaran santri.', '/gallery/olahraga.png'),
('Kebun Pesantren', 'Kebun seluas 2 hektar yang dimanfaatkan untuk kegiatan pertanian santri.', '/gallery/kebun.png'),
('Asrama Pesantren', 'Asrama yang bersih dan nyaman sebagai tempat tinggal santri sehari-hari.', '/gallery/asrama.png');
