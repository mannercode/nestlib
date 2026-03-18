# nestlib

NestJS 마이크로서비스 아키텍처를 위한 공유 라이브러리 모노레포.

## Packages

| Package | Description | npm |
|---|---|---|
| [`@mannercode/nestlib-core`](packages/core/) | 유틸리티, 타입, 밸리데이터 (인프라 의존성 없음) | [![npm](https://img.shields.io/npm/v/@mannercode/nestlib-core)](https://www.npmjs.com/package/@mannercode/nestlib-core) |
| [`@mannercode/nestlib-logger`](packages/logger/) | Winston 기반 로깅 (필터, 인터셉터) | [![npm](https://img.shields.io/npm/v/@mannercode/nestlib-logger)](https://www.npmjs.com/package/@mannercode/nestlib-logger) |
| [`@mannercode/nestlib-mongoose`](packages/mongoose/) | Mongoose 리포지토리 패턴, 스키마 유틸 | [![npm](https://img.shields.io/npm/v/@mannercode/nestlib-mongoose)](https://www.npmjs.com/package/@mannercode/nestlib-mongoose) |
| [`@mannercode/nestlib-redis`](packages/redis/) | Redis 모듈, 헬스체크, 캐시 서비스 | [![npm](https://img.shields.io/npm/v/@mannercode/nestlib-redis)](https://www.npmjs.com/package/@mannercode/nestlib-redis) |
| [`@mannercode/nestlib-temporal`](packages/temporal/) | Temporal.io 클라이언트/워커 | [![npm](https://img.shields.io/npm/v/@mannercode/nestlib-temporal)](https://www.npmjs.com/package/@mannercode/nestlib-temporal) |
| [`@mannercode/nestlib-nats`](packages/nats/) | NATS 기반 RPC (ClientProxy) | [![npm](https://img.shields.io/npm/v/@mannercode/nestlib-nats)](https://www.npmjs.com/package/@mannercode/nestlib-nats) |
| [`@mannercode/nestlib-s3`](packages/s3/) | S3/Minio 오브젝트 스토리지 | [![npm](https://img.shields.io/npm/v/@mannercode/nestlib-s3)](https://www.npmjs.com/package/@mannercode/nestlib-s3) |
| [`@mannercode/nestlib-auth`](packages/auth/) | JWT 인증, BaseConfigService | [![npm](https://img.shields.io/npm/v/@mannercode/nestlib-auth)](https://www.npmjs.com/package/@mannercode/nestlib-auth) |
| [`@mannercode/nestlib-testing`](packages/testing/) | 테스트 유틸 (HttpTestClient, RpcTestClient 등) | [![npm](https://img.shields.io/npm/v/@mannercode/nestlib-testing)](https://www.npmjs.com/package/@mannercode/nestlib-testing) |

## 패키지 의존 관계

```
core ← (모든 패키지의 기반)
├── logger
├── mongoose ← core
├── redis
├── temporal
├── nats ← core
├── s3 ← core, mongoose
├── auth ← core, redis
└── testing ← core, nats
```

## 사용하는 프로젝트에서 설치

필요한 패키지만 골라서 설치합니다. `.npmrc` 설정 불필요 (npm public registry).

```bash
# 예시: core + redis + mongoose만 사용
npm install @mannercode/nestlib-core @mannercode/nestlib-redis @mannercode/nestlib-mongoose

# 테스트 유틸은 devDependencies로
npm install -D @mannercode/nestlib-testing
```

---

## 개발 환경 설정

### 사전 준비

- Node.js 20+
- npm 10+

### 설치

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
npx turbo run build --filter=@mannercode/nestlib-core

# 클린 빌드
npm run clean && npm run build
```

### 포맷팅

```bash
npm run format
```

---

## 배포 (Publishing)

이 프로젝트는 [Changesets](https://github.com/changesets/changesets)를 사용하여 버전 관리와 npm 배포를 수행합니다.

### 1. npm 로그인

npm public registry에 로그인합니다. `@mannercode` 스코프의 패키지를 배포할 권한이 필요합니다.

```bash
npm login
```

### 2. 변경 사항 기록 (Changeset 추가)

코드 변경 후, 어떤 패키지가 어떤 수준으로 변경되었는지 기록합니다.

```bash
npm run changeset:add
```

대화형 프롬프트가 나타납니다:
1. **변경된 패키지 선택** (스페이스바로 선택, 엔터로 확정)
2. **버전 범프 유형 선택**: `major` / `minor` / `patch`
   - `patch`: 버그 수정, 내부 변경
   - `minor`: 새 기능 추가 (하위 호환)
   - `major`: 브레이킹 체인지
3. **변경 설명 입력**

`.changeset/` 디렉토리에 마크다운 파일이 생성됩니다. 이 파일을 커밋합니다.

```bash
git add .changeset/
git commit -m "chore: add changeset for XYZ"
```

### 3. 버전 업데이트

Changeset 파일들을 기반으로 각 패키지의 `package.json` 버전을 업데이트하고 CHANGELOG를 생성합니다.

```bash
npm run changeset:version
```

이 명령은:
- 각 패키지의 `package.json`에서 `version` 필드를 업데이트
- 의존 패키지의 버전도 자동으로 업데이트 (예: core가 올라가면 mongoose도 업데이트)
- 각 패키지에 `CHANGELOG.md` 생성/업데이트
- `.changeset/` 디렉토리의 changeset 파일 삭제

변경된 파일들을 커밋합니다:

```bash
git add -A
git commit -m "chore: version packages"
```

### 4. 빌드 & 배포

```bash
npm run changeset:publish
```

이 명령은:
1. 모든 패키지를 빌드 (`turbo run build`)
2. 버전이 변경된 패키지만 npm에 배포 (`changeset publish`)
3. 각 패키지에 대해 git tag 생성 (예: `@mannercode/nestlib-core@1.0.0`)

배포 후 태그를 푸시합니다:

```bash
git push --follow-tags
```

### 5. 전체 배포 흐름 요약

```bash
# 1. 코드 변경 후
git add -A && git commit -m "feat: add new feature"

# 2. changeset 추가
npm run changeset:add
git add .changeset/ && git commit -m "chore: add changeset"

# 3. 버전 업데이트
npm run changeset:version
git add -A && git commit -m "chore: version packages"

# 4. 배포
npm run changeset:publish
git push --follow-tags
```

---

## CI/CD로 자동 배포 (GitHub Actions)

`.github/workflows/publish.yml` 파일을 생성하여 자동 배포를 설정할 수 있습니다:

```yaml
name: Publish

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'

      - run: npm install
      - run: npm run build

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: npx changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### GitHub Actions 설정 방법

1. **NPM_TOKEN 생성**:
   - [npmjs.com](https://www.npmjs.com/) → Access Tokens → Generate New Token → Automation
   - 생성된 토큰을 복사

2. **GitHub Secret 추가**:
   - GitHub 리포지토리 → Settings → Secrets and variables → Actions
   - `NPM_TOKEN` 이름으로 시크릿 추가

3. **동작 방식**:
   - `main` 브랜치에 changeset 파일이 포함된 커밋이 푸시되면
   - GitHub Actions가 자동으로 "Version Packages" PR을 생성
   - 해당 PR을 머지하면 자동으로 npm에 배포

---

## 새 패키지 추가하기

```bash
# 1. 디렉토리 생성
mkdir -p packages/new-package/src

# 2. package.json 생성
cat > packages/new-package/package.json << 'EOF'
{
    "name": "@mannercode/nestlib-new-package",
    "version": "0.0.1",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "files": ["dist"],
    "scripts": {
        "build": "tsc -p tsconfig.build.json",
        "clean": "rm -rf dist *.tsbuildinfo"
    },
    "publishConfig": {
        "access": "public"
    },
    "license": "MIT"
}
EOF

# 3. tsconfig 생성
cat > packages/new-package/tsconfig.json << 'EOF'
{
    "extends": "../../tsconfig.base.json",
    "compilerOptions": { "outDir": "dist", "rootDir": "src" },
    "include": ["src/**/*"]
}
EOF

cat > packages/new-package/tsconfig.build.json << 'EOF'
{
    "extends": "./tsconfig.json",
    "exclude": ["src/**/*.spec.ts", "src/**/__tests__/**"]
}
EOF

# 4. 소스 코드 작성
echo 'export const hello = "world"' > packages/new-package/src/index.ts

# 5. 의존성 설치 & 빌드
npm install
npm run build
```

## License

MIT
