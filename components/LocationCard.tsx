import { Building, MapPin, Zap } from "lucide-react";

import { LocationCardProps } from "@/types/location";

const LocationCard = ({ location }: LocationCardProps) => {
  if (!location) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[420px] bg-white/90 rounded-3xl shadow-lg border border-zinc-100/30 backdrop-blur-xl overflow-hidden z-50 animate-float">
        <div className="px-6 py-8 text-center">
          <div className="relative mb-6">
            {/* Gradient orb effect */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-orange-200/40 to-rose-200/40 rounded-full blur-2xl" />

            {/* Icon container with hover effect */}
            <div className="relative mx-auto w-14 h-14 bg-gradient-to-b from-orange-50 to-orange-100/50 rounded-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:rotate-3">
              <MapPin className="w-7 h-7 text-orange-500/90" />
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-lg font-medium text-zinc-800">
              Selecciona una Oficina 🏢
            </h3>
            <p className="text-sm text-zinc-500/90 max-w-[280px] mx-auto leading-relaxed">
              Explora el mapa para encontrar la oficina más cercana a tu
              ubicación
            </p>
          </div>

          {/* Subtle interaction hint */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full animate-pulse" />
            Haz clic en cualquier marcador
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[480px] max-h-[46vh] bg-white/95 rounded-3xl shadow-2xl border border-zinc-200/50 backdrop-blur-md overflow-hidden z-50 animate-slide-up">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-zinc-100/50 flex items-center justify-between p-4">
        <div className="flex items-center gap-3 justify-between w-full">
          <div className="flex gap-2 items-center">
            <div className="p-2 bg-zinc-100 rounded-xl flex-none">
              <Building className="w-5 h-5 text-zinc-700" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-zinc-900 line-clamp-1">
                {location.serviceCenter}
              </h3>
            </div>
          </div>
          <span
            className={`px-2 py-1 font-medium rounded-full whitespace-nowrap text-sm flex items-center ${
              location.status === "OPERATIVO"
                ? "bg-emerald-100 text-emerald-500"
                : "bg-amber-100 text-red-500"
            }`}
          >
            {location.status === "OPERATIVO" ? "Operativo" : "No operativo"}

            {location.status === "OPERATIVO" ? (
              <Zap className="w-4 h-4 ml-1 text-emerald-500" />
            ) : (
              <Zap className="w-4 h-4 ml-1 text-red-500" />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
