import { useState, useEffect } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

type QuestionType = {
  id: string,
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

export function useRoom(roomId: string) {
  const history = useHistory();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');
  const [endedAt, sedEndedAt] = useState<boolean | string | undefined>();
  const [authorId, setAuthorId] = useState<string>("");

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

      roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      })

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
      sedEndedAt(databaseRoom.endedAt || false);
      setAuthorId(databaseRoom.authorId);
    })

    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id])

  useEffect(() => {
		if (endedAt) {
			toast.info("Sala fechada!");

      setIsOpen(true);
			//history.push("/");
		}
	}, [endedAt, history]);

  return { questions, title, endedAt, authorId, isOpen, setIsOpen }
}