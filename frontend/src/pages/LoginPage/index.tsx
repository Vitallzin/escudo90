import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { LoginForm } from '../../features/auth'
import './LoginPage.css'

export function LoginPage() {
  return (
    <>
      <Header />
      <main className="login-page">
        <section className="login-panel">
          <div className="login-copy">
            <span className="eyebrow">Entrar na conta</span>
            <h1>Acesse sua conta para continuar comprando.</h1>
            <p>Use seu e-mail e senha cadastrados para acompanhar pedidos, endereços e dados da sua conta.</p>

            <div className="login-trust">
              <article>
                <ShieldCheck aria-hidden="true" />
                <span>Entrada segura</span>
              </article>
              <article>
                <LockKeyhole aria-hidden="true" />
                <span>Senha protegida</span>
              </article>
            </div>
          </div>

          <LoginForm />
        </section>
      </main>
      <Footer />
    </>
  )
}
