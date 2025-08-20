import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function GeneralSettings({ models }: {
  models: any[] | null
}) {
  return (
    <div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Models..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Model 1</SelectItem>
        </SelectContent>
      </Select>
      <div>
        { JSON.stringify(models, null, 2) }
      </div>
      <p>In Progress (General Settings)</p>
    </div>
  )
}
