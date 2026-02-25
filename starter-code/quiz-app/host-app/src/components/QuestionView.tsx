// ============================================================
// QuestionView - Affichage de la question en cours (cote host)
// A IMPLEMENTER : question, choix, timer, compteur de reponses
// ============================================================

import type { QuizQuestion } from '@shared/index'

interface QuestionViewProps {
  /** La question en cours (sans correctIndex) */
  question: Omit<QuizQuestion, 'correctIndex'>
  /** Index de la question (0-based) */
  index: number
  /** Nombre total de questions */
  total: number
  /** Temps restant en secondes */
  remaining: number
  /** Nombre de joueurs ayant repondu */
  answerCount: number
  /** Nombre total de joueurs */
  totalPlayers: number
}

/**
 * Composant affichant la question en cours sur l'ecran du host.
 *
 * Ce qu'il faut implementer :
 * - En-tete avec "Question X / Y" (classe .question-header)
 * - Le timer en cercle (classes .countdown, .countdown-circle)
 *   Ajouter la classe .warning si remaining <= 10, .danger si remaining <= 3
 * - Le texte de la question (classe .question-text)
 * - Les 4 choix dans une grille (classes .choices-grid, .choice-card)
 * - Le compteur de reponses "X / Y reponses" (classe .answer-counter)
 *
 * Note : cote host on affiche les choix mais sans interaction
 * (c'est purement visuel pour projeter au mur)
 */
function QuestionView({ question, index, total, remaining, answerCount, totalPlayers }: QuestionViewProps) {
  // Classes CSS du timer selon le temps restant
  const timerClass = [
    'countdown-circle',
    remaining <= 3 ? 'danger' : remaining <= 10 ? 'warning' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const CHOICE_COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c']
  const CHOICE_LABELS = ['A', 'B', 'C', 'D']

  return (
    <div className="phase-container">

      {/* TODO: En-tete "Question {index + 1} / {total}" */}
      <div className="question-header">
        <span>Question {index + 1} / {total}</span>
        <span>{answerCount} / {totalPlayers} réponses</span>
      </div>

      {/* TODO: Timer avec .countdown-circle (+ .warning / .danger selon remaining) */}
      <div className="countdown">
        <div className={timerClass}>{remaining}</div>
      </div>

      {/* TODO: Texte de la question avec .question-text */}
      <p className="question-text">{question.text}</p>

      {/* TODO: Grille des 4 choix avec .choices-grid et .choice-card */}
      {/* Note : cote host on affiche les choix mais sans interaction */}
      <div className="choices-grid">
        {question.choices.map((choice, i) => (
          <div
            key={i}
            className="choice-card"
            style={{ background: CHOICE_COLORS[i] }}
          >
            <span style={{ marginRight: '0.5rem', fontWeight: 700 }}>
              {CHOICE_LABELS[i]}
            </span>
            {choice}
          </div>
        ))}
      </div>

      {/* TODO: Compteur "{answerCount} / {totalPlayers} reponses" */}
      <div className="answer-counter">
        <div
          style={{
            marginTop: '1rem',
            height: 6,
            background: '#1e1e4a',
            borderRadius: 9999,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              background: '#7c3aed',
              borderRadius: 9999,
              transition: 'width 0.4s ease',
              width: totalPlayers > 0
                ? `${Math.round((answerCount / totalPlayers) * 100)}%`
                : '0%',
            }}
          />
        </div>
        <p style={{ marginTop: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          {totalPlayers > 0
            ? `${Math.round((answerCount / totalPlayers) * 100)}% ont répondu`
            : 'En attente de réponses...'}
        </p>
      </div>

    </div>
  )
}

export default QuestionView