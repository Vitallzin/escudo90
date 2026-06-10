const stats = [
  { label: 'Pedidos', value: '12' },
  { label: 'Favoritos', value: '18' },
  { label: 'Cupons ativos', value: '3' },
]

export function ProfileStats() {
  return (
    <div className="dashboard-grid">
      {stats.map((stat) => (
        <article key={stat.label}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </article>
      ))}
    </div>
  )
}
