type ChannelKind = "chat" | "phone" | "form" | "message";
export type ConsultationChannel = {
  id: "kakao" | "phone" | "form" | "message";
  kind: ChannelKind;
  destination: string | null;
  available: boolean;
};

// Enable only after the agency confirms the destination and operating details.
export const consultationChannels: readonly ConsultationChannel[] = [
  { id: "kakao", kind: "chat", destination: null, available: false },
  { id: "phone", kind: "phone", destination: null, available: false },
  { id: "form", kind: "form", destination: null, available: false },
  { id: "message", kind: "message", destination: null, available: false },
];
