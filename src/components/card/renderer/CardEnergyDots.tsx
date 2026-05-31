interface CardEnergyDotsProps {
  cost: number
}

export function CardEnergyDots({ cost }: CardEnergyDotsProps) {
  return (
    <div className="move-cost-dots">
      {Array.from({ length: cost }).map((_, i) => (
        <div key={i} className="cost-dot" />
      ))}
    </div>
  )
}
