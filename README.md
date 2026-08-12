src/
├── app/ # Next.js App Router (Presentation Layer)
│ ├── (auth)/
│ │ ├── login/
│ │ │ └── page.tsx
│ │ └── register/
│ │ └── page.tsx
│ ├── (dashboard)/
│ │ ├── layout.tsx
│ │ └── products/
│ │ ├── page.tsx
│ │ └── [id]/
│ │ └── page.tsx
│ ├── api/ # Route Handlers (ถ้าจำเป็น)
│ │ └── webhook/
│ │ └── route.ts
│ ├── layout.tsx
│ └── globals.css
│
├── domain/ # === CORE - ไม่ผูกกับ framework ใดๆ ===
│ ├── entities/
│ │ ├── Product.ts # interface/type + business invariants
│ │ ├── User.ts
│ │ └── Order.ts
│ ├── repositories/ # Interfaces (contracts) เท่านั้น
│ │ ├── IProductRepository.ts
│ │ ├── IUserRepository.ts
│ │ └── IOrderRepository.ts
│ └── errors/
│ ├── DomainError.ts
│ └── ValidationError.ts
│
├── application/ # === USE CASES ===
│ ├── use-cases/
│ │ ├── product/
│ │ │ ├── GetProductList.ts
│ │ │ ├── GetProductDetail.ts
│ │ │ ├── CreateProduct.ts
│ │ │ └── UpdateProductStock.ts
│ │ ├── auth/
│ │ │ ├── LoginUser.ts
│ │ │ └── RegisterUser.ts
│ │ └── order/
│ │ └── PlaceOrder.ts
│ └── dto/ # Data Transfer Objects
│ ├── ProductDTO.ts
│ └── OrderDTO.ts
│
├── infrastructure/ # === IMPLEMENTATION DETAILS ===
│ ├── api/
│ │ ├── axios-client.ts # หรือ fetch wrapper
│ │ └── endpoints.ts
│ ├── repositories/ # Implementation ของ interface ใน domain
│ │ ├── ProductRepositoryImpl.ts
│ │ ├── UserRepositoryImpl.ts
│ │ └── OrderRepositoryImpl.ts
│ ├── storage/
│ │ ├── LocalStorageService.ts
│ │ └── CookieService.ts
│ └── mappers/ # แปลง API response -> Domain Entity
│ ├── ProductMapper.ts
│ └── UserMapper.ts
│
├── presentation/ # === UI Components ===
│ ├── components/
│ │ ├── common/ # Reusable ทั่วไป (Button, Input, Modal)
│ │ │ ├── Button/
│ │ │ │ ├── Button.tsx
│ │ │ │ └── Button.test.tsx
│ │ │ └── Modal/
│ │ ├── layouts/
│ │ │ ├── Header.tsx
│ │ │ └── Sidebar.tsx
│ │ └── features/ # Component เฉพาะ feature
│ │ ├── product/
│ │ │ ├── ProductCard.tsx
│ │ │ └── ProductList.tsx
│ │ └── order/
│ │ └── OrderSummary.tsx
│ ├── hooks/ # Custom hooks ที่เรียกใช้ use-cases
│ │ ├── useProducts.ts
│ │ ├── useAuth.ts
│ │ └── useOrder.ts
│ ├── stores/ # State management (Zustand/Redux)
│ │ ├── authStore.ts
│ │ └── cartStore.ts
│ └── viewmodels/ # (ถ้าซับซ้อนมาก แยก logic ของ view ออกจาก component)
│ └── ProductListViewModel.ts
│
├── shared/ # Utilities ใช้ร่วมกันทุก layer
│ ├── utils/
│ │ ├── formatDate.ts
│ │ └── validators.ts
│ ├── constants/
│ │ └── config.ts
│ └── types/
│ └── common.ts
│
├── di/ # Dependency Injection (ผูก interface กับ implementation)
│ └── container.ts
│
└── tests/
├── unit/
└── integration/
