import { ODD_NUMBER_SUM_CONFIG } from '#/configs/test-config'
import {
  formatOddSumExpression,
  getOddDigitIndexes,
  SUM_INSTRUCTION_EXAMPLE,
} from '#/utils/exam/sum-instruction-example'
import { cn } from '#/lib/utils'

type OddNumberSumInstructionPanelProps = {
  timerMinutes: number
}

export function OddNumberSumInstructionPanel({ timerMinutes }: OddNumberSumInstructionPanelProps) {
  const exampleDigits = [...SUM_INSTRUCTION_EXAMPLE.digits]
  const exampleOptions = [...SUM_INSTRUCTION_EXAMPLE.options]
  const exampleAnswer = SUM_INSTRUCTION_EXAMPLE.answer
  const oddIndexes = getOddDigitIndexes(exampleDigits)
  const sumExpression = formatOddSumExpression(exampleDigits)

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <div className="rounded border border-[#c5d3e3] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1a2744]">Odd Number Sum Test</h2>
        <div className="mt-3 space-y-2 text-sm leading-6 text-[#1a2744]">
          <p>
            <strong>No. of Questions:</strong> {ODD_NUMBER_SUM_CONFIG.questionCount}
          </p>
          <p>
            <strong>Time Limit:</strong> {timerMinutes} Minutes
          </p>
          <p className="font-semibold">
            The number of questions and the time limit in each test can vary in the actual exam.
          </p>
          <p>
            In this test, you will see a sequence of numbers from 1 to 9. Add all odd numbers in the
            sequence. Odd numbers are 1, 3, 5, 7, and 9. Ignore even numbers. Select the option that
            matches the total sum of odd numbers.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-sm font-semibold text-[#1a2744]">Example</p>
          <DigitRow digits={exampleDigits} />
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            {exampleOptions.map((option, index) => (
              <span key={option}>
                {String.fromCharCode(65 + index)}. {option}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#1a2744]">Answer</p>
            <DigitRow digits={exampleDigits} highlightIndexes={oddIndexes} />
            <p className="text-sm text-[#1a2744]">
              The sum of all the above odd numbers ({sumExpression}) is {exampleAnswer}.
            </p>
          </div>
        </div>

        <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {ODD_NUMBER_SUM_CONFIG.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function DigitRow({
  digits,
  highlightIndexes,
}: {
  digits: Array<number>
  highlightIndexes?: Set<number>
}) {
  return (
    <div className="overflow-x-auto rounded border border-[#8fa3bc] bg-white">
      <div className="inline-flex min-w-full">
        {digits.map((digit, index) => (
          <span
            key={`${digit}-${index}`}
            className={cn(
              'inline-flex min-w-[1.35rem] items-center justify-center border-r border-[#d5dbe3] px-0.5 py-2 text-sm font-semibold tabular-nums last:border-r-0',
              highlightIndexes?.has(index) && 'bg-[#7eb8d8] text-white',
            )}
          >
            {digit}
          </span>
        ))}
      </div>
    </div>
  )
}
