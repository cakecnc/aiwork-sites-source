# 배포 규칙 (staging/prod)

- 운영 브랜치: `main`
- 미리보기 브랜치: `staging`
- 배포 브랜치: `prod`

## 1) main → staging / prod 동기화

```bash
# main 브랜치에서만 실행
npm run deploy:staging   # main -> staging 동기화
npm run deploy:prod      # main -> prod 동기화
```

- `deploy:staging`/`deploy:prod`는 `main` 현재 커밋을 해당 브랜치로 동기화합니다.
- 실행 전 `main`은 깨끗한 상태여야 합니다.
- `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_PAGES_PROJECT_NAME`이 설정되면 Cloudflare Pages 배포까지 시도합니다.

## 2) 배포 SHA 확인

```bash
npm run deploy:check staging
npm run deploy:check prod
```

- GitHub 기준 staging/prod 브랜치 SHA를 조회합니다.
- Cloudflare 환경 변수가 있으면 배포 목록에서 최근 sha도 같이 출력합니다.

## 3) 브랜치 역할

- `staging`: 검증용 프리뷰 라벨
- `prod`: 운영 배포 라벨

## 4) Branch protection

- `prod` 브랜치는 리뷰 1인 승인 필수, 강제 push/삭제 비허용으로 보안 고정.
