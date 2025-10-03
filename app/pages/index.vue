<style lang="sass" scoped>
flex, inline-flex
  --a: overflow-hidden;
  &, div
    --a: justify-evenly place-items-center;

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

    <div size-full flex="~ col-reverse lg:row" overflow-y-auto>
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

