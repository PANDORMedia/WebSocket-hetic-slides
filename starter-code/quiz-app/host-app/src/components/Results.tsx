// ============================================================
// Results - Affichage des resultats d'une question
// A IMPLEMENTER : barres animees et bonne reponse
// ============================================================

import { useState, useEffect } from 'react'

interface ResultsProps {
  /** Index de la bonne reponse (0-3) */
  correctIndex: number
  /** Distribution des reponses [nb_choix_0, nb_choix_1, nb_choix_2, nb_choix_3] */
  distribution: number[]
  /** Texte des choix de reponse */
  choices: string[]
  /** Callback quand le host clique sur "Question suivante" */
  onNext: () => void
}

/**
 * Composant affichant les resultats d'une question avec des barres animees.
 *
 * Ce qu'il faut implementer :
 * - Un titre "Resultats"
 * - Pour chaque choix, une barre horizontale proportionnelle au nombre de reponses
 *   (classes .result-bar-container, .result-bar-label, .result-bar-wrapper, .result-bar)
 *   La barre correcte a la classe .correct, les autres .incorrect
 *   Afficher un label "(Bonne reponse)" a cote du bon choix (classe .correct-label)
 * - La largeur de la barre est proportionnelle :
 *   width = `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`
 * - Un bouton "Question suivante" (classe .btn-primary)
 *
 * Astuce : const maxCount = Math.max(...distribution, 1)
 */
function Results({ correctIndex, distribution, choices, onNext }: ResultsProps) {
  // On demarre les barres a 0 puis on les anime apres un court delai
  // Astuce : const maxCount = Math.max(...distribution, 1)
  const [widths, setWidths] = useState<number[]>([0, 0, 0, 0])

  const maxCount = Math.max(...distribution, 1)

  useEffect(() => {
    // Reset a 0 d'abord (si on change de question)
    setWidths([0, 0, 0, 0])

    // TODO: Apres un court setTimeout(50ms), mettre a jour le state avec les vrais pourcentages
    // La transition CSS fait le reste
    const timer = setTimeout(() => {
      setWidths(
        distribution.map(count => Math.round((count / maxCount) * 100))
      )
    }, 50)

    return () => clearTimeout(timer)
  }, [distribution])

  const CHOICE_LABELS = ['A', 'B', 'C', 'D']
  const CHOICE_COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c']

  const totalAnswers = distribution.reduce((a, b) => a + b, 0)

  return (
    <div className="phase-container">
      <div className="results-container">

        {/* TODO: Un titre "Resultats" */}
        <h1>Résultats</h1>

        {/* Recap rapide */}
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          {totalAnswers} réponse{totalAnswers > 1 ? 's' : ''} reçue{totalAnswers > 1 ? 's' : ''}
          {' · '}
          Bonne réponse :{' '}
          <span style={{ color: '#10b981', fontWeight: 700 }}>
            {choices[correctIndex]}
          </span>
        </p>

        {/* TODO: Pour chaque choix, afficher une barre de resultat */}
        {/* TODO: Utiliser .result-bar.correct pour la bonne reponse */}
        {/* TODO: Calculer la largeur proportionnelle de chaque barre */}
        {/* TODO: Afficher le nombre de reponses dans chaque barre */}
        {choices.map((choice, i) => {
          const isCorrect = i === correctIndex
          const count = distribution[i] ?? 0
          const pct = widths[i]

          return (
            <div className="result-bar-container" key={i}>
              {/* Label du choix */}
              <div className="result-bar-label">
                <span
                  style={{
                    display: 'inline-block',
                    background: CHOICE_COLORS[i],
                    color: 'white',
                    borderRadius: 4,
                    padding: '0 6px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    marginRight: '0.4rem',
                  }}
                >
                  {CHOICE_LABELS[i]}
                </span>
                {choice}
                {/* TODO: Afficher un label "(Bonne reponse)" avec .correct-label */}
                {isCorrect && (
                  <span className="correct-label"> ✓</span>
                )}
              </div>

              {/* Barre animee — width via style inline, transition CSS fait le reste */}
              <div className="result-bar-wrapper">
                <div
                  className={`result-bar ${isCorrect ? 'correct' : 'incorrect'}`}
                  style={{ width: `${pct}%` }}
                >
                  {pct > 15 && (
                    <span className="result-bar-count">{count}</span>
                  )}
                </div>
              </div>

              {/* Nombre de reponses a droite si barre trop petite */}
              {pct <= 15 && (
                <span
                  style={{
                    minWidth: 24,
                    textAlign: 'right',
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              )}
            </div>
          )
        })}

        {/* TODO: Bouton "Question suivante" */}
        <button
          className="btn-primary"
          onClick={onNext}
          style={{ marginTop: '2rem', width: '100%' }}
        >
          Question suivante →
        </button>

      </div>
    </div>
  )
}

export default Results