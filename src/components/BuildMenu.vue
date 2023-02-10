<template>
  <div class="grow overflow-y-auto bg-sky-900">
    <div class="grid grid-cols-2 text-center">
      <div
        class="flex aspect-square cursor-pointer items-center justify-center bg-sky-900 bg-cover"
        :style="{
          backgroundImage: 'url(artwork/base2.jpeg)',
        }"
      >
        <div
          class="grow animate-pulse bg-gray-50 bg-opacity-30 text-2xl font-bold text-white"
        >
          Deploy Base
        </div>
      </div>
      <div
        class="flex aspect-square items-center justify-center bg-sky-700 text-3xl font-bold text-sky-600"
      >
        ?
      </div>
    </div>
  </div>
</template>
