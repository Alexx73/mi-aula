import React, {useState} from "react";
import useSpeech from "../hooks/useSpeech.js";



export default function Jobs() {
  const { playSound } = useSpeech();
    const [activeJob, setActiveJob] = useState(null);

 // Duración de animación y texto (ms)
  const duracion = 1500;

  // Traducciones simples
  const traducciones = {
    farmer: "granjero",
    secretary: "secretaria",
    baker: "panadero",
    engineer: "ingeniero",
    painter: "pintor",
    vet: "veterinario",
    dentist: "dentista",
    butcher: "carnicero",
    pilot: "piloto",
    nurse: "enfermero",
    tailor: "sastre",
    teacher: "maestro",
    cook: "cocinero",
    hairdresser: "peluquero",
    singer: "cantante",
    actor: "actor",
  };


  // Cargar todas las imágenes de forma automática
  const images = import.meta.glob("../assets/jobs/*.png", { eager: true });

  // Convertirlas a un array con nombre limpio y src
  const jobs = Object.keys(images).map((path) => {
    // Extraer solo el nombre del archivo (sin carpeta ni extensión)
    const fileName = path.split("/").pop().replace(".png", "");
    // Quitar número y guion inicial (ej: "01 - farmer" -> "farmer")
    const name = fileName.replace(/^\d+\s*-\s*/, "").trim().toLowerCase();

    return { name, img: images[path].default };
  });

  // Colores cíclicos como en Alphabet.jsx
  const colors = [
    "bg-red-500",
    "bg-blue-600",
    "bg-yellow-400",
    "bg-cyan-400",
    "bg-green-400",
    "bg-purple-600",
  ];

  // Maneja clics y animación
  const handleClick = (jobName) => {
    playSound(jobName);
    setActiveJob(jobName);
    setTimeout(() => setActiveJob(null), duracion);
  };


 return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-5 px-4 flex flex-col items-center">
      {/* <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Jobs
      </h1> */}

      {/* GRID: 3 columnas en móvil, 4 en pantallas grandes */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {jobs.map((job, index) => {
          const color = colors[index % colors.length];
          const isActive = activeJob === job.name;

          return (
            <div
              key={job.name}
              className={`relative flex flex-col items-center justify-center rounded-xl p-2 cursor-pointer transition-transform duration-300 ${color} ${
                isActive ? "scale-110" : "hover:scale-105"
              }`}
              onClick={() => handleClick(job.name)}
            >
              {/* Imagen */}
              <img
                src={job.img}
                alt={job.name}
                className="w-[180px] h-[160px] object-contain mx-auto transition-transform"
              />

              {/* Nombre */}
              <p className="mt-2 text-white font-semibold capitalize text-sm sm:text-base">
                {job.name}
              </p>

              {/* Traducción temporal */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-lg font-bold py-1 text-center rounded-b-lg animate-fadeInOut"
                  style={{ animationDuration: `${duracion}ms` }}
                >
                  {traducciones[job.name]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Animaciones */}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(10px); }
            10% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(10px); }
          }
          .animate-fadeInOut {
            animation: fadeInOut ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
}