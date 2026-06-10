import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { formatCurrency } from '../../../utils/formatCurrency'

type CartSummaryProps = {
  subtotal: number
  coupon: number
  shipping: number
  total: number
}

export function CartSummary({ subtotal, coupon, shipping, total }: CartSummaryProps) {
  return (
    <aside className="summary-panel">
      <h2>Resumo</h2>
      <div className="summary-row">
        <span>Subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
      <div className="summary-row">
        <span>Cupom</span>
        <strong>-{formatCurrency(coupon)}</strong>
      </div>
      <div className="summary-row">
        <span>Frete</span>
        <strong>{shipping === 0 ? 'Grátis' : formatCurrency(shipping)}</strong>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>
      <Link to="/checkout">
        <Button>Finalizar compra</Button>
      </Link>
      <Link className="continue-link" to="/times">
        Continuar comprando
      </Link>
    </aside>
  )
}
