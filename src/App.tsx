import { useState } from 'react';
import { NatalUser, Planet } from './types';
import StarBackground from './components/StarBackground';
import IntroScreen from './components/IntroScreen';
import IntakeScreen from './components/IntakeScreen';
import MainScreen from './components/MainScreen';

export default function App() {
  const [screen, setScreen] = useState<'intro' | 'intake' | 'main'>('intro');
  const [user, setUser] = useState<NatalUser | null>(null);
  
  // States representing background planetary canvas targets
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [activePlanets, setActivePlanets] = useState<Set<string>>(new Set());

  const handleDismissIntro = () => {
    setScreen('intake');
  };

  const handleIntakeSubmit = (natalUser: NatalUser) => {
    setUser(natalUser);
    setScreen('main');
  };

  const handleReset = () => {
    setUser(null);
    setPlanets([]);
    setActivePlanets(new Set());
    setScreen('intake');
  };

  return (
    <main className="relative w-screen h-screen max-h-screen text-[var(--parchment)] max-w-full overflow-hidden flex flex-col justify-between select-none bg-black">
      
      {/* Dynamic star twinkling and constellation background lines */}
      <StarBackground planets={planets} activePlanets={activePlanets} />

      {/* Frame boundary wrapper */}
      <div className="relative z-10 w-full h-full max-h-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* State 1: Gothic intro gate */}
        {screen === 'intro' && (
          <IntroScreen onDismiss={handleDismissIntro} />
        )}

        {/* State 2: Personal birth intake details */}
        {screen === 'intake' && (
          <IntakeScreen onSubmit={handleIntakeSubmit} />
        )}

        {/* State 3: Tarot draw layout & confluence summaries */}
        {screen === 'main' && user && (
          <MainScreen
            user={user}
            onUpdatePlanets={setPlanets}
            onUpdateActivePlanets={setActivePlanets}
            onReset={handleReset}
          />
        )}
        
      </div>
      
    </main>
  );
}
