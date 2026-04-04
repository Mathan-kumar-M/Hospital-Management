export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'patient' | 'admin';
  phone?: string;
  photo?: string;
  createdAt: Date;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  departmentId: string;
  photo?: string;
  bio?: string;
  rating?: number;
  experience?: string;
  availability?: string[];
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  description?: string;
  doctorCount?: number;
  image?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  patientId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
