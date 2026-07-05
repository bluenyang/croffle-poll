<script setup lang="ts">
  const modelValue = defineModel<'TEXT' | 'DATE'>({ default: 'TEXT' });

  // 옵션 타입 라디오 그룹 아이템 정의
  const optionTypeItems = [
    {
      label: 'Text Selection',
      description: '텍스트로 이루어진 선택지를 나열하는 방식. 가장 일반적인 투표 방식입니다.',
      value: 'TEXT',
      icon: 'i-lucide-circle-dot',
    },
    {
      label: 'Timeline Selection',
      description: '특정 날짜와 시간을 투표 항목으로 제공합니다. 약속 잡기에 적합합니다.',
      value: 'DATE',
      icon: 'i-lucide-chart-gantt',
    },
  ];
</script>

<template>
  <UCard class="divide-y-0 rounded-2xl bg-white/3 p-4 pt-0 shadow-md shadow-black hover:shadow-lg">
    <!-- Option Type Selection -->
    <UFormField
      class="w-full"
      label="Option Type"
      name="OptionType"
      :ui="{
        wrapper: 'w-full',
        label: 'text-cyan-400 font-bold text-base',
      }"
    >
      <!-- 라디오 그룹 -->
      <URadioGroup
        v-model="modelValue"
        indicator="start"
        variant="card"
        :items="optionTypeItems"
        :ui="{
          // 라디오 그룹 컨테이너는 기본적으로 숨김 처리. 라디오 버튼 자체가 카드 형태로 표시되므로 별도의 컨테이너 UI는 필요 없음
          container: 'hidden',
          fieldset: 'grid w-full grid-cols-1 md:grid-cols-2 gap-4',
          item: `items-center gap-4 not-has-data-[state=checked]:bg-black`,
        }"
      >
        <!-- 라디오 버튼 라벨 Customization -->
        <template #label="{ item }">
          <div
            class="flex flex-col items-start gap-2"
            :class="modelValue === item.value ? '[]' : ''"
          >
            <!-- 아이콘 -->
            <div class="flex rounded-lg bg-white/20 p-2">
              <UIcon
                :name="item.icon"
                class="size-8"
                :class="modelValue === item.value ? 'bg-primary' : ''"
              />
            </div>
            <!-- 라벨 텍스트 -->
            <span class="font-bold">{{ item.label }}</span>
          </div>
        </template>
        <!-- 설명은 원래 URadioGroup의 형태 유지 -->
      </URadioGroup>
    </UFormField>
  </UCard>
</template>
