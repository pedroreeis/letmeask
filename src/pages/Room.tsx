import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';

import toast, { Toaster } from 'react-hot-toast';

import { RoomCode } from '../components/RoomCode'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { PageLoading } from '../components/PageLoading';
import { ModalComponent } from '../components/Modal';

import '../styles/room.scss';
import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

import { FormEvent, useEffect, useState  } from 'react';
import { useRoom } from '../hooks/useRoom';
import { useTheme } from '../hooks/useTheme';

type RoomParams = {
  id: string;
}

export function Room() {
  const {user, signInWithGoogle} = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const history = useHistory();

  const roomId = params.id;

  const { questions, title, endedAt, isOpen } = useRoom(roomId);

  const { theme } = useTheme();

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.get().then(room => {
      if(room.val().endedAt) {
        history.push('/');
      }
    })
  }, [roomId, history])

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

      if (newQuestion.trim() === '') {
        return;
      }

      if (!user) {
        toast.error("Você não está logado.");
        return;
      }

      const question = {
        content: newQuestion,
        author: {
          name: user.name,
          avatar: user.avatar
        },
        isHighlighted: false,
        isAnswered: false
      };


      await database.ref(`rooms/${roomId}/questions`).push(question);
      toast.success("Você enviou uma pergunta!");

      setNewQuestion('');
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()

      toast.success('Você retirou a curtida de uma pergunta!');
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id
      })
  
      toast.success('Você curtiu uma pergunta!');
    }
  }

  if (endedAt === undefined) {
		return <PageLoading />;
	}

  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          <img src={logoImg} alt="Logomarca da letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>
      
      <main>
      <Toaster />
      <ModalComponent show={isOpen} />

        <div className={"room-title"}>
          <h1 className={theme}>Sala {title}</h1>

          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="O que você deseja perguntar ?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
            className={theme}
          />

          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span className={theme}>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button onClick={signInWithGoogle}>faça seu login</button>.</span>
            ) }
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        <div className="question-list">
        {questions.map(questions => {
          return (
            <Question 
              key={questions.id}
              content={questions.content}
              author={questions.author}
              isAnswered={questions.isAnswered}
              isHighlighted={questions.isHighlighted}
            >
              { !questions.isAnswered && (
                <button className={`like-button ${questions.likeId ? 'liked' : ''}`} type="button" aria-label="Marcar como gostei" onClick={() => handleLikeQuestion(questions.id, questions.likeId)}>
                { questions.likeCount > 0 && <span>{questions.likeCount}</span> }
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </button>
              ) }
            </Question>
          )
        })}
        </div>
      </main>
    </div>
  );
} 