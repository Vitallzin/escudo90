import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand-block">
          <Link className="footer-brand" to="/">
            Escudo Noventa
          </Link>
          <p>
            Plataforma esportiva premium para comprar camisas nacionais e
            internacionais com curadoria, segurança e atendimento profissional.
          </p>
        </div>

        <div className="footer-column">
          <h4>Loja</h4>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/catalogo?promocoes=true">Promoções</Link>
          <Link to="/perfil">Minha conta</Link>
          <Link to="/admin">Painel admin</Link>
        </div>

        <div className="footer-column">
          <h4>Atendimento</h4>
          <a href="#rastreio">Rastrear pedido</a>
          <a href="#trocas">Trocas e devoluções</a>
          <a href="#ajuda">Central de ajuda</a>
          <a href="#contato">Contato</a>
        </div>

        <div className="footer-column">
          <h4>Institucional</h4>
          <a href="#politicas">Políticas da loja</a>
          <a href="#privacidade">Privacidade</a>
          <a href="#social">Redes sociais</a>
          <a href="#legal">Informações legais</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Escudo Noventa. Todos os direitos reservados.</span>
        <span>Pagamentos por Mercado Pago, cartões, Pix e antifraude.</span>
      </div>
    </footer>
  )
}
