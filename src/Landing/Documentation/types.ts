export interface ProjectInfo {
    name: string;
    version: string;
    lastUpdated: string;
    description: string;
}

export interface TechStack {
    frontend: string[];
    backend: string[];
    authentication: string[];
}

export interface OverviewSection {
    title: string;
    description: string;
    techStack: TechStack;
    features: string[];
}

export interface ArchitectureLayer {
    name: string;
    description: string;
    components: string[];
}

export interface Architecture {
    title: string;
    type: string;
    layers: ArchitectureLayer[];
}

export interface FileNode {
    name: string;
    type: "file" | "directory";
    description?: string;
    children?: FileNode[];
    files?: string[];
}

export interface FileStructure {
    backend: {
        root: string;
        structure: FileNode[];
    };
    frontend: {
        root: string;
        structure: FileNode[];
    };
}

export interface RoleInfo {
    name: string;
    key: string;
    description: string;
    permissions: string[];
    accessibleModules?: string[];
}

export interface ErrorResponse {
    status: number;
    body: Record<string, any>;
}

export interface EndpointResponse {
    status: number;
    body: Record<string, any>;
    headers?: Record<string, string>;
}

export interface Endpoint {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    description: string;
    accessRoles: string[];
    requestBody?: Record<string, any> | null;
    queryParams?: Record<string, string>;
    pathParams?: Record<string, string>;
    requestCookies?: Record<string, string>;
    responseSuccess: EndpointResponse;
    responseError?: ErrorResponse[];
}

export interface ApiModule {
    id: string;
    name: string;
    description: string;
    icon: string;
    endpoints: Endpoint[];
    flowDiagram?: string;
    sequenceDiagram?: string;
}

export interface ErrorCode {
    code: number;
    name: string;
    description: string;
}

export interface DocumentationData {
    project: ProjectInfo;
    overview: OverviewSection;
    architecture: Architecture;
    fileStructure: FileStructure;
    roles: RoleInfo[];
    apiModules: ApiModule[];
    errorCodes: ErrorCode[];
}