import React, { useContext } from 'react';
import { RoomContext } from '../../context/RoomContext';

export const CreateButton: React.FC = ()=> {
  const {ws} = useContext(RoomContext)
  const joinRoom = () => {
    ws.emit("create-room")
  }
  return (
      <button onClick={ joinRoom } 
        className='bg-blue-500 p-4 rounded-lg text-xl hover:bg-blue-600 text-white w-[100%]'>
          Start new Meeting
      </button>
  );
}

// export default CreateButton;
