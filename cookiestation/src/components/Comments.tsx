import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { Toast } from "../utils/swal";
import "../styles/comments.css";

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: Timestamp | null;
}

interface UserProfile {
  photoURL?: string;
  displayName?: string;
}

interface CommentsProps {
  storyId: string;
}

const Comments: React.FC<CommentsProps> = ({ storyId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState<UserProfile>({});

  // Gera o link do avatar padrão baseado no ID
  const getDefaultAvatar = (uid: string) => 
    `https://api.dicebear.com/8.x/notionists/svg?seed=${uid}`;

  // 1. Carrega dados atualizados do usuário logado para o formulário
  useEffect(() => {
    if (!user) {
      setCurrentUserData({});
      return;
    }
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setCurrentUserData(userSnap.data() as UserProfile);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
      }
    };
    fetchUserData();
  }, [user]);

  // 2. Escuta os comentários e gerencia os perfis dos autores dinamicamente
  useEffect(() => {
    if (!storyId) return;

    const commentsRef = collection(db, "stories", storyId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[];

        setComments(fetchedComments);
        setLoading(false);

        // Identifica IDs únicos de usuários que comentaram para buscar seus perfis atualizados
        const userIds = Array.from(new Set(fetchedComments.map((c) => c.userId)));
        
        userIds.forEach(async (uid) => {
          // Evita buscar novamente se o perfil já foi carregado nesta sessão
          if (profiles[uid]) return;

          try {
            const userSnap = await getDoc(doc(db, "users", uid));
            if (userSnap.exists()) {
              setProfiles((prev) => ({
                ...prev,
                [uid]: userSnap.data() as UserProfile,
              }));
            }
          } catch (err) {
            console.error(`Erro ao buscar perfil do usuário ${uid}:`, err);
          }
        });
      },
      (error) => {
        console.error("Erro Firebase (Permissões):", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [storyId, profiles]);

  // 3. Envio do comentário simplificado (não armazena mais a imagem dentro do comentário)
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      Toast.fire({ icon: "info", title: "Faça login para participar!" });
      return;
    }
    if (!newComment.trim()) return;

    try {
      const commentsRef = collection(db, "stories", storyId, "comments");
      
      await addDoc(commentsRef, {
        text: newComment.trim(),
        userId: user.uid,
        userName: currentUserData.displayName || user.displayName || "Cozinheiro Anônimo",
        createdAt: serverTimestamp(),
      });

      setNewComment("");
      Toast.fire({
        icon: "success",
        title: "Comentário enviado! 🍪",
        timer: 1500,
      });
    } catch (error) {
      console.error("Erro ao salvar comentário:", error);
      Toast.fire({ icon: "error", title: "Erro ao enviar." });
    }
  };

  // Avatar dinâmico para a caixa de digitação do formulário
  const formAvatar = currentUserData.photoURL || user?.photoURL || getDefaultAvatar(user?.uid || "default");

  return (
    <div className="comments-section fade-in">
      <h3>Conversas na Estação ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <img
            src={formAvatar}
            alt="Seu Avatar"
            className="comment-avatar"
            onError={(e) => {
              e.currentTarget.src = getDefaultAvatar(user.uid);
            }}
          />
          <div className="form-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione um ingrediente a essa conversa..."
              rows={3}
            />
            <button
              type="submit"
              className="btn-comment"
              disabled={!newComment.trim()}
            >
              Comentar
            </button>
          </div>
        </form>
      ) : (
        <div className="login-prompt">
          <p>
            Quer participar?{" "}
            <button className="btn-link" onClick={() => navigate("/login")}>
              Faça login
            </button>
          </p>
        </div>
      )}

      {loading ? (
        <p className="loading-comments">Carregando...</p>
      ) : comments.length === 0 ? (
        <p className="no-comments">Seja o primeiro a comentar!</p>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => {
            // Resolve em tempo real os dados atualizados vindos da coleção de usuários
            const userProfile = profiles[comment.userId];
            const liveAvatar = userProfile?.photoURL || getDefaultAvatar(comment.userId);
            const liveName = userProfile?.displayName || comment.userName;

            return (
              <div key={comment.id} className="comment-item fade-in">
                <img
                  src={liveAvatar}
                  alt={liveName}
                  className="comment-avatar"
                  onError={(e) => {
                    e.currentTarget.src = getDefaultAvatar(comment.userId);
                  }}
                />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{liveName}</span>
                    <span className="comment-date">
                      {comment.createdAt?.toDate
                        ? comment.createdAt.toDate().toLocaleDateString()
                        : "agora"}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Comments;