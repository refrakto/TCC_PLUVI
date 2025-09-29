<style lang="sass" scoped>
div, flex, inline-flex
  --a: justify-evenly place-items-center overflow-hidden;

.principal
  --a: flex-col sz-screen gap-auto place-content-start;

.red
  width: 900px;
  height: 20px;
  background: red;
</style>

<template>
  <flex class="principal">

    <flex w-full p-5>
      <flex class="red"></flex>
    </flex>

    <div sz-full flex="~ col-reverse lg:row">
      <inline-flex>
        <p>Hello World</p>
      </inline-flex>
      <inline-flex>
        <Calendario />
      </inline-flex>
    </div>

  </flex>
</template>

<script lang="ts" setup>
</script>

