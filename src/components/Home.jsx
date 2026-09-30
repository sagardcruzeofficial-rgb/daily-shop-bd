import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function VisitorChatWidget() {
  const { chats, sendChatMessage, addChatSession } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const [myChatId, setMyChatId] = useState(localStorage.getItem('my_chat_id') || '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msgText, setMsgText] = useState('');

  // Find my active chat session
  const currentChat = chats.find(c => c.id === myChatId);

  const handleStartChat = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !msgText.trim()) return;
    const newId = addChatSession(name.trim(), phone.trim(), msgText.trim());
    setMyChatId(newId);
    localStorage.setItem('my_chat_id', newId);
    setMsgText('');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgText.trim() || !myChatId) return;
    sendChatMessage(myChatId, 'customer', msgText.trim());
    setMsgText('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold transition transform hover:scale-105"
        >
          💬 Live Chat Support
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-[450px] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gray-900 text-white p-3.5 flex justify-between items-center">
            <span className="font-bold text-xs">💬 DailyShop Live Support</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white font-bold">✕</button>
          </div>

          {/* Chat Body */}
          {!currentChat ? (
            <form onSubmit={handleStartChat} className="p-4 space-y-3 flex-1 flex flex-col justify-center">
              <p className="text-xs text-gray-600 mb-2 font-medium">আমাদের সাথে সরাসরি কথা বলতে আপনার নাম ও ফোন নম্বর দিয়ে চ্যাট শুরু করুন:</p>
              <input type="text" placeholder="আপনার নাম (Your Name)" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border p-2 text-xs rounded" />
              <input type="tel" placeholder="মোবাইল নম্বর (Phone Number)" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full border p-2 text-xs rounded" />
              <textarea placeholder="আপনার মেসেজ লিখুন..." value={msgText} onChange={(e) => setMsgText(e.target.value)} required className="w-full border p-2 text-xs rounded" rows={3}></textarea>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded text-xs transition shadow">Start Chat 🚀</button>
            </form>
          ) : (
            <div className="flex-1 flex flex-col justify-between bg-gray-50">
              <div className="p-3 overflow-y-auto space-y-2 flex-1">
                {currentChat.messages.map((m, idx) => (
                  <div key={idx} className={`flex flex-col ${m.sender === 'customer' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-2.5 rounded-xl text-xs ${
                      m.sender === 'customer' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none shadow-sm'
                    }`}>
                      <p>{m.text}</p>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-0.5">{m.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t flex gap-2">
                <input 
                  type="text" 
                  placeholder="মেসেজ লিখুন..." 
                  value={msgText} 
                  onChange={(e) => setMsgText(e.target.value)} 
                  className="flex-1 border p-2 text-xs rounded-lg focus:outline-none"
                />
                <button className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Send</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
