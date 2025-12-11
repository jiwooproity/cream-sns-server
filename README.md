# Cream SNS Server

Cream SNS 서버를 담당하며, Auth 인증 및 게시글 API와 같이 SNS 서비스에 필요한 API를 제공합니다.

## 라이브러리

- bcrypy : 민감한 정보에 대해 해시를 제공합니다.
- dotenv : 환경변수에 접근하기 위해 사용됩니다.
- cors : 보안 정책으로 인해 발생하는 CORS 관련 문제를 해결하기 위해 사용됩니다.
- express : node.js 서버를 구성하기 위한 기초 프레임워크입니다.
- express-session : 자동적으로 세션을 기록하고 로그인 유효성 검사를 위해 사용됩니다.
- mongodb : CRUD를 처리하기 위해 사용됩니다.
- connect-mongo : mongoDB에 연결하기 위해 사용됩니다.
- mongoose : 데이터베이스 ODM, 상호작용을 위해 사용됩니다.
- nodemon : 작성된 서버 코드의 변화가 실시간으로 적용되도록 사용합니다.
- tsconfig-paths : alias로 등록된 path를 읽을 수 있도록 처리합니다.

## 주의

현재 사용 중인 MongoDB는 4.0 버전이며, MongoDB 관련된 GUI와 라이브러리의 최신 버전이 지원하지 않습니다.  
따라서, 현재 이 서버에서는 각 버전을 다운그레이드하여 사용 중이므로 의존성 처리에 있어 주의가 필요합니다.  
패키지를 다운로드 받을 때 "--legacy-peer-deps" 사용이 불가피합니다.
