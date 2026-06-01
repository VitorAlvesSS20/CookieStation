import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc
} from "firebase/firestore";

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  text: string;
  createdAt?: Date | number | { seconds: number };
};

type ChatUser = {
  uid: string;
  displayName?: string;
  photoURL?: string;
};

export const useChat = (chatId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(!chatId);

  useEffect(() => {
    if (!chatId) {
      return;
    }

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map((document) => ({
          id: document.id,
          ...(document.data() as Omit<ChatMessage, 'id'>),
        })) as ChatMessage[];
        setMessages(docs);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (user: ChatUser, text: string) => {
    if (!text.trim() || !chatId || !user) return;

    const chatRef = doc(db, "chats", chatId);
    const messagesRef = collection(db, "chats", chatId, "messages");

    await addDoc(messagesRef, {
      senderId: user.uid,
      senderName: user.displayName || "Escritor",
      senderPhoto: user.photoURL || "",
      text: text.trim(),
      createdAt: serverTimestamp(),
    });

    await updateDoc(chatRef, {
      lastUpdate: serverTimestamp(),
      lastMessage: text.trim(),
    });
  };

  return { messages, sendMessage, loading };
};