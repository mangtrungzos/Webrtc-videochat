import { createContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Peer, { MediaConnection } from 'peerjs';
import { v4 as uuidV4 } from 'uuid';
import { ws } from '../ws';
import { peerReducer } from '../reducers/peerReducer';
import { addPeerAction, removePeerAction } from '../reducers/peerActions';
import { IMessage } from '../types/chat';
import { chatReducer } from '../reducers/chatReducer';
import { addHistoryAction, addMessageAction, toggleChatAction } from '../reducers/chatActions';
// import { UserContext } from "./UserContext";
// import { IPeer } from '../types/peer';


export const RoomContext = createContext<any>(null);

export const RoomProvider = ({ children }: any) => {
    const navigate = useNavigate();
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [screenStream, setScreenStream] = useState<MediaStream>();
    // const { userName, userId } = useContext(UserContext);
    const [peers, dispatch] = useReducer(peerReducer, {});
    const [screenSharingId, setScreenSharingId] = useState<string>("");
    const [roomId, setRoomId] = useState<string>("");
    const [chat, chatDispatch] = useReducer(chatReducer,{
        messages:[],
        isChatOpen: false,
    });
    const [mic, setMicIsOn] = useState(true);

    const enterRoom = ({ roomId }: { roomId: string }) => {
        navigate(`room/${roomId}`);
    };

    // const getUsers = ({
    //     participants,
    // }: {
    //     participants: Record<string, IPeer>;
    // }) => {
    //     dispatch(addAllPeersAction(participants));
    // };

    const removePeer = (peerId: string) => {
        if( peerId === screenSharingId ){
            setScreenSharingId("");
        }
        dispatch(removePeerAction(peerId));
    };

    const streamCamera = () => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
            setStream(stream)
        });
    };

    const switchToCamStream = () => {
        Object.values(peers).forEach((element) => {
            const track = stream
                ?.getTracks()
                .find((track) => track.kind === "video") as MediaStreamTrack
            const call:MediaConnection = element.call;
            call.peerConnection
                .getSenders()[1]
                .replaceTrack(track)
                .catch(e =>  console.log(e))
        });
    };

    const switchStream = (st: MediaStream) => {
        setScreenStream(st);
        setScreenSharingId(me?.id || "");
        Object.values(peers).forEach((element) => {
            const track = st
                ?.getTracks()
                .find((track) => track.kind === "video") as MediaStreamTrack;
            const call:MediaConnection = element.call;
            call.peerConnection.getSenders()[1]
            .replaceTrack(track)
            .catch(e =>  console.log(e))
            track.onended = () => {
                ws.emit('stop-sharing',{peerId:screenSharingId,roomId});
                switchToCamStream();
            }
        });
    };

    const shareScreen = () => {
        if (screenSharingId) {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then(switchStream);
        } else {
            navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
                switchStream(stream);
                setScreenStream(stream);
            });
        }
    };
    
    const sendMessage = (message: string) => {
        const messageData:  IMessage = {
            content: message,
            timestamp: new Date().getTime(),
            author: me?.id,
        }
        chatDispatch(addMessageAction(messageData));
        ws.emit("send-message", roomId, messageData);
    }

    const addMessage = (message: IMessage) => {
        chatDispatch(addMessageAction(message));
        
    }

    const addHistory = (message: IMessage[]) => {
        chatDispatch(addHistoryAction(message));
        
    }

    const toggleChat = () => {
        chatDispatch(toggleChatAction(chat.isChatOpen));
    }

    const toggleMicrophone = () => {
        setMicIsOn(!mic);
    };

    useEffect(() => {
        const meId = uuidV4();
        const peer = new Peer(meId);
        setMe(peer);

        try {
            streamCamera();
        } catch (e) {
            alert("Some error occured");

        }

        ws.on("room-created", enterRoom);
        // ws.on('get-users', getUsers);
        ws.on('user-disconnected', removePeer);
        ws.on('user-started-sharing', (peerId) => setScreenSharingId(peerId));
        ws.on('user-stopped-sharing',()=>setScreenSharingId(""));
        ws.on("add-message",addMessage);
        ws.on("get-messages",addHistory);

        return () => {
            ws.off("room-created");
            // ws.off('get-users');
            ws.off("user-joined");
            ws.off("user-disconnected");
            ws.off("user-shared-screen");
            ws.off("user-stop-sharing");
            ws.off("add-message");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        if(screenSharingId.length!==0){
            ws.emit("start-sharing",{peerId: screenSharingId,roomId});
        }else{
            ws.emit("stop-sharing",{peerId: screenSharingId,roomId});
        }
    },[screenSharingId,roomId]);
    useEffect(() => {
        if (!me || !stream) return;
        ws.on('user-joined', ({ peerId }) => {
            const call = me.call(peerId, stream);
            call.on('stream', (peerstream: any) => {
                dispatch(addPeerAction(call.peer, peerstream,call));

            });
        });
        me.on('call', (call: any) => {
            call.answer(stream);
            call.on('stream', (callerstream: MediaStream) => {
                dispatch(addPeerAction(call.peer, callerstream,call));
            });
        });
    }, [me,stream]);

    return (
    <RoomContext.Provider 
        value={{ 
            ws, 
            me, 
            stream, 
            peers, 
            chat,
            toggleChat, 
            shareScreen,
            screenStream, 
            screenSharingId, 
            setRoomId , 
            sendMessage,
            mic,
            toggleMicrophone
        }}>
        {children}
    </RoomContext.Provider>);
}