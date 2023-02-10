<template>
  <div class="grow overflow-y-auto bg-sky-900">
    <div class="grid grid-cols-2 text-center">
      <div
        class="aspect-square bg-sky-900 flex items-center justify-center bg-cover cursor-pointer"
        :style="{
          backgroundImage: 'url(artwork/base2.jpeg)',
        }"
      >
        <div class="animate-pulse text-2xl font-bold bg-gray-50 bg-opacity-30 text-white grow">
          Deploy Base
        </div>
      </div>
      <div class="aspect-square bg-sky-700 flex items-center justify-center font-bold text-sky-600 text-3xl">
        ?
      </div>
    </div>
  </div>
</template>
