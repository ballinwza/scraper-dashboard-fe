## Services

[Backend](https://scraper-dashboard-be-prod-758337397665.asia-southeast1.run.app)
[Backend Docs](https://scraper-dashboard-be-prod-758337397665.asia-southeast1.run.app/docs/index.html)

```
src/
├── app/ # Next.js App Router (Presentation Layer)
│
├── domain/
│ ├── entities/
│ ├── repositories/ # Interfaces (contracts) เท่านั้น
│ └── errors/
│ ├── DomainError.ts
│ └── ValidationError.ts
│
├── application/
│ ├── usecases/
│ └── dto/ # Data Transfer Objects
│
├── infrastructure/
│ ├── api/
│ ├── repositories/ # Implementation ของ interface ใน domain
│ ├── storage/
│ └── mappers/ # แปลง API response -> Domain Entity
│ ├── ProductMapper.ts
│ └── UserMapper.ts
│
├── presentation/
│ ├── components/
│ │ ├── common/ # Reusable ทั่วไป (Button, Input, Modal)
│ │ ├── layouts/
│ │ └── features/ # Component เฉพาะ feature
│ │ ├── product/
│ │ └── order/
│ ├── hooks/ # Custom hooks ที่เรียกใช้ use-cases
│ ├── stores/ # State management (Zustand/Redux)
│ └── viewmodels/ # (ถ้าซับซ้อนมาก แยก logic ของ view ออกจาก component)
│
├── shared/ # Utilities ใช้ร่วมกันทุก layer
│ ├── utils/
│ ├── constants/
│ └── types/
│
├── di/ # Dependency Injection (ผูก interface กับ implementation)
│ └── container.ts
│
└── tests/
├── unit/
└── integration/
```
