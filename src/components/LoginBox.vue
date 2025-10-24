<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// Função que navega para a rota da Tela Principal: /inicial
function enterAsGuest() {
  router.push('/inicial') 
}

function handleLogin() {
    // AQUI vai a sua lógica de autenticação de usuário e senha (back-end)
    console.log("Tentativa de Login...");
    // Se for bem-sucedido, chame: router.push('/inicial')
}
</script>

<template>
  <div class="login-container">
    <h2>Acesso ao Sistema</h2>
    <form @submit.prevent="handleLogin">
        <input type="text" placeholder="Usuário" class="input-field" />
        <input type="password" placeholder="Senha" class="input-field" />
        
        <button type="submit" class="btn primary">Entrar</button>
    </form>
    
    <div class="separator">ou</div>
    
    <button @click="enterAsGuest" class="btn guest-btn">
      Entrar como Visitante
    </button>
  </div>
</template>

<style scoped>
/* Estilos para o Card de Login (Modo Escuro Padrão) */
.login-container {
  background: #3a3a3a;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  color: #fff;
  min-width: 300px;
  transition: background 0.3s, color 0.3s;
}

h2 {
    margin-bottom: 20px;
}

.input-field {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #555;
    border-radius: 6px;
    background: #2b2b2b; /* Fundo escuro para inputs */
    color: #fff;
    transition: background 0.3s, color 0.3s, border-color 0.3s;
}

.btn {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
}

.btn.primary {
    background: #6fbfff;
    color: #111;
    margin-bottom: 15px;
}

.guest-btn {
    background: #595959; /* Fundo escuro para o botão visitante */
    color: #fff;
    transition: background 0.3s, color 0.3s;
}

.guest-btn:hover {
    background: #4a4a4a;
}

.separator {
    text-align: center;
    margin: 15px 0;
    color: #aaa;
    transition: color 0.3s;
}
</style>