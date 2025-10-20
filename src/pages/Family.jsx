import React, { useState } from "react";
import useSpeech from "../hooks/useSpeech.js";

export default function Family() {
  const { playSound } = useSpeech();
  const [active, setActive] = useState(null);
  const duracion = 1600;

  const images = import.meta.glob("../assets/family/*.png", { eager: true });
  const imgs = {};
  Object.keys(images).forEach((p) => {
    const filename = p.split("/").pop().replace(".png", "");
    imgs[filename] = images[p].default;
  });

  const fileKeys = [
    "1_grandfather",
    "2_grandmother",
    "3_mother",
    "4_father",
    "5_aunt",
    "6_uncle",
    "7_sister",
    "8_you",
    "9_brother",
    "10_cousin",
    "11_cousin2",
  ];

  const labels = {
    1: "grandfather",
    2: "grandmother",
    3: "mother",
    4: "father",
    5: "aunt",
    6: "uncle",
    7: "sister",
    8: "you",
    9: "brother",
    10: "cousin",
    11: "cousin",
  };

  const handleClick = (idx) => {
    const key = fileKeys[idx - 1];
    const word = labels[idx];
    if (key && key.includes("you")) return;
    playSound(word);
    setActive({ id: idx, word });
    setTimeout(() => setActive(null), duracion);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 dark:bg-gray-800 overflow-hidden">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mt-3 mb-3 text-center">
        👪 My Family
      </h2>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full max-w-[1000px] flex-1 flex flex-col items-center justify-evenly bg-white rounded-lg shadow-md border border-gray-200 py-6 sm:py-8 h-[90vh]">
        {/* FILA 1 - Abuelos */}
        <div className="flex justify-center gap-6 sm:gap-12">
          {[1, 2].map((idx) => (
            <FamilyMember
              key={idx}
              idx={idx}
              img={imgs[fileKeys[idx - 1]]}
              label={labels[idx]}
              isActive={active?.id === idx}
              duracion={duracion}
              onClick={() => handleClick(idx)}
              activeWord={active?.word}
            />
          ))}
        </div>

        {/* FILA 2 - Padres y Tíos */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-10">
          {[3, 4, 5, 6].map((idx) => (
            <FamilyMember
              key={idx}
              idx={idx}
              img={imgs[fileKeys[idx - 1]]}
              label={labels[idx]}
              isActive={active?.id === idx}
              duracion={duracion}
              onClick={() => handleClick(idx)}
              activeWord={active?.word}
            />
          ))}
        </div>

        {/* FILA 3 - Hermanos + Tú + Primos */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {[7, 8, 9, 10, 11].map((idx) => (
            <FamilyMember
              key={idx}
              idx={idx}
              img={imgs[fileKeys[idx - 1]]}
              label={labels[idx]}
              isActive={active?.id === idx}
              duracion={duracion}
              onClick={() => handleClick(idx)}
              activeWord={active?.word}
            />
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-6px); }
            10% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-6px); }
          }
          .animate-fadeInOut {
            animation: fadeInOut ease-in-out forwards;
          }

          @keyframes pop {
            0% { transform: scale(1); }
            20% { transform: scale(1.18); }
            50% { transform: scale(1.08); }
            80% { transform: scale(1.12); }
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

/* 🔸 COMPONENTE REUTILIZABLE */
function FamilyMember({
  idx,
  img,
  label,
  isActive,
  duracion,
  onClick,
  activeWord,
}) {
  const sizeClass =
    "w-[22vw] sm:w-[14vw] md:w-[11vw] lg:w-[9vw] max-w-[120px] min-w-[70px]";

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={onClick}
        disabled={label === "you"}
        className={`relative flex items-center justify-center bg-transparent border-0 ${
          label === "you" ? "cursor-default" : "cursor-pointer"
        }`}
      >
        <img
          src={img}
          alt={label}
          className={`${sizeClass} rounded-full border-4 border-white shadow-lg transition-transform ${
            isActive ? "animate-pop" : "hover:scale-[1.05]"
          }`}
        />
        {isActive && (
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-md animate-fadeInOut"
            style={{ animationDuration: `${duracion}ms` }}
          >
            {activeWord}
          </div>
        )}
      </button>
    </div>
  );
}
