
import { useMemo } from 'react';
import ChallengeItem from '../components/ChallengeItem';
import RandomChallenge from '../components/RandomChallenge';
import { useFixedChallenges, useUserProgress, useToggleChallengeProgress } from '../hooks/useSupabaseData';
import { Target, Trophy } from 'lucide-react';

const Desafios = () => {
  const { data: challenges, isLoading: challengesLoading } = useFixedChallenges();
  const { data: userProgress, isLoading: progressLoading } = useUserProgress();
  const toggleProgress = useToggleChallengeProgress();

  const progressMap = useMemo(() => {
    if (!userProgress) return new Map();
    
    const map = new Map();
    userProgress.forEach(progress => {
      map.set(progress.challenge_id, progress.is_completed);
    });
    return map;
  }, [userProgress]);

  const completedCount = useMemo(() => {
    if (!challenges) return 0;
    return challenges.filter(challenge => progressMap.get(challenge.id)).length;
  }, [challenges, progressMap]);

  const handleToggleChallenge = async (challengeId: string) => {
    const isCurrentlyCompleted = progressMap.get(challengeId) || false;
    toggleProgress.mutate({
      challengeId,
      isCompleted: !isCurrentlyCompleted
    });
  };

  if (challengesLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando desafios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Target className="mx-auto text-blue-600 mb-4" size={48} />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Desafios Sustentáveis</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete os desafios abaixo e construa hábitos sustentáveis que fazem a diferença!
          </p>
        </div>

        {/* Random Challenge */}
        <div className="mb-8">
          <RandomChallenge />
        </div>

        {/* Progress Counter */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="text-yellow-600" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {completedCount} de {challenges?.length || 0} Desafios Concluídos
                </h2>
                <p className="text-gray-600">Continue assim! Cada ação conta para um planeta melhor.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {challenges?.length ? Math.round((completedCount / challenges.length) * 100) : 0}%
              </div>
              <div className="text-gray-500">Completo</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${challenges?.length ? (completedCount / challenges.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Seus Desafios</h2>
          {challenges?.map((challenge) => (
            <ChallengeItem
              key={challenge.id}
              challenge={challenge.challenge}
              isCompleted={progressMap.get(challenge.id) || false}
              onToggle={() => handleToggleChallenge(challenge.id)}
            />
          ))}
        </div>

        {/* Completion Message */}
        {challenges && completedCount === challenges.length && challenges.length > 0 && (
          <div className="mt-8 bg-green-600 text-white p-8 rounded-lg text-center">
            <Trophy className="mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-2">Parabéns! 🎉</h2>
            <p className="text-green-100">
              Você completou todos os desafios! Seu compromisso com a sustentabilidade está fazendo a diferença.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Desafios;
