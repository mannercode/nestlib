# nestlib

NestJS 마이크로서비스 아키텍처를 위한 공유 라이브러리 모노레포.

## Packages

| Package                                                      | Description                                         | npm                                                                                                                                     |
| ------------------------------------------------------------ | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [`@mannercode/nestlib-common`](packages/common/)             | 유틸리티, 타입, 로깅, Mongoose, Redis, S3, JWT 인증 | [![npm](https://img.shields.io/npm/v/@mannercode/nestlib-common)](https://www.npmjs.com/package/@mannercode/nestlib-common)             |
| [`@mannercode/nestlib-microservice`](packages/microservice/) | NATS RPC (ClientProxy), Temporal.io 클라이언트/워커 | [![npm](https://img.shields.io/npm/v/@mannercode/nestlib-microservice)](https://www.npmjs.com/package/@mannercode/nestlib-microservice) |
| [`@mannercode/nestlib-testing`](packages/testing/)           | 테스트 유틸 (HttpTestClient, RpcTestClient 등)      | [![npm](https://img.shields.io/npm/v/@mannercode/nestlib-testing)](https://www.npmjs.com/package/@mannercode/nestlib-testing)           |

### nestlib-common 포함 모듈

| 모듈        | 설명                                                                           |
| ----------- | ------------------------------------------------------------------------------ |
| `utils`     | Base64, Byte, Checksum, Date, Env, HttpUtil, Json, Path, Time, generateShortId |
| `types`     | PaginationDto, DateTimeRange, LatLong                                          |
| `validator` | Require, Verify, ensure                                                        |
| `logger`    | Winston 로거, ExceptionLoggerFilter, SuccessLoggerInterceptor                  |
| `mongoose`  | MongooseRepository, MongooseSchema (soft delete), QueryBuilder                 |
| `redis`     | RedisModule, RedisHealthIndicator, CacheService                                |
| `s3`        | S3ObjectService (presigned URL, upload/download)                               |
| `services`  | JwtAuthService, BaseConfigService                                              |

### nestlib-microservice 포함 모듈

| 모듈       | 설명                                                  |
| ---------- | ----------------------------------------------------- |
| `rpc`      | ClientProxyService, ClientProxyModule (NATS 기반 RPC) |
| `temporal` | TemporalClientModule, TemporalWorkerService           |

## 패키지 의존 관계

```
common (독립)
microservice → common
testing → common, microservice
```

## 사용하는 프로젝트에서 설치

`.npmrc` 설정 불필요 (npm public registry).

```bash
# common만 사용
npm install @mannercode/nestlib-common

# 마이크로서비스 아키텍처 사용
npm install @mannercode/nestlib-common @mannercode/nestlib-microservice

# 테스트 유틸은 devDependencies로
npm install -D @mannercode/nestlib-testing
```

---

## 개발 환경 설정

### DevContainer (권장)

VS Code에서 이 리포를 열면 DevContainer로 자동 실행됩니다.
포함 항목: Node 24, ESLint, Prettier, Husky, Commitlint

### 수동 설정

- Node.js 24+
- npm 11+

```bash
git clone https://github.com/mannercode/nestlib.git
cd nestlib
npm install
```

### 빌드

```bash
# 전체 빌드
npm run build

# 특정 패키지만 빌드
npx turbo run build --filter=@mannercode/nestlib-common

# 클린 빌드
npm run clean && npm run build
```

### 린트 & 포맷팅

```bash
npm run lint
npm run format
```

---

## 배포 (Publishing)

[Changesets](https://github.com/changesets/changesets)를 사용하여 버전 관리와 npm 배포를 수행합니다.

### 수동 배포

```bash
# 1. npm 로그인
npm login

# 2. 코드 변경 후 changeset 추가
npm run changeset:add
# → 변경된 패키지 선택 → 버전 범프 유형(patch/minor/major) 선택 → 설명 입력
git add .changeset/ && git commit -m "chore: add changeset"

# 3. 버전 업데이트 (package.json 버전 + CHANGELOG 생성)
npm run changeset:version
git add -A && git commit -m "chore: version packages"

# 4. 빌드 & npm 배포
npm run changeset:publish
git push --follow-tags
```

### 자동 배포 (GitHub Actions)

이 리포에는 `.github/workflows/publish.yaml`이 설정되어 있습니다.

**설정 방법 (OIDC — 토큰 불필요):**

1. **npmjs.com** → 패키지 Settings → Publishing Access → **Require two-factor authentication or an automation token or OIDC** 선택
2. GitHub Actions가 OIDC로 자동 인증하므로 NPM_TOKEN 시크릿 불필요

**동작 방식:**

1. 코드 변경 + `npm run changeset:add` 후 `main`에 푸시
2. GitHub Actions가 자동으로 **"Version Packages"** PR 생성
3. 해당 PR을 머지하면 자동으로 npm에 배포 + git tag 생성

---

## 코드 품질

| 도구           | 설정                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| **ESLint**     | TypeScript strict rules, import 정렬, unused imports 감지              |
| **Prettier**   | 4 spaces, single quotes, no semicolons, 100 chars                      |
| **Husky**      | pre-commit (lint-staged), commit-msg (commitlint)                      |
| **Commitlint** | [Conventional Commits](https://www.conventionalcommits.org/) 형식 강제 |

커밋 메시지 예시:

```
feat: add new utility function
fix: resolve cache TTL calculation
chore: update dependencies
```

## License

MIT
