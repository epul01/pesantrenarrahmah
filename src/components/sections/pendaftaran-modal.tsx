"use client";

import { useState } from "react";
import {
  ClipboardList,
  ListOrdered,
  FileCheck,
  CalendarDays,
  Banknote,
  Info,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Users,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const initialFormData = {
  nama: "",
  tempatTanggalLahir: "",
  lulusan: "",
  yatimStatus: "",
  namaOrangtua: "",
  pekerjaan: "",
  alamatLengkap: "",
  noWA: "",
};

interface PendaftaranModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resetKey: number;
}

export function PendaftaranModal({ open, onOpenChange, resetKey }: PendaftaranModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentKey, setCurrentKey] = useState(resetKey);

  if (resetKey !== currentKey) {
    setCurrentKey(resetKey);
    setFormData(initialFormData);
    setFormErrors({});
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.nama.trim()) errors.nama = "Nama wajib diisi";
    if (!formData.tempatTanggalLahir.trim()) errors.tempatTanggalLahir = "Tempat & tanggal lahir wajib diisi";
    if (!formData.lulusan.trim()) errors.lulusan = "Lulusan wajib diisi";
    if (!formData.yatimStatus) errors.yatimStatus = "Status yatim wajib dipilih";
    if (!formData.namaOrangtua.trim()) errors.namaOrangtua = "Nama orang tua/wali wajib diisi";
    if (!formData.alamatLengkap.trim()) errors.alamatLengkap = "Alamat wajib diisi";
    if (!formData.noWA.trim()) errors.noWA = "No. WhatsApp wajib diisi";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const message = `Assalamu'alaikum Wr. Wb.\n\nSaya ingin mendaftarkan putra/putri saya di Pesantren Ar-Rahmah Dewan Da'wah.\n\n📋 *FORMULIR PENDAFTARAN*\n\n👤 Nama: ${formData.nama}\n📅 Tempat & Tanggal Lahir: ${formData.tempatTanggalLahir}\n🎓 Lulusan: ${formData.lulusan}\n💫 Status Yatim: ${formData.yatimStatus === "yatim" ? "Yatim" : formData.yatimStatus === "piatu" ? "Piatu" : "Yatim Piatu"}\n👨‍👩‍👧 Nama Orang Tua/Wali: ${formData.namaOrangtua}\n💼 Pekerjaan: ${formData.pekerjaan}\n📍 Alamat: ${formData.alamatLengkap}\n📱 No. WhatsApp: ${formData.noWA}\n\nJazakumullahu khairan.\nWassalamu'alaikum Wr. Wb.`;
    const waUrl = `https://wa.me/6285703465155?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    onOpenChange(false);
  };

  const steps = [
    { icon: ClipboardList, title: "Isi Formulir", desc: "Lengkapi data calon santri" },
    { icon: ListOrdered, title: "Verifikasi", desc: "Data akan diverifikasi admin" },
    { icon: FileCheck, title: "Konfirmasi", desc: "Terima konfirmasi pendaftaran" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-islamic-green flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-islamic-gold" />
            Formulir Pendaftaran Santri Baru
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Steps */}
          <div className="grid grid-cols-3 gap-3">
            {steps.map((step, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-islamic-green-50">
                <step.icon className="w-6 h-6 mx-auto mb-2 text-islamic-green" />
                <p className="text-xs sm:text-sm font-semibold text-foreground">{step.title}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-1.5 mb-1.5">
                <ClipboardList className="w-4 h-4 text-islamic-green" />
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={(e) => handleInputChange("nama", e.target.value)}
                className={formErrors.nama ? "border-red-400" : ""}
              />
              {formErrors.nama && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.nama}</p>}
            </div>

            <div>
              <Label className="flex items-center gap-1.5 mb-1.5">
                <CalendarDays className="w-4 h-4 text-islamic-green" />
                Tempat & Tanggal Lahir <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Contoh: Sukabumi, 1 Januari 2012"
                value={formData.tempatTanggalLahir}
                onChange={(e) => handleInputChange("tempatTanggalLahir", e.target.value)}
                className={formErrors.tempatTanggalLahir ? "border-red-400" : ""}
              />
              {formErrors.tempatTanggalLahir && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.tempatTanggalLahir}</p>}
            </div>

            <div>
              <Label className="flex items-center gap-1.5 mb-1.5">
                <GraduationCap className="w-4 h-4 text-islamic-green" />
                Lulusan <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Contoh: SD kelas 6 / MI"
                value={formData.lulusan}
                onChange={(e) => handleInputChange("lulusan", e.target.value)}
                className={formErrors.lulusan ? "border-red-400" : ""}
              />
              {formErrors.lulusan && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.lulusan}</p>}
            </div>

            <div>
              <Label className="flex items-center gap-1.5 mb-1.5">
                <Info className="w-4 h-4 text-islamic-green" />
                Status Yatim <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.yatimStatus}
                onValueChange={(val) => handleInputChange("yatimStatus", val)}
                className="flex flex-wrap gap-4 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tidak" id="tidak" />
                  <Label htmlFor="tidak" className="text-sm cursor-pointer">Tidak</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yatim" id="yatim" />
                  <Label htmlFor="yatim" className="text-sm cursor-pointer">Yatim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="piatu" id="piatu" />
                  <Label htmlFor="piatu" className="text-sm cursor-pointer">Piatu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yatim-piatu" id="yatim-piatu" />
                  <Label htmlFor="yatim-piatu" className="text-sm cursor-pointer">Yatim Piatu</Label>
                </div>
              </RadioGroup>
              {formErrors.yatimStatus && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.yatimStatus}</p>}
            </div>

            <div>
              <Label className="flex items-center gap-1.5 mb-1.5">
                <Users className="w-4 h-4 text-islamic-green" />
                Nama Orang Tua/Wali <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Masukkan nama orang tua/wali"
                value={formData.namaOrangtua}
                onChange={(e) => handleInputChange("namaOrangtua", e.target.value)}
                className={formErrors.namaOrangtua ? "border-red-400" : ""}
              />
              {formErrors.namaOrangtua && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.namaOrangtua}</p>}
            </div>

            <div>
              <Label className="flex items-center gap-1.5 mb-1.5">
                <Banknote className="w-4 h-4 text-islamic-green" />
                Pekerjaan Orang Tua/Wali
              </Label>
              <Input
                placeholder="Masukkan pekerjaan"
                value={formData.pekerjaan}
                onChange={(e) => handleInputChange("pekerjaan", e.target.value)}
              />
            </div>

            <div>
              <Label className="flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-4 h-4 text-islamic-green" />
                Alamat Lengkap <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Masukkan alamat lengkap"
                value={formData.alamatLengkap}
                onChange={(e) => handleInputChange("alamatLengkap", e.target.value)}
                className={formErrors.alamatLengkap ? "border-red-400" : ""}
              />
              {formErrors.alamatLengkap && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.alamatLengkap}</p>}
            </div>

            <div>
              <Label className="flex items-center gap-1.5 mb-1.5">
                <Phone className="w-4 h-4 text-islamic-green" />
                No. WhatsApp <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Contoh: 085703465155"
                value={formData.noWA}
                onChange={(e) => handleInputChange("noWA", e.target.value)}
                className={formErrors.noWA ? "border-red-400" : ""}
              />
              {formErrors.noWA && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.noWA}</p>}
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-islamic-gold-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-islamic-gold flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Dengan mengirim formulir ini, data Anda akan dikirim langsung ke tim pendaftaran Pesantren Ar-Rahmah melalui WhatsApp untuk proses verifikasi lebih lanjut.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-islamic-green hover:bg-islamic-green-light text-white font-semibold"
            >
              <Clock className="w-4 h-4 mr-2" />
              Kirim via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
