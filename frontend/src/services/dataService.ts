// src/services/dataService.ts
import api from "./api";

export type Provider = {
  userId: string;
  name: string;
  [k: string]: any;
};

export type Patient = {
  _id?: string;
  userId?: string;
  name?: string;
  illnesses?: string[];
  assignedProvider?: string;
  assignedProviderName?: string;
  [k: string]: any;
};

type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

// 1) Get Patient Data
export async function getPatientData(userId: string): Promise<Patient> {
  try {
    const { data } = await api.post<ApiResponse<Patient>>("/data/getPatientData", { userId });
    // backend might return user directly or inside data
    return data.data ?? (data as unknown as Patient);
  } catch (err: any) {
    // rethrow with readable message
    const message = err?.response?.data?.message ?? err.message ?? "Failed to fetch patient data";
    throw new Error(message);
  }
}

// 2) Add Patient Illness
export async function addPatientIllness(userId: string, illness: string): Promise<Patient> {
  try {
    const { data } = await api.post<ApiResponse<Patient>>("/data/addPatientIllness", { userId, illness });
    return data.data ?? (data as unknown as Patient);
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Failed to add illness";
    throw new Error(message);
  }
}

// 3) Get Providers
export async function getProviders(): Promise<Provider[]> {
  try {
    const { data } = await api.get<ApiResponse<Provider[]>>("/data/getProviders");
    return data.data ?? (data as unknown as Provider[]);
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Failed to fetch providers";
    throw new Error(message);
  }
}

// 4) Assign Provider to Patient
export async function assignProvider(patientId: string, providerId: string): Promise<{ message: string; patient: Patient }> {
  try {
    const { data } = await api.post<ApiResponse<{ message: string; patient: Patient }>>("/data/assignProvider", {
      patientId,
      providerId,
    });
    return data.data ?? (data as unknown as { message: string; patient: Patient });
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Failed to assign provider";
    throw new Error(message);
  }
}
