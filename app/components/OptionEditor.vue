<script setup lang="ts">
  import { ref } from 'vue';

  interface OptionEditorProps {
    type: 'TEXT' | 'DATE';
  }

  defineProps<OptionEditorProps>();

  // 옵션 목록 상태 관리
  const options = ref([
    {
      text: '', // TEXT 타입일 때 사용할 값
      date: null, // DATE 타입일 때 사용할 날짜 값
      time: null, // DATE 타입일 때 사용할 시간 값
    },
  ]);
</script>

<template>
  <UCard
    class="gap-2 divide-y-0 rounded-2xl bg-white/3 shadow-md shadow-black hover:shadow-lg"
    :ui="{
      header: 'p-0 pt-4',
      body: '',
    }"
  >
    <template #header>
      <!-- Poll Options Header -->
      <div class="flex flex-row items-center justify-between">
        <h3 class="text-base font-bold text-cyan-400">Poll Options</h3>

        <!-- Add Option Button -->
        <UButton
          variant="ghost"
          class="text-secondary"
          size="sm"
          @click="options.push({ text: '', date: null, time: null })"
        >
          <UIcon name="i-lucide-circle-plus" class="size-4" />
          <span>Add Option</span>
        </UButton>
      </div>
    </template>
    <template #default>
      <!-- Poll Options List -->
      <UFormField
        class="w-full"
        label="Options"
        name="options"
        :ui="{
          wrapper: 'w-full',
          label: 'hidden',
        }"
      >
        <div class="flex flex-col gap-2">
          <div
            v-for="(option, index) in options"
            :key="index"
            class="flex flex-row items-center gap-2"
          >
            <span class="w-6 text-sm font-bold text-cyan-400">{{
              String(index + 1).padStart(2, '0')
            }}</span>

            <!-- TEXT와 DATE에 따른 입력 필드 -->
            <UInput
              v-if="type === 'TEXT'"
              v-model="option.text"
              placeholder="Enter option text"
              class="w-full"
              :ui="{ base: 'text-base md:text-base p-2 bg-black' }"
            />
            <div v-else-if="type === 'DATE'" class="flex w-full flex-row gap-2">
              <!-- Date -->
              <UInputDate
                v-model="option.date"
                class="flex-1"
                :ui="{ base: 'text-base md:text-base p-2 bg-black' }"
              >
                <template #trailing>
                  <!-- DatePicker -->
                  <UPopover>
                    <UButton
                      color="neutral"
                      variant="link"
                      size="sm"
                      icon="i-lucide-calendar"
                      aria-label="Select a date"
                      class="pointer-events-auto px-0"
                    />
                    <template #content>
                      <UCalendar v-model="option.date" class="p-2" />
                    </template>
                  </UPopover>
                </template>
              </UInputDate>

              <UInputTime
                v-model="option.time"
                class="flex-1"
                :ui="{ base: 'text-base md:text-base p-2 bg-black' }"
              />
            </div>
            <UButton
              variant="ghost"
              class="hover:bg-red-700/30"
              :ui="{ base: 'size-8 p-0 flex items-center justify-center' }"
              :disabled="options.length === 1"
              @click="options.splice(index, 1)"
            >
              <UIcon name="i-lucide-trash" class="size-4 bg-red-500" />
            </UButton>
          </div>
        </div>
      </UFormField>
    </template>
  </UCard>
</template>
