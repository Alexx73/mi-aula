import React, { useState }  from 'react'

import useSpeech from '../hooks/useSpeech';
import questions from '../data/Questions';

export default function PersonalQuestions() {
      const { playSound } = useSpeech();
      const [activeItem, setActiveItem] = useState(null); // Estado para controlar la traducción activa
  const duracion = 2000; // Duración de la animación en milisegundos

//    const questions = [
//     { 
//       number: '1', 
//       question: 'What is your first name?', 
//       answer: 'My first name is Ana.', 
//       translationQuestion: '¿Cuál es tu primer nombre?', 
//       translationAnswer: 'Mi primer nombre es Ana.'
//     },
//     { 
//       number: '2', 
//       question: 'How old are you?', 
//       answer: 'I am 12 years old.', 
//       translationQuestion: 'Qué edad tienes?', 
//       translationAnswer: 'Tengo 12 años de edad.'
//     },
//     { 
//       number: '3', 
//       question: 'What is your phone number?', 
//       answer: 'My phone number is 343 555 1202.', 
//       translationQuestion: '¿Cuál es tu número de teléfono?', 
//       translationAnswer: 'Mi número de teléfono es 343 555 1202.'
//     },
//     { 
//       number: '4', 
//       question: 'What is your last name?', 
//       answer: 'My last name is Lopez.', 
//       translationQuestion: '¿Cuál es tu apellido?', 
//       translationAnswer: 'Mi apellido es Lopez.'
//     },
//     { 
//       number: '5', 
//       question: 'What is your address?', 
//       answer: 'My address is 255 Colon Street.', 
//       translationQuestion: '¿Cuál es tu dirección?', 
//       translationAnswer: 'Mi dirección es  Calle Colón 255.'
//     },
//     { 
//       number: '6', 
//       question: 'What is your email address?', 
//       answer: 'My email is Ana14@gmail.com.', 
//       translationQuestion: '¿Cuál es tu correo electrónico?', 
//       translationAnswer: 'Mi correo es Ana14@gmail.com.'
//     },
//     { 
//       number: '7', 
//       question: 'What is your favorite subject?', 
//       answer: 'My favorite subject is Biology.', 
//       translationQuestion: '¿Cuál es tu materia favorita?', 
//       translationAnswer: 'Mi materia favorita es Biología.'
//     },
//     { 
//       number: '8', 
//       question: 'What is your favorite color?', 
//       answer: 'My favorite color is Black.', 
//       translationQuestion: '¿Cuál es tu color favorito?', 
//       translationAnswer: 'Mi color favorito es negro.'
//     },
//     { 
//       number: '9', 
//       question: 'What city are you from?', 
//       answer: 'I am from Paraná.', 
//       translationQuestion: '¿De qué ciudad eres?', 
//       translationAnswer: 'Soy de Paraná.'
//     },
//     { 
//       number: '10', 
//       question: 'What country are you from?', 
//       answer: 'I am from Argentina.', 
//       translationQuestion: '¿De qué país eres?', 
//       translationAnswer: 'Soy de Argentina.'
//     }
//   ];

  return (
    <div className="min-h-screen w-full flex flex-col p-2 sm:p-5 bg-gray-100 font-sans overflow-hidden dark:bg-gray-800 relative">
      <div>
        <h4 className="text-center text-xl sm:text-2xl md:text-2xl mb-2.5 text-gray-800 dark:text-gray-200 animate-bounce text-yellow-500">😄 Personal Questions! 🎉</h4>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:gap-2.5 flex-grow p-1 sm:p-1.5 h-[calc(100%-60px)]">
        {questions.map((item, index) => (
          <div
            key={item.number}
            className="flex flex-row items-center justify-between p-2 rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform duration-200 relative"
          >
            {/* Sección de Pregunta */}
            <div
              className="flex-1 p-3 rounded-l-xl bg-yellow-400 text-white text-center mr-6 relative"
            >
              <h3
                className="text-lg sm:text-xl font-bold mb-2 animate-pulse"
                onClick={() => {
                  playSound(item.question, false);
                  setActiveItem({ type: 'question', text: item.question });
                  setTimeout(() => setActiveItem(null), duracion);
                }}
              >
                {item.number} {item.question}
              </h3>
              {activeItem?.type === 'question' && activeItem.text === item.question && (
                <div
                  className="absolute top-0 left-0 right-0 bg-black/70 text-white text-sm font-bold py-1 text-center rounded-t-lg animate-fadeInOut"
                  style={{ animationDuration: `${duracion}ms` }}
                >
                  {item.translationQuestion}
                </div>
              )}
            </div>
            {/* Sección de Respuesta */}
            <div
              className="flex-1 p-3 rounded-r-xl bg-green-400 text-white text-center relative"
            >
              <h3
                className="text-lg sm:text-xl font-bold mb-2 animate-pulse"
                onClick={() => {
                  playSound(item.answer, false);
                  setActiveItem({ type: 'answer', text: item.answer });
                  setTimeout(() => setActiveItem(null), duracion);
                }}
              >
                {item.answer}
              </h3>
              {activeItem?.type === 'answer' && activeItem.text === item.answer && (
                <div
                  className="absolute top-0 left-0 right-0 bg-black/70 text-white text-sm font-bold py-1 text-center rounded-t-lg animate-fadeInOut"
                  style={{ animationDuration: `${duracion}ms` }}
                >
                  {item.translationAnswer}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <style>
        {`
          /* Texto traducido (fade arriba) */
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
          .animate-fadeInOut {
            animation: fadeInOut ease-in-out forwards;
          }

          /* Animación de rebote (pop) */
          @keyframes pop {
            0% { transform: scale(1); }
            20% { transform: scale(1.15); }
            50% { transform: scale(1.05); }
            80% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-pop {
            animation: pop ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
}