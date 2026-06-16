import { CheckCircle2, LockKeyhole, ShieldCheck, Truck } from 'lucide-react'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { RegisterForm } from '../../features/auth'
import './RegisterPage.css'

const trustItems = [
  { icon: LockKeyhole, label: 'Senha protegida', description: 'Seus dados de acesso ficam seguros.' },
  { icon: ShieldCheck, label: 'Cadastro validado', description: 'E-mail e CPF ajudam a proteger sua conta.' },
  { icon: Truck, label: 'Compra rastreavel', description: 'Pedidos e entregas ficam vinculados ao seu perfil.' },
]

export function RegisterPage() {
  return (
    <>
      <Header />
      <main className="register-page">
        <section className="register-hero">
          <div className="register-copy">
            <span className="eyebrow">Conta Escudo Noventa</span>
            <h1>Compre com mais seguranca.</h1>
            <p>
              Sua conta guarda os dados essenciais para finalizar pedidos, acompanhar compras e acessar seus favoritos.
            </p>

            <div className="register-fields">
              {trustItems.map((item) => (
                <article key={item.label}>
                  <item.icon aria-hidden="true" />
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="register-badge">
              <CheckCircle2 aria-hidden="true" />
              <span>Cadastro gratuito e pronto para usar na loja.</span>
            </div>
          </div>

          <RegisterForm />
        </section>
      </main>
      <Footer />
    </>
  )
}
