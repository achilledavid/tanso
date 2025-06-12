"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPadsFromProject, getProjectForLive } from "@/lib/project";
import { Room } from "@/components/room";
import { CollaborativeApp } from "@/components/collaborative-app";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Radio, Users, Eye, Crown, Send } from "lucide-react";
import Pad from "@/components/pad/pad";
import { isEmpty } from "lodash";
import PopStagger from "@/components/pop-stagger";
import { useUser } from "@/hooks/user";
import style from "../project.module.scss";
import { useOthers, useSelf, useBroadcastEvent, useEventListener } from "@liveblocks/react/suspense";
import { cn } from '@/lib/utils';
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useState, useEffect, useRef } from "react";
import SelectedPad from "@/components/selected-pad/selected-pad";
import { useSelectedPad } from "@/contexts/selected-pad";

function LiveSessionContent({
  project,
  pads,
  creator,
  isCreator,
  uuid,
}: {
  uuid: string;
  project: Project;
  pads: Pad[];
  creator: User;
  isCreator: boolean;
}) {
  const others = useOthers();
  const self = useSelf();
  const { selectedPad } = useSelectedPad();
  const [messages, setMessages] = useState<Array<{
    id: string;
    message: string;
    userId: string;
    userName: string;
    timestamp: Date;
  }>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "users">("chat");

  const broadcast = useBroadcastEvent();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Seuls les créateurs peuvent jouer les sons via les raccourcis clavier
  useKeyboardShortcuts(isCreator ? pads : []);

  // Écouter les messages du chat
  useEventListener(({ event }) => {
    if (event.type === "CHAT_MESSAGE") {
      setMessages(prev => [...prev, {
        id: `${event.userId}-${Date.now()}`,
        message: event.message,
        userId: event.userId,
        userName: event.userName,
        timestamp: new Date()
      }]);
    }
  });

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userName = self?.presence?.user?.name || "Anonymous";
    const userId = self?.presence?.user?.id || "";

    // Ajouter le message localement
    setMessages(prev => [...prev, {
      id: `${userId}-${Date.now()}`,
      message: newMessage,
      userId,
      userName,
      timestamp: new Date()
    }]);

    // Diffuser le message aux autres utilisateurs
    broadcast({
      type: "CHAT_MESSAGE",
      message: newMessage,
      userId,
      userName
    });

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const totalUsers = others.length + (self ? 1 : 0);
  const viewers =
    others.filter((user) => parseInt(user.id) !== project?.userId).length +
    (self && !isCreator ? 1 : 0);

  return (
    <CollaborativeApp
      projectName={project?.name}
      isCreator={isCreator}
      showTopIndicators={false}
    >
      <div className={style.wrapper}>
        <main className={style.container}>
          <div className={style.grid}>
            <aside>
              <div className={style.project}>
                <div>
                  <h1 className={style.title}>{project?.name}</h1>
                  <p>Created by {creator?.username}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {project?.description}
                  </p>
                </div>
              </div>
              
              {isCreator && selectedPad && (
                <div className={style.pad}>
                  <p className={style.title}>Selected pad</p>
                  <SelectedPad projectUuid={uuid} />
                </div>
              )}
            </aside>
            <PopStagger className={cn(style.pads, !isCreator ? "pointer-events-none opacity-75" : "")}>
              {pads &&
                !isEmpty(pads) &&
                pads.map((pad) => <Pad key={`pad-${pad.id}`} pad={pad} />)}
            </PopStagger>

            <aside className={style.rightSidebar}>
              <div className={style.liveContainer}>
                {/* Header avec indicateur live */}
                <div className="flex items-center gap-2 mb-4">
                  <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                  <h2 className={style.title}>Live Session</h2>
                </div>

                {/* Onglets */}
                <div className={style.tabs}>
                  <button
                    className={`${style.tab} ${activeTab === "chat" ? style.active : ""}`}
                    onClick={() => setActiveTab("chat")}
                  >
                    💬 Chat ({messages.length})
                  </button>
                  <button
                    className={`${style.tab} ${activeTab === "users" ? style.active : ""}`}
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="w-3 h-3 mr-1" />
                    Users ({totalUsers})
                  </button>
                </div>

                {/* Contenu des onglets */}
                <div className={style.tabContent}>
                  {activeTab === "chat" ? (
                    <div className={style.chatTab}>
                      {/* Messages */}
                      <div className={style.chatMessages}>
                        {messages.length === 0 ? (
                          <div className={style.emptyState}>
                            <div className={style.emptyIcon}>💬</div>
                            <p>Aucun message pour le moment...</p>
                            <p className="mt-1 opacity-75">Soyez le premier à dire quelque chose !</p>
                          </div>
                        ) : (
                          <>
                            {messages.map((msg) => (
                              <div key={msg.id} className={style.chatMessage}>
                                <div className={style.messageHeader}>
                                  <span className={style.timestamp}>
                                    {msg.timestamp.toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                  {parseInt(msg.userId) === project?.userId && (
                                    <Crown className={style.crownIcon} />
                                  )}
                                  <span className={`${style.userName} ${
                                    parseInt(msg.userId) === project?.userId 
                                      ? 'text-red-400' 
                                      : 'text-blue-400'
                                  }`}>
                                    {msg.userName}
                                  </span>
                                </div>
                                <div className={style.messageContent}>
                                  <span className={style.messageText}>{msg.message}</span>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </>
                        )}
                      </div>

                      {/* Message Input */}
                      <div className={style.chatInput}>
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Tapez votre message..."
                          maxLength={200}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={style.usersTab}>
                      {/* Stats */}
                      <div className={style.userStats}>
                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>Viewers</span>
                          </div>
                          <span className="font-medium">{viewers}</span>
                        </div>
                      </div>

                      {/* Liste des utilisateurs */}
                      <div className={style.userList}>
                        {self && (
                          <div className="flex items-center gap-1 text-sm mb-2">
                            <span className={`${
                              isCreator ? 'text-red-400' : 'text-blue-400'
                            } font-medium`}>
                              {self.presence?.user?.name || "You"}
                            </span>
                            {isCreator && (
                              <Crown className="w-3 h-3 text-yellow-500" />
                            )}
                          </div>
                        )}
                        {others.map(({ connectionId, presence }) => (
                          <div
                            key={connectionId}
                            className="flex items-center gap-1 text-sm mb-2"
                          >
                            <span className={`${
                              parseInt(presence?.user?.id) === project?.userId ? 'text-red-400' : 'text-blue-400'
                            } font-medium`}>
                              {presence?.user?.name || "Anonymous"}
                            </span>
                            {parseInt(presence?.user?.id) === project?.userId && (
                              <Crown className="w-3 h-3 text-yellow-500" />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Status */}
                      <div className="border-t pt-4 text-sm text-muted-foreground">
                        {isCreator ? (
                          <div className="space-y-2">
                            <p className="flex items-center gap-2">
                              🎛️ <span>You are controlling this session</span>
                            </p>
                            <p>Others can watch your performance</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              <span>Watching live session</span>
                            </p>
                            <p>Only the creator can interact with pads</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </CollaborativeApp>
  );
}

export default function LiveSession({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const uuid = use(params).uuid;
  const { data: session } = useSession();

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project-live", uuid],
    queryFn: () => getProjectForLive(uuid),
  });

  const { data: pads, isLoading: isLoadingPads } = useQuery({
    queryKey: ["project-pads", uuid],
    queryFn: () => getPadsFromProject(uuid),
  });

  const { data: creator } = useUser(project?.userId);

  const isLoading = isLoadingPads || isLoadingProject;
  const isCreator = session?.user?.id === project?.userId;

  if (!isLoading && !project) notFound();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2
          className="animate-spin"
          stroke="hsl(var(--muted-foreground))"
        />
      </div>
    );
  }

  if (!project || !pads || !creator) {
    return null;
  }
  return (
    <Room>
      <LiveSessionContent
        uuid={uuid}
        project={project}
        pads={pads}
        creator={creator}
        isCreator={isCreator}
      />
    </Room>
  );
}
