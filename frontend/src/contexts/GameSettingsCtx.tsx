import { createContext, useContext, useState } from "react";

interface GameSettingsProps {
  radius: number;
  units: number;
  velocity: number;
  music: boolean;
  bounceSound: boolean;
  handleRadius: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUnits: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVelocity: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMusic: () => void;
  handleBounceSounds: () => void;
}

const GameSettingsCtx = createContext<GameSettingsProps | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [radius, setRadius] = useState<number>(14);
  const [units, setUnits] = useState<number>(7);
  const [velocity, setVelocity] = useState<number>(10);
  const [music, setMusic] = useState<boolean>(true);
  const [bounceSound, setBounceSounds] = useState<boolean>(true);

  const handleRadius = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(e.target.value));
  };

  const handleUnits = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnits(Number(e.target.value));
  };

  const handleVelocity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVelocity(Number(e.target.value));
  };

  const handleMusic = () => {
    setMusic(!music);
  };

  const handleBounceSounds = () => {
    setBounceSounds(!bounceSound);
  };

  return (
    <GameSettingsCtx.Provider
      value={{
        radius,
        handleRadius,
        units,
        handleUnits,
        velocity,
        handleVelocity,
        music,
        handleMusic,
        bounceSound,
        handleBounceSounds,
      }}
    >
      {children}
    </GameSettingsCtx.Provider>
  );
}

export const useSettingsCtx = () => {
  const context = useContext(GameSettingsCtx);

  if (!context) {
    throw new Error(
      "useVariables deve ser usado dentro de um VariablesProvider",
    );
  }

  return context;
};
