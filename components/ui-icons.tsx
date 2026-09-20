export function Globe() {
  return <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/></svg>;
}

export function ContactIcon({ type }: { type: "chat" | "phone" | "form" | "message" }) {
  return <svg aria-hidden="true" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {type === "chat" && <><path d="M21 10.5c0 4.4-4 7.5-9 7.5H8l-4 3v-5a7 7 0 0 1-2-5.5C2 6.1 6 3 11.5 3S21 6.1 21 10.5Z"/><path d="M7 10h.01M12 10h.01M17 10h.01"/></>}
    {type === "phone" && <path d="m7 3 3 5-3 3c1 3 3 5 6 6l3-3 5 3c0 3-2 5-5 4C8 19 4 15 2 7 1 4 4 2 7 3Z"/>}
    {type === "form" && <><rect x="5" y="3" width="14" height="19" rx="2"/><path d="M9 7h6M9 11h6M9 15h3"/></>}
    {type === "message" && <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/></>}
  </svg>;
}
