import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  isDonor: boolean;
  bloodGroup?: string;
  location?: string;
  contactNumber?: string;
  donorRegistrationTime?: Timestamp;
}

export interface BloodRequest {
  id?: string; // Firestore document ID
  requesterUid: string;
  patientName: string;
  requesterName: string; // Can be same as UserProfile.name or different
  bloodGroup: string;
  location: string; // General area, city, etc.
  hospitalName?: string; // Optional: specific hospital
  contactInfo: string; // Phone number or other contact means
  urgency: "low" | "medium" | "high";
  notes?: string;
  createdAt: Timestamp;
  status: "open" | "matched" | "closed";
}

export interface Donor {
  uid: string; // Same as UserProfile.uid
  name: string;
  bloodGroup: string;
  location: string;
  contactNumber: string;
  registrationTime: Timestamp;
}

export interface Hospital {
  id?: string; // Firestore document ID or static ID
  name: string;
  address: string;
  contactNumber: string;
  imageUrl: string;
  aiHint?: string; // For image search if using placeholders
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
