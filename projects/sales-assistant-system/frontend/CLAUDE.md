# 销售助理系统前端 - CLAUDE.md

**项目：** 销售助理系统前端 Web 应用  
**技术栈：** React 18 + TypeScript + Vite + Ant Design 5  
**Agent:** Frontend Agent  
**最后更新：** 2026-03-09

---

## 📋 项目概述

这是一个销售管理系统的前端 Web 应用，包含：
- **销售端** - 客户管理、成交录入、业绩查看、学习空间
- **管理端** - 团队管理、数据报表、资料管理、用户管理

---

## 🏗️ 架构规范

### 目录结构
```
src/
├── main.tsx                    # 应用入口
├── App.tsx                     # 根组件
├── vite-env.d.ts               # Vite 类型定义
├── components/                 # 公共组件
│   ├── Layout/                 # 布局组件
│   ├── Header/                 # 头部组件
│   ├── Sidebar/                # 侧边栏
│   └── common/                 # 通用组件
├── pages/                      # 页面组件
│   ├── Login/                  # 登录页
│   ├── Dashboard/              # 仪表盘
│   ├── Customers/              # 客户管理
│   ├── Orders/                 # 订单管理
│   ├── Performance/            # 业绩
│   ├── Team/                   # 团队管理
│   └── Learning/               # 学习空间
├── hooks/                      # 自定义 hooks
├── services/                   # API 服务
│   ├── api.ts                  # axios 实例
│   ├── auth.ts                 # 认证 API
│   ├── customers.ts            # 客户 API
│   └── ...
├── store/                      # 状态管理 (Zustand)
│   ├── auth.ts                 # 认证状态
│   └── app.ts                  # 应用状态
├── types/                      # TypeScript 类型
│   ├── api.ts                  # API 类型
│   └── models.ts               # 数据模型
├── utils/                      # 工具函数
├── constants/                  # 常量
└── styles/                     # 全局样式
```

### 代码规范

**命名约定：**
- 文件：PascalCase for components (UserProfile.tsx), camelCase for others (auth.ts)
- 组件：PascalCase (CustomerList)
- 函数/变量：camelCase (fetchCustomers)
- 常量：UPPER_SNAKE_CASE (API_BASE_URL)
- 类型/接口：PascalCase (CustomerDTO)

**组件结构：**
```typescript
// 函数组件 + TypeScript
import React from 'react';
import { CustomerDTO } from '@/types/models';

interface CustomerListProps {
  customers: CustomerDTO[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onEdit,
  onDelete,
}) => {
  // 组件逻辑
  return <div>...</div>;
};
```

---

## 🔐 安全规则 (最高优先级)

### Critical Rules

1. **Token 存储** - JWT token 存储在内存或 httpOnly cookie，不存 localStorage
2. **XSS 防护** - 不直接使用 dangerouslySetInnerHTML
3. **CSRF 防护** - 所有状态变更请求需要 CSRF token
4. **输入验证** - 表单输入必须验证和转义
5. **敏感信息** - 不将敏感信息打印到 console
6. **依赖安全** - 定期 npm audit
7. **HTTPS** - 生产环境强制 HTTPS
8. **CSP** - 配置 Content Security Policy

### 认证流程

```typescript
// 登录
POST /api/auth/login → 获取 token
→ 存储到 Zustand store (内存)
→ 设置 axios interceptor 自动携带 token

// 请求拦截
axios.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 响应拦截 - 处理 401
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // token 过期，跳转登录
      useAuthStore.getState().logout();
      navigate('/login');
    }
    return Promise.reject(error);
  }
);
```

---

## 🧪 验证命令

**必须运行这些命令验证代码：**

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 单元测试
npm test

# 测试覆盖率
npm run test:coverage

# E2E 测试
npm run test:e2e

# Lint
npm run lint
```

**验证循环：**
1. 运行 `npm run build` - 确保编译通过
2. 运行 `npm test` - 确保测试通过
3. 运行 `npm run lint` - 确保代码规范
4. 有错误 → 修复 → 重新验证

---

## 📝 API 交互规范

### Axios 配置

```typescript
// services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### React Query 配置

```typescript
// 查询配置
import { useQuery } from '@tanstack/react-query';

export const useCustomers = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['customers', page, pageSize],
    queryFn: () => customersService.getList(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 分钟
    retry: 2,
  });
};

// 突变配置
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: customersService.create,
    onSuccess: () => {
      // 使列表失效，重新获取
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      message.success('创建成功');
    },
  });
};
```

### 响应格式处理

```typescript
// 统一响应类型
interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 使用示例
const response = await api.get<ListResponse<CustomerDTO>>('/customers');
```

---

## 🎨 UI 规范

### Ant Design 使用

**主题配置：**
```typescript
// 使用 Ant Design 5 的 CSS-in-JS 主题
import { ConfigProvider } from 'antd';

<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  }}
>
  <App />
</ConfigProvider>
```

**表单规范：**
```typescript
import { Form, Input, Button, message } from 'antd';

interface LoginFormValues {
  username: string;
  password: string;
}

export const LoginForm = () => {
  const [form] = Form.useForm<LoginFormValues>();
  
  const onFinish = async (values: LoginFormValues) => {
    try {
      await authService.login(values);
      message.success('登录成功');
    } catch (error) {
      message.error('登录失败');
    }
  };
  
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="用户名" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password placeholder="密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};
```

**表格规范：**
```typescript
import { Table, Space, Button, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface CustomerTableProps {
  customers: CustomerDTO[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CustomerTable = ({ customers, loading, onEdit, onDelete }) => {
  const columns: ColumnsType<CustomerDTO> = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button onClick={() => onEdit(record.id)}>编辑</Button>
          <Button danger onClick={() => onDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];
  
  return <Table columns={columns} dataSource={customers} loading={loading} />;
};
```

### 响应式设计

```typescript
// 使用 Ant Design 的 Grid 系统
import { Row, Col } from 'antd';

<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6}>
    <Card title="统计卡片 1" />
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    <Card title="统计卡片 2" />
  </Col>
</Row>
```

---

## 🔄 状态管理

### Zustand Store

```typescript
// store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: UserDTO | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserDTO) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      // 只存储必要信息，不存 token (用 httpOnly cookie)
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

---

## 📚 领域知识

### 用户角色

- `sales` - 销售人员 → 显示销售端菜单
- `manager` - 销售主管 → 显示管理端菜单
- `admin` - 系统管理员 → 显示全部菜单

### 路由权限

```typescript
// 路由配置
const routes = [
  {
    path: '/login',
    element: <LoginPage />,
    public: true,
  },
  {
    path: '/customers',
    element: <CustomerListPage />,
    roles: ['sales', 'manager', 'admin'],
  },
  {
    path: '/team',
    element: <TeamPage />,
    roles: ['manager', 'admin'],
  },
];
```

---

## 🛠️ 开发技巧

### 常用 Hooks

```typescript
// 防抖搜索
import { useDebounce } from 'ahooks';

const [searchText, setSearchText] = useState('');
const debouncedSearch = useDebounce(searchText, { wait: 300 });

// 分页
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

// 加载状态
const { data, isLoading, error } = useCustomers(page, pageSize);
```

### 错误处理

```typescript
// 统一错误处理
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || '操作失败';
    notification.error({ message });
  } else {
    notification.error({ message: '未知错误' });
  }
};
```

---

## 📈 质量门

- 构建：必须通过
- 测试：覆盖率 >70%
- Lint: 无错误
- E2E: 关键流程通过
- 无障碍：基本 a11y 合规

---

**最后提醒：** 每次代码变更后，必须运行验证循环！
