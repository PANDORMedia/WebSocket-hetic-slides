// ============================================================
// CreateQuiz - Formulaire de creation d'un quiz
// A IMPLEMENTER : construire le formulaire dynamique
// ============================================================

import { useState } from 'react'
import type { QuizQuestion } from '@shared/index'

interface CreateQuizProps {
  /** Callback appele quand le formulaire est soumis */
  onSubmit: (title: string, questions: QuizQuestion[]) => void
}

/**
 * Composant formulaire pour creer un nouveau quiz.
 *
 * Ce qu'il faut implementer :
 * - Un champ pour le titre du quiz
 * - Une liste dynamique de questions (pouvoir en ajouter/supprimer)
 * - Pour chaque question :
 *   - Un champ texte pour la question
 *   - 4 champs texte pour les choix de reponse
 *   - Un selecteur (radio) pour la bonne reponse (correctIndex)
 *   - Un champ pour la duree du timer en secondes
 * - Un bouton pour ajouter une question
 * - Un bouton pour soumettre le formulaire
 *
 * Astuce : utilisez un state pour stocker un tableau de questions
 * et generez un id unique pour chaque question (ex: crypto.randomUUID())
 *
 * Classes CSS disponibles : .create-form, .form-group, .question-card,
 * .question-card-header, .choices-inputs, .choice-input-group,
 * .btn-add-question, .btn-remove, .btn-primary
 */

// Structure interne pour le formulaire (avec un uid temporaire pour les keys React)
interface QuestionDraft {
  uid: string
  text: string
  choices: [string, string, string, string]
  correctIndex: number
  timerSec: number
}

const DEFAULT_TIMER = 20

function makeEmptyQuestion(): QuestionDraft {
  return {
    uid: crypto.randomUUID(),
    text: '',
    choices: ['', '', '', ''],
    correctIndex: 0,
    timerSec: DEFAULT_TIMER,
  }
}

function CreateQuiz({ onSubmit }: CreateQuizProps) {
  // TODO: State pour le titre
  const [title, setTitle] = useState('')

  // TODO: State pour la liste des questions
  const [questions, setQuestions] = useState<QuestionDraft[]>([makeEmptyQuestion()])

  const [errors, setErrors] = useState<string[]>([])

  // --- Mise a jour d'une question ---
  const updateQuestion = (uid: string, field: Partial<QuestionDraft>) => {
    setQuestions(prev =>
      prev.map(q => (q.uid === uid ? { ...q, ...field } : q))
    )
  }

  const updateChoice = (uid: string, choiceIdx: number, value: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.uid !== uid) return q
        const newChoices = [...q.choices] as [string, string, string, string]
        newChoices[choiceIdx] = value
        return { ...q, choices: newChoices }
      })
    )
  }

  const addQuestion = () => {
    setQuestions(prev => [...prev, makeEmptyQuestion()])
  }

  const removeQuestion = (uid: string) => {
    setQuestions(prev => prev.filter(q => q.uid !== uid))
  }

  // TODO: Valider que le titre n'est pas vide
  // TODO: Valider qu'il y a au moins 1 question
  // TODO: Valider que chaque question a un texte et 4 choix non-vides
  const validate = (): string[] => {
    const errs: string[] = []
    if (!title.trim()) errs.push('Le titre du quiz est obligatoire.')
    if (questions.length === 0) errs.push('Ajoute au moins une question.')
    questions.forEach((q, i) => {
      if (!q.text.trim()) errs.push(`Question ${i + 1} : le texte est vide.`)
      q.choices.forEach((c, ci) => {
        if (!c.trim()) errs.push(`Question ${i + 1} : le choix ${ci + 1} est vide.`)
      })
    })
    return errs
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Valider que le titre n'est pas vide
    // TODO: Valider qu'il y a au moins 1 question
    // TODO: Valider que chaque question a un texte et 4 choix non-vides
    // TODO: Appeler onSubmit(title, questions)
    const errs = validate()
    if (errs.length > 0) {
      setErrors(errs)
      return
    }
    setErrors([])

    // Convertir les drafts en QuizQuestion avec des ids propres
    const finalQuestions: QuizQuestion[] = questions.map((q, i) => ({
      id: `q-${i}`,
      text: q.text.trim(),
      choices: q.choices.map(c => c.trim()),
      correctIndex: q.correctIndex,
      timerSec: q.timerSec,
    }))

    onSubmit(title.trim(), finalQuestions)
  }

  const CHOICE_COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c']
  const CHOICE_LABELS = ['A', 'B', 'C', 'D']

  return (
    <div className="phase-container" style={{ maxWidth: 680, width: '100%' }}>
      <h1>Créer un Quiz</h1>

      {/* Erreurs de validation */}
      {errors.length > 0 && (
        <div
          style={{
            background: '#7f1d1d',
            color: '#fca5a5',
            borderRadius: 8,
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            textAlign: 'left',
            fontSize: '0.9rem',
          }}
        >
          {errors.map((e, i) => (
            <div key={i}>• {e}</div>
          ))}
        </div>
      )}

      <form className="create-form" onSubmit={handleSubmit}>

        {/* TODO: Champ titre */}
        <div className="form-group">
          <label htmlFor="quiz-title">Titre du quiz</label>
          <input
            id="quiz-title"
            type="text"
            placeholder="Ex : Culture générale, JS avancé..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* TODO: Liste des questions avec .question-card */}
        {questions.map((q, qIdx) => (
          <div className="question-card" key={q.uid}>
            <div className="question-card-header">
              <h3>Question {qIdx + 1}</h3>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeQuestion(q.uid)}
                >
                  Supprimer
                </button>
              )}
            </div>

            {/* Texte de la question */}
            <div className="form-group">
              <label>Question</label>
              <input
                type="text"
                placeholder="Ex : Quelle est la capitale de la France ?"
                value={q.text}
                onChange={e => updateQuestion(q.uid, { text: e.target.value })}
              />
            </div>

            {/* 4 choix de reponse */}
            <div className="form-group">
              <label>Choix de réponse — sélectionne la bonne réponse</label>
              <div className="choices-inputs">
                {q.choices.map((choice, ci) => (
                  <div className="choice-input-group" key={ci}>
                    {/* Radio pour marquer la bonne reponse */}
                    <input
                      type="radio"
                      name={`correct-${q.uid}`}
                      checked={q.correctIndex === ci}
                      onChange={() => updateQuestion(q.uid, { correctIndex: ci })}
                      title="Bonne réponse"
                    />
                    {/* Badge colore */}
                    <span
                      style={{
                        background: CHOICE_COLORS[ci],
                        color: 'white',
                        borderRadius: 6,
                        padding: '0 8px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        flexShrink: 0,
                      }}
                    >
                      {CHOICE_LABELS[ci]}
                    </span>
                    <input
                      type="text"
                      placeholder={`Choix ${CHOICE_LABELS[ci]}`}
                      value={choice}
                      onChange={e => updateChoice(q.uid, ci, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Duree du timer */}
            <div className="form-group" style={{ maxWidth: 200 }}>
              <label htmlFor={`timer-${q.uid}`}>Durée (secondes)</label>
              <select
                id={`timer-${q.uid}`}
                value={q.timerSec}
                onChange={e => updateQuestion(q.uid, { timerSec: Number(e.target.value) })}
              >
                {[5, 10, 15, 20, 30, 45, 60].map(t => (
                  <option key={t} value={t}>{t}s</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {/* TODO: Bouton ajouter une question */}
        <button
          type="button"
          className="btn-add-question"
          onClick={addQuestion}
        >
          + Ajouter une question
        </button>

        {/* TODO: Bouton soumettre */}
        <div style={{ marginTop: '1.5rem' }}>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%' }}
          >
            Créer le quiz ({questions.length} question{questions.length > 1 ? 's' : ''})
          </button>
        </div>

      </form>
    </div>
  )
}

export default CreateQuiz