import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { VideoPlayer } from "../components/common/VideoPlayer";
import { PeerState } from "../reducers/peerReducer";
import { ShareScreenButtoon } from "../components/common/ShareScreenButton";
import { ChatButton } from "../components/common/ChatButton";
import { Chat } from "../components/chat/Chat";
import { MicroButton } from "../components/common/MicroButton";

export const Room = () => {
  const { id } = useParams()
  const { 
    ws, 
    chat, 
    me, 
    stream, 
    peers, 
    toggleChat, 
    shareScreen, 
    screenStream, 
    screenSharingId, 
    setRoomId,
    toggleMicrophone
  } = useContext(RoomContext);

  useEffect(() => {
    if (me) me.on('open', () => {
      ws.emit('join-room', { roomId: id, peerId: me._id });
    });
  }, [me, id, ws]);

  useEffect(() => {
    setRoomId(id);
  }, [id, setRoomId]);
  const screenSharingVideo = 
    me?.id === screenSharingId 
      ? screenStream 
      : peers[screenSharingId]?.stream;
  const { [screenSharingId]: sharing, ...peersToShow } = peers;


  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="flex grow">
        {screenSharingId && (
          <div className="w-4/5 pr-4">
            <VideoPlayer stream={screenSharingVideo} />
          </div>
        )}
        <div className={`grid gap-4 ${screenSharingId ? "w-1/5 grid-col-1" : "grid-cols-4"}`}>
          <VideoPlayer stream={stream} />
          {Object.values(peersToShow as PeerState).map((peer, ind) => (
            <VideoPlayer key={ind} stream={peer.stream} />

          ))}
        </div>
        {
          chat.isChatOpen && (<div className="ml-9 mr-9 mt-16 mb-16 rounded-t-2xl rounded-b-2xl z-50 py-4 bg-neutral-900">
            <Chat />
          </div>)
        }

        

      </div>

      <div className="fixed bottom-0 px-3 py-3 h-20 w-full flex justify-center border-t-2">
        <MicroButton onClick={toggleMicrophone}/>
        <ShareScreenButtoon onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
      </div>
    </div>
  );
}