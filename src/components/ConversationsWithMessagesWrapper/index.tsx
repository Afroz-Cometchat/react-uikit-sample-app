import { CometChatConversationsWithMessages, CometChatIncomingCall, CometChatPalette, CometChatTheme, CometChatThemeContext, ConversationsConfiguration } from "@cometchat/chat-uikit-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

import { useLocation } from "react-router-dom";

export function ConversationsWithMessagesWrapper({ isMobileView }: { isMobileView: boolean }) {
    const { state } = useLocation();
    const changeThemeToCustom = state?.changeThemeToCustom;
    const { theme } = useContext(CometChatThemeContext);

    const themeContext = useMemo(() => {
        let res = theme;
        if (changeThemeToCustom) {
            res = new CometChatTheme({
                palette: new CometChatPalette({
                    mode: theme.palette.mode,
                    primary: {
                        light: "#D422C2",
                        dark: "#D422C2",
                    },
                    accent: {
                        light: "#07E676",
                        dark: "#B6F0D3",
                    },
                    accent50: {
                        light: "#39f",
                        dark: "#141414",
                    },
                    accent900: {
                        light: "white",
                        dark: "black",
                    }
                }),
            })
        }
        return { theme: res };
    }, [theme, changeThemeToCustom]);


    // #################
    const [conversationLastMessages, setConversationLastMessages] = useState<any>([]);
    useEffect(() => {
        let limit = 30;
        let conversationRequest = new CometChat.ConversationsRequestBuilder()
            .setLimit(limit)
            .build();
        conversationRequest.fetchNext().then(
            conversationList => {
                console.log("Conversations list received:", conversationList);
                conversationList.forEach(element => {
                    let lastMessage = element.getLastMessage()
                    setConversationLastMessages((prev: any) => [...prev, lastMessage])
                });
            }, error => {
                console.log("Conversations list fetching failed with error:", error);
            }
        );
    }, [])
    const markAllAsRead = () => {
        conversationLastMessages.forEach((element: any) => {
            CometChat.markAsRead(element).then(
                () => {
                    console.log("mark as read success.");
                }, (error: any) => {
                    console.log("An error occurred when marking the message as read.", error);
                }
            );
        });
    }
    // ####################

    return (
        <>
            <button onClick={markAllAsRead}>READ ALL</button>
            <CometChatThemeContext.Provider value={themeContext}>
                <CometChatConversationsWithMessages
                    isMobileView={isMobileView}
                    conversationsConfiguration={new ConversationsConfiguration({
                        conversationsStyle: { height: '60vh', width: '100%' },
                        backdropStyle: {
                            border: "5px solid red",
                            width: "300px"
                        }
                    })}
                />
                <CometChatIncomingCall />
            </CometChatThemeContext.Provider>
        </>
    );
}
