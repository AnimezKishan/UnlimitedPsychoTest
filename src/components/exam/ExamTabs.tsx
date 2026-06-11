import { InfoIcon } from 'lucide-react'
import { cn } from '#/lib/utils'

export type ExamTab = 'instructions' | 'test'

type ExamTabsProps = {
  activeTab: ExamTab
  onTabChange: (tab: ExamTab) => void
  testTabDisabled?: boolean
  sectionName: string
}

export function ExamTabs({
  activeTab,
  onTabChange,
  testTabDisabled,
  sectionName,
}: ExamTabsProps) {
  return (
    <nav
      className="border-b border-[#b8cde0] bg-[#d9ebf7]"
      aria-label="Exam sections"
    >
      <div className="mx-auto flex max-w-[1400px] flex-wrap gap-2 px-4 py-2">
        <button
          type="button"
          onClick={() => onTabChange('instructions')}
          className={cn(
            'inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'instructions'
              ? 'border-[#7eb8d8] bg-[#7eb8d8] text-white'
              : 'border-[#7eb8d8] bg-white text-[#1a2744] hover:bg-[#eef6fb]',
          )}
          aria-current={activeTab === 'instructions' ? 'page' : undefined}
        >
          <InfoIcon className="size-4" aria-hidden="true" />
          {sectionName} Instructions
        </button>
        <button
          type="button"
          onClick={() => onTabChange('test')}
          disabled={testTabDisabled}
          className={cn(
            'inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'test'
              ? 'border-[#7eb8d8] bg-[#7eb8d8] text-white'
              : 'border-[#7eb8d8] bg-white text-[#1a2744] hover:bg-[#eef6fb]',
            testTabDisabled && 'cursor-not-allowed opacity-50 hover:bg-white',
          )}
          aria-current={activeTab === 'test' ? 'page' : undefined}
        >
          <InfoIcon className="size-4" aria-hidden="true" />
          {sectionName} Test
        </button>
      </div>
    </nav>
  )
}
