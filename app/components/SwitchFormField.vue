<script setup lang="ts">
  const modelValue = defineModel<boolean>();

  interface SwitchFormFieldProps {
    label: string;
    description: string;
    name: string;
  }

  defineProps<SwitchFormFieldProps>();
</script>

<template>
  <UCard
    class="has-data-[state=checked]:border-primary border border-black bg-black"
    :ui="{ body: 'sm:p-2 sm:py-4' }"
  >
    <UFormField
      class="flex w-full"
      :label="label"
      :name="name"
      :ui="{
        wrapper: 'hidden',
        container: 'w-full',
      }"
    >
      <USwitch
        v-model="modelValue"
        :label="label"
        :description="description"
        :ui="{
          label: 'cursor-pointer after:absolute after:inset-0',
        }"
        class="flex w-full flex-row-reverse items-center justify-between"
      />
    </UFormField>
  </UCard>
</template>
