import './styles.scss'

import Modal from 'react-modal'
import { Link, useHistory } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg';

type ModalProps = {
  show: boolean;
}

export function ModalComponent(props: ModalProps) {
  const history = useHistory();

  return (
    <Modal
    isOpen={props.show}
    onRequestClose={() => history.push('/')}
    contentLabel="Sala Encerrada!"
    className="modal-end-room"
  >
      <img src={logoImg} alt="Logo letmeask"/>
      <div className="separator"></div>
      <h2>Ops...</h2>
      <p>A sala que você estava foi encerrada.</p>
      <div className="separator">Você pode</div>
      <span><Link to="/">Volte para a home</Link></span>
  </Modal>
  )
}