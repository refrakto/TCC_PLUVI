<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Dropdown perfil
const showDropdown = ref(false)
function toggleDropdown() { showDropdown.value = !showDropdown.value }
function handleClickOutside(event) {
  const dropdown = document.querySelector('.profile-dropdown')
  if (dropdown && !dropdown.contains(event.target)) showDropdown.value = false
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

// Calendário
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho','Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const currentDate = ref(new Date())
function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
const daysInMonth = ref(getDaysInMonth(currentDate.value.getFullYear(), currentDate.value.getMonth()))
function prevMonth() {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1)
  daysInMonth.value = getDaysInMonth(currentDate.value.getFullYear(), currentDate.value.getMonth())
}
function nextMonth() {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1)
  daysInMonth.value = getDaysInMonth(currentDate.value.getFullYear(), currentDate.value.getMonth())
}

// Registros de chuva
const rainRecords = ref([])
const showModal = ref(false)
const editingRecord = ref(null)
const selectedDay = ref(null)
const inputChuva = ref('')
const inputVazao = ref('')

// Pluviômetros
const showPluvModal = ref(false)
const editingPluv = ref(null)
const inputNomePluv = ref('')
const inputLat = ref('')
const inputLng = ref('')
const inputDescricao = ref('')
const pluviometros = ref([])

// Inicialização
onMounted(() => {
  const savedRecords = localStorage.getItem('rainRecords')
  if (savedRecords) rainRecords.value = JSON.parse(savedRecords)

  const savedPluv = localStorage.getItem('pluviometros')
  if (savedPluv) pluviometros.value = JSON.parse(savedPluv)

  daysInMonth.value = getDaysInMonth(currentDate.value.getFullYear(), currentDate.value.getMonth())
  if (showMap.value) setTimeout(() => initMap(), 100)
})

function saveToLocalStorage() {
  localStorage.setItem('rainRecords', JSON.stringify(rainRecords.value))
  localStorage.setItem('pluviometros', JSON.stringify(pluviometros.value))
}

// Funções chuva
function openNewRecordModal() {
  editingRecord.value = null
  selectedDay.value = ''
  inputChuva.value = ''
  inputVazao.value = ''
  showModal.value = true
}
function openEditRecordModal(record) {
  editingRecord.value = record
  selectedDay.value = record.dia
  inputChuva.value = record.chuva
  inputVazao.value = record.vazao
  showModal.value = true
}
function saveRecord() {
  if (!selectedDay.value || inputChuva.value === '' || inputVazao.value === '') {
    alert('Preencha todos os campos!')
    return
  }
  if (editingRecord.value) {
    editingRecord.value.chuva = parseFloat(inputChuva.value)
    editingRecord.value.vazao = parseFloat(inputVazao.value)
  } else {
    if (rainRecords.value.some(r => r.dia === selectedDay.value)) {
      alert('Já existe registro para esse dia!')
      return
    }
    rainRecords.value.push({ dia: selectedDay.value, chuva: parseFloat(inputChuva.value), vazao: parseFloat(inputVazao.value) })
  }
  saveToLocalStorage()
  showModal.value = false
}
function deleteRecord() {
  if (editingRecord.value) {
    rainRecords.value = rainRecords.value.filter(r => r !== editingRecord.value)
    saveToLocalStorage()
    showModal.value = false
  }
}
function hasRain(day) { return rainRecords.value.some(r => r.dia === day) }
function getRecord(day) { return rainRecords.value.find(r => r.dia === day) }

// Funções pluviômetros
function openNewPluvModal() {
  editingPluv.value = null
  inputNomePluv.value = ''
  inputLat.value = ''
  inputLng.value = ''
  inputDescricao.value = ''
  showPluvModal.value = true
}
function openEditPluvModal(pluv) {
  editingPluv.value = pluv
  inputNomePluv.value = pluv.nome
  inputLat.value = pluv.lat
  inputLng.value = pluv.lng
  inputDescricao.value = pluv.descricao
  showPluvModal.value = true
}
function savePluv() {
  if (!inputNomePluv.value || inputLat.value === '' || inputLng.value === '') {
    alert('Preencha todos os campos do pluviômetro!')
    return
  }
  const newPluv = {
    nome: inputNomePluv.value,
    lat: parseFloat(inputLat.value),
    lng: parseFloat(inputLng.value),
    descricao: inputDescricao.value
  }
  if (editingPluv.value) Object.assign(editingPluv.value, newPluv)
  else pluviometros.value.push(newPluv)
  saveToLocalStorage()
  showPluvModal.value = false
  if (showMap.value) setTimeout(() => initMap(), 100)
}
function deletePluv() {
  if (editingPluv.value) {
    pluviometros.value = pluviometros.value.filter(p => p !== editingPluv.value)
    saveToLocalStorage()
    showPluvModal.value = false
    if (showMap.value) setTimeout(() => initMap(), 100)
  }
}

// Mapa
const showMap = ref(false)
function initMap() {
  const map = L.map('map').setView([-22.5128, -44.0006], 17)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map)
  pluviometros.value.forEach(p => {
    L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup(`<b>${p.nome}</b><br>${p.descricao}`)
  })
}
function toggleMap() {
  showMap.value = !showMap.value
  if (showMap.value) setTimeout(() => initMap(), 100)
}
</script>

<template>
  <div class="topbar">
    <h1 class="title">SIMP IFRJ</h1>
    <div class="profile-dropdown">
      <button class="profile-button" @click="toggleDropdown">Meu Perfil</button>
      <div v-if="showDropdown" class="dropdown-menu">
        <ul>
          <li><a href="#">Configurações</a></li>
          <li><a href="#">Sair</a></li>
        </ul>
      </div>
    </div>
  </div>

  <div class="main-content">
    <div class="sidebar">
      <p>{{ rainRecords.length }} chuvas registradas no mês.</p>
      <p>Total estimado de horas de chuva: {{ rainRecords.length * 2 }} horas</p>
      <p>Pluviômetros cadastrados: {{ pluviometros.length }}</p>
      <div class="buttons">
        <button class="btn-green" @click="openNewRecordModal">Registrar Chuva</button>
        <button class="btn-green" @click="openNewPluvModal">Adicionar Pluviômetro</button>
        <button class="btn-green" @click="toggleMap">{{ showMap ? 'Ver Calendário' : 'Ver Mapa' }}</button>
      </div>
    </div>

    <div v-if="!showMap" class="calendar-section">
      <div class="calendar-header">
        <button @click="prevMonth">&lt;</button>
        <h2>{{ currentDate.getFullYear() }}, {{ months[currentDate.getMonth()] }}</h2>
        <button @click="nextMonth">&gt;</button>
      </div>
      <div class="calendar">
        <div
          v-for="day in daysInMonth"
          :key="day"
          class="day"
          :class="{ rain: hasRain(day) }"
          @click="hasRain(day) ? openEditRecordModal(getRecord(day)) : null"
        >
          {{ day }}
          <div v-if="hasRain(day)" class="rain-indicator"></div>
        </div>
      </div>
    </div>

    <!-- Mapa + Tabela -->
    <div v-else class="map-pluv-wrapper">
      <div id="map" class="map"></div>
      <div class="pluv-table">
        <h3>Pluviômetros</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p,index) in pluviometros" :key="p.nome" :class="{ 'even-row': index % 2 === 0 }">
              <td>{{ p.nome }}</td>
              <td>{{ p.descricao }}</td>
              <td>{{ p.lat }}</td>
              <td>{{ p.lng }}</td>
              <td>
                <button class="btn-small" @click="openEditPluvModal(p)">Editar</button>
                <button class="btn-delete-small" @click="deletePluv(p)">Apagar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal Chuva -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <h3 v-if="!editingRecord">Registrar Chuva</h3>
      <h3 v-else>Editar Chuva - Dia {{ editingRecord.dia }}</h3>
      <div class="modal-body">
        <label>Dia do mês:</label>
        <select v-model="selectedDay">
          <option disabled value="">Selecione</option>
          <option v-for="d in daysInMonth" :key="d" :value="d">{{ d }}</option>
        </select>
        <label>Quantidade de chuva (mm):</label>
        <input type="number" min="0" step="0.1" v-model="inputChuva" />
        <label>Vazão do corpo hídrico (l/s):</label>
        <input type="number" min="0" step="0.01" v-model="inputVazao" />
      </div>
      <div class="modal-actions">
        <button class="btn-green" @click="saveRecord">{{ editingRecord ? 'Salvar Alterações' : 'Registrar' }}</button>
        <button class="btn-gray" @click="showModal = false">Cancelar</button>
        <button v-if="editingRecord" class="btn-delete" @click="deleteRecord">Apagar Registro</button>
      </div>
    </div>
  </div>

  <!-- Modal Pluviômetro -->
  <div v-if="showPluvModal" class="modal-overlay">
    <div class="modal">
      <h3 v-if="!editingPluv">Adicionar Pluviômetro</h3>
      <h3 v-else>Editar Pluviômetro - {{ editingPluv.nome }}</h3>
      <div class="modal-body">
        <label>Nome:</label>
        <input type="text" v-model="inputNomePluv" />
        <label>Latitude:</label>
        <input type="number" step="0.0001" v-model="inputLat" />
        <label>Longitude:</label>
        <input type="number" step="0.0001" v-model="inputLng" />
        <label>Descrição:</label>
        <input type="text" v-model="inputDescricao" />
      </div>
      <div class="modal-actions">
        <button class="btn-green" @click="savePluv">{{ editingPluv ? 'Salvar Alterações' : 'Adicionar' }}</button>
        <button class="btn-gray" @click="showPluvModal = false">Cancelar</button>
        <button v-if="editingPluv" class="btn-delete" @click="deletePluv">Apagar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content { display:flex; flex-direction:row; justify-content:flex-start; padding:110px 30px 40px 30px; gap:30px; flex-wrap:wrap; font-family:Arial,sans-serif; }
.sidebar { width:38%; min-width:250px; }
.sidebar p { font-size:18px; margin-bottom:12px; }
.buttons { margin-top:20px; display:flex; flex-direction:column; gap:12px; }

.btn-green { background-color:#6fff78; border:none; border-radius:20px; padding:10px 22px; font-weight:bold; cursor:pointer; transition:.2s; }
.btn-green:hover { filter:brightness(0.9); }
.btn-gray { background-color:#d9d9d9; border:none; border-radius:20px; padding:10px 22px; font-weight:bold; cursor:not-allowed; }
.btn-delete { background-color:#ff4c4c; border:none; border-radius:20px; padding:10px 22px; font-weight:bold; cursor:pointer; color:white; margin-left:auto; transition:.2s; }
.btn-delete:hover { filter:brightness(0.8); }

.btn-small { padding:4px 8px; font-size:12px; border-radius:6px; margin-right:4px; }
.btn-delete-small { padding:4px 8px; font-size:12px; border-radius:6px; background-color:#ff4c4c; color:white; border:none; cursor:pointer; }
.btn-delete-small:hover { filter:brightness(0.8); }

.calendar-section { min-width:280px; max-width:480px; background-color:#f5f5f5; padding:20px 24px; border-radius:20px; display:flex; flex-direction:column; align-items:center; margin:0 auto; }
.calendar-header { display:flex; justify-content:center; align-items:center; gap:16px; margin-bottom:20px; width:100%; }
.calendar { display:grid; grid-template-columns:repeat(7,52px); gap:10px; width:424px; }
.day { width:52px; height:52px; background-color:#d9d9d9; display:flex; justify-content:center; align-items:center; border-radius:14px; font-weight:bold; cursor:pointer; position:relative; font-size:17px; }
.day.rain { background-color:#6fbfff; }
.rain-indicator { position:absolute; bottom:7px; width:14px; height:14px; background-color:#0047ab; border-radius:50%; }

.topbar { width:100%; position:fixed; top:0; left:0; padding:.5rem 1.5rem; background-color:white; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; z-index:10; border-bottom:1px solid #ccc; }
.topbar h1 { font-size:28px; font-weight:bold; }
.profile-button { background-color:#6fff78; border:none; padding:8px 18px; border-radius:20px; font-weight:bold; cursor:pointer; }

.modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,.4); display:flex; justify-content:center; align-items:center; z-index:2000; }
.modal { background-color:white; padding:24px 30px; border-radius:12px; max-width:420px; width:90%; box-shadow:0 8px 20px rgba(0,0,0,.15); }
.modal-body { margin-top:15px; display:flex; flex-direction:column; gap:14px; }
.modal-body label { font-weight:bold; }
.modal-body input, .modal-body select { padding:8px 12px; font-size:16px; border-radius:8px; border:1px solid #ccc; width:100%; }
.modal-actions { margin-top:20px; display:flex; justify-content:flex-end; gap:15px; }

.map-pluv-wrapper { display:flex; gap:20px; width:100%; flex-wrap:wrap; }
.map { flex:2; min-height:400px; border-radius:10px; }
.pluv-table { flex:1; overflow-x:auto; max-height:400px; }
.pluv-table table { width:100%; border-collapse:collapse; }
.pluv-table th, .pluv-table td { border:1px solid #ccc; padding:8px; text-align:left; }
.pluv-table th { background-color:#f0f0f0; }
.pluv-table tr.even-row { background-color:#f9f9f9; }
.pluv-table h3 { text-align:center; margin-bottom:10px; }

@media (max-width:768px) {
  .main-content { flex-direction:column; padding:120px 20px 20px 20px; }
  .sidebar { width:100%; }
  .calendar-section { width:100%; margin-top:20px; }
  .calendar { grid-template-columns:repeat(7,1fr); gap:6px; justify-content:center; }
  .map-pluv-wrapper { flex-direction:column; }
  .map { width:100%; min-height:300px; }
  .pluv-table { width:100%; max-height:none; margin-top:20px; }
  .topbar { padding:.5rem 1rem; }
}
</style>
