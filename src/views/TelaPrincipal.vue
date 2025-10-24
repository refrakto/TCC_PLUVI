<template>
  <div :class="themeStore.themeClass">
    <header class="topbar">
      <h1 class="brand">SIMP - IFRJ</h1>
      <div class="top-controls">
        <button class="icon" @click="themeStore.toggleTheme" :title="themeStore.currentTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro'">
          <component :is="themeStore.currentTheme === 'dark' ? Sun : Moon" />
        </button>
        <div class="profile">Meu Perfil</div>
      </div>
    </header>

    <section class="layout">
      <aside class="left-actions">
        <button class="action-btn" @click="openNewRecordModal()">Registrar Chuva</button>
        <button class="action-btn" @click="openNewPluvModal()">Registrar Pluviômetro</button>
        <button class="action-btn" @click="openEditPluvList()">Editar Pluviômetro</button>
      </aside>

      <main class="calendar-card" role="region" aria-label="Calendário">
        <div class="cal-header">
          <button class="nav-btn" @click="changeMonth(-1)"><ChevronLeft /></button>
          <div class="month-title">{{ months[currentMonth] }} {{ currentYear }}</div>
          <button class="nav-btn" @click="changeMonth(1)"><ChevronRight /></button>
        </div>
        <div class="weekday-row">
          <div v-for="d in ['D','S','T','Q','Q','S','S']" :key="d" class="weekday">{{ d }}</div>
        </div>
        <div class="grid-days">
          <div
            v-for="cell in calendarCells"
            :key="cell.key"
            :class="['cell', { empty: !cell.day, rain: cell.day && hasRain(cell.day), today: isToday(cell.day) }]"
            @click="onCellClick(cell.day)"
          >
            <span v-if="cell.day">{{ cell.day }}</span>
          </div>
        </div>
      </main>

      <aside class="right-stats">
        <p><strong>{{ countThisMonth }}</strong> chuvas registradas no mês.</p>
        <p>Total estimado de horas de chuva: <strong>{{ estimatedHours }}</strong></p>
        <p>Pluviômetros cadastrados: <strong>{{ pluviometros.length }}</strong></p>
        <button class="report-btn" @click="openReportsModal"><BarChart3 /> Gerar Relatórios</button>
      </aside>
    </section>

    <section class="map-section">
      <div class="map-card">
        <h3 class="map-title">Mapa de Pluviômetros</h3>
        <div id="map" ref="mapEl" class="mapbox" aria-hidden="false" tabindex="0"></div>
      </div>
    </section>

    <div v-if="showRainModal" class="modal-overlay" @click.self="closeRainModal">
      <div class="modal">
        <h3>{{ editingRain ? 'Editar Chuva - Dia ' + editingRain.dia : 'Registrar Chuva' }}</h3>
        <label>Dia do mês</label>
        <select v-model="formRain.day">
          <option value="">Selecione</option>
          <option v-for="d in monthDays" :key="d" :value="d">{{ d }}</option>
        </select>
        <label>Quantidade (mm)</label>
        <input type="number" step="0.1" v-model.number="formRain.mm" />
        <label>Vazão (l/s) (opcional)</label>
        <input type="number" step="0.01" v-model.number="formRain.vazao" />
        <div class="modal-actions">
          <button class="btn primary" @click="saveRain">{{ editingRain ? 'Salvar' : 'Registrar' }}</button>
          <button class="btn" @click="closeRainModal">Fechar</button>
          <button v-if="editingRain" class="btn danger" @click="deleteRain">Apagar</button>
        </div>
      </div>
    </div>

    <div v-if="showPluvList" class="modal-overlay" @click.self="closePluvList">
      <div class="modal">
        <h3>Selecionar Pluviômetro para Editar</h3>
        <div v-if="pluviometros.length === 0">
          <p>Nenhum pluviômetro cadastrado.</p>
        </div>
        <ul v-else class="pluv-list">
          <li v-for="p in pluviometros" :key="p.id" class="pluv-item">
            <div class="pluv-info">
              <strong>{{ p.nome }}</strong><br />
              <small>{{ p.descricao || 'Sem descrição' }}</small><br />
              <small>({{ p.lat }}, {{ p.lng }})</small>
            </div>
            <button class="edit-icon-btn" @click="selectPluvToEdit(p)" title="Editar Pluviômetro">
              <Pencil :size="16" />
            </button>
          </li>
        </ul>
        <div class="modal-actions">
          <button class="btn" @click="closePluvList">Fechar</button>
        </div>
      </div>
    </div>

    <div v-if="showPluvModal" class="modal-overlay" @click.self="closePluvModal">
      <div class="modal">
        <h3>{{ editingPluv ? 'Editar Pluviômetro' : 'Registrar Pluviômetro' }}</h3>
        <label>Nome</label>
        <input v-model="formPluv.nome" type="text" />
        <label>Latitude</label>
        <input v-model="formPluv.lat" type="number" step="0.000001" />
        <label>Longitude</label>
        <input v-model="formPluv.lng" type="number" step="0.000001" />
        <label>Descrição</label>
        <input v-model="formPluv.descricao" type="text" />
        <div class="modal-actions">
          <button class="btn primary" @click="savePluv">{{ editingPluv ? 'Salvar' : 'Adicionar' }}</button>
          <button class="btn" @click="closePluvModal">Fechar</button>
          <button v-if="editingPluv" class="btn danger" @click="deletePluv">Apagar</button>
        </div>
      </div>
    </div>

    <div v-if="showReports" class="modal-overlay" @click.self="closeReportsModal">
      <div class="modal large">
        <h3>Relatórios</h3>
        <div class="report-controls">
          <label>Período</label>
          <select v-model="reportPeriod">
            <option value="month">Mês</option>
            <option value="semester">Semestre</option>
            <option value="year">Ano</option>
          </select>
          <button class="btn" @click="renderCharts">Gerar</button>
        </div>
        <div class="charts">
          <div class="chart-card">
            <h4>Acumulado</h4>
            <div class="chart-wrapper"><canvas ref="accCanvas"></canvas></div>
          </div>
          <div class="chart-card">
            <h4>Comparativo por Pluviômetro</h4>
            <div class="chart-wrapper"><canvas ref="compCanvas"></canvas></div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="closeReportsModal">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ------------------------------------------------------------------------- */
/* IMPORTS E SETUP                               */
/* ------------------------------------------------------------------------- */
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
// @ts-ignore
import L from 'leaflet'
import { useThemeStore } from '../stores/theme' // Importação do Pinia Store
import { ChevronLeft, ChevronRight, Sun, Moon, BarChart3, Pencil } from 'lucide-vue-next'

/* --- CORREÇÃO DE ÍCONE DO LEAFLET EM AMBIENTES VITE --- */
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
// @ts-ignore
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"></svg>',
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"></svg>',
  shadowUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"></svg>',
});
/* -------------------------------------------------------- */


/* ------------------------------------------------------------------------- */
/* PINIA STORE INICIALIZAÇÃO                               */
/* ------------------------------------------------------------------------- */
const themeStore = useThemeStore() // Inicializa o store


/* ------------------------------------------------------------------------- */
/* TYPES E STORAGE */
/* ------------------------------------------------------------------------- */
type Rain = {
  id: string
  dia: number
  mes: number
  ano: number
  mm: number
  vazao: number
  pluvId?: string | null
}
type Pluv = {
  id: string
  nome: string
  lat: number
  lng: number
  descricao?: string
}

const rainRecords = ref<Rain[]>(
  JSON.parse(localStorage.getItem('rainRecords') || '[]')
)
const pluviometros = ref<Pluv[]>(
  JSON.parse(localStorage.getItem('pluviometros') || '[]')
)

watch([rainRecords, pluviometros], () => {
  localStorage.setItem('rainRecords', JSON.stringify(rainRecords.value))
  localStorage.setItem('pluviometros', JSON.stringify(pluviometros.value))
}, { deep: true })


/* ------------------------------------------------------------------------- */
/* CALENDAR, STATS, MODALS, MAP, REPORTS */
/* ------------------------------------------------------------------------- */
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const currentDate = ref(new Date())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())

function changeMonth(delta: number) {
  currentDate.value = new Date(currentYear.value, currentMonth.value + delta, 1)
}

const monthDays = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate())

const calendarCells = computed(() => {
  const firstDow = new Date(currentYear.value, currentMonth.value, 1).getDay()
  const total = monthDays.value
  const cells: { key: string; day: number | null }[] = []
  for (let i = 0; i < firstDow; i++) cells.push({ key: `b${i}`, day: null })
  for (let d = 1; d <= total; d++) cells.push({ key: `d${d}`, day: d })
  while (cells.length % 7 !== 0) cells.push({ key: `t${cells.length}`, day: null })
  return cells
})

function isToday(day: number | null) {
  if (!day) return false
  const now = new Date()
  return now.getDate() === day && now.getMonth() === currentMonth.value && now.getFullYear() === currentYear.value
}

function hasRain(day: number | null) {
  if (!day) return false
  return rainRecords.value.some(r => r.dia === day && r.mes === currentMonth.value && r.ano === currentYear.value)
}

function getRecord(day: number | null) {
  if (!day) return null
  return rainRecords.value.find(r => r.dia === day && r.mes === currentMonth.value && r.ano === currentYear.value)
}

function onCellClick(day: number | null) {
  if (!day) return
  const clicked = new Date(currentYear.value, currentMonth.value, day)
  if (clicked > new Date()) {
    alert('Não é possível registrar chuva em datas futuras');
    return
  }
  const rec = getRecord(day)
  if (rec) openEditRecordModal(rec)
  else openNewRecordModal(day)
}

const countThisMonth = computed(() => rainRecords.value.filter(r => r.mes === currentMonth.value && r.ano === currentYear.value).length)
const estimatedHours = computed(() => countThisMonth.value * 2)

const showRainModal = ref(false)
const editingRain = ref<Rain | null>(null)
const formRain = reactive<{ day: number | string; mm: number | string; vazao: number | string }>({ day: '', mm: '', vazao: '' })

function openNewRecordModal(day?: number | null) {
  if (day) {
    const clicked = new Date(currentYear.value, currentMonth.value, day)
    if (clicked > new Date()) {
      alert('Não é possível registrar chuva em datas futuras');
      return
    }
    formRain.day = day
  } else formRain.day = ''
  formRain.mm = ''; formRain.vazao = ''
  editingRain.value = null
  showRainModal.value = true
}

function openEditRecordModal(r: Rain) {
  editingRain.value = r
  formRain.day = r.dia; formRain.mm = r.mm; formRain.vazao = r.vazao
  showRainModal.value = true
}

function closeRainModal() {
  showRainModal.value = false; editingRain.value = null; formRain.day = ''; formRain.mm = ''; formRain.vazao = ''
}

function saveRain() {
  if (formRain.day === '' || formRain.mm === '') {
    alert('Preencha dia e quantidade');
    return
  }
  const d = Number(formRain.day)
  const dateClicked = new Date(currentYear.value, currentMonth.value, d)
  if (dateClicked > new Date()) {
    alert('Não é possível registrar chuva em datas futuras');
    return
  }
  const base = {
    dia: d,
    mes: currentMonth.value,
    ano: currentYear.value,
    mm: Number(formRain.mm),
    vazao: Number(formRain.vazao || 0)
  }
  if (editingRain.value) Object.assign(editingRain.value, base)
  else {
    if (rainRecords.value.some(r => r.dia === d && r.mes === currentMonth.value && r.ano === currentYear.value)) {
      alert('Já existe registro para esse dia');
      return
    }
    const pluvId = pluviometros.value.length > 0 ? pluviometros.value[0].id : null
    rainRecords.value.push({ id: String(Date.now() + Math.random()), ...base, pluvId: pluvId })
  }
  closeRainModal()
}

function deleteRain() {
  if (!editingRain.value) return
  rainRecords.value = rainRecords.value.filter(r => r.id !== editingRain.value!.id)
  closeRainModal()
}

const showPluvModal = ref(false)
const editingPluv = ref<Pluv | null>(null)
const formPluv = reactive<{ nome: string; lat: number | string; lng: number | string; descricao: string }>({ nome: '', lat: '', lng: '', descricao: '' })

function openNewPluvModal(prefill?: { lat: number, lng: number }) {
  editingPluv.value = null
  formPluv.nome = ''; formPluv.descricao = '';
  formPluv.lat = prefill ? prefill.lat : '';
  formPluv.lng = prefill ? prefill.lng : ''
  showPluvModal.value = true
}

function openEditPluvModal(p: Pluv) {
  editingPluv.value = p;
  formPluv.nome = p.nome;
  formPluv.lat = p.lat;
  formPluv.lng = p.lng;
  formPluv.descricao = p.descricao || '';
  showPluvModal.value = true
}

function closePluvModal() {
  showPluvModal.value = false;
  editingPluv.value = null;
  formPluv.nome = '';
  formPluv.lat = '';
  formPluv.lng = '';
  formPluv.descricao = ''
}

function savePluv() {
  if (!formPluv.nome || formPluv.lat === '' || formPluv.lng === '') {
    alert('Preencha todos os campos');
    return
  }
  const newP: Pluv = editingPluv.value
    ? {
      ...editingPluv.value,
      nome: formPluv.nome,
      lat: Number(formPluv.lat),
      lng: Number(formPluv.lng),
      descricao: formPluv.descricao
    }
    : {
      id: String(Date.now() + Math.random()),
      nome: formPluv.nome,
      lat: Number(formPluv.lat),
      lng: Number(formPluv.lng),
      descricao: formPluv.descricao
    }

  if (editingPluv.value) {
    const idx = pluviometros.value.findIndex(x => x.id === editingPluv.value!.id)
    if (idx >= 0) pluviometros.value[idx] = newP
  } else pluviometros.value.push(newP)

  closePluvModal()
  refreshMarkers()
}

function deletePluv() {
  if (!editingPluv.value) return;
  const deletedId = editingPluv.value!.id
  pluviometros.value = pluviometros.value.filter(p => p.id !== deletedId);
  rainRecords.value = rainRecords.value.map(r => r.pluvId === deletedId ? { ...r, pluvId: null } : r)
  closePluvModal();
  refreshMarkers()
}

const showPluvList = ref(false);

function openEditPluvList() {
  showPluvList.value = true;
}

function closePluvList() {
  showPluvList.value = false;
}

// Essa função é chamada pelo ícone de caneta
function selectPluvToEdit(p: Pluv) {
  closePluvList();
  nextTick(() => {
    openEditPluvModal(p);
  })
}

const mapEl = ref<HTMLDivElement | null>(null)
// @ts-ignore
let map: L.Map | null = null
// @ts-ignore
let markersLayer: L.LayerGroup | null = null

function initMap() {
  if (!mapEl.value) return
  
  if (map) {
    map.remove()
    map = null
  }

  // @ts-ignore
  map = L.map(mapEl.value).setView([-22.5128, -44.0006], 14)

  // @ts-ignore
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)
  
  // @ts-ignore
  markersLayer = L.layerGroup().addTo(map)

  map.on('click', (e: L.LeafletMouseEvent) => {
    const lat = Number(e.latlng.lat.toFixed(6));
    const lng = Number(e.latlng.lng.toFixed(6))
    openNewPluvModal({ lat, lng })
  })
  
  refreshMarkers()
}

function refreshMarkers() {
  if (!map || !markersLayer) return;

  markersLayer.clearLayers();
  
  // @ts-ignore
  const icon = L.divIcon({
    html: '<div class="pluv-icon"></div>',
    className: 'pluv-marker-wrapper',
    iconSize: [18, 18],
    iconAnchor: [9, 18],
  });

  pluviometros.value.forEach((p) => {
    // @ts-ignore
    const m = L.marker([p.lat, p.lng], { icon }).addTo(markersLayer!);
    m.bindPopup(`<b>${p.nome}</b><br>${p.descricao || ''}`);
  });
}

const showReports = ref(false) // Variável reativa para o botão funcionar
const reportPeriod = ref<'month' | 'semester' | 'year'>('month')
const accCanvas = ref<HTMLCanvasElement | null>(null)
const compCanvas = ref<HTMLCanvasElement | null>(null)
let accChart: Chart | null = null
let compChart: Chart | null = null

function openReportsModal() {
  showReports.value = true
  nextTick(() => {
    setTimeout(() => {
      if (!accChart && !compChart) renderCharts()
    }, 60)
  })
}

function closeReportsModal() {
  showReports.value = false
  if (accChart) { accChart.destroy(); accChart = null }
  if (compChart) { compChart.destroy(); compChart = null }
}

function accumulateData(period: 'month' | 'semester' | 'year') {
  if (period === 'month') {
    const days = Array.from({ length: monthDays.value }, (_, i) => i + 1)
    const vals = days.map(d => {
      const rec = rainRecords.value.find(r => r.dia === d && r.mes === currentMonth.value && r.ano === currentYear.value)
      return rec ? rec.mm : 0
    })
    return { labels: days.map(String), values: vals }
  }
  if (period === 'semester') {
    const y = currentYear.value;
    const m = currentMonth.value;
    const start = m < 6 ? 0 : 6
    const monthsRange = Array.from({ length: 6 }, (_, i) => start + i)
    const vals = monthsRange.map(mi => rainRecords.value.filter(r => r.mes === mi && r.ano === y).reduce((s, x) => s + x.mm, 0))
    return { labels: monthsRange.map(i => months[i]), values: vals }
  }
  const vals = months.map((_, mi) => rainRecords.value.filter(r => r.mes === mi && r.ano === currentYear.value).reduce((s, x) => s + x.mm, 0))
  return { labels: months, values: vals }
}

function compareData(period: 'month' | 'semester' | 'year') {
  const labels = pluviometros.value.map(p => p.nome || p.id)
  const values = pluviometros.value.map(p => {
    if (period === 'month') return rainRecords.value.filter(r => r.pluvId === p.id && r.mes === currentMonth.value && r.ano === currentYear.value).reduce((s, x) => s + x.mm, 0)
    if (period === 'semester') {
      const start = currentMonth.value < 6 ? 0 : 6;
      const monthsRange = Array.from({ length: 6 }, (_, i) => start + i);
      return rainRecords.value.filter(r => r.pluvId === p.id && r.ano === currentYear.value && monthsRange.includes(r.mes)).reduce((s, x) => s + x.mm, 0)
    }
    return rainRecords.value.filter(r => r.pluvId === p.id && r.ano === currentYear.value).reduce((s, x) => s + x.mm, 0)
  })
  return { labels, values }
}

function renderCharts() {
  const acc = accumulateData(reportPeriod.value)
  const comp = compareData(reportPeriod.value)

  if (accChart) { accChart.destroy(); accChart = null }
  if (compChart) { compChart.destroy(); compChart = null }

  if (accCanvas.value) {
    accCanvas.value.parentElement!.style.height = '220px'
    accChart = new Chart(accCanvas.value.getContext('2d') as CanvasRenderingContext2D, {
      type: 'bar',
      data: {
        labels: acc.labels,
        datasets: [{
          label: 'mm de chuva',
          data: acc.values,
          backgroundColor: '#6fbfff'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    })
  }
  if (compCanvas.value) {
    compCanvas.value.parentElement!.style.height = '220px'
    compChart = new Chart(compCanvas.value.getContext('2d') as CanvasRenderingContext2D, {
      type: 'pie',
      data: {
        labels: comp.labels,
        datasets: [{
          data: comp.values,
          backgroundColor: comp.labels.map((_, i) => `hsl(${(i * 60) % 360} 70% 60%)`)
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    })
  }
}

/* ------------------------------------------------------------------------- */
/* LIFECYCLE */
/* ------------------------------------------------------------------------- */
onMounted(() => {
  initMap()
})

watch(pluviometros, () => {
  nextTick(() => {
    refreshMarkers()
  })
}, { deep: true })
</script>

<style scoped>
/* --- IMPORTANTE: GARANTE QUE OS ESTILOS DO MAPA LEAFLET SEJAM CARREGADOS --- */
@import 'leaflet/dist/leaflet.css';
/* -------------------------------------------------------------------------- */

/* --- variáveis / base --- */
.tela-root {
  min-height: 100vh;
  font-family: Inter, Arial, sans-serif;
  background: #222;
  color: #fff;
  transition: background 0.3s, color 0.3s; 
}

.tela-root.light {
  background: #f1f3f5;
  color: #111;
}

/* topbar */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 36px;
}

.brand {
  font-size: 44px;
  font-weight: 800;
  margin: 0;
}

.top-controls {
  display: flex;
  gap: 14px;
  align-items: center;
}

.icon {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
}

/* layout grid */
.layout {
  display: grid;
  grid-template-columns: 260px 1fr 260px;
  gap: 28px;
  padding: 10px 40px;
  align-items: start;
}

.left-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 18px;
}

.action-btn {
  background: #6fbfff;
  color: #fff;
  border: none;
  padding: 12px 26px;
  border-radius: 28px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.2);
}

/* calendar card (COM CORREÇÃO DE TAMANHO) */
.calendar-card {
  /* NOVO: Limita o tamanho máximo e centraliza o calendário na coluna do grid */
  max-width: 700px; /* Tamanho máximo para que não fique gigante */
  margin: 0 auto;  /* Centraliza o card dentro da coluna '1fr' */
  width: 100%;     /* Garante que ele utilize 100% do espaço até o max-width */
  
  /* Estilos visuais mantidos */
  background: #595959;
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
  transition: background 0.3s, box-shadow 0.3s;
}

.tela-root.light .calendar-card {
  background: #fff;
  color: #111;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.cal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  color: inherit; 
}

.month-title {
  font-weight: 800;
  font-size: 18px;
  color: inherit;
}

.nav-btn {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
}

/* CORRIGIDO: usa 1fr e gap 12px */
.weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  margin-bottom: 10px;
  color: #9cc5ea;
  font-weight: 700;
  text-align: center;
}
.tela-root.light .weekday-row {
  color: #555;
}

/* CORRIGIDO: usa 1fr */
.grid-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
}

/* A CORREÇÃO PRINCIPAL: USO DE ASPECT-RATIO */
.cell {
  aspect-ratio: 1 / 1; /* Garante que a célula seja um quadrado perfeito */
  
  background: #333; 
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  cursor: pointer;
  color: #fff; 
}

.tela-root.light .cell {
    background: #e9ecef;
    color: #111;
}

.cell.empty {
  background: transparent;
  cursor: default;
  color: transparent;
  box-shadow: none;
}

.cell.rain {
  background: #6fbfff; /* Fundo azul brilhante */
  color: #111; /* Texto preto para bom contraste no azul */
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.25);
}

.tela-root.light .cell.rain {
  background: #6fbfff; /* FORÇA o fundo azul no modo claro */
  color: #fff; /* Altera o texto para BRANCO para melhor contraste com o azul no modo claro */
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1); 
}

.cell.today {
  outline: 3px solid rgba(255, 255, 255, 0.06);
}
.tela-root.light .cell.today {
  outline: 3px solid rgba(0, 0, 0, 0.1);
}

/* right stats */
.right-stats {
  padding-top: 18px;
}

.report-btn {
  margin-top: 18px;
  background: #6fbfff;
  color: #fff;
  border: none;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
}

/* map */
.map-section {
  display: flex;
  justify-content: center;
  padding: 18px 36px 48px 36px;
}

.map-card {
  width: 70%;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 12px 14px;
  text-align: center;
  transition: background 0.3s;
}

.tela-root.light .map-card {
  background: #fff;
  border: 1px solid #eee;
  color: #111;
}

.map-title {
  font-weight: 700;
  margin-bottom: 12px;
}

.mapbox {
  height: 320px;
  border-radius: 12px;
  overflow: hidden;
}

/* marker icon */
.pluv-marker-wrapper .pluv-icon {
  width: 18px;
  height: 18px;
  background: #6fbfff;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease;
}

.tela-root.light .pluv-marker-wrapper .pluv-icon {
  border: 2px solid #111;
}

.pluv-marker-wrapper .pluv-icon:hover {
  transform: scale(1.2);
}

/* modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
}

.modal {
  background: #3a3a3a;
  color: #fff;
  padding: 18px;
  border-radius: 12px;
  min-width: 320px;
  max-width: 92%;
  transition: background 0.3s, color 0.3s;
}

.tela-root.light .modal {
  background: #fff;
  color: #111;
  border: 1px solid #eee;
}

.modal.large {
  min-width: 780px;
}

.modal label {
  display: block;
  margin-top: 8px;
  font-weight: 700
}

/* Inputs e selects - Ajuste de tema */
.tela-root select,
.tela-root input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #555;
  margin-top: 6px;
  background-color: #2b2b2b;
  color: #fff;
  transition: background 0.3s, color 0.3s;
}

.tela-root.light select,
.tela-root.light input {
  background-color: #fff;
  color: #111;
  border: 1px solid #ccc;
}
/* Garante que as opções do select fiquem legíveis */
.tela-root select option {
  background-color: #2b2b2b;
  color: #fff;
}

.tela-root.light select option {
  background-color: #fff;
  color: #111;
}

.modal-actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.btn.primary {
  background: #6fbfff;
  color: #111;
}

.btn.danger {
  background: #ff5c5c;
  color: #fff;
}

/* -------------------------------------------------------------------------- */
/* ESTILOS: LISTA DE PLUVIÔMETROS PARA EDIÇÃO (COM ÍCONE) */
/* -------------------------------------------------------------------------- */
.pluv-list {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.pluv-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: default; 
  transition: background 0.2s;
  
  /* Adaptação de cor no tema escuro */
  background: #444; 
}

/* Adaptação de cor no tema claro */
.tela-root.light .pluv-item {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
}

.pluv-info {
  flex-grow: 1; /* Permite que a informação ocupe o espaço */
}

.edit-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: background 0.2s;
  color: #6fbfff; /* Cor do seu tema principal */
}

.edit-icon-btn:hover {
  background: rgba(111, 191, 255, 0.2); /* Fundo azul claro ao passar o mouse */
}

.tela-root.light .edit-icon-btn {
  color: #111; /* Ícone escuro no modo claro, se preferir */
}

.tela-root.light .edit-icon-btn:hover {
  background: #e9ecef; 
}
/* -------------------------------------------------------------------------- */


/* charts */
.charts {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.chart-card {
  flex: 1;
  min-height: 260px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  padding: 8px;
  transition: background 0.3s;
}
</style>