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
  --radius-xs: 0.125rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-4xl: 2rem;

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