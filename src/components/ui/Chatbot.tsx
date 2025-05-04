
import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatDatePicker from '@/components/chat/ChatDatePicker';
import ChatTimePicker from '@/components/chat/ChatTimePicker';
import ChatUserInfoForm from '@/components/chat/ChatUserInfoForm';
import ChatConfirmation from '@/components/chat/ChatConfirmation';
import ChatPostConfirmation from '@/components/chat/ChatPostConfirmation';
import ChatInitialOptions from '@/components/chat/ChatInitialOptions';
import ChatInput from '@/components/chat/ChatInput';
import { useChatbotState } from '@/hooks/useChatbotState';

const Chatbot = () => {
  const {
    isOpen,
    step,
    messages,
    userInput,
    selectedDate,
    isSubmitting,
    currentInfoField,
    setUserInput,
    toggleChat,
    handleInitialChoice,
    handleDateSelect,
    handleTimeSelect,
    handleInfoInput,
    submitAppointment,
    handlePostConfirmation,
    handleReset,
    processUserQuery
  } = useChatbotState();

  return (
    <>
      <button 
        className="fixed bottom-6 right-6 bg-gold hover:bg-gold-light text-blue-dark p-4 rounded-full shadow-lg z-50 transition-colors"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 flex flex-col max-h-[70vh] border border-gray-200">
          <ChatHeader onClose={toggleChat} />
          <ChatMessages messages={messages} />

          <div className="border-t border-gray-200 p-4">
            {step === 'initial' && (
              <ChatInitialOptions 
                onInfoClick={() => handleInitialChoice('info')}
                onScheduleClick={() => handleInitialChoice('schedule')}
              />
            )}

            {step === 'info' && (
              <ChatInput
                userInput={userInput}
                setUserInput={setUserInput}
                onSubmit={(e) => {
                  e.preventDefault();
                  processUserQuery(userInput);
                }}
                onReset={handleReset}
              />
            )}

            {step === 'date' && (
              <ChatDatePicker 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onReset={handleReset}
              />
            )}

            {step === 'time' && (
              <ChatTimePicker 
                onTimeSelect={handleTimeSelect}
                onReset={handleReset}
              />
            )}
            
            {step === 'user_info' && (
              <ChatUserInfoForm
                currentField={currentInfoField}
                userInput={userInput}
                onInputChange={setUserInput}
                onSubmit={handleInfoInput}
                onReset={handleReset}
              />
            )}

            {step === 'confirmation' && (
              <ChatConfirmation
                isSubmitting={isSubmitting}
                onSubmit={submitAppointment}
                onReset={handleReset}
              />
            )}
            
            {step === 'post_confirmation' && (
              <ChatPostConfirmation
                onConfirm={handlePostConfirmation}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
