# CISSP Study App

CISSP(Certified Information Systems Security Professional) 시험 준비를 위한 웹 기반 학습 애플리케이션입니다.

## 🌟 주요 기능

### 📚 학습 모드
- **플래시카드 형태의 학습**: CISSP 8개 도메인의 핵심 개념들을 카드 형태로 학습
- **랜덤 셔플**: 카드 순서를 무작위로 섞어서 반복 학습
- **진행률 추적**: 학습 완료한 항목들을 자동으로 기록
- **도메인별 필터링**: 특정 도메인만 선택해서 학습 가능
- **키워드 검색**: 특정 주제나 키워드로 검색하여 학습

### 🎯 퀴즈 모드
- **객관식 퀴즈**: 학습한 내용을 바탕으로 한 4지 선다형 퀴즈
- **실시간 점수**: 퀴즈 진행 중 실시간 정답률 확인
- **즉시 피드백**: 답안 제출 후 정답 여부와 설명 제공
- **랜덤 문제**: 매번 다른 문제 조합으로 퀴즈 생성

### 📊 복습 모드
- **학습 통계**: 전체 학습 진행률과 완료 항목 수 확인
- **복습 기능**: 학습 완료한 항목들만 따로 모아서 복습

## 🗂️ CISSP 8개 도메인

1. **Security and Risk Management** (보안 및 위험 관리)
2. **Asset Security** (자산 보안)
3. **Security Architecture and Engineering** (보안 아키텍처 및 엔지니어링)
4. **Communication and Network Security** (통신 및 네트워크 보안)
5. **Identity and Access Management** (신원 및 접근 관리)
6. **Security Assessment and Testing** (보안 평가 및 테스팅)
7. **Security Operations** (보안 운영)
8. **Software Development Security** (소프트웨어 개발 보안)

## 🚀 시작하기

### 1. 파일 구조
```
cissp-study-app/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── app.js             # JavaScript 메인 로직
├── data/              # JSON 데이터 폴더
│   ├── cissp_security_risk_management_study.json
│   ├── cissp_asset_security_study.json
│   ├── cissp_security_architecture_engineering_study.json
│   ├── cissp_communication_network_security_study.json
│   ├── cissp_identity_access_management_study.json
│   ├── cissp_security_assessment_testing_study.json
│   ├── cissp_security_operations_study.json
│   └── cissp_software_development_security_study.json
└── README.md          # 이 파일
```

### 2. 실행 방법
1. 웹 서버를 통해 실행 (파일:// 프로토콜로는 JSON 로딩이 안됩니다)
2. 간단한 로컬 서버 실행 예시:
   ```bash
   # Python 3.x
   python -m http.server 8000
   
   # Node.js (http-server가 설치된 경우)
   npx http-server
   
   # Live Server (VS Code 확장)
   Live Server 확장을 사용하여 실행
   ```
3. 브라우저에서 `http://localhost:8000` 접속

## 🎮 사용법

### 학습 모드
1. **기본 학습**: 이전/다음 버튼으로 카드를 넘기며 학습
2. **키보드 단축키**:
   - `←` / `→`: 이전/다음 카드
   - `스페이스바`: 학습 완료 토글
   - `Ctrl+R` / `Cmd+R`: 카드 랜덤 섞기
3. **학습 완료**: 각 카드의 "학습완료" 버튼을 클릭하여 진행률 기록
4. **필터링**: 도메인 선택 또는 검색어 입력으로 원하는 내용만 학습

### 퀴즈 모드
1. **퀴즈 시작**: "퀴즈 시작" 버튼 클릭
2. **문제 풀이**: 4개 선택지 중 정답 선택 후 "답안 제출"
3. **결과 확인**: 정답 여부와 설명 확인 후 다음 문제로 진행
4. **점수 확인**: 퀴즈 완료 후 최종 점수와 정답률 확인

### 복습 모드
1. **통계 확인**: 전체 학습 진행률 확인
2. **복습 시작**: "학습완료 항목 복습" 버튼으로 복습 모드 진입

## 💾 데이터 저장

- 학습 진행률은 브라우저의 localStorage에 자동 저장됩니다
- 브라우저 데이터를 삭제하지 않는 한 진행률이 유지됩니다
- "초기화" 버튼으로 모든 진행률을 재설정할 수 있습니다

## 🎨 반응형 디자인

- 데스크톱, 태블릿, 모바일 모든 기기에서 사용 가능
- 터치 친화적인 UI 디자인
- 다크 모드 지원 (시스템 설정 따름)

## 🛠️ 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: 모던 스타일링 (Flexbox, Grid, CSS Variables)
- **Vanilla JavaScript**: ES6+ 문법 사용
- **Font Awesome**: 아이콘
- **JSON**: 학습 데이터 저장

## 📝 데이터 형식

각 JSON 파일의 데이터 구조:
```json
[
  {
    "id": 1,
    "topic": "주제명",
    "description": "상세 설명",
    "reference": "참고 자료"
  }
]
```

## 🤝 기여하기

1. JSON 파일에 새로운 학습 항목 추가
2. 기능 개선 제안
3. 버그 리포트

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 🎯 학습 팁

1. **일일 학습량 설정**: 매일 일정량의 카드를 학습하여 꾸준히 진행
2. **반복 학습**: 랜덤 기능을 활용하여 같은 내용을 다양한 순서로 반복
3. **퀴즈 활용**: 학습 후 퀴즈로 이해도 점검
4. **도메인별 집중**: 약한 도메인을 집중적으로 학습
5. **키워드 검색**: 특정 개념이 헷갈릴 때 검색 기능 활용

## 📞 문의

앱 사용 중 문제가 있거나 개선 사항이 있으시면 언제든 문의해 주세요!

---

**CISSP 시험 합격을 응원합니다! 🎉**# cissp-study-app
