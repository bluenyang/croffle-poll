# 🥐 Croffle Poll (크로플 투표 서비스)

> Nuxt 3, Yarn Berry, Drizzle-ORM, PostgreSQL을 기반으로 구축된 유려하고 강력한 크로플(Team Croffle) 서비스의 투표/설문 플랫폼입니다.

---

## ✨ Key Features (주요 기능)

* **다양한 투표 방식 (Timeline Selection)**: 일반적인 텍스트 투표 외에도 특정 날짜와 시간(Timeline)을 항목으로 제공하여, 팀 회식이나 모임 등 **약속 일정 잡기**에 최적화된 투표를 생성할 수 있습니다.
* **직접 입력 지원**: 투표 생성자가 허용할 경우, 참여자가 기존 항목 외에 새로운 선택지를 직접 추가하여 투표할 수 있습니다.
* **강력한 SSO 연동**: Authentik(OIDC) 기반의 안전한 로그인 및 자동 회원가입을 지원하며, Authentik 그룹 정보를 통해 관리자 권한이 자동 부여됩니다.
* **실시간 대시보드 및 결과 집계**: 투표 결과를 명확하고 아름다운 UI로 한눈에 확인할 수 있습니다.

---

## 🛠 Tech Stack (기술 스택)

* **Frontend & Backend**: [Nuxt 3](https://nuxt.com/) (Vue 3, Fullstack)
* **UI & Styling**: [Nuxt UI](https://ui.nuxt.com/), Tailwind CSS
* **Package Manager**: [Yarn Berry (v4)](https://yarnpkg.com/) (nodeLinker: `node-modules`)
* **ORM & Database**: [Drizzle-ORM](https://orm.drizzle.team/), PostgreSQL
* **CI/CD & Virtualization**: GitHub Actions, Docker (Multi-stage Build)

---

## 🚀 Quick Start (로컬 개발 시작하기)

### 1. Yarn Berry(Modern) 활성화 및 패키지 설치
이 프로젝트는 **Yarn v4**를 패키지 매니저로 사용합니다. Node.js 내장 Corepack을 이용해 활성화한 후 의존성을 주입합니다.

```bash
# Corepack 활성화
corepack enable

# 의존성 설치
yarn install
```

### 2. 로컬 환경 변수 (.env) 구성
루트 디렉토리에 `.env` 파일을 생성하고 아래 형식을 바탕으로 필요한 값을 입력합니다.

```env
DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/<DB_NAME>
NUXT_SESSION_PASSWORD=minimum_32_characters_random_string

# Authentik OAuth 설정
NUXT_OAUTH_AUTHENTIK_CLIENT_ID=your-authentik-client-id
NUXT_OAUTH_AUTHENTIK_CLIENT_SECRET=your-authentik-client-secret
NUXT_OAUTH_AUTHENTIK_DOMAIN=your-authentik-domain
AUTHENTIK_ADMIN_GROUP=your-authentik-admin-group
```

### 3. 데이터베이스 스키마 반영 (Drizzle)
PostgreSQL 데이터베이스 인스턴스를 구동한 상태에서, 아래 명령을 통해 Drizzle 스키마 정의를 생성하고 반영합니다.

```bash
# DB 마이그레이션 파일 생성
yarn db:generate

# 스키마를 데이터베이스에 즉시 동기화(Push)
yarn db:push

# (선택) Drizzle Studio GUI 웹 콘솔 실행
yarn db:studio
```

### 4. 로컬 개발 서버 구동
```bash
yarn dev
```
기본적으로 `http://localhost:3000` 주소를 통해 브라우저에서 투표 앱 및 API 모니터링을 실시간으로 디버깅할 수 있습니다.

---

## 🐳 Docker Compose를 이용한 프로덕션 배포

### 1. 초간단 컨테이너 기동
프로덕션 서버 환경에서 PostgreSQL 데이터베이스와 컴파일 완료된 Nuxt 3 이미지(독립 실행형 Node 서버)를 한 번에 빌드 및 배포합니다.

```bash
# docker-compose 파일 위치 지정하여 백그라운드 구동
docker compose -f .docker/docker-compose.yaml up -d
```

### 2. 컨테이너 환경 변수
`.docker/docker-compose.yaml`을 구동할 때, 아래 환경 변수를 런타임에 주입하여 즉시 커스텀 초기화가 가능합니다.
* `DATABASE_URL`: 연결할 PostgreSQL 주소
* `NUXT_SESSION_PASSWORD`: 세션 암호화 토큰
* `NUXT_OAUTH_AUTHENTIK_CLIENT_ID`: Authentik 클라이언트 ID
* `NUXT_OAUTH_AUTHENTIK_CLIENT_SECRET`: Authentik 클라이언트 Secret
* `NUXT_OAUTH_AUTHENTIK_DOMAIN`: Authentik 도메인 주소
* `AUTHENTIK_ADMIN_GROUP`: 관리자 권한을 부여할 Authentik 그룹명

---

## 🔒 Authentik OIDC 연동 및 자동 회원가입
로그인은 100% Authentik 기반의 OAuth 2.0 (OIDC)로 동작합니다.
최초 로그인 시 데이터베이스에 유저가 없을 경우, Authentik의 프로필(이메일, 닉네임 등)을 기반으로 계정을 자동 생성(`auto-registration`)합니다.
또한, Authentik에서 반환되는 그룹 정보를 파악하여, `AUTHENTIK_ADMIN_GROUP`으로 지정된 그룹에 속한 사용자는 어플리케이션 내에서 최고 관리자(`ADMIN`) 권한을 자동으로 부여받게 됩니다.

---

## 📋 유용한 개발 스크립트 목록

* **`yarn lint`**: 프로젝트 전체 소스 코드의 정적 분석 및 ESLint 린트 포맷팅 검사 수행
* **`yarn typecheck`**: Nuxt 3 및 TypeScript 컴포넌트 간 타입 무결성 전체 검사
* **`yarn build`**: 프로덕션 배포를 위한 고성능 `.output` 단독 웹 서버 번들링 컴파일
* **`yarn preview`**: 로컬 빌드 결과물을 미리 실행하여 구동 및 라우트 성능 체크
