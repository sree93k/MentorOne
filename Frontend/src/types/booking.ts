export interface SaveBookingParams {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  day: string;
  slotIndex: number;
  sessionId: string;
  amount: number;
}

export interface UpdateSlotPayload {
  isAvailable?: boolean;
  menteeId?: string;
}

export interface RescheduleRequestParams {
  requestedDate?: string;
  requestedTime?: string;
  requestedSlotIndex?: number;
  mentorDecides: boolean;
}
