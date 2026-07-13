/**
 * Convert a string to a URL-friendly slug.
 * Handles Indonesian text, apostrophes (Da'wah → dawah), and special characters.
 *
 * Examples:
 *   slugify("Tasmi' Hafalan Al-Qur'an 5 Juz") → "tasmi-hafalan-al-quran-5-juz"
 *   slugify("Ajarkan Beladiri agar Menjadi Da'i dan Mujahid") → "ajarkan-beladiri-agar-menjadi-dai-dan-mujahid"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics (é → e)
    .replace(/['']/g, "") // remove straight & curly apostrophes (Da'wah → dawah)
    .replace(/[""]/g, "") // remove straight & curly quotes
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric (keep spaces, hyphens)
    .trim()
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}
