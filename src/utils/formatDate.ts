export function formatarDataBr(dateString: string | null | undefined): string {
    if (!dateString) return ''
    
    try {
      const parts = dateString.split('-')
      if (parts.length !== 3) return dateString
      
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) return dateString
      
      const data = new Date(Date.UTC(year, month, day))
      
      if (isNaN(data.getTime())) return dateString
      
      return data.toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }