import { CheckCircle2, LockKeyhole, PackageCheck, ShieldCheck } from 'lucide-react'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { RegisterForm } from '../../features/auth'
import './RegisterPage.css'

const benefits = [
  { icon: PackageCheck, label: 'Acompanhe seus pedidos em tempo real' },
  { icon: ShieldCheck, label: 'Dados protegidos e checkout seguro' },
  { icon: LockKeyhole, label: 'Enderecos, favoritos e compras salvos' },
]

export function RegisterPage() {
  return (
    <>
      <Header />
      <main className="register-page">
        <section className="register-hero">
          <div className="register-copy">
            <span className="eyebrow">Conta Escudo Noventa</span>
            <h1>Entre para comprar camisas oficiais com mais velocidade e seguranca.</h1>
            <p>
              Seu cadastro libera historico de pedidos, favoritos, enderecos salvos e uma experiencia mais rapida em
              novas compras.
            </p>

            <div className="register-benefits">
              {benefits.map((benefit) => (
                <article key={benefit.label}>
                  <benefit.icon aria-hidden="true" />
                  <span>{benefit.label}</span>
                </article>
              ))}
            </div>

            <div className="register-badge">
              <CheckCircle2 aria-hidden="true" />
              <span>Cadastro gratuito para clientes da loja</span>
            </div>
          </div>

          <RegisterForm />
        </section>
      </main>
      <Footer />
    </>
  )
}
