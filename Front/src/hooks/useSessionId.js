// src/hooks/useSessionId.js
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function useSessionId() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    let storedSessionId = localStorage.getItem('session_id');

    if (!storedSessionId) {
      storedSessionId = uuidv4(); // Genera un ID único
      localStorage.setItem('session_id', storedSessionId);
    }

    setSessionId(storedSessionId);
  }, []);

  return sessionId;
}
