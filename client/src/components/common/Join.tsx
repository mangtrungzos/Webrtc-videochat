import React, { useContext } from 'react';
import { RoomContext } from '../../context/RoomContext';

const CreateButton: React.FC = ()=> {
  const {ws} = useContext(RoomContext)
  const joinRoom = () => {
    ws.emit("create-room")
  }
  return (
      <button onClick={ joinRoom } 
        className='bg-fuchsia-700 p-4 rounded-lg text-xl hover:bg-fuchsia-800 text-white w-[100%]'>
          Start new Meeting
      </button>
  );
}

export default CreateButton;
