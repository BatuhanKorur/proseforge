import { cn } from '@/lib/utils'

export default function Logo({ className }: { className?: string }) {
  return (
    <svg width="100" height="99" viewBox="0 0 100 99" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('', className)}>
      <path d="M46.9597 47.1614V58.879H63.1452L72.6532 58.8226C87.8952 57.992 100 44.5887 100 29.4516C100 14.3145 87.4032 0.371015 71.7984 0.0484344C47.8629 0.0323053 23.9274 0 0 0V98.4194H46.9677V86.7178H11.7016V11.7339H71.4032C80.8064 11.9597 88.1613 20.2178 88.2823 29.4678C88.1613 38.7097 80.7742 46.9275 71.3629 47.1614H46.9677H46.9597ZM35.1048 75.0161V35.2984H70.5726C73.7903 35.2984 76.4193 32.6694 76.4193 29.4516C76.4193 26.2339 73.7823 23.5968 70.5726 23.5968H23.4032V75.0161H35.1048Z" fill="url(#paint0_linear_188_121615)" />
      <defs>
        <linearGradient id="paint0_linear_188_121615" x1="-1.53451" y1="79.3336" x2="58.9268" y2="-24.0265" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9A9A9A" />
          <stop offset="1" stopColor="#BFBFBF" />
        </linearGradient>
      </defs>
    </svg>

  )
}
