<template>

  <flex class="principal" sz-screen>

    <flex class="titlebar" w-full>
      <flex class="red"></flex>
    </flex>

    <flex class="content" sz-full>
      <inline-flex>
        <p>Hello World</p>
      </inline-flex>
      <inline-flex>
        <Calendario />
      </inline-flex>
    </flex>

  </flex>
</template>

<script lang="ts" setup>

</script>

<style scoped>
flex, inline-flex {
  justify-content: space-evenly;
  place-items: center;
  overflow: hidden;
}

.principal {
  --a: w-screen h-screen gap-auto;
  place-content: start;
  flex-direction: column;
}
.titlebar {
  --a: p-5;
}

.content {
  flex-direction: row;
}

.red { 
  width: 900px;
  height: 20px;
  background: red 
}

</style>