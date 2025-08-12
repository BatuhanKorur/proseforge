export default function DateTime({ date, className }: {
  date: string | Date
  className?: string
}) {
  if (typeof date === 'string') {
    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) {
      throw new TypeError('Invalid date string')
    }
    date = parsedDate
  }

  const options = {
    /*    weekday: 'long', */
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    /*    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric', */
    timeZone: 'UTC',
  }

  // @ts-ignore
  return <p className={className}>{ date.toLocaleString('en-US', options) }</p>
}
