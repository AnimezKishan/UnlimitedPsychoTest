export type OddNumberQuestion = {
  index: number
  digits: Array<number>
  options: Array<number>
  correctOption: number
}

function hashSeed(input: string) {
  let hash = 2166136261

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function createRng(seed: number) {
  let state = seed

  return () => {
    state += 0x6d2b79f5
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function countOddDigits(digits: Array<number>) {
  return digits.filter((digit) => digit % 2 === 1).length
}

function buildOptions(correct: number, rng: () => number) {
  const options = new Set<number>([correct])

  while (options.size < 4) {
    const offset = Math.floor(rng() * 6) - 3
    const candidate = Math.max(0, correct + offset)
    options.add(candidate)
  }

  const shuffled = Array.from(options)
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}

export function generateOddNumberQuestions(
  attemptId: string,
  questionCount = 30,
  minDigits = 25,
  maxDigits = 30,
): Array<OddNumberQuestion> {
  const questions: Array<OddNumberQuestion> = []

  for (let index = 0; index < questionCount; index += 1) {
    const rng = createRng(hashSeed(`${attemptId}:${index}`))
    const length = minDigits + Math.floor(rng() * (maxDigits - minDigits + 1))
    const digits = Array.from({ length }, () => 1 + Math.floor(rng() * 9))
    const correctOption = countOddDigits(digits)
    const options = buildOptions(correctOption, rng)

    questions.push({
      index,
      digits,
      options,
      correctOption,
    })
  }

  return questions
}

export function formatDigits(digits: Array<number>) {
  return digits.join(' ')
}
