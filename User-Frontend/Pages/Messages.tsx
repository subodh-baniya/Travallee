import React, { useState } from "react";
import { motion } from "framer-motion";

interface Message {
  from: "me" | "them";
  text: string;
  time: string;
}

interface Guest {
  name: string;
  initials: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
}

const ChatPage: React.FC = () => {
  const [activeName, setActiveName] = useState("Shirshak Shrestha");

  const [messages, setMessages] = useState<{
    [key: string]: Message[];
  }>({
    "Shirshak Shrestha": [
      {
        from: "them",
        text: "Is this room available for tonight?",
        time: "10:30 AM",
      },
      {
        from: "me",
        text: "Yes, Room 305 is available.",
        time: "10:32 AM",
      },
      {
        from: "them",
        text: "Great. Please reserve it for me.",
        time: "10:33 AM",
      },
    ],
  });

  const [msgInput, setMsgInput] = useState("");

  const guests: Guest[] = [
    {
      name: "Shirshak Shrestha",
      initials: "SS",
      preview: "Is this room available?",
      time: "2m",
      unread: 4,
      online: true,
    },
    {
      name: "Bipin Ranabhat",
      initials: "BR",
      preview: "Thank you",
      time: "1h",
      unread: 0,
      online: true,
    },
    {
      name: "Kushal Khadka",
      initials: "KK",
      preview: "Can I extend my stay?",
      time: "3h",
      unread: 0,
      online: false,
    },
    {
      name: "Luffy Gear 5",
      initials: "LG",
      preview: "I'm on my way",
      time: "Yesterday",
      unread: 0,
      online: true,
    },
    {
      name: "Stuti Acharya",
      initials: "SA",
      preview: "Is restaurant open?",
      time: "Yesterday",
      unread: 0,
      online: false,
    },
  ];

  const openChat = (name: string) => {
    setActiveName(name);

    if (!messages[name]) {
      setMessages((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
  };

  const sendMsg = () => {
    if (!msgInput.trim()) return;

    const d = new Date();

    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsg: Message = {
      from: "me",
      text: msgInput,
      time,
    };

    setMessages((prev) => ({
      ...prev,
      [activeName]: [...(prev[activeName] || []), newMsg],
    }));

    setMsgInput("");
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">

      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Guest Messages
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Real-time communication with guests
        </p>
      </div>

      {/* LAYOUT */}

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 h-[82vh]">

        {/* SIDEBAR */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">

          {/* SEARCH */}

          <div className="p-4 border-b border-slate-100">
            <input
              type="text"
              placeholder="Search guest..."
              className="
                w-full px-4 py-2.5 rounded-xl
                border border-slate-200
                text-sm
                outline-none
                focus:ring-2 focus:ring-blue-500/20
                focus:border-blue-500
              "
            />
          </div>

          {/* GUEST LIST */}

          <div className="overflow-y-auto flex-1">

            {guests.map((guest) => (
              <button
                key={guest.name}
                onClick={() => openChat(guest.name)}
                className={`
                  w-full px-4 py-4
                  border-b border-slate-100
                  transition
                  flex items-center gap-3
                  text-left
                  hover:bg-slate-50
                  ${
                    activeName === guest.name
                      ? "bg-blue-50"
                      : "bg-white"
                  }
                `}
              >

                {/* AVATAR */}

                <div className="relative shrink-0">

                  <div
                    className="
                      w-11 h-11 rounded-full
                      bg-blue-600 text-white
                      flex items-center justify-center
                      text-sm font-semibold
                    "
                  >
                    {guest.initials}
                  </div>

                  {guest.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>

                {/* CONTENT */}

                <div className="flex-1 min-w-0">

                  <div className="flex items-center justify-between">

                    <h3 className="text-sm font-semibold text-slate-800 truncate">
                      {guest.name}
                    </h3>

                    <span className="text-[11px] text-slate-400 shrink-0">
                      {guest.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">

                    <p className="text-xs text-slate-500 truncate">
                      {guest.preview}
                    </p>

                    {guest.unread > 0 && (
                      <div
                        className="
                          min-w-[18px] h-[18px]
                          px-1 rounded-full
                          bg-blue-600 text-white
                          text-[10px] font-medium
                          flex items-center justify-center
                        "
                      >
                        {guest.unread}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CHAT WINDOW */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">

          {/* CHAT HEADER */}

          <div
            className="
              px-6 py-4 border-b border-slate-100
              flex items-center gap-3
            "
          >
            <div
              className="
                w-11 h-11 rounded-full
                bg-blue-600 text-white
                flex items-center justify-center
                text-sm font-semibold
              "
            >
              {activeName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                {activeName}
              </h2>

              <p className="text-xs text-emerald-600">
                ● Online
              </p>
            </div>
          </div>

          {/* MESSAGES */}

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">

            {messages[activeName]?.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  flex
                  ${msg.from === "me" ? "justify-end" : "justify-start"}
                `}
              >

                <div
                  className={`
                    max-w-[70%]
                    px-4 py-3 rounded-2xl
                    shadow-sm
                    ${
                      msg.from === "me"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white border border-slate-200 text-slate-700 rounded-bl-md"
                    }
                  `}
                >

                  <p className="text-sm leading-relaxed">
                    {msg.text}
                  </p>

                  <div
                    className={`
                      mt-2 text-[10px]
                      ${
                        msg.from === "me"
                          ? "text-blue-100"
                          : "text-slate-400"
                      }
                    `}
                  >
                    {msg.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* INPUT */}

          <div className="p-4 border-t border-slate-100 bg-white">

            <div className="flex gap-3">

              <input
                type="text"
                placeholder="Type a message..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                className="
                  flex-1 px-4 py-3 rounded-xl
                  border border-slate-200
                  text-sm
                  outline-none
                  focus:ring-2 focus:ring-blue-500/20
                  focus:border-blue-500
                "
              />

              <button
                onClick={sendMsg}
                className="
                  px-5 py-3 rounded-xl
                  bg-blue-600 text-white
                  text-sm font-medium
                  hover:bg-blue-700
                  transition
                "
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;