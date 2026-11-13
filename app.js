/* =====================================================================
   app.js — Interfaz: lee el formulario, valida, muestra el resultado
   y guarda un historial local (localStorage, solo en este teléfono).
   ===================================================================== */

/* Rangos FISIOLÓGICAMENTE POSIBLES (no son rangos normales).
   Sirven para detectar errores de captura: una FC de 720 casi seguro
   es un 72 mal tecleado. */
const RANGOS = {
  fr:   { min: 0,  max: 80,  nombre: 'Frecuencia respiratoria' },
  spo2: { min: 50, max: 100, nombre: 'SpO₂' },
  tas:  { min: 40, max: 300, nombre: 'T/A sistólica' },
  fc:   { min: 20, max: 300, nombre: 'Frecuencia cardiaca' },
  temp: { min: 25, max: 45,  nombre: 'Temperatura' },
};

const NOMBRES_DETALLE = {
  fr: 'Frecuencia respiratoria', spo2: 'SpO₂', oxigeno: 'Oxígeno suplementario',
  tas: 'T/A sistólica', fc: 'Frecuencia cardiaca', conciencia: 'Conciencia (ACVPU)', temp: 'Temperatura',
};

const CLAVE_HISTORIAL = 'news2-historial';
let ultimoCalculo = null;

/* ---------- Botones de opción (oxígeno y ACVPU) ---------- */
document.querySelectorAll('.segmentos').forEach(grupo => {
  grupo.addEventListener('click', e => {
    const boton = e.target.closest('button');
    if (!boton) return;
    grupo.querySelectorAll('button').forEach(b => b.classList.remove('activo'));
    boton.classList.add('activo');
  });
});

function valorSegmento(grupo) {
  return document.querySelector(`.segmentos[data-grupo="${grupo}"] .activo`).dataset.valor;
}

/* ---------- Validación ---------- */
function validar() {
  let ok = true;
  const signos = {};

  for (const [id, r] of Object.entries(RANGOS)) {
    const input = document.getElementById(id);
    const error = document.querySelector(`.error[data-para="${id}"]`);
    const texto = input.value.trim().replace(',', '.');   // acepta coma decimal
    const valor = Number(texto);

    let mensaje = '';
    if (texto === '')                         mensaje = 'Campo obligatorio';
    else if (Number.isNaN(valor))             mensaje = 'Debe ser un número';
    else if (valor < r.min || valor > r.max)  mensaje = `Fuera de rango (${r.min}–${r.max})`;

    error.textContent = mensaje;
    input.classList.toggle('invalido', mensaje !== '');
    if (mensaje) ok = false;
    signos[id] = valor;
  }

  signos.oxigeno    = valorSegmento('oxigeno') === 'si';
  signos.conciencia = valorSegmento('conciencia');
  signos.escala2    = document.getElementById('escala2').checked;

  return ok ? signos : null;
}

/* ---------- Mostrar resultado ---------- */
function mostrar(resultado) {
  const caja = document.getElementById('resultado');
  caja.className = `resultado nivel-${resultado.riesgo.nivel}`;
  document.getElementById('total').textContent = resultado.total;
  document.getElementById('etiqueta').textContent = resultado.riesgo.etiqueta;
  document.getElementById('respuesta').textContent = resultado.riesgo.respuesta;

  document.getElementById('detalle').innerHTML = Object.entries(resultado.detalle)
    .map(([k, p]) => `<tr class="${p === 3 ? 'tres' : ''}"><td>${NOMBRES_DETALLE[k]}</td><td>${p}</td></tr>`)
    .join('');

  caja.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('formulario').addEventListener('submit', e => {
  e.preventDefault();
  const signos = validar();
  if (!signos) return;
  const resultado = NEWS2.calcular(signos);
  ultimoCalculo = { signos, resultado };
  mostrar(resultado);
});

/* ---------- Historial local ---------- */
function leerHistorial() {
  try { return JSON.parse(localStorage.getItem(CLAVE_HISTORIAL)) || []; }
  catch { return []; }
}

function pintarHistorial() {
  const lista = document.getElementById('lista-historial');
  const registros = leerHistorial();
  if (registros.length === 0) {
    lista.innerHTML = '<li class="vacio">Sin registros.</li>';
    return;
  }
  const colores = { cero: '#1e8e3e', bajo: '#1e8e3e', 'bajo-medio': '#f2b705', medio: '#e8710a', alto: '#c5221f' };
  lista.innerHTML = registros.slice().reverse().map(r => {
    const fecha = new Date(r.fecha).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
    const cama = r.cama ? escapar(r.cama) : 'Sin ID';
    return `<li style="border-left-color:${colores[r.nivel]}"><span>${cama} · ${fecha}</span><strong>${r.total}</strong></li>`;
  }).join('');
}

function escapar(t) {
  return t.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

document.getElementById('guardar').addEventListener('click', () => {
  if (!ultimoCalculo) return;
  const registros = leerHistorial();
  registros.push({
    fecha: new Date().toISOString(),
    cama: document.getElementById('cama').value.trim(),
    signos: ultimoCalculo.signos,
    total: ultimoCalculo.resultado.total,
    nivel: ultimoCalculo.resultado.riesgo.nivel,
  });
  try { localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(registros)); } catch {}
  pintarHistorial();
});

document.getElementById('borrar').addEventListener('click', () => {
  try { localStorage.removeItem(CLAVE_HISTORIAL); } catch {}
  pintarHistorial();
});

pintarHistorial();

/* ---------- PWA: registrar el service worker (funciona offline) ---------- */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW no registrado:', err));
}
