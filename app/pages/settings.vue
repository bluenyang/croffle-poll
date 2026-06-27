<script setup lang="ts">
  const { user, fetch: refreshSession } = useUserSession();
  const toast = useToast();

  const isProfilePending = ref(false);

  // 1. Profile Form State
  const profileForm = reactive({
    email: user.value?.email ?? '',
    nickname: user.value?.nickname ?? '',
  });

  // 세션의 유저 정보가 변경될 때 폼 상태도 갱신
  watch(
    () => user.value,
    (newUser) => {
      if (newUser) {
        profileForm.email = newUser.email;
        profileForm.nickname = newUser.nickname;
      }
    },
    { immediate: true }
  );

  // 닉네임 변경사항이 있는지 확인
  const isProfileChanged = computed(() => {
    return profileForm.nickname.trim() !== (user.value?.nickname ?? '');
  });

  async function onUpdateProfile() {
    if (!profileForm.nickname.trim()) {
      toast.add({
        title: '입력 오류',
        description: '닉네임을 입력해 주세요.',
        color: 'error',
      });
      return;
    }

    isProfilePending.value = true;
    try {
      await $fetch('/api/auth/profile', {
        method: 'PATCH',
        body: {
          nickname: profileForm.nickname.trim(),
        },
      });

      await refreshSession();

      toast.add({
        title: '프로필 업데이트 성공',
        description: '닉네임이 성공적으로 변경되었습니다.',
        type: 'foreground',
      });
    } catch (err) {
      console.error(err);
      const fetchError = err as { data?: { message?: string } };
      toast.add({
        title: '업데이트 실패',
        description: fetchError.data?.message || '프로필을 변경하는 중 오류가 발생했습니다.',
        color: 'error',
      });
    } finally {
      isProfilePending.value = false;
    }
  }

</script>

<template>
  <div class="mx-auto flex w-full max-w-5xl flex-col gap-8 p-8">
    <!-- Header -->
    <div class="flex w-full flex-col gap-1">
      <h1 class="text-4xl font-bold">계정 설정</h1>
      <p class="text-muted">프로필 수정, 비밀번호 변경 등 계정 환경을 관리합니다.</p>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Left Columns: Edit Forms -->
      <div class="flex flex-col gap-8 lg:col-span-2">
        <!-- Profile Card -->
        <UCard class="shadow-sm">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-user" class="text-primary size-5" />
              <h3 class="text-xl font-bold">프로필 설정</h3>
            </div>
            <p class="text-muted mt-1 text-sm">닉네임을 변경할 수 있습니다.</p>
          </template>

          <UForm class="flex flex-col gap-4" @submit="onUpdateProfile">
            <UFormField label="이메일 주소" :ui="{ label: 'text-muted-foreground font-medium' }">
              <UInput
                v-model="profileForm.email"
                disabled
                icon="i-lucide-mail"
                class="w-full"
                :ui="{ base: 'bg-neutral-900/50 cursor-not-allowed opacity-80' }"
              />
            </UFormField>

            <UFormField label="닉네임" :ui="{ label: 'text-muted-foreground font-medium' }">
              <UInput
                v-model="profileForm.nickname"
                placeholder="닉네임을 입력해 주세요"
                icon="i-lucide-smile"
                class="w-full"
                :ui="{ base: 'bg-neutral-900' }"
              />
            </UFormField>

            <div class="mt-2 flex justify-end">
              <UButton
                type="submit"
                color="primary"
                :loading="isProfilePending"
                :disabled="!isProfileChanged"
                class="px-6 font-bold"
              >
                저장하기
              </UButton>
            </div>
          </UForm>
        </UCard>


      </div>

      <!-- Right Column: Account Info Summary -->
      <div class="lg:col-span-1">
        <UCard class="h-full border border-dashed border-neutral-800 bg-neutral-950/20">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-id-card" class="text-primary size-5" />
              <h3 class="text-xl font-bold">계정 정보</h3>
            </div>
            <p class="text-muted mt-1 text-sm">현재 로그인된 계정의 상세 명세입니다.</p>
          </template>

          <div class="flex flex-col gap-6 py-2">
            <!-- Profile Avatar / Visual Decor -->
            <div class="flex flex-col items-center gap-2 border-b border-neutral-800 pb-4">
              <div
                class="bg-primary/10 text-primary shadow-primary/20 flex h-16 w-16 items-center justify-center rounded-full text-3xl font-black shadow-inner"
              >
                {{ user?.nickname?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="text-center">
                <h4 class="text-lg font-bold text-white">{{ user?.nickname || '닉네임 없음' }}</h4>
                <p class="text-muted mt-0.5 text-xs">{{ user?.email || '이메일 없음' }}</p>
              </div>
            </div>

            <!-- Detail Fields -->
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-1">
                <span class="text-muted text-xs font-semibold tracking-wider uppercase"
                  >이메일 계정</span
                >
                <span class="text-sm font-medium text-white">{{ user?.email || '-' }}</span>
              </div>

              <div class="flex flex-col gap-1">
                <span class="text-muted text-xs font-semibold tracking-wider uppercase"
                  >닉네임</span
                >
                <span class="text-sm font-medium text-white">{{ user?.nickname || '-' }}</span>
              </div>

              <div class="flex flex-col gap-1">
                <span class="text-muted text-xs font-semibold tracking-wider uppercase"
                  >부여 권한</span
                >
                <div class="mt-1 flex items-center gap-2">
                  <UBadge
                    :color="user?.role === 'ADMIN' ? 'error' : 'neutral'"
                    variant="subtle"
                    class="px-2.5 py-0.5 text-xs font-bold"
                  >
                    {{ user?.role || 'MEMBER' }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
