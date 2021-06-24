import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg'

import toast, { Toaster } from 'react-hot-toast';

import { RoomCode } from '../components/RoomCode'
import { Button } from '../components/Button'
import { Question } from '../components/Question'

import '../styles/room.scss';

import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  //const {user} = useAuth();
  const params = useParams<RoomParams>();
  const history = useHistory();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');

    toast.success('Você encerrou uma sala.');
  }

  async function handleDeleteQuestion(questionId: string) {
   if (window.confirm('Tem certeza que você deseja excluir esta pergunta ?')) {
     await database.ref(`rooms/${roomId}/questions/${questionId}`).remove() 

     toast.success('Você excluiu uma pergunta!')
   }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logomarca da letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>
      
      <main>
      <Toaster />

        <div className="room-title">
          <h1>Sala {title}</h1>

          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <div className="question-list">
        {questions.map(questions => {
          return (
            <Question 
              key={questions.id}
              content={questions.content}
              author={questions.author}
            >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(questions.id)}
              >
                <img src={deleteImg} alt="Excluir pergunta"/>
              </button>
            </Question>
          )
        })}
        </div>
      </main>
    </div>
  );
}