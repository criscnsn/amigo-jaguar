/**
 * Genera un código de rastreo único de 4 caracteres alfanuméricos con el prefijo JAG-
 * Ejemplo: JAG-8392, JAG-4K9A
 * Esto es para que cada alumno que haga una pregunta pueda
 * revisar si su duda fue respondida sin necesidad de registrarse.
 */
export function generateTrackingCode(): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Se omiten O, 0, I, 1 para evitar confusiones
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `JAG-${result}`;
}