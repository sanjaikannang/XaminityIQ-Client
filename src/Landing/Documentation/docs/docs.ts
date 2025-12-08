export const docs = {
    "project": {
        "name": "Academic Management System",
        "version": "1.0.0",
        "description": "A comprehensive academic management system for managing batches, courses, departments, students, and faculty",
        "lastUpdated": "2024-12-05"
    },
    "overview": {
        "title": "Project Overview",
        "description": "This system provides a complete solution for academic institution management with role-based access control and comprehensive APIs.",
        "techStack": {
            "frontend": ["React", "Tailwind CSS", "Axios"],
            "backend": ["Node.js", "Express", "PostgreSQL"],
            "authentication": ["JWT", "HttpOnly Cookies"]
        },
        "features": [
            "Role-based access control (Super Admin, Faculty, Student)",
            "Batch and Course Management",
            "Department and Section Management",
            "Student and Faculty Onboarding",
            "Bulk Import via CSV",
            "Secure Authentication with JWT"
        ]
    },
    "architecture": {
        "title": "System Architecture",
        "type": "monolithic",
        "layers": [
            {
                "name": "Presentation Layer",
                "description": "React-based frontend with Tailwind CSS",
                "components": ["Admin Dashboard", "Faculty Portal", "Student Portal"]
            },
            {
                "name": "Application Layer",
                "description": "Express.js REST API with middleware",
                "components": ["Authentication", "Authorization", "Business Logic"]
            },
            {
                "name": "Data Layer",
                "description": "PostgreSQL database with normalized schema",
                "components": ["User Management", "Academic Data", "Audit Logs"]
            }
        ]
    },
    "fileStructure": {
        "backend": {
            "root": "backend/",
            "structure": [
                {
                    "name": "src/",
                    "type": "directory",
                    "children": [
                        {
                            "name": "controllers/",
                            "type": "directory",
                            "description": "Request handlers and business logic",
                            "files": [
                                "authController.js",
                                "batchController.js",
                                "courseController.js",
                                "departmentController.js",
                                "sectionController.js",
                                "subjectController.js",
                                "studentController.js",
                                "facultyController.js"
                            ]
                        },
                        {
                            "name": "models/",
                            "type": "directory",
                            "description": "Database models and schemas",
                            "files": [
                                "User.js",
                                "Batch.js",
                                "Course.js",
                                "Department.js",
                                "Section.js",
                                "Subject.js",
                                "Student.js",
                                "Faculty.js"
                            ]
                        },
                        {
                            "name": "routes/",
                            "type": "directory",
                            "description": "API route definitions",
                            "files": [
                                "authRoutes.js",
                                "adminRoutes.js",
                                "facultyRoutes.js",
                                "studentRoutes.js"
                            ]
                        },
                        {
                            "name": "middleware/",
                            "type": "directory",
                            "description": "Express middleware functions",
                            "files": [
                                "authMiddleware.js",
                                "roleMiddleware.js",
                                "validationMiddleware.js",
                                "errorHandler.js"
                            ]
                        },
                        {
                            "name": "config/",
                            "type": "directory",
                            "description": "Configuration files",
                            "files": ["database.js", "jwt.js", "email.js"]
                        },
                        {
                            "name": "utils/",
                            "type": "directory",
                            "description": "Utility functions",
                            "files": [
                                "passwordHash.js",
                                "tokenGenerator.js",
                                "csvParser.js",
                                "emailSender.js"
                            ]
                        }
                    ]
                },
                {
                    "name": "package.json",
                    "type": "file",
                    "description": "Backend dependencies and scripts"
                },
                {
                    "name": ".env.example",
                    "type": "file",
                    "description": "Environment variables template"
                }
            ]
        },
        "frontend": {
            "root": "frontend/",
            "structure": [
                {
                    "name": "src/",
                    "type": "directory",
                    "children": [
                        {
                            "name": "components/",
                            "type": "directory",
                            "description": "Reusable React components",
                            "children": [
                                {
                                    "name": "admin/",
                                    "type": "directory",
                                    "files": [
                                        "BatchManagement.jsx",
                                        "CourseManagement.jsx",
                                        "DepartmentManagement.jsx",
                                        "SectionManagement.jsx",
                                        "SubjectManagement.jsx",
                                        "StudentManagement.jsx",
                                        "FacultyManagement.jsx"
                                    ]
                                },
                                {
                                    "name": "common/",
                                    "type": "directory",
                                    "files": [
                                        "Sidebar.jsx",
                                        "Header.jsx",
                                        "Table.jsx",
                                        "Modal.jsx",
                                        "Form.jsx"
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "pages/",
                            "type": "directory",
                            "description": "Page components",
                            "files": [
                                "Login.jsx",
                                "AdminDashboard.jsx",
                                "FacultyDashboard.jsx",
                                "StudentDashboard.jsx"
                            ]
                        },
                        {
                            "name": "services/",
                            "type": "directory",
                            "description": "API service functions",
                            "files": [
                                "authService.js",
                                "adminService.js",
                                "facultyService.js",
                                "studentService.js"
                            ]
                        },
                        {
                            "name": "hooks/",
                            "type": "directory",
                            "description": "Custom React hooks",
                            "files": ["useAuth.js", "useApi.js"]
                        },
                        {
                            "name": "context/",
                            "type": "directory",
                            "description": "React context providers",
                            "files": ["AuthContext.jsx"]
                        }
                    ]
                }
            ]
        }
    },
    "roles": [
        {
            "name": "Super Admin",
            "key": "super_admin",
            "description": "Full system access with all administrative privileges",
            "permissions": [
                "Manage all batches, courses, departments, sections, subjects",
                "Onboard and manage students and faculty",
                "View all system data and analytics",
                "Configure system settings"
            ],
            "accessibleModules": [
                "batch_management",
                "course_management",
                "department_management",
                "section_management",
                "subject_management",
                "student_management",
                "faculty_management"
            ]
        },
        {
            "name": "Faculty",
            "key": "faculty",
            "description": "Teaching staff with course and student management access",
            "permissions": [
                "View assigned courses and sections",
                "Manage student attendance and grades",
                "Access student profiles in assigned sections",
                "Submit exam results"
            ],
            "accessibleModules": [
                "course_view",
                "student_view",
                "attendance_management",
                "grade_management"
            ]
        },
        {
            "name": "Student",
            "key": "student",
            "description": "Enrolled students with limited read access",
            "permissions": [
                "View own profile and academic records",
                "View enrolled courses and subjects",
                "Access exam schedules and results",
                "View attendance records"
            ],
            "accessibleModules": [
                "profile_view",
                "course_view",
                "exam_view",
                "attendance_view"
            ]
        }
    ],
    "apiModules": [
        {
            "id": "authentication",
            "name": "Authentication",
            "description": "User authentication and token management",
            "icon": "lock",
            "endpoints": [
                {
                    "method": "POST",
                    "path": "/api/auth/login",
                    "description": "User login with credentials",
                    "accessRoles": ["public"],
                    "requestBody": {
                        "email": "string (required)",
                        "password": "string (required)"
                    },
                    "responseSuccess": {
                        "status": 200,
                        "body": {
                            "accessToken": "string (JWT token)",
                            "user": {
                                "id": "number",
                                "email": "string",
                                "role": "string"
                            }
                        },
                        "headers": {
                            "Set-Cookie": "refreshToken=<token>; HttpOnly; Secure; SameSite=Strict"
                        }
                    },
                    "responseError": [
                        {
                            "status": 401,
                            "body": {
                                "error": "Invalid credentials"
                            }
                        }
                    ]
                },
                {
                    "method": "POST",
                    "path": "/api/auth/refresh-token",
                    "description": "Refresh access token using refresh token cookie",
                    "accessRoles": ["authenticated"],
                    "requestBody": null,
                    "requestCookies": {
                        "refreshToken": "string (HttpOnly cookie)"
                    },
                    "responseSuccess": {
                        "status": 200,
                        "body": {
                            "accessToken": "string (new JWT token)"
                        }
                    },
                    "responseError": [
                        {
                            "status": 401,
                            "body": {
                                "error": "Invalid refresh token"
                            }
                        }
                    ]
                },
                {
                    "method": "POST",
                    "path": "/api/auth/logout",
                    "description": "Logout user and revoke refresh token",
                    "accessRoles": ["authenticated"],
                    "requestBody": null,
                    "responseSuccess": {
                        "status": 200,
                        "body": {
                            "message": "Logged out successfully"
                        },
                        "headers": {
                            "Set-Cookie": "refreshToken=; Max-Age=0"
                        }
                    }
                }
            ],
            "flowDiagram": "authentication_flow",
            "sequenceDiagram": "authentication_sequence"
        },
        {
            "id": "batch_management",
            "name": "Batch Management",
            "description": "Manage academic batches with year ranges",
            "icon": "calendar",
            "endpoints": [
                {
                    "method": "GET",
                    "path": "/api/admin/batches",
                    "description": "Retrieve all academic batches",
                    "accessRoles": ["super_admin"],
                    "queryParams": {
                        "page": "number (optional, default: 1)",
                        "limit": "number (optional, default: 10)",
                        "search": "string (optional)"
                    },
                    "responseSuccess": {
                        "status": 200,
                        "body": {
                            "batches": [
                                {
                                    "id": "number",
                                    "startYear": "number",
                                    "endYear": "number",
                                    "name": "string (e.g., 2023-2026)",
                                    "enrolledStudents": "number",
                                    "isActive": "boolean",
                                    "courses": ["array of course objects"],
                                    "departments": ["array of department objects"]
                                }
                            ],
                            "total": "number",
                            "page": "number",
                            "limit": "number"
                        }
                    }
                },
                {
                    "method": "POST",
                    "path": "/api/admin/batches",
                    "description": "Create new academic batch",
                    "accessRoles": ["super_admin"],
                    "requestBody": {
                        "startYear": "number (required)",
                        "endYear": "number (required)",
                        "courseIds": "array of numbers (required)",
                        "departmentIds": "array of numbers (required)"
                    },
                    "responseSuccess": {
                        "status": 201,
                        "body": {
                            "id": "number",
                            "startYear": "number",
                            "endYear": "number",
                            "name": "string",
                            "message": "Batch created successfully"
                        }
                    },
                    "responseError": [
                        {
                            "status": 400,
                            "body": {
                                "error": "End year must be after start year"
                            }
                        }
                    ]
                },
                {
                    "method": "PUT",
                    "path": "/api/admin/batches/:id",
                    "description": "Update batch information",
                    "accessRoles": ["super_admin"],
                    "pathParams": {
                        "id": "number (batch ID)"
                    },
                    "requestBody": {
                        "startYear": "number (optional)",
                        "endYear": "number (optional)",
                        "isActive": "boolean (optional)"
                    },
                    "responseSuccess": {
                        "status": 200,
                        "body": {
                            "id": "number",
                            "startYear": "number",
                            "endYear": "number",
                            "isActive": "boolean",
                            "message": "Batch updated successfully"
                        }
                    }
                },
                {
                    "method": "DELETE",
                    "path": "/api/admin/batches/:id",
                    "description": "Delete academic batch (soft delete)",
                    "accessRoles": ["super_admin"],
                    "pathParams": {
                        "id": "number (batch ID)"
                    },
                    "responseSuccess": {
                        "status": 200,
                        "body": {
                            "message": "Batch archived successfully"
                        }
                    }
                }
            ],
            "flowDiagram": "batch_management_flow",
            "sequenceDiagram": "batch_management_sequence"
        },
        {
            "id": "student_management",
            "name": "Student Management",
            "description": "Onboard and manage student accounts",
            "icon": "users",
            "endpoints": [
                {
                    "method": "GET",
                    "path": "/api/admin/students",
                    "description": "Retrieve all students with filters",
                    "accessRoles": ["super_admin"],
                    "queryParams": {
                        "page": "number (optional)",
                        "limit": "number (optional)",
                        "search": "string (optional)",
                        "batchId": "number (optional)",
                        "courseId": "number (optional)",
                        "departmentId": "number (optional)",
                        "sectionId": "number (optional)"
                    },
                    "responseSuccess": {
                        "status": 200,
                        "body": {
                            "students": [
                                {
                                    "id": "number",
                                    "studentId": "string (e.g., 2023IT001)",
                                    "name": "string",
                                    "email": "string",
                                    "phone": "string",
                                    "batch": "object",
                                    "course": "object",
                                    "department": "object",
                                    "section": "object"
                                }
                            ],
                            "total": "number",
                            "page": "number",
                            "limit": "number"
                        }
                    }
                },
                {
                    "method": "POST",
                    "path": "/api/admin/students",
                    "description": "Onboard new student",
                    "accessRoles": ["super_admin"],
                    "requestBody": {
                        "name": "string (required)",
                        "email": "string (required)",
                        "phone": "string (required)",
                        "address": "string (optional)",
                        "batchId": "number (required)",
                        "courseId": "number (required)",
                        "departmentId": "number (required)",
                        "sectionId": "number (required)"
                    },
                    "responseSuccess": {
                        "status": 201,
                        "body": {
                            "student": {
                                "id": "number",
                                "studentId": "string",
                                "name": "string",
                                "email": "string"
                            },
                            "credentials": {
                                "studentId": "string",
                                "temporaryPassword": "string"
                            },
                            "message": "Student created successfully. Credentials sent to email."
                        }
                    },
                    "responseError": [
                        {
                            "status": 400,
                            "body": {
                                "error": "Email already exists"
                            }
                        },
                        {
                            "status": 400,
                            "body": {
                                "error": "Section capacity exceeded"
                            }
                        }
                    ]
                },
                {
                    "method": "POST",
                    "path": "/api/admin/students/bulk-import",
                    "description": "Import multiple students via CSV",
                    "accessRoles": ["super_admin"],
                    "requestBody": {
                        "type": "multipart/form-data",
                        "fields": {
                            "file": "CSV file with columns: name, email, phone, batchId, courseId, departmentId, sectionId"
                        }
                    },
                    "responseSuccess": {
                        "status": 201,
                        "body": {
                            "imported": "number",
                            "failed": "number",
                            "errors": [
                                {
                                    "row": "number",
                                    "error": "string"
                                }
                            ],
                            "message": "Bulk import completed"
                        }
                    },
                    "responseError": [
                        {
                            "status": 207,
                            "body": {
                                "imported": "number",
                                "failed": "number",
                                "errors": ["array of error objects"]
                            }
                        }
                    ]
                },
                {
                    "method": "GET",
                    "path": "/api/admin/students/:id",
                    "description": "Get detailed student profile",
                    "accessRoles": ["super_admin", "faculty"],
                    "pathParams": {
                        "id": "number (student ID)"
                    },
                    "responseSuccess": {
                        "status": 200,
                        "body": {
                            "id": "number",
                            "studentId": "string",
                            "name": "string",
                            "email": "string",
                            "phone": "string",
                            "address": "string",
                            "batch": "object",
                            "course": "object",
                            "department": "object",
                            "section": "object",
                            "examHistory": ["array of exam records"]
                        }
                    }
                },
                {
                    "method": "PUT",
                    "path": "/api/admin/students/:id",
                    "description": "Update student information",
                    "accessRoles": ["super_admin"],
                    "pathParams": {
                        "id": "number (student ID)"
                    },
                    "requestBody": {
                        "name": "string (optional)",
                        "phone": "string (optional)",
                        "address": "string (optional)",
                        "sectionId": "number (optional)"
                    },
                    "responseSuccess": {
                        "status": 200,
                        "body": {
                            "student": "object",
                            "message": "Student updated successfully"
                        }
                    }
                },
                {
                    "method": "POST",
                    "path": "/api/admin/students/:id/transfer-section",
                    "description": "Transfer student to different section",
                    "accessRoles": ["super_admin"],
                    "pathParams": {
                        "id": "number (student ID)"
                    },
                    "requestBody": {
                        "newSectionId": "number (required)"
                    },
                    "responseSuccess": {
                        "status": 200,
                        "body": {
                            "message": "Student transferred successfully",
                            "oldSection": "object",
                            "newSection": "object"
                        }
                    },
                    "responseError": [
                        {
                            "status": 400,
                            "body": {
                                "error": "New section capacity exceeded"
                            }
                        }
                    ]
                },
                {
                    "method": "DELETE",
                    "path": "/api/admin/students/:id",
                    "description": "Delete student account (soft delete)",
                    "accessRoles": ["super_admin"],
                    "pathParams": {
                        "id": "number (student ID)"
                    },
                    "responseSuccess": {
                        "status": 200,
                        "body": {
                            "message": "Student archived successfully"
                        }
                    }
                }
            ],
            "flowDiagram": "student_management_flow",
            "sequenceDiagram": "student_management_sequence"
        }
    ],
    "diagrams": {
        "authentication_flow": {
            "type": "flowchart",
            "title": "JWT Authentication Flow",
            "mermaidCode": "flowchart TD\n    A[User Opens App] --> B{Has Valid Access Token?}\n    B -->|Yes| C[Access Protected Resources]\n    B -->|No| D{Has Refresh Token Cookie?}"
        },
        "authentication_sequence": {
            "type": "sequence",
            "title": "Authentication Sequence",
            "mermaidCode": "sequenceDiagram\n    participant U as User\n    participant F as Frontend\n    participant B as Backend\n    participant DB as Database"
        }
    },
    "errorCodes": [
        {
            "code": 400,
            "name": "Bad Request",
            "description": "Invalid request parameters or validation errors"
        },
        {
            "code": 401,
            "name": "Unauthorized",
            "description": "Authentication required or invalid credentials"
        },
        {
            "code": 403,
            "name": "Forbidden",
            "description": "Insufficient permissions to access resource"
        },
        {
            "code": 404,
            "name": "Not Found",
            "description": "Requested resource does not exist"
        },
        {
            "code": 409,
            "name": "Conflict",
            "description": "Resource conflict (e.g., duplicate email, cannot delete)"
        },
        {
            "code": 500,
            "name": "Internal Server Error",
            "description": "Unexpected server error"
        }
    ],
    "gettingStarted": {
        "title": "Getting Started",
        "sections": [
            {
                "id": "prerequisites",
                "name": "Prerequisites",
                "description": "Required software and tools before installation",
                "requirements": [
                    {
                        "name": "Node.js",
                        "version": ">=16.0.0",
                        "description": "JavaScript runtime environment",
                        "downloadUrl": "https://nodejs.org/"
                    },
                    {
                        "name": "PostgreSQL",
                        "version": ">=13.0",
                        "description": "Relational database management system",
                        "downloadUrl": "https://www.postgresql.org/"
                    },
                    {
                        "name": "npm or yarn",
                        "version": ">=7.0.0",
                        "description": "Package manager for Node.js",
                        "downloadUrl": "https://www.npmjs.com/"
                    },
                    {
                        "name": "Git",
                        "version": ">=2.0.0",
                        "description": "Version control system",
                        "downloadUrl": "https://git-scm.com/"
                    }
                ],
                "systemRequirements": {
                    "cpu": "Dual-core processor or better",
                    "ram": "4GB minimum, 8GB recommended",
                    "storage": "1GB free disk space",
                    "os": "Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)"
                }
            },
            {
                "id": "installation",
                "name": "Installation & Setup",
                "description": "Step-by-step installation instructions",
                "steps": [
                    {
                        "step": 1,
                        "title": "Clone Repository",
                        "commands": [
                            "git clone https://github.com/your-org/academic-management-system.git",
                            "cd academic-management-system"
                        ],
                        "description": "Clone the project repository from GitHub"
                    },
                    {
                        "step": 2,
                        "title": "Install Backend Dependencies",
                        "commands": [
                            "cd backend",
                            "npm install"
                        ],
                        "description": "Install all required backend packages"
                    },
                    {
                        "step": 3,
                        "title": "Install Frontend Dependencies",
                        "commands": [
                            "cd ../frontend",
                            "npm install"
                        ],
                        "description": "Install all required frontend packages"
                    },
                    {
                        "step": 4,
                        "title": "Setup Database",
                        "commands": [
                            "createdb academic_management",
                            "cd ../backend",
                            "npm run migrate"
                        ],
                        "description": "Create PostgreSQL database and run migrations"
                    },
                    {
                        "step": 5,
                        "title": "Configure Environment",
                        "commands": [
                            "cp .env.example .env",
                            "# Edit .env with your configuration"
                        ],
                        "description": "Setup environment variables"
                    },
                    {
                        "step": 6,
                        "title": "Seed Database (Optional)",
                        "commands": [
                            "npm run seed"
                        ],
                        "description": "Populate database with sample data for testing"
                    }
                ]
            },
            {
                "id": "environment_configuration",
                "name": "Environment Configuration",
                "description": "Configuration of environment variables",
                "envVariables": {
                    "backend": [
                        {
                            "name": "PORT",
                            "required": true,
                            "default": "5000",
                            "description": "Port number for the backend server",
                            "example": "5000"
                        },
                        {
                            "name": "NODE_ENV",
                            "required": true,
                            "default": "development",
                            "description": "Environment mode (development, production, test)",
                            "example": "production"
                        },
                        {
                            "name": "DATABASE_URL",
                            "required": true,
                            "default": null,
                            "description": "PostgreSQL connection string",
                            "example": "postgresql://user:password@localhost:5432/academic_management"
                        },
                        {
                            "name": "JWT_SECRET",
                            "required": true,
                            "default": null,
                            "description": "Secret key for JWT token generation (min 32 characters)",
                            "example": "your-super-secret-jwt-key-min-32-chars"
                        },
                        {
                            "name": "JWT_REFRESH_SECRET",
                            "required": true,
                            "default": null,
                            "description": "Secret key for refresh token generation",
                            "example": "your-super-secret-refresh-key-min-32-chars"
                        },
                        {
                            "name": "JWT_EXPIRES_IN",
                            "required": false,
                            "default": "15m",
                            "description": "Access token expiration time",
                            "example": "15m"
                        },
                        {
                            "name": "JWT_REFRESH_EXPIRES_IN",
                            "required": false,
                            "default": "7d",
                            "description": "Refresh token expiration time",
                            "example": "7d"
                        },
                        {
                            "name": "SMTP_HOST",
                            "required": true,
                            "default": null,
                            "description": "SMTP server hostname for email",
                            "example": "smtp.gmail.com"
                        },
                        {
                            "name": "SMTP_PORT",
                            "required": true,
                            "default": "587",
                            "description": "SMTP server port",
                            "example": "587"
                        },
                        {
                            "name": "SMTP_USER",
                            "required": true,
                            "default": null,
                            "description": "SMTP authentication username",
                            "example": "your-email@gmail.com"
                        },
                        {
                            "name": "SMTP_PASSWORD",
                            "required": true,
                            "default": null,
                            "description": "SMTP authentication password",
                            "example": "your-app-password"
                        },
                        {
                            "name": "CORS_ORIGIN",
                            "required": true,
                            "default": "http://localhost:3000",
                            "description": "Allowed CORS origin(s)",
                            "example": "https://yourdomain.com"
                        },
                        {
                            "name": "RATE_LIMIT_WINDOW",
                            "required": false,
                            "default": "15",
                            "description": "Rate limiting window in minutes",
                            "example": "15"
                        },
                        {
                            "name": "RATE_LIMIT_MAX_REQUESTS",
                            "required": false,
                            "default": "100",
                            "description": "Maximum requests per window",
                            "example": "100"
                        }
                    ],
                    "frontend": [
                        {
                            "name": "REACT_APP_API_URL",
                            "required": true,
                            "default": "http://localhost:5000",
                            "description": "Backend API base URL",
                            "example": "https://api.yourdomain.com"
                        },
                        {
                            "name": "REACT_APP_ENV",
                            "required": false,
                            "default": "development",
                            "description": "Frontend environment mode",
                            "example": "production"
                        }
                    ]
                }
            },
            {
                "id": "quick_start",
                "name": "Quick Start Guide",
                "description": "Get up and running quickly",
                "steps": [
                    {
                        "title": "Start Backend Server",
                        "description": "Run the backend development server",
                        "commands": [
                            "cd backend",
                            "npm run dev"
                        ],
                        "expectedOutput": "Server running on http://localhost:5000"
                    },
                    {
                        "title": "Start Frontend Application",
                        "description": "Run the frontend development server",
                        "commands": [
                            "cd frontend",
                            "npm start"
                        ],
                        "expectedOutput": "Application running on http://localhost:3000"
                    },
                    {
                        "title": "Access Application",
                        "description": "Login with default admin credentials",
                        "credentials": {
                            "email": "admin@academic.com",
                            "password": "Admin@123"
                        },
                        "url": "http://localhost:3000/login"
                    },
                    {
                        "title": "Verify Installation",
                        "description": "Check if all services are running properly",
                        "healthChecks": [
                            {
                                "service": "Backend API",
                                "url": "http://localhost:5000/api/health",
                                "expectedStatus": 200
                            },
                            {
                                "service": "Database Connection",
                                "url": "http://localhost:5000/api/health/db",
                                "expectedStatus": 200
                            }
                        ]
                    }
                ]
            }
        ]
    },
    "databaseSchema": {
        "title": "Database Schema",
        "description": "Complete database structure and relationships",
        "erd": {
            "title": "Entity Relationship Diagram",
            "description": "Visual representation of database entities and their relationships",
            "mermaidCode": `erDiagram
    USERS ||--o{ STUDENTS : "is"
    USERS ||--o{ FACULTY : "is"
    BATCHES ||--o{ STUDENTS : "contains"
    COURSES ||--o{ BATCHES : "associated_with"
    DEPARTMENTS ||--o{ BATCHES : "associated_with"
    DEPARTMENTS ||--o{ SECTIONS : "has"
    SECTIONS ||--o{ STUDENTS : "contains"
    COURSES ||--o{ SUBJECTS : "has"
    SUBJECTS ||--o{ FACULTY : "taught_by"
    SECTIONS ||--o{ FACULTY : "assigned_to"
    
    USERS {
        int id PK
        string email UK
        string password_hash
        enum role
        datetime created_at
        datetime updated_at
    }
    
    STUDENTS {
        int id PK
        int user_id FK
        string student_id UK
        string name
        string phone
        string address
        int batch_id FK
        int course_id FK
        int department_id FK
        int section_id FK
        datetime created_at
    }
    
    FACULTY {
        int id PK
        int user_id FK
        string faculty_id UK
        string name
        string phone
        string specialization
        int department_id FK
        datetime created_at
    }
    
    BATCHES {
        int id PK
        int start_year
        int end_year
        string name
        boolean is_active
        datetime created_at
    }
    
    COURSES {
        int id PK
        string code UK
        string name
        string description
        int duration_years
        datetime created_at
    }
    
    DEPARTMENTS {
        int id PK
        string code UK
        string name
        string description
        datetime created_at
    }
    
    SECTIONS {
        int id PK
        string name
        int department_id FK
        int capacity
        int current_enrollment
        datetime created_at
    }
    
    SUBJECTS {
        int id PK
        string code UK
        string name
        int course_id FK
        int semester
        int credits
        datetime created_at
    }`
        },
        "tables": [
            {
                "name": "users",
                "description": "Core authentication table for all system users",
                "columns": [
                    {
                        "name": "id",
                        "type": "SERIAL",
                        "constraints": ["PRIMARY KEY"],
                        "description": "Unique identifier"
                    },
                    {
                        "name": "email",
                        "type": "VARCHAR(255)",
                        "constraints": ["NOT NULL", "UNIQUE"],
                        "description": "User email address"
                    },
                    {
                        "name": "password_hash",
                        "type": "VARCHAR(255)",
                        "constraints": ["NOT NULL"],
                        "description": "Bcrypt hashed password"
                    },
                    {
                        "name": "role",
                        "type": "VARCHAR(50)",
                        "constraints": ["NOT NULL", "CHECK(role IN ('super_admin', 'faculty', 'student'))"],
                        "description": "User role"
                    },
                    {
                        "name": "is_active",
                        "type": "BOOLEAN",
                        "constraints": ["DEFAULT TRUE"],
                        "description": "Account status"
                    },
                    {
                        "name": "last_login",
                        "type": "TIMESTAMP",
                        "constraints": [],
                        "description": "Last login timestamp"
                    },
                    {
                        "name": "created_at",
                        "type": "TIMESTAMP",
                        "constraints": ["DEFAULT CURRENT_TIMESTAMP"],
                        "description": "Record creation time"
                    },
                    {
                        "name": "updated_at",
                        "type": "TIMESTAMP",
                        "constraints": ["DEFAULT CURRENT_TIMESTAMP"],
                        "description": "Last update time"
                    }
                ],
                "indexes": [
                    {
                        "name": "idx_users_email",
                        "columns": ["email"],
                        "type": "UNIQUE"
                    },
                    {
                        "name": "idx_users_role",
                        "columns": ["role"],
                        "type": "BTREE"
                    }
                ]
            },
            {
                "name": "students",
                "description": "Student profile information",
                "columns": [
                    {
                        "name": "id",
                        "type": "SERIAL",
                        "constraints": ["PRIMARY KEY"],
                        "description": "Unique identifier"
                    },
                    {
                        "name": "user_id",
                        "type": "INTEGER",
                        "constraints": ["FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE"],
                        "description": "Reference to users table"
                    },
                    {
                        "name": "student_id",
                        "type": "VARCHAR(20)",
                        "constraints": ["NOT NULL", "UNIQUE"],
                        "description": "Student registration number"
                    },
                    {
                        "name": "name",
                        "type": "VARCHAR(255)",
                        "constraints": ["NOT NULL"],
                        "description": "Student full name"
                    },
                    {
                        "name": "phone",
                        "type": "VARCHAR(15)",
                        "constraints": ["NOT NULL"],
                        "description": "Contact number"
                    },
                    {
                        "name": "address",
                        "type": "TEXT",
                        "constraints": [],
                        "description": "Residential address"
                    },
                    {
                        "name": "batch_id",
                        "type": "INTEGER",
                        "constraints": ["FOREIGN KEY REFERENCES batches(id)"],
                        "description": "Associated batch"
                    },
                    {
                        "name": "course_id",
                        "type": "INTEGER",
                        "constraints": ["FOREIGN KEY REFERENCES courses(id)"],
                        "description": "Enrolled course"
                    },
                    {
                        "name": "department_id",
                        "type": "INTEGER",
                        "constraints": ["FOREIGN KEY REFERENCES departments(id)"],
                        "description": "Department assignment"
                    },
                    {
                        "name": "section_id",
                        "type": "INTEGER",
                        "constraints": ["FOREIGN KEY REFERENCES sections(id)"],
                        "description": "Section assignment"
                    },
                    {
                        "name": "created_at",
                        "type": "TIMESTAMP",
                        "constraints": ["DEFAULT CURRENT_TIMESTAMP"],
                        "description": "Record creation time"
                    }
                ],
                "indexes": [
                    {
                        "name": "idx_students_student_id",
                        "columns": ["student_id"],
                        "type": "UNIQUE"
                    },
                    {
                        "name": "idx_students_batch_course",
                        "columns": ["batch_id", "course_id"],
                        "type": "BTREE"
                    }
                ]
            },
            {
                "name": "batches",
                "description": "Academic batch/year groups",
                "columns": [
                    {
                        "name": "id",
                        "type": "SERIAL",
                        "constraints": ["PRIMARY KEY"],
                        "description": "Unique identifier"
                    },
                    {
                        "name": "start_year",
                        "type": "INTEGER",
                        "constraints": ["NOT NULL"],
                        "description": "Starting year"
                    },
                    {
                        "name": "end_year",
                        "type": "INTEGER",
                        "constraints": ["NOT NULL"],
                        "description": "Ending year"
                    },
                    {
                        "name": "name",
                        "type": "VARCHAR(50)",
                        "constraints": ["NOT NULL", "UNIQUE"],
                        "description": "Batch name (auto-generated)"
                    },
                    {
                        "name": "is_active",
                        "type": "BOOLEAN",
                        "constraints": ["DEFAULT TRUE"],
                        "description": "Active status"
                    },
                    {
                        "name": "created_at",
                        "type": "TIMESTAMP",
                        "constraints": ["DEFAULT CURRENT_TIMESTAMP"],
                        "description": "Record creation time"
                    }
                ]
            }
        ],
        "relationships": [
            {
                "from": "students",
                "to": "users",
                "type": "one-to-one",
                "foreignKey": "user_id",
                "onDelete": "CASCADE",
                "description": "Each student has one user account"
            },
            {
                "from": "students",
                "to": "batches",
                "type": "many-to-one",
                "foreignKey": "batch_id",
                "onDelete": "RESTRICT",
                "description": "Many students belong to one batch"
            },
            {
                "from": "students",
                "to": "sections",
                "type": "many-to-one",
                "foreignKey": "section_id",
                "onDelete": "RESTRICT",
                "description": "Many students belong to one section"
            }
        ]
    },
    "authenticationSecurity": {
        "title": "Authentication & Security",
        "sections": [
            {
                "id": "jwt_flow",
                "name": "JWT Token Flow",
                "description": "Complete authentication flow using JWT tokens",
                "flowDiagram": `flowchart TD
    A[User Submits Login] --> B[Backend Validates Credentials]
    B --> C{Valid?}
    C -->|No| D[Return 401 Error]
    C -->|Yes| E[Generate Access Token JWT]
    E --> F[Generate Refresh Token]
    F --> G[Store Refresh Token in HttpOnly Cookie]
    G --> H[Return Access Token in Response]
    H --> I[Frontend Stores Access Token in Memory]
    I --> J[User Makes API Request]
    J --> K{Access Token Valid?}
    K -->|Yes| L[Process Request]
    K -->|No| M{Refresh Token Valid?}
    M -->|Yes| N[Issue New Access Token]
    M -->|No| O[Redirect to Login]
    N --> J`,
                "components": [
                    {
                        "name": "Access Token",
                        "type": "JWT",
                        "storage": "Memory (Frontend State)",
                        "lifetime": "15 minutes",
                        "payload": {
                            "userId": "number",
                            "email": "string",
                            "role": "string",
                            "iat": "timestamp",
                            "exp": "timestamp"
                        },
                        "purpose": "Short-lived token for API authentication"
                    },
                    {
                        "name": "Refresh Token",
                        "type": "JWT",
                        "storage": "HttpOnly Cookie",
                        "lifetime": "7 days",
                        "payload": {
                            "userId": "number",
                            "tokenVersion": "number",
                            "iat": "timestamp",
                            "exp": "timestamp"
                        },
                        "purpose": "Long-lived token for renewing access tokens"
                    }
                ],
                "securityFeatures": [
                    "HttpOnly cookies prevent XSS attacks on refresh tokens",
                    "Short-lived access tokens minimize exposure window",
                    "Token version tracking allows immediate revocation",
                    "Secure flag ensures HTTPS-only transmission",
                    "SameSite attribute prevents CSRF attacks"
                ]
            },
            {
                "id": "password_policies",
                "name": "Password Policies",
                "description": "Password requirements and security measures",
                "requirements": {
                    "minLength": 8,
                    "maxLength": 128,
                    "requireUppercase": true,
                    "requireLowercase": true,
                    "requireNumber": true,
                    "requireSpecialChar": true,
                    "specialChars": "!@#$%^&*()_+-=[]{}|;:,.<>?",
                    "preventCommonPasswords": true,
                    "preventUserInfoInPassword": true
                },
                "validation": {
                    "regex": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                    "errorMessages": {
                        "tooShort": "Password must be at least 8 characters",
                        "noUppercase": "Password must contain at least one uppercase letter",
                        "noLowercase": "Password must contain at least one lowercase letter",
                        "noNumber": "Password must contain at least one number",
                        "noSpecialChar": "Password must contain at least one special character"
                    }
                },
                "hashing": {
                    "algorithm": "bcrypt",
                    "saltRounds": 10,
                    "description": "Uses bcrypt with 10 salt rounds for secure password hashing"
                },
                "passwordReset": {
                    "tokenExpiry": "1 hour",
                    "method": "Email-based reset link",
                    "maxAttempts": 3,
                    "lockoutDuration": "15 minutes"
                }
            },
            {
                "id": "session_management",
                "name": "Session Management",
                "description": "How user sessions are handled and maintained",
                "features": [
                    {
                        "name": "Automatic Token Refresh",
                        "description": "Silently refreshes access tokens before expiration",
                        "implementation": "Frontend checks token expiry every 5 minutes and refreshes if needed"
                    },
                    {
                        "name": "Concurrent Session Handling",
                        "description": "Allows multiple active sessions per user",
                        "limit": "Maximum 5 concurrent sessions"
                    },
                    {
                        "name": "Session Timeout",
                        "description": "Auto-logout after inactivity period",
                        "timeout": "30 minutes of inactivity"
                    },
                    {
                        "name": "Remember Me",
                        "description": "Extended session duration option",
                        "duration": "30 days (if enabled)"
                    }
                ],
                "logout": {
                    "clientSide": [
                        "Clear access token from memory",
                        "Clear user data from state",
                        "Redirect to login page"
                    ],
                    "serverSide": [
                        "Invalidate refresh token",
                        "Clear HttpOnly cookie",
                        "Update last_logout timestamp"
                    ]
                }
            },
            {
                "id": "security_best_practices",
                "name": "Security Best Practices",
                "description": "Implemented security measures and recommendations",
                "implemented": [
                    {
                        "practice": "HTTPS Only",
                        "description": "All production traffic must use HTTPS",
                        "enforcement": "HSTS headers with 1-year max-age"
                    },
                    {
                        "practice": "CORS Configuration",
                        "description": "Strict CORS policy for API access",
                        "settings": {
                            "allowedOrigins": ["Configured frontend domains only"],
                            "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
                            "allowCredentials": true
                        }
                    },
                    {
                        "practice": "SQL Injection Prevention",
                        "description": "Parameterized queries and ORM usage",
                        "method": "All database queries use prepared statements"
                    },
                    {
                        "practice": "XSS Protection",
                        "description": "Input sanitization and output encoding",
                        "measures": [
                            "HTML entity encoding for user-generated content",
                            "Content Security Policy headers",
                            "React's built-in XSS protection"
                        ]
                    },
                    {
                        "practice": "CSRF Protection",
                        "description": "Cross-Site Request Forgery prevention",
                        "method": "SameSite cookie attribute + custom headers"
                    },
                    {
                        "practice": "Rate Limiting",
                        "description": "Prevent brute force and DoS attacks",
                        "limits": {
                            "login": "5 attempts per 15 minutes",
                            "api": "100 requests per 15 minutes",
                            "passwordReset": "3 attempts per hour"
                        }
                    }
                ],
                "recommendations": [
                    "Regularly update dependencies for security patches",
                    "Enable database query logging in production",
                    "Implement API request/response logging",
                    "Set up monitoring for suspicious activities",
                    "Conduct regular security audits",
                    "Use environment variables for sensitive data",
                    "Implement IP whitelisting for admin access (optional)"
                ]
            },
            {
                "id": "rate_limiting",
                "name": "Rate Limiting",
                "description": "API rate limiting configuration and policies",
                "globalLimits": {
                    "windowMs": 900000,
                    "maxRequests": 100,
                    "message": "Too many requests, please try again later",
                    "standardHeaders": true,
                    "legacyHeaders": false
                },
                "endpointSpecificLimits": [
                    {
                        "endpoint": "/api/auth/login",
                        "windowMs": 900000,
                        "maxRequests": 5,
                        "message": "Too many login attempts, please try again after 15 minutes"
                    },
                    {
                        "endpoint": "/api/auth/forgot-password",
                        "windowMs": 3600000,
                        "maxRequests": 3,
                        "message": "Too many password reset requests, please try again after 1 hour"
                    },
                    {
                        "endpoint": "/api/admin/students/bulk-import",
                        "windowMs": 3600000,
                        "maxRequests": 10,
                        "message": "Bulk import limit reached, please try again later"
                    }
                ],
                "implementation": {
                    "library": "express-rate-limit",
                    "storage": "Redis (production) / Memory (development)",
                    "skipSuccessfulRequests": false,
                    "skipFailedRequests": false
                }
            }
        ]
    },
    "workflows": {
    }
}
