import type { SectionQuestion } from '#/utils/exam/section-questions'
import { cn } from '#/lib/utils'

type DigitSequenceExamPanelProps = {
  questions: Array<SectionQuestion>
  answers: Record<number, string | undefined>
  onSelect: (questionIndex: number, option: number) => void
  disabled?: boolean
}

export function DigitSequenceExamPanel({
  questions,
  answers,
  onSelect,
  disabled,
}: DigitSequenceExamPanelProps) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-4">
      <div className="overflow-x-auto rounded border border-[#c5d3e3] bg-white shadow-sm">
        {questions.map((question) => {
          const selected = answers[question.index]
          return (
            <div
              key={question.index}
              className="flex flex-col gap-3 border-b border-[#d5dbe3] px-3 py-3 last:border-b-0 lg:flex-row lg:items-center lg:gap-4"
            >
              <p className="w-12 shrink-0 text-sm font-semibold text-[#1a2744]">
                Q. {question.index + 1}
              </p>
              <div className="min-w-0 flex-1 overflow-x-auto">
                <div className="inline-flex">
                  {question.digits.map((digit, digitIndex) => (
                    <span
                      key={`${question.index}-${digitIndex}`}
                      className="inline-flex min-w-[1.25rem] items-center justify-center border-r border-[#e3e8ef] px-0.5 py-1 text-sm font-semibold tabular-nums last:border-r-0"
                    >
                      {digit}
                    </span>
                  ))}
                </div>
              </div>
              <fieldset
                className="flex shrink-0 flex-wrap items-center gap-3 lg:gap-4"
                disabled={disabled}
              >
                <legend className="sr-only">Options for question {question.index + 1}</legend>
                {question.options.map((option) => {
                  const optionId = `q-${question.index}-opt-${option}`
                  const isSelected = selected === String(option)
                  return (
                    <label
                      key={optionId}
                      htmlFor={optionId}
                      className={cn(
                        'inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium',
                        isSelected && 'text-primary',
                      )}
                    >
                      <input
                        id={optionId}
                        type="radio"
                        name={`question-${question.index}`}
                        value={String(option)}
                        checked={isSelected}
                        onChange={() => onSelect(question.index, option)}
                        className="size-4 accent-[#1e3a8a]"
                      />
                      {option}
                    </label>
                  )
                })}
              </fieldset>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** @deprecated Use DigitSequenceExamPanel */
export const OddNumberExamPanel = DigitSequenceExamPanel
