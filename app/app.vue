<template>
  <NuxtPage />
</template>

<style>
@font-face {
  font-family: 'Inter';
  src: url('assets/font/Inter-Variable.ttf') format('truetype-variations');
  font-weight: 100 900;
}
:root {
  --font-sans: 'Inter', ui-sans-serif, -apple-system, system-ui;

  font-feature-settings: 
    "case" 1,
    "ss03" 1,
    "cv05" 1,
    "cv06" 1,
    "cv11" 1;
}

html, body {
  --a: 'p-0 m-0';
}

</style>