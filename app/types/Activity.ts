export type Activity = {
  direction: "inbound" | "outbound";
  from: number;
  to: number;
  via: number;
  duration: number;
  is_archived: boolean;
  call_type: "missed" | "answered" | "voicemail";
  id: string;
  created_at: string;
};
