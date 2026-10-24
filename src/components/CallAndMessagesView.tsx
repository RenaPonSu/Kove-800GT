import React, { useState } from 'react';
import { IncomingCall, IncomingMessage } from '../types';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  MessageSquare,
  Volume2,
  Send,
  Check,
  Clock,
  User,
  ShieldAlert,
  Headphones
} from 'lucide-react';
import { formatSeconds } from '../utils/telemetry';

interface CallAndMessagesViewProps {
  activeCall: IncomingCall | null;
  messages: IncomingMessage[];
  onAcceptCall: () => void;
  onRejectCall: () => void;
  onEndCall: () => void;
  onToggleMic: () => void;
  onReadMessageAloud: (msg: IncomingMessage) => void;
  onSendQuickReply: (msgId: string, replyText: string) => void;
  onMarkMessageRead: (msgId: string) => void;
}

export const CallAndMessagesView: React.FC<CallAndMessagesViewProps> = ({
  activeCall,
  messages,
  onAcceptCall,
  onRejectCall,
  onEndCall,
  onToggleMic,
  onReadMessageAloud,
  onSendQuickReply,
  onMarkMessageRead
}) => {
  const [selectedMessage, setSelectedMessage] = useState<IncomingMessage | null>(messages[0] || null);
  const [sentReplyNotice, setSentReplyNotice] = useState<string | null>(null);

  const QUICK_REPLIES = [
    'Riding motorcycle now, arriving in 20 min.',
    'At fuel stop, calling you back in 5 min.',
    'On alpine pass, will check when parked.',
    'OK, got it! Ride safe.'
  ];

  const handleReply = (reply: string) => {
    if (!selectedMessage) return;
    onSendQuickReply(selectedMessage.id, reply);
    setSentReplyNotice(`Sent: "${reply}"`);
    setTimeout(() => setSentReplyNotice(null), 3000);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
      {/* 1. ACTIVE OR INCOMING CALL POPUP (Top Priority on TFT) */}
      {activeCall && (
        <div
          className={`rounded-2xl border p-4 shadow-2xl transition-all ${
            activeCall.status === 'incoming'
              ? 'bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border-emerald-500/80 animate-pulse'
              : 'bg-slate-950/90 border-cyan-500/60'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 ${
                  activeCall.status === 'incoming'
                    ? 'bg-emerald-500 text-slate-950 animate-bounce'
                    : 'bg-cyan-600'
                }`}
              >
                <PhoneCall className="w-7 h-7" />
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>
                    {activeCall.status === 'incoming'
                      ? 'INCOMING CALL · S23 SDC BLUETOOTH'
                      : 'CALL ACTIVE · HELMET INTERCOM'}
                  </span>
                </div>
                <div className="text-xl font-extrabold text-white tracking-tight">
                  {activeCall.callerName}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {activeCall.phoneNumber}
                  {activeCall.status === 'active' && (
                    <span className="ml-2 text-cyan-400 font-bold">
                      · {formatSeconds(activeCall.durationSeconds)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Call Action Buttons (Massive 56px targets for gloves) */}
            <div className="flex items-center gap-3">
              {activeCall.status === 'incoming' ? (
                <>
                  <button
                    onClick={onRejectCall}
                    aria-label="Decline Call"
                    title="Decline Call (Left Switchgear Red)"
                    className="w-14 h-14 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/30 transition-all"
                  >
                    <PhoneOff className="w-7 h-7" />
                  </button>
                  <button
                    onClick={onAcceptCall}
                    aria-label="Accept Call"
                    title="Accept Call (Left Switchgear Green)"
                    className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 font-black transition-all"
                  >
                    <Phone className="w-7 h-7 fill-slate-950" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onToggleMic}
                    aria-label={activeCall.isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                    className={`w-13 h-13 border rounded-2xl flex items-center justify-center active:scale-95 transition-all ${
                      activeCall.isMicMuted
                        ? 'bg-rose-950/60 border-rose-600 text-rose-400'
                        : 'bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    {activeCall.isMicMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={onEndCall}
                    aria-label="End Call"
                    className="w-14 h-14 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/30 transition-all"
                  >
                    <PhoneOff className="w-7 h-7" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. MESSAGES & NOTIFICATIONS HUB */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Messages List Column */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 pb-1">
            <span>Samsung S23 Messages</span>
            <span className="text-[11px] text-cyan-400 font-mono">{messages.length} total</span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {messages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    onMarkMessageRead(msg.id);
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/80 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-cyan-400 rounded">
                        {msg.app}
                      </span>
                      <span>{msg.sender}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                  </div>
                  <div className="text-xs text-slate-400 truncate">{msg.text}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Message Reader & Helmet Speech Column */}
        <div className="md:col-span-3 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          {selectedMessage ? (
            <>
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-xs font-bold">
                      {selectedMessage.sender.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{selectedMessage.sender}</div>
                      <div className="text-[10px] text-slate-400">{selectedMessage.app} · {selectedMessage.timestamp}</div>
                    </div>
                  </div>

                  {/* Read to Helmet Voice Trigger */}
                  <button
                    onClick={() => onReadMessageAloud(selectedMessage)}
                    title="Read message aloud to motorcycle helmet"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-300 rounded-xl text-xs font-semibold active:scale-95 transition-all shadow"
                  >
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>Read to Helmet</span>
                  </button>
                </div>

                {/* Message Body Content */}
                <div className="py-3 text-sm text-slate-200 leading-relaxed font-medium">
                  "{selectedMessage.text}"
                </div>
              </div>

              {/* Quick Canned Voice/Text Replies (Motorcycle Glove Safe) */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  1-Tap Quick Motorcycle Replies
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {QUICK_REPLIES.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => handleReply(reply)}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700/80 text-slate-300 hover:text-white rounded-lg text-left text-xs truncate transition-all flex items-center justify-between group"
                    >
                      <span className="truncate">{reply}</span>
                      <Send className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>

                {sentReplyNotice && (
                  <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-medium animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>{sentReplyNotice}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No message selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
