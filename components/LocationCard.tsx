import { Building, MapPin, Zap } from "lucide-react";

import { LocationCardProps } from "@/types/location";

const LocationCard = ({ location }: LocationCardProps) => {
  if (!location) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[480px] bg-white rounded-2xl shadow-2xl border border-zinc-200/50 backdrop-blur-md overflow-hidden z-50 animate-fade-up h-auto">
        <div className="px-8 py-10 text-center space-y-6">
          <div className="relative">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-100/50 rounded-full blur-xl" />
            <div className="relative mx-auto w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-zinc-900">
              Encuentra tu Oficina RENIEC
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Explora el mapa y selecciona un marcador para ver información
              detallada sobre la oficina más cercana a tu ubicación
            </p>
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
