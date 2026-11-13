/* =====================================================================
   casos.js — Casos de prueba (verificación, al estilo IEC 62304)
   Cada caso tiene entradas y el resultado ESPERADO calculado a mano
   con la tabla oficial de NEWS2. Si el código da otro número, hay un
   defecto (bug) y se documenta.
   ===================================================================== */

const CASOS_FRONTERA = [
  // [función, entrada, esperado]   — valores en el límite de cada rango
  ['puntajeFR', 8, 3], ['puntajeFR', 9, 1], ['puntajeFR', 11, 1], ['puntajeFR', 12, 0],
  ['puntajeFR', 20, 0], ['puntajeFR', 21, 2], ['puntajeFR', 24, 2], ['puntajeFR', 25, 3],

  ['puntajeSpO2Escala1', 91, 3], ['puntajeSpO2Escala1', 92, 2], ['puntajeSpO2Escala1', 93, 2],
  ['puntajeSpO2Escala1', 94, 1], ['puntajeSpO2Escala1', 95, 1], ['puntajeSpO2Escala1', 96, 0],

  ['puntajeTAS', 90, 3], ['puntajeTAS', 91, 2], ['puntajeTAS', 100, 2], ['puntajeTAS', 101, 1],
  ['puntajeTAS', 110, 1], ['puntajeTAS', 111, 0], ['puntajeTAS', 219, 0], ['puntajeTAS', 220, 3],

  ['puntajeFC', 40, 3], ['puntajeFC', 41, 1], ['puntajeFC', 50, 1], ['puntajeFC', 51, 0],
  ['puntajeFC', 90, 0], ['puntajeFC', 91, 1], ['puntajeFC', 110, 1], ['puntajeFC', 111, 2],
  ['puntajeFC', 130, 2], ['puntajeFC', 131, 3],

  ['puntajeTemp', 35.0, 3], ['puntajeTemp', 35.1, 1], ['puntajeTemp', 36.0, 1], ['puntajeTemp', 36.1, 0],
  ['puntajeTemp', 38.0, 0], ['puntajeTemp', 38.1, 1], ['puntajeTemp', 39.0, 1], ['puntajeTemp', 39.1, 2],

  ['puntajeConciencia', 'A', 0], ['puntajeConciencia', 'C', 3],
  ['puntajeConciencia', 'V', 3], ['puntajeConciencia', 'U', 3],

  ['puntajeOxigeno', false, 0], ['puntajeOxigeno', true, 2],
];

const CASOS_CLINICOS = [
  { nombre: '1. Paciente estable',
    signos: { fr: 16, spo2: 98, oxigeno: false, tas: 120, fc: 72, conciencia: 'A', temp: 36.8 },
    total: 0, nivel: 'cero' },

  { nombre: '2. Postquirúrgico con taquipnea leve',
    signos: { fr: 22, spo2: 95, oxigeno: false, tas: 115, fc: 95, conciencia: 'A', temp: 37.0 },
    total: 4, nivel: 'bajo' },

  { nombre: '3. Confusión de inicio reciente, resto normal',
    signos: { fr: 16, spo2: 97, oxigeno: false, tas: 120, fc: 75, conciencia: 'C', temp: 37.0 },
    total: 3, nivel: 'bajo-medio' },

  { nombre: '4. Neumonía con oxígeno',
    signos: { fr: 23, spo2: 94, oxigeno: true, tas: 118, fc: 88, conciencia: 'A', temp: 37.5 },
    total: 5, nivel: 'medio' },

  { nombre: '5. Sospecha de sepsis',
    signos: { fr: 24, spo2: 93, oxigeno: false, tas: 100, fc: 112, conciencia: 'A', temp: 39.2 },
    total: 10, nivel: 'alto' },

  { nombre: '6. Insuficiencia respiratoria grave',
    signos: { fr: 26, spo2: 90, oxigeno: true, tas: 95, fc: 115, conciencia: 'A', temp: 38.6 },
    total: 13, nivel: 'alto' },

  { nombre: '7. Hipotermia aislada',
    signos: { fr: 12, spo2: 96, oxigeno: false, tas: 111, fc: 51, conciencia: 'A', temp: 35.0 },
    total: 3, nivel: 'bajo-medio' },

  { nombre: '8. EPOC en Escala 2 con O2 y saturación 95 %',
    signos: { fr: 18, spo2: 95, oxigeno: true, tas: 130, fc: 80, conciencia: 'A', temp: 36.9, escala2: true },
    total: 4, nivel: 'bajo' },
];

if (typeof module !== 'undefined') module.exports = { CASOS_FRONTERA, CASOS_CLINICOS };
