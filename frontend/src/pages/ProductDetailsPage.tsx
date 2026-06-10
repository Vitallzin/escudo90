import { useParams, Link } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/ui/Button'
import { featuredProducts } from '../constants/products'
import { formatCurrency } from '../utils/formatCurrency'
import { useState } from 'react'

export function ProductDetailsPage() {
  const { id } = useParams()
  const [selectedSize, setSelectedSize] = useState('M')
  const product = featuredProducts.find(p => p.id === id)

  if (!product) {
    return (
      <div className="app-shell">
        <Header />
        <main style={{ textAlign: 'center', padding: '10rem 2rem' }}>
          <h2>Produto não encontrado</h2>
          <Link to="/catalogo" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>Voltar ao catálogo</Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Header />
      <main style={{ marginTop: '3rem' }}>
        <div className="grid-2">
          <div className="product-image-large">
            <span>👕</span>
          </div>

          <div className="product-details-content">
            <span className="eyebrow">{product.category}</span>
            <h1 style={{ fontSize: '3.5rem', margin: '1rem 0', color: 'var(--primary-blue)' }}>{product.name}</h1>
            <strong style={{ fontSize: '2.5rem', display: 'block', marginBottom: '2rem', color: 'var(--secondary-blue)' }}>
              {formatCurrency(product.price)}
            </strong>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '3rem', lineHeight: '1.8', maxWidth: '500px' }}>
              {product.description}
            </p>

            <div style={{ marginBottom: '3rem' }}>
              <h4 style={{ marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Selecione o Tamanho</h4>
              <div className="size-picker">
                {['P', 'M', 'G', 'GG'].map(size => (
                  <button 
                    key={size} 
                    className={`size-button ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/carrinho" style={{ flex: 1 }}>
                <Button style={{ width: '100%' }}>Adicionar ao Carrinho</Button>
              </Link>
              <Button variant="secondary" style={{ width: '64px', padding: 0 }}>❤</Button>
            </div>

            <div style={{ marginTop: '4rem', borderTop: '1px solid #eef2f6', paddingTop: '3rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="info-card">
                  <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Frete Grátis</strong>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Para todo o Brasil em pedidos acima de R$ 299</p>
                </div>
                <div className="info-card">
                  <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Parcelamento</strong>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Até 10x sem juros no cartão de crédito</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
