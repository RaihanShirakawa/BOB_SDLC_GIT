# LOS MVP Architecture Diagrams

Comprehensive architecture documentation using Mermaid diagrams for the Loan Origination System MVP.

## Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Component Architecture](#2-component-architecture)
3. [Data Flow Diagram](#3-data-flow-diagram)
4. [State Management Architecture](#4-state-management-architecture)
5. [User Role Workflow](#5-user-role-workflow)
6. [Service Layer Architecture](#6-service-layer-architecture)
7. [Authentication Flow](#7-authentication-flow)
8. [Application Lifecycle](#8-application-lifecycle)
9. [Technology Stack](#9-technology-stack)

---

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end
    
    subgraph "Presentation Layer"
        React[React 19 + Vite]
        Router[React Router]
        UI[UI Components]
    end
    
    subgraph "State Management"
        Redux[Redux Toolkit]
        AuthSlice[Auth Slice]
        AppSlice[Application Slice]
    end
    
    subgraph "Business Logic Layer"
        AuthService[Auth Service]
        DataService[Data Service]
        AuditService[Audit Service]
        AgentService[Agent Service]
        FileService[File Service]
        MemoService[Memo Service]
    end
    
    subgraph "Data Layer"
        LocalStorage[Browser LocalStorage]
        JSONFiles[JSON Data Files]
        Cache[Cache Layer]
    end
    
    Browser --> React
    React --> Router
    React --> UI
    UI --> Redux
    Redux --> AuthSlice
    Redux --> AppSlice
    AuthSlice --> AuthService
    AppSlice --> DataService
    DataService --> AuditService
    DataService --> LocalStorage
    DataService --> JSONFiles
    LocalStorage --> Cache
    JSONFiles --> Cache
```

---

## 2. Component Architecture

```mermaid
graph TB
    subgraph "App Component"
        App[App.jsx]
        AppRoutes[AppRoutes]
        ProtectedRoute[ProtectedRoute]
        PublicRoute[PublicRoute]
    end
    
    subgraph "Pages"
        Login[Login Page]
        Dashboard[Dashboard Page]
    end
    
    subgraph "Dashboard Components"
        Header[Header Component]
        StatsCards[Stats Cards]
        QuickActions[Quick Actions]
        TaskList[Task List Table]
    end
    
    subgraph "Common Components"
        StatusBadge[Status Badge]
        ActionButton[Action Button]
        LoadingSpinner[Loading Spinner]
    end
    
    App --> AppRoutes
    AppRoutes --> ProtectedRoute
    AppRoutes --> PublicRoute
    PublicRoute --> Login
    ProtectedRoute --> Dashboard
    Dashboard --> Header
    Dashboard --> StatsCards
    Dashboard --> QuickActions
    Dashboard --> TaskList
    TaskList --> StatusBadge
    QuickActions --> ActionButton
    Dashboard --> LoadingSpinner
```

---

## 3. Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI as UI Component
    participant Redux as Redux Store
    participant Service as Data Service
    participant Storage as LocalStorage
    participant JSON as JSON Files
    participant Audit as Audit Service

    User->>UI: Interact with UI
    UI->>Redux: Dispatch Action
    Redux->>Service: Call Service Method
    
    alt Data in Cache
        Service->>Storage: Check LocalStorage
        Storage-->>Service: Return Cached Data
    else No Cache
        Service->>JSON: Fetch JSON File
        JSON-->>Service: Return Data
        Service->>Storage: Cache Data
    end
    
    Service->>Audit: Log Action
    Audit->>Storage: Save Audit Log
    Service-->>Redux: Return Data
    Redux-->>UI: Update State
    UI-->>User: Render Updated UI
```

---

## 4. State Management Architecture

```mermaid
graph LR
    subgraph "Redux Store"
        Store[Store Configuration]
        
        subgraph "Auth Slice"
            AuthState[Auth State]
            AuthActions[Auth Actions]
            AuthReducers[Auth Reducers]
        end
        
        subgraph "Application Slice"
            AppState[Application State]
            AppActions[Application Actions]
            AppReducers[Application Reducers]
        end
    end
    
    subgraph "Async Thunks"
        LoginThunk[loginUser]
        LogoutThunk[logoutUser]
        FetchAppsThunk[fetchApplications]
        FetchAppByIdThunk[fetchApplicationById]
        AddAppThunk[addApplication]
        ModifyAppThunk[modifyApplication]
    end
    
    Store --> AuthState
    Store --> AppState
    AuthState --> AuthActions
    AuthActions --> AuthReducers
    AppState --> AppActions
    AppActions --> AppReducers
    
    AuthActions --> LoginThunk
    AuthActions --> LogoutThunk
    AppActions --> FetchAppsThunk
    AppActions --> FetchAppByIdThunk
    AppActions --> AddAppThunk
    AppActions --> ModifyAppThunk
```

---

## 5. User Role Workflow

```mermaid
graph TB
    Start[User Login] --> CheckRole{Check User Role}
    
    CheckRole -->|RM| RMDashboard[RM Dashboard]
    CheckRole -->|Credit Analyst| AnalystDashboard[Analyst Dashboard]
    CheckRole -->|Approver| ApproverDashboard[Approver Dashboard]
    CheckRole -->|Admin| AdminDashboard[Admin Dashboard]
    
    subgraph "RM Workflow"
        RMDashboard --> CreateApp[Create Application]
        CreateApp --> UploadDocs[Upload Documents]
        UploadDocs --> SubmitApp[Submit Application]
        SubmitApp --> TrackStatus[Track Status]
    end
    
    subgraph "Analyst Workflow"
        AnalystDashboard --> ViewPending[View Pending Apps]
        ViewPending --> RunAnalysis[Run Credit Analysis]
        RunAnalysis --> GenerateMemo[Generate Credit Memo]
        GenerateMemo --> SubmitRecommendation[Submit Recommendation]
    end
    
    subgraph "Approver Workflow"
        ApproverDashboard --> ReviewApp[Review Application]
        ReviewApp --> CheckAnalysis[Check Analysis]
        CheckAnalysis --> MakeDecision{Make Decision}
        MakeDecision -->|Approve| ApproveApp[Approve with Conditions]
        MakeDecision -->|Reject| RejectApp[Reject with Reason]
    end
    
    subgraph "Admin Workflow"
        AdminDashboard --> ViewAll[View All Applications]
        ViewAll --> ManageUsers[Manage Users]
        ManageUsers --> ViewAudit[View Audit Logs]
        ViewAudit --> ConfigSystem[Configure System]
    end
```

---

## 6. Service Layer Architecture

```mermaid
graph TB
    subgraph "Service Layer"
        subgraph "Auth Service"
            Login[login]
            Logout[logout]
            GetCurrentUser[getCurrentUser]
            ValidateSession[validateSession]
        end
        
        subgraph "Data Service"
            GetAllApps[getAllApplications]
            GetAppById[getApplicationById]
            CreateApp[createApplication]
            UpdateApp[updateApplication]
            DeleteApp[deleteApplication]
            SubmitApp[submitApplication]
            GetDocs[getAllDocuments]
            AddDoc[addDocument]
            GetAnalysis[getAllAnalyses]
            SaveAnalysis[saveAnalysis]
            GetDecisions[getAllDecisions]
            ApproveApp[approveApplication]
            RejectApp[rejectApplication]
        end
        
        subgraph "Audit Service"
            LogAction[logAuditAction]
            GetAuditLogs[getAuditLogs]
            GetUserActions[getUserActions]
        end
        
        subgraph "Agent Service"
            RunAgent[runAgentAnalysis]
            GetAgentResult[getAgentAnalysisResult]
        end
        
        subgraph "File Service"
            UploadFile[uploadFile]
            DeleteFile[deleteFile]
            GetFileUrl[getFileUrl]
        end
        
        subgraph "Memo Service"
            GenerateMemo[generateCreditMemo]
            GetMemoTemplate[getMemoTemplate]
        end
    end
    
    subgraph "Data Sources"
        LocalStorage[(LocalStorage)]
        JSONFiles[(JSON Files)]
    end
    
    GetAllApps --> LocalStorage
    GetAllApps --> JSONFiles
    CreateApp --> LocalStorage
    UpdateApp --> LocalStorage
    LogAction --> LocalStorage
    UploadFile --> LocalStorage
```

---

## 7. Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant LoginPage
    participant Redux
    participant AuthService
    participant LocalStorage
    participant Dashboard

    User->>LoginPage: Enter Credentials
    LoginPage->>Redux: Dispatch loginUser
    Redux->>AuthService: Call login(username, password)
    
    AuthService->>LocalStorage: Fetch users.json
    LocalStorage-->>AuthService: Return users data
    
    alt Valid Credentials
        AuthService->>AuthService: Validate credentials
        AuthService->>LocalStorage: Store session
        AuthService-->>Redux: Return user object
        Redux->>Redux: Update auth state
        Redux-->>LoginPage: Login successful
        LoginPage->>Dashboard: Navigate to dashboard
        Dashboard->>User: Show role-based dashboard
    else Invalid Credentials
        AuthService-->>Redux: Return error
        Redux-->>LoginPage: Show error message
        LoginPage->>User: Display error
    end
```

---

## 8. Application Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: RM Creates Application
    
    Draft --> Submitted: RM Submits Application
    Draft --> [*]: RM Deletes Draft
    
    Submitted --> InReview: Analyst Starts Analysis
    
    InReview --> InReview: Analyst Updates Analysis
    InReview --> Submitted: Analyst Returns for More Info
    
    InReview --> Approved: Approver Approves
    InReview --> Rejected: Approver Rejects
    
    Approved --> Completed: Loan Disbursed
    Rejected --> [*]: Application Closed
    Completed --> [*]: Application Archived
    
    note right of Draft: Status: DRAFT<br/>Owner: RM<br/>Actions: Edit, Submit, Delete
    note right of Submitted: Status: SUBMITTED<br/>Visible to: Analyst<br/>Actions: Start Analysis
    note right of InReview: Status: IN_REVIEW<br/>Visible to: Analyst, Approver<br/>Actions: Analyze, Recommend, Approve, Reject
    note right of Approved: Status: APPROVED<br/>Actions: Disburse Loan
    note right of Rejected: Status: REJECTED<br/>Actions: View Only
```

---

## 9. Technology Stack

```mermaid
graph TB
    subgraph "Frontend Framework"
        React[React 19.2.0]
        ReactDOM[React DOM 19.2.0]
        Vite[Vite 7.3.1]
    end
    
    subgraph "State Management"
        ReduxToolkit[@reduxjs/toolkit 2.11.2]
        ReactRedux[react-redux 9.2.0]
    end
    
    subgraph "Routing"
        ReactRouter[react-router-dom 7.13.1]
    end
    
    subgraph "Utilities"
        UUID[uuid 13.0.0]
        DateFns[date-fns 4.1.0]
    end
    
    subgraph "Development Tools"
        ESLint[ESLint 9.39.1]
        ViteReact[@vitejs/plugin-react 5.1.1]
        TypeScript[TypeScript Types]
    end
    
    subgraph "Data Storage"
        LocalStorageAPI[LocalStorage API]
        JSONData[JSON Files]
        CacheLayer[Cache Layer]
    end
    
    React --> ReduxToolkit
    React --> ReactRouter
    React --> ReactDOM
    ReduxToolkit --> ReactRedux
    Vite --> ViteReact
    React --> UUID
    React --> DateFns
    React --> LocalStorageAPI
    LocalStorageAPI --> JSONData
    LocalStorageAPI --> CacheLayer
```

---

## Architecture Highlights

### Key Design Patterns

1. **Service Layer Pattern**
   - Separation of business logic from UI components
   - Centralized data access through service modules
   - Consistent error handling and logging

2. **Redux State Management**
   - Centralized application state
   - Predictable state updates through reducers
   - Async operations handled by Redux Toolkit thunks

3. **Role-Based Access Control (RBAC)**
   - Four distinct user roles: RM, Credit Analyst, Approver, Admin
   - Role-specific dashboards and actions
   - Filtered data views based on user permissions

4. **Caching Strategy**
   - LocalStorage caching for improved performance
   - Fallback to JSON files when cache is empty
   - Cache invalidation on data updates

5. **Audit Trail**
   - Comprehensive logging of all user actions
   - Immutable audit records
   - Timestamp and user tracking for compliance

### Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Memoization**: Redux selectors for derived state
- **Caching**: LocalStorage for frequently accessed data
- **Efficient Rendering**: React 19 concurrent features

### Security Considerations

- **Client-Side Authentication**: Session management via LocalStorage
- **Role-Based Authorization**: Access control at component level
- **Audit Logging**: Complete action tracking
- **Data Validation**: Input validation at service layer

---

## File Structure

```
los-mvp/
├── src/
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # Application entry point
│   ├── pages/
│   │   ├── Login.jsx          # Login page
│   │   └── Dashboard.jsx      # Role-based dashboard
│   ├── store/
│   │   ├── store.js           # Redux store configuration
│   │   └── slices/
│   │       ├── authSlice.js   # Authentication state
│   │       └── applicationSlice.js  # Application state
│   ├── services/
│   │   ├── authService.js     # Authentication logic
│   │   ├── dataService.js     # Data CRUD operations
│   │   ├── auditService.js    # Audit logging
│   │   ├── agentService.js    # AI agent integration
│   │   ├── fileService.js     # File management
│   │   └── memoService.js     # Credit memo generation
│   └── utils/
│       ├── constants.js       # Application constants
│       └── calculations.js    # Financial calculations
├── public/
│   ├── data/                  # JSON data files
│   └── config/                # Configuration files
└── package.json               # Dependencies
```

---

**Generated with IBM Bob - Architecture Documentation**