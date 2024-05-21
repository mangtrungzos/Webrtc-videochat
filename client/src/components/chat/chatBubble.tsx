import { useContext } from "react";
import { IMessage } from "../../types/chat";
import { RoomContext } from "../../context/RoomContext";
import classNames from "classnames";

export const ChatBubble: React.FC<{message:IMessage}> = ({message}) => {
    const { me } = useContext(RoomContext);
    const isSelf = message.author=== me?.id;
    const time = new Date(message.timestamp).toLocaleTimeString()
    return (
        <div className={classNames("m-2 flex",{
            "pl-10 justify-end": isSelf,
            "pr-10 jusitfy-start": !isSelf
        })}>
            <div className={classNames("inline-block py-2 px-5 ",{
                "rounded-l-3xl rounded-br-3xl bg-indigo-400": isSelf,
                "rounded-r-3xl rounded-bl-3xl bg-slate-500":!isSelf
            })}
            >
                   {message.content}    
               <div>
                    <div className={classNames("text-xs opacity-50",{
                        "text-right": isSelf,
                        "text-left": !isSelf,
                    })}
                    >
                        {time}
                    </div>
                </div>

            </div>
        </div>
    );
};
