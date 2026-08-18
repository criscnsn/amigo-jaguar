import {Filter} from 'bad-words';
//buscar lista de profanity en español y agregarla a la lista de palabras prohibidas
//Lista negra de groserias prohibidas o palabras en general ejje

const customBadWords = [
  "puto",
  "puta",
  "pendejo",
  "pendeja",
  "verga",
  "cabron",
  "cabrona",
  "chingar",
  "chingada",
  "maricon",
  "maricones",
  "joto",
  "culero",
  "culera",
  "mamada",
  "mamadas",
  "chupatrusas",
  "americanista",
  "pumista",
  "pinche",
];

/**
 * Normaliza el texto removiendo acentos, leetspeak, números y caracteres especiales
 * para evitar evasiones comunes en filtros.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina acentos/diacríticos
    .replace(/4/g, "a")
    .replace(/3/g, "e")
    .replace(/1/g, "i")
    .replace(/0/g, "o")
    .replace(/5/g, "s")
    .replace(/\$/g, "s")
    .replace(/@/g, "a")
    .replace(/[^a-z\s]/g, ""); // Mantiene solo letras y espacios
}

/**
 * Valida si un texto contiene lenguaje inapropiado
 * @returns true si el texto contiene insumos/groserías, false si está limpio
 */
export function hasProfanity(text: string): boolean {
  const normalized = normalizeText(text);
  
  // 1. Instancia del filtro bad-words base
  const filter = new Filter();
  filter.addWords(...customBadWords);

  // 2. Comprobar texto original y texto normalizado
  if (filter.isProfane(text) || filter.isProfane(normalized)) {
    return true;
  }

  // 3. Comprobar palabras pegadas sin espacios (ej. "p.e.n.d.e.j.o" -> "pendejo")
  const compactText = normalized.replace(/\s+/g, "");
  return customBadWords.some((word) => compactText.includes(word));
}