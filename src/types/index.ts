export type UserRole = 'student' | 'teacher' | 'admin';
export type Tenant = 'engineering' | 'medical';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenant: Tenant;
  avatar?: string;
  createdAt: Date;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  building: string;
  floor: number;
  amenities: string[];
  tenant: Tenant;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  category: string;
  stock: number;
  image: string;
  tenant: Tenant;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  teacherId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  questions: Question[];
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  tenant: Tenant;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  points: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  answers: Record<string, string | number>;
  submittedAt: Date;
  score?: number;
}

export interface SensorData {
  id: string;
  sensorId: string;
  type: 'temperature' | 'humidity' | 'occupancy' | 'air-quality';
  value: number;
  unit: string;
  location: string;
  timestamp: Date;
}

export interface ShuttleLocation {
  id: string;
  shuttleId: string;
  name: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  status: 'active' | 'idle' | 'maintenance';
  lastUpdated: Date;
  route: string;
  nextStop: string;
  eta: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}
