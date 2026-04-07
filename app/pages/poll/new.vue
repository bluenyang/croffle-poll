<script setup lang="ts">
  import SwitchFormField from '~/components/SwitchFormField.vue';
</script>

<template>
  <div class="flex flex-col">
    <!-- 페이지 헤더 -->
    <h1 class="mb-2 text-base font-bold text-cyan-500">Draft Phase</h1>
    <h2 class="text-3xl font-bold">Create New Poll</h2>
    <p class="text-muted mt-2">
      Create a new poll by filling out the form below. You can add multiple options and set the poll
      duration. Once you're done, click "Create Poll" to publish it.
    </p>
    <!-- 작섣 폼 -->
    <UForm class="my-8">
      <!-- 폼 레이아웃 - 좌우 분리 -->
      <div class="mt-4 flex w-full flex-row gap-8">
        <!-- 폼 입력 영역 -->
        <div class="flex flex-2 flex-col gap-4">
          <!-- 타이틀 및 설명 -->
          <UCard class="rounded-2xl bg-white/3 p-4 shadow-md shadow-black hover:shadow-lg">
            <div class="flex flex-col gap-8">
              <UFormField
                label="Title"
                name="title"
                :ui="{
                  label: 'text-cyan-400 font-bold text-base',
                }"
              >
                <UInput
                  placeholder="Enter poll title"
                  class="w-full"
                  :ui="{ base: 'text-base md:text-base p-2 bg-black' }"
                />
              </UFormField>
              <UFormField
                label="Description"
                name="description"
                :ui="{
                  label: 'text-cyan-400 font-bold text-base',
                }"
              >
                <UTextarea
                  placeholder="Enter poll description"
                  :rows="5"
                  class="w-full"
                  :ui="{ base: 'text-base md:text-base p-2 bg-black' }"
                />
              </UFormField>
            </div>
          </UCard>
          <!-- Poll 옵션의 타입 선택기 -->
          <IconRadioGroup />
        </div>
        <!-- 우측 -->
        <div class="flex-1">
          <!-- Poll 옵션. Sticky -->
          <div class="sticky top-20 flex flex-col gap-8">
            <UCard
              class="divide-gray-700 rounded-2xl bg-white/3 shadow-md shadow-black hover:shadow-lg"
            >
              <!-- 옵션 카드 헤더 -->
              <template #header>
                <h3 class="text-lg font-bold text-cyan-400">Poll Options</h3>
              </template>
              <template #default>
                <div class="flex flex-col gap-2">
                  <!-- 스위치 형태 -->
                  <SwitchFormField
                    label="Allow Multiple Selections"
                    name="isMultipleChoice"
                    description="Allow voters to select multiple options when voting"
                  />
                  <SwitchFormField
                    label="Multiple Choice"
                    name="isMultipleChoice"
                    description="Allow voters to select multiple options"
                  />
                  <SwitchFormField
                    label="Allow Custom Options"
                    name="allowCustomOptions"
                    description="Allow voters to add their own options when voting"
                  />
                </div>
              </template>
            </UCard>

            <!-- 생성버튼 -->
            <div class="group relative inline-block cursor-pointer">
              <!-- hover 그림자 -->
              <div
                class="to-primary-500 absolute -inset-1 rounded-lg bg-linear-to-r from-cyan-400 opacity-0 blur transition duration-300 group-hover:opacity-75"
              ></div>

              <UButton
                label="Create Poll"
                icon="i-lucide-message-square-plus"
                variant="solid"
                class="from-primary-300 to-primary-500 relative w-full items-center justify-center bg-linear-to-r py-4 hover:shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </UForm>
  </div>
</template>
