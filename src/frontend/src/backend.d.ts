import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ChatRequest {
    context?: string;
    mode: Mode;
    message: string;
}
export interface UserProfile {
    name: string;
}
export interface ChatResponse {
    mode: Mode;
    history: Array<[string, string]>;
    response: string;
}
export enum Mode {
    scienceHelp = "scienceHelp",
    socialStudiesHelp = "socialStudiesHelp",
    languageArtsHelp = "languageArtsHelp",
    mathHelp = "mathHelp"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    chat(request: ChatRequest): Promise<ChatResponse>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getModePageIntroduction(mode: Mode): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
