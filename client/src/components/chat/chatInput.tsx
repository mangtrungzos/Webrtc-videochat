import { useContext, useState } from "react";
import { RoomContext } from "../../context/RoomContext";


export const ChatInput: React.FC = () => {
    const [message, setMessage] = useState("");
    const { sendMessage } = useContext(RoomContext);
    // const { roomId } = useContext(RoomContext);
    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                // sendMessage(message, roomId);
                sendMessage(message);
                setMessage("");
            }}>
                <div className="flex gap-5">

                    <input 
                        className="border rounded-full px-2 py-2" 
                        onChange={e => setMessage(e.target.value)} 
                        value={message} 
                    />

                    <button 
                        className="bg-slate-300 p-4 rounded-lg text-xl hover:bg-slate-400 text-white w-[100%]" 
                        type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="w-6 h-6"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};