type ProductVisualProps = {
  colors: string[]
  name: string
  badge?: string
  large?: boolean
}

export function ProductVisual({ colors, name, badge, large = false }: ProductVisualProps) {
  const [primary, secondary = '#FFD700'] = colors

  return (
    <div
      className={`jersey-visual ${large ? 'jersey-visual-large' : ''}`}
      style={
        {
          '--jersey-primary': primary,
          '--jersey-secondary': secondary,
        } as CSSProperties
      }
      aria-label={`Imagem ilustrativa da camisa ${name}`}
      role="img"
    >
      {badge && <span className="product-badge">{badge}</span>}
      <div className="jersey">
        <div className="jersey-neck" />
        <div className="jersey-stripe" />
        <div className="jersey-crest">90</div>
      </div>
    </div>
  )
}
import type { CSSProperties } from 'react'
