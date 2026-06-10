export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-info">
          <span className="footer-brand">Escudo Noventa</span>
          <p>A maior curadoria de camisas premium do Brasil. Qualidade, autenticidade e a nostalgia dos anos 90 em cada detalhe.</p>
        </div>
        
        <div className="footer-links">
          <h4>Atendimento</h4>
          <ul>
            <li><a href="#rastreio">Rastrear Pedido</a></li>
            <li><a href="#trocas">Trocas e Devoluções</a></li>
            <li><a href="#faq">Central de Ajuda</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Contato</h4>
          <ul>
            <li>WhatsApp: (11) 99999-9999</li>
            <li>Email: contato@escudonoventa.com</li>
            <li>Instagram: @escudonoventa</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <span>&copy; 2026 Escudo Noventa. Todos os direitos reservados.</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#privacidade">Privacidade</a>
          <a href="#termos">Termos</a>
        </div>
      </div>
    </footer>
  )
}
