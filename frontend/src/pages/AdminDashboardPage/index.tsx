import {
  AlertTriangle,
  Archive,
  BarChart3,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  Edit3,
  Filter,
  Globe2,
  KeyRound,
  LayoutDashboard,
  Lock,
  Mail,
  Menu,
  Moon,
  PackagePlus,
  Percent,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sun,
  Tags,
  Truck,
  Upload,
  UserCog,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import './AdminDashboardPage.css'

type AdminSection =
  | 'dashboard'
  | 'products'
  | 'catalogs'
  | 'pricing'
  | 'users'
  | 'orders'
  | 'content'
  | 'settings'
  | 'reports'
  | 'extras'
  | 'logs'

type ProductStatus = 'Ativo' | 'Inativo' | 'Arquivado'
type OrderStatus = 'Pendente' | 'Pago' | 'Enviado' | 'Entregue' | 'Cancelado'

type ProductRow = {
  id: string
  name: string
  team: string
  category: string
  size: string
  color: string
  price: number
  oldPrice?: number
  stock: number
  sku: string
  status: ProductStatus
}

type AdminLog = {
  id: string
  kind: 'Admin' | 'Erro' | 'Acesso'
  actor: string
  action: string
  ip: string
  when: string
  severity: 'Baixa' | 'Media' | 'Alta'
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const menuItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Produtos e estoque', icon: Boxes },
  { id: 'catalogs', label: 'Catalogos', icon: Tags },
  { id: 'pricing', label: 'Precos e promocoes', icon: Percent },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'orders', label: 'Pedidos e vendas', icon: ShoppingCart },
  { id: 'content', label: 'Conteudo do site', icon: Globe2 },
  { id: 'settings', label: 'Configuracoes', icon: Settings },
  { id: 'reports', label: 'Relatorios', icon: BarChart3 },
  { id: 'extras', label: 'Extras', icon: SlidersHorizontal },
  { id: 'logs', label: 'Logs do sistema', icon: ClipboardList },
]

const products: ProductRow[] = [
  {
    id: 'brasil-1970-retro',
    name: 'Brasil Retro 1970',
    team: 'Selecao Brasileira',
    category: 'Selecoes',
    size: 'P, M, G, GG, XG',
    color: 'Amarelo',
    price: 289.9,
    oldPrice: 349.9,
    stock: 18,
    sku: 'SEL-BRA-1970',
    status: 'Ativo',
  },
  {
    id: 'boca-juniors-home',
    name: 'Boca Juniors Home',
    team: 'Boca Juniors',
    category: 'Libertadores',
    size: 'M, G, GG, XG',
    color: 'Azul/Ouro',
    price: 319.9,
    oldPrice: 379.9,
    stock: 11,
    sku: 'ARG-BOC-HOME',
    status: 'Ativo',
  },
  {
    id: 'milan-champions',
    name: 'Milan Champions Night',
    team: 'AC Milan',
    category: 'Champions',
    size: 'M, G, GG',
    color: 'Preto/Vermelho',
    price: 399.9,
    oldPrice: 449.9,
    stock: 8,
    sku: 'ITA-MIL-UCL',
    status: 'Ativo',
  },
  {
    id: 'chelsea-home-2026',
    name: 'Chelsea Home 2026',
    team: 'Chelsea',
    category: 'Premier League',
    size: 'P, M, G, GG',
    color: 'Azul',
    price: 349.9,
    stock: 27,
    sku: 'ING-CHE-2026',
    status: 'Inativo',
  },
]

const catalogs = [
  { name: 'Camisas 2025', products: 42, featured: true, order: 1 },
  { name: 'Times Brasileiros', products: 28, featured: true, order: 2 },
  { name: 'Times Europeus', products: 31, featured: false, order: 3 },
  { name: 'Lancamentos', products: 16, featured: true, order: 4 },
  { name: 'Colecao Infantil', products: 9, featured: false, order: 5 },
]

const users = [
  {
    name: 'Marcos Oliveira',
    email: 'cliente@escudonoventa.com',
    phone: '(21) 98888-7777',
    status: 'Ativo',
    orders: 8,
    spent: 2840.2,
    role: 'Cliente',
  },
  {
    name: 'Ana Pereira',
    email: 'ana@email.com',
    phone: '(11) 97777-1111',
    status: 'Bloqueado',
    orders: 2,
    spent: 619.8,
    role: 'Cliente',
  },
  {
    name: 'Administrador Escudo Noventa',
    email: 'admin@escudonoventa.com',
    phone: '(11) 90000-0000',
    status: 'Ativo',
    orders: 0,
    spent: 0,
    role: 'Admin exclusivo',
  },
]

const orders: {
  id: string
  user: string
  products: string
  status: OrderStatus
  total: number
  payment: string
  date: string
}[] = [
  {
    id: 'ORD-2091',
    user: 'Marcos Oliveira',
    products: 'Brasil Retro 1970, Milan Champions',
    status: 'Pago',
    total: 689.8,
    payment: 'PIX',
    date: '18/06/2026',
  },
  {
    id: 'ORD-2088',
    user: 'Ana Pereira',
    products: 'Boca Juniors Home',
    status: 'Enviado',
    total: 319.9,
    payment: 'Cartao',
    date: '17/06/2026',
  },
  {
    id: 'ORD-2072',
    user: 'Joao Costa',
    products: 'Chelsea Home 2026',
    status: 'Pendente',
    total: 349.9,
    payment: 'Mercado Pago',
    date: '16/06/2026',
  },
]

const logs: AdminLog[] = [
  {
    id: 'LOG-1008',
    kind: 'Admin',
    actor: 'Administrador Escudo Noventa',
    action: 'Alterou preco em massa: categoria Champions +5%',
    ip: '192.168.0.12',
    when: '18/06/2026 03:10',
    severity: 'Alta',
  },
  {
    id: 'LOG-1007',
    kind: 'Acesso',
    actor: 'admin@escudonoventa.com',
    action: 'Login administrativo confirmado',
    ip: '192.168.0.12',
    when: '18/06/2026 03:02',
    severity: 'Baixa',
  },
  {
    id: 'LOG-1006',
    kind: 'Erro',
    actor: 'Sistema',
    action: 'Falha temporaria no webhook de pagamento',
    ip: 'supabase-edge',
    when: '17/06/2026 22:44',
    severity: 'Media',
  },
  {
    id: 'LOG-1005',
    kind: 'Admin',
    actor: 'Administrador Escudo Noventa',
    action: 'Bloqueou usuario ana@email.com',
    ip: '192.168.0.12',
    when: '17/06/2026 21:20',
    severity: 'Alta',
  },
]

const reportRows = [
  ['Vendas do dia', currency.format(9284.5), '34 pedidos', '+12%'],
  ['Vendas do mes', currency.format(84920), '426 pedidos', '+18%'],
  ['Ticket medio', currency.format(199.34), 'checkout saudavel', '+4%'],
  ['Produto mais vendido', 'Brasil Retro 1970', '86 unidades', 'Top 1'],
  ['Estoque critico', '3 produtos', 'abaixo de 10 un.', 'Acao urgente'],
]

const checklistGroups = [
  {
    title: 'Seguranca do superusuario',
    items: [
      'Confirmacao obrigatoria antes de deletar, bloquear usuarios e alterar precos em massa',
      'Logs obrigatorios para todas as acoes administrativas',
      'Senha forte com minimo de 12 caracteres, letras, numeros e simbolos',
      '2FA recomendado para o acesso admin',
      'Auto logout por inatividade configuravel',
      'Maximo de 5 tentativas de login antes de bloqueio temporario',
      'Acesso exclusivo para um unico administrador',
    ],
  },
  {
    title: 'Importacao, exportacao e integracoes',
    items: [
      'Importar produtos via CSV ou Excel',
      'Exportar produtos, pedidos, usuarios e logs',
      'Template de importacao pronto para uso',
      'Integracao com Correios, transportadoras, pagamentos, ERP e webhooks',
      'Modo manutencao com mensagem personalizada',
      'Sistema de fidelidade e gestao de avaliacoes',
    ],
  },
]

function statusClass(status: string) {
  return status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toast, setToast] = useState('Painel administrativo carregado com seguranca.')
  const [criticalAction, setCriticalAction] = useState<string | null>(null)
  const [stockAlert, setStockAlert] = useState(10)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = `${product.name} ${product.team} ${product.sku}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchStatus = statusFilter === 'Todos' || product.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [searchTerm, statusFilter])

  const lowStockCount = products.filter((product) => product.stock < stockAlert).length
  const revenue = orders.reduce((sum, order) => sum + order.total, 0)

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3600)
  }

  function requestCriticalAction(action: string) {
    setCriticalAction(action)
  }

  function confirmCriticalAction() {
    if (!criticalAction) {
      return
    }

    notify(`Acao critica confirmada: ${criticalAction}. Registro enviado para auditoria.`)
    setCriticalAction(null)
  }

  function exportLogs() {
    const header = 'id,tipo,quem,quando,acao,ip,severidade'
    const rows = logs.map((log) =>
      [log.id, log.kind, log.actor, log.when, log.action, log.ip, log.severity]
        .map((value) => `"${value.replace(/"/g, '""')}"`)
        .join(','),
    )
    downloadTextFile('escudo90-logs-admin.csv', [header, ...rows].join('\n'))
    notify('Logs exportados em CSV.')
  }

  return (
    <div className={`app-shell admin-shell admin-shell--${theme}`}>
      <Header />

      <main className="admin-main">
        <section className="admin-hero">
          <div>
            <span className="eyebrow">Superusuario administrador</span>
            <h1>Controle total da loja de camisas</h1>
            <p>
              Area exclusiva, separada dos usuarios comuns, com produtos, catalogos, precos, pedidos,
              clientes, seguranca, relatorios e logs em um unico painel.
            </p>
          </div>

          <div className="admin-hero__actions">
            <button type="button" onClick={() => requestCriticalAction('alterar precos em massa')}>
              <Percent aria-hidden="true" />
              Alterar precos
            </button>
            <button type="button" onClick={exportLogs}>
              <Download aria-hidden="true" />
              Exportar logs
            </button>
            <button type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
              {theme === 'light' ? 'Modo dark' : 'Modo light'}
            </button>
          </div>
        </section>

        {toast && (
          <div className="admin-toast" role="status">
            <CheckCircle2 aria-hidden="true" />
            {toast}
          </div>
        )}

        <section className="admin-layout">
          <aside className={`admin-sidebar ${mobileMenuOpen ? 'is-open' : ''}`}>
            <button className="admin-menu-toggle" type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu aria-hidden="true" />
              Menu administrativo
              <ChevronDown aria-hidden="true" />
            </button>

            <nav aria-label="Navegacao administrativa">
              {menuItems.map((item) => {
                const Icon = item.icon

                return (
                  <button
                    className={activeSection === item.id ? 'active' : undefined}
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setMobileMenuOpen(false)
                    }}
                    type="button"
                  >
                    <Icon aria-hidden="true" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </aside>

          <div className="admin-content">
            {activeSection === 'dashboard' && (
              <>
                <div className="admin-metrics">
                  <article>
                    <span>Faturamento</span>
                    <strong>{currency.format(revenue)}</strong>
                    <small>Vendas monitoradas em tempo real</small>
                  </article>
                  <article>
                    <span>Pedidos</span>
                    <strong>{orders.length}</strong>
                    <small>1 pagamento pendente</small>
                  </article>
                  <article>
                    <span>Estoque critico</span>
                    <strong>{lowStockCount}</strong>
                    <small>Produtos abaixo de {stockAlert} unidades</small>
                  </article>
                  <article>
                    <span>Usuarios ativos</span>
                    <strong>{users.filter((user) => user.status === 'Ativo').length}</strong>
                    <small>Admin exclusivo protegido</small>
                  </article>
                </div>

                <section className="admin-panel admin-chart-panel">
                  <div className="admin-panel__header">
                    <div>
                      <span className="eyebrow">Analytics</span>
                      <h2>Desempenho dos ultimos 7 dias</h2>
                    </div>
                    <button type="button" onClick={() => notify('Dashboard atualizado.')}>
                      <RefreshCw aria-hidden="true" />
                      Atualizar
                    </button>
                  </div>
                  <div className="bar-chart" aria-label="Grafico de vendas">
                    {[45, 62, 58, 74, 68, 82, 91].map((height, index) => (
                      <span key={index} style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </section>

                <SecurityPanel stockAlert={stockAlert} setStockAlert={setStockAlert} />
              </>
            )}

            {activeSection === 'products' && (
              <section className="admin-panel">
                <div className="admin-panel__header">
                  <div>
                    <span className="eyebrow">Gerenciamento de produtos</span>
                    <h2>Cadastro, edicao, imagens e estoque</h2>
                  </div>
                  <div className="admin-actions">
                    <button type="button" onClick={() => notify('Formulario de novo produto aberto.')}>
                      <PackagePlus aria-hidden="true" />
                      Novo produto
                    </button>
                    <button type="button" onClick={() => notify('Importacao CSV/Excel preparada.')}>
                      <Upload aria-hidden="true" />
                      Importar estoque
                    </button>
                  </div>
                </div>

                <div className="admin-filters">
                  <label>
                    <Search aria-hidden="true" />
                    <input
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Buscar por camisa, time ou SKU"
                      value={searchTerm}
                    />
                  </label>
                  <label>
                    <Filter aria-hidden="true" />
                    <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
                      <option>Todos</option>
                      <option>Ativo</option>
                      <option>Inativo</option>
                      <option>Arquivado</option>
                    </select>
                  </label>
                </div>

                <div className="admin-table" role="table">
                  <div className="admin-table__row admin-table__head" role="row">
                    <span>Produto</span>
                    <span>Categoria</span>
                    <span>Preco</span>
                    <span>Estoque</span>
                    <span>Status</span>
                    <span>Acoes</span>
                  </div>
                  {filteredProducts.map((product) => (
                    <div className="admin-table__row" key={product.id} role="row">
                      <span>
                        <strong>{product.name}</strong>
                        <small>
                          {product.team} | {product.size} | {product.color} | {product.sku}
                        </small>
                      </span>
                      <span>{product.category}</span>
                      <span>
                        <strong>{currency.format(product.price)}</strong>
                        {product.oldPrice && <small>Original {currency.format(product.oldPrice)}</small>}
                      </span>
                      <span className={product.stock < 10 ? 'danger-text' : undefined}>{product.stock} un.</span>
                      <span>
                        <mark className={`status-pill ${statusClass(product.status)}`}>{product.status}</mark>
                      </span>
                      <span className="row-actions">
                        <button type="button" title="Editar produto" onClick={() => notify(`${product.name} pronto para edicao.`)}>
                          <Edit3 aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          title="Arquivar produto"
                          onClick={() => requestCriticalAction(`arquivar produto ${product.name}`)}
                        >
                          <Archive aria-hidden="true" />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>

                <ProductForm notify={notify} />
              </section>
            )}

            {activeSection === 'catalogs' && (
              <section className="admin-panel">
                <div className="admin-panel__header">
                  <div>
                    <span className="eyebrow">Gerenciamento de catalogos</span>
                    <h2>Colecoes, destaque, ordenacao e preview</h2>
                  </div>
                  <button type="button" onClick={() => notify('Novo catalogo tematico criado em rascunho.')}>
                    <Plus aria-hidden="true" />
                    Criar catalogo
                  </button>
                </div>

                <div className="catalog-grid">
                  {catalogs.map((catalog) => (
                    <article key={catalog.name}>
                      <span>Ordem {catalog.order}</span>
                      <h3>{catalog.name}</h3>
                      <p>{catalog.products} produtos associados</p>
                      <mark>{catalog.featured ? 'Principal/destaque' : 'Catalogo ativo'}</mark>
                      <div className="row-actions">
                        <button type="button" onClick={() => notify(`Preview do catalogo ${catalog.name} aberto.`)}>
                          <Globe2 aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => requestCriticalAction(`excluir catalogo ${catalog.name}`)}>
                          <Archive aria-hidden="true" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'pricing' && (
              <section className="admin-panel">
                <div className="admin-panel__header">
                  <div>
                    <span className="eyebrow">Precos e promocoes</span>
                    <h2>Cupons, descontos, regras e historico</h2>
                  </div>
                  <button type="button" onClick={() => requestCriticalAction('aplicar desconto em massa')}>
                    <Percent aria-hidden="true" />
                    Desconto em massa
                  </button>
                </div>

                <div className="admin-split">
                  <FormCard
                    buttonLabel="Salvar promocao"
                    fields={[
                      'Nome da promocao',
                      'Tipo: porcentagem, valor fixo, quantidade ou periodo',
                      'Validade do cupom',
                      'Limite por usuario',
                    ]}
                    onSubmit={() => notify('Promocao salva com tracking de uso.')}
                    title="Promocoes e cupons"
                  />
                  <Checklist
                    title="Regras de preco"
                    items={[
                      'Preco minimo obrigatorio para evitar venda abaixo do permitido',
                      'Preco sugerido por categoria e tamanho',
                      'Ajuste automatico por inflacao mensal',
                      'Historico com quem, quando, valor antigo e valor novo',
                    ]}
                  />
                </div>
              </section>
            )}

            {activeSection === 'users' && (
              <section className="admin-panel">
                <div className="admin-panel__header">
                  <div>
                    <span className="eyebrow">Gerenciamento de usuarios</span>
                    <h2>Clientes, permissoes, bloqueios e historico</h2>
                  </div>
                  <button type="button" onClick={() => notify('Usuario manual criado em rascunho.')}>
                    <UserCog aria-hidden="true" />
                    Criar usuario
                  </button>
                </div>
                <SimpleTable
                  columns={['Usuario', 'Contato', 'Pedidos', 'Total gasto', 'Permissao', 'Status']}
                  rows={users.map((user) => [
                    user.name,
                    `${user.email} | ${user.phone}`,
                    String(user.orders),
                    currency.format(user.spent),
                    user.role,
                    user.status,
                  ])}
                />
                <div className="danger-zone">
                  <AlertTriangle aria-hidden="true" />
                  <div>
                    <strong>Acoes criticas exigem confirmacao</strong>
                    <p>Bloquear, desbloquear, deletar ou arquivar usuarios sempre gera log de auditoria.</p>
                  </div>
                  <button type="button" onClick={() => requestCriticalAction('bloquear usuario selecionado')}>
                    Bloquear usuario
                  </button>
                </div>
              </section>
            )}

            {activeSection === 'orders' && (
              <section className="admin-panel">
                <div className="admin-panel__header">
                  <div>
                    <span className="eyebrow">Pedidos e vendas</span>
                    <h2>Status, pagamentos, cancelamentos e entrega</h2>
                  </div>
                  <button type="button" onClick={() => notify('Relatorio de vendas exportado.')}>
                    <Download aria-hidden="true" />
                    Exportar vendas
                  </button>
                </div>
                <SimpleTable
                  columns={['Pedido', 'Usuario', 'Produtos', 'Pagamento', 'Total', 'Status']}
                  rows={orders.map((order) => [
                    `${order.id} | ${order.date}`,
                    order.user,
                    order.products,
                    order.payment,
                    currency.format(order.total),
                    order.status,
                  ])}
                />
                <Checklist
                  title="Fluxo de status"
                  items={[
                    'Pendente para Pago',
                    'Pago para Enviado',
                    'Enviado para Entregue',
                    'Qualquer status para Cancelado com justificativa',
                    'Estorno de pagamento quando necessario',
                    'Notificacao automatica para o cliente',
                  ]}
                />
              </section>
            )}

            {activeSection === 'content' && (
              <section className="admin-panel">
                <div className="admin-panel__header">
                  <div>
                    <span className="eyebrow">Conteudo do site</span>
                    <h2>Home, banners, paginas e navegacao</h2>
                  </div>
                  <button type="button" onClick={() => notify('Alteracoes de conteudo publicadas.')}>
                    <Globe2 aria-hidden="true" />
                    Publicar
                  </button>
                </div>
                <div className="admin-split">
                  <FormCard
                    buttonLabel="Salvar home"
                    fields={['Texto principal da home', 'Banner promocional', 'Produtos em destaque', 'Ordem da secao']}
                    onSubmit={() => notify('Home page atualizada.')}
                    title="Home page"
                  />
                  <Checklist
                    title="Paginas institucionais"
                    items={[
                      'Sobre Nos',
                      'Contato',
                      'Politica de Privacidade',
                      'Politica de Entrega',
                      'Troca e Devolucao',
                      'Termos de Uso',
                      'Menu principal e rodape ordenaveis',
                    ]}
                  />
                </div>
              </section>
            )}

            {activeSection === 'settings' && (
              <section className="admin-panel">
                <div className="admin-panel__header">
                  <div>
                    <span className="eyebrow">Configuracoes do sistema</span>
                    <h2>Pagamento, frete, email, seguranca e backups</h2>
                  </div>
                  <button type="button" onClick={() => notify('Configuracoes salvas com sucesso.')}>
                    <Settings aria-hidden="true" />
                    Salvar tudo
                  </button>
                </div>
                <div className="settings-grid">
                  <SettingsGroup
                    icon={Globe2}
                    title="Gerais"
                    items={['Nome do site', 'Logo upload', 'Telefone', 'Email', 'Endereco da empresa', 'CLK horario']}
                  />
                  <SettingsGroup
                    icon={KeyRound}
                    title="Pagamento"
                    items={['Gateway', 'Taxas', 'Cartao, PIX e boleto', 'Chave API', 'Modo teste/producao']}
                  />
                  <SettingsGroup
                    icon={Truck}
                    title="Frete"
                    items={['Correios', 'Transportadoras', 'Taxa por regiao', 'Frete gratis acima de X', 'Prazo estimado']}
                  />
                  <SettingsGroup
                    icon={Mail}
                    title="Email"
                    items={['SMTP', 'Remetente', 'Pedido enviado', 'Pedido entregue', 'Cancelamento', 'Promocao']}
                  />
                  <SettingsGroup
                    icon={ShieldCheck}
                    title="Seguranca"
                    items={['2FA para admin', 'Limite de tentativas', 'Session timeout', 'SSL/HTTPS', 'Log admin']}
                  />
                  <SettingsGroup
                    icon={Archive}
                    title="Backups"
                    items={['Backup automatico', 'Backup manual instantaneo', 'Restaurar backup', 'Historico']}
                  />
                </div>
              </section>
            )}

            {activeSection === 'reports' && (
              <section className="admin-panel">
                <div className="admin-panel__header">
                  <div>
                    <span className="eyebrow">Relatorios e analytics</span>
                    <h2>Dados para decisao comercial</h2>
                  </div>
                  <button type="button" onClick={() => notify('Relatorio detalhado exportado em CSV/Excel.')}>
                    <Download aria-hidden="true" />
                    Exportar
                  </button>
                </div>
                <SimpleTable columns={['Metrica', 'Valor', 'Detalhe', 'Tendencia']} rows={reportRows} />
                <Checklist
                  title="Metricas avancadas"
                  items={[
                    'Crescimento de vendas comparado ao mes anterior',
                    'Conversao de visitas para compras',
                    'Taxa de cancelamento',
                    'Tempo medio de entrega',
                    'Satisfacao do cliente por avaliacoes',
                    'Ranking por produto, time, estoque, usuarios e cupons',
                  ]}
                />
              </section>
            )}

            {activeSection === 'extras' && (
              <section className="admin-panel">
                <div className="admin-panel__header">
                  <div>
                    <span className="eyebrow">Funcionalidades extras</span>
                    <h2>Operacoes avancadas para o admin</h2>
                  </div>
                  <button type="button" onClick={() => notify('Modo manutencao alternado.')}>
                    <Lock aria-hidden="true" />
                    Modo manutencao
                  </button>
                </div>
                <div className="checklist-grid">
                  {checklistGroups.map((group) => (
                    <Checklist key={group.title} title={group.title} items={group.items} />
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'logs' && (
              <section className="admin-panel">
                <div className="admin-panel__header">
                  <div>
                    <span className="eyebrow">Logs do sistema</span>
                    <h2>Admin, erros, acessos e exportacao</h2>
                  </div>
                  <button type="button" onClick={exportLogs}>
                    <Download aria-hidden="true" />
                    Exportar logs
                  </button>
                </div>
                <SimpleTable
                  columns={['ID', 'Tipo', 'Quem', 'Quando', 'O que', 'IP', 'Severidade']}
                  rows={logs.map((log) => [log.id, log.kind, log.actor, log.when, log.action, log.ip, log.severity])}
                />
              </section>
            )}
          </div>
        </section>
      </main>

      {criticalAction && (
        <div className="confirm-backdrop" role="presentation">
          <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <button className="confirm-close" type="button" onClick={() => setCriticalAction(null)} aria-label="Fechar">
              <X aria-hidden="true" />
            </button>
            <AlertTriangle aria-hidden="true" />
            <h2 id="confirm-title">Confirmar acao critica</h2>
            <p>
              Voce esta prestes a {criticalAction}. Essa operacao sera registrada com usuario, data, IP e detalhes.
            </p>
            <div>
              <button type="button" onClick={() => setCriticalAction(null)}>
                Cancelar
              </button>
              <button type="button" onClick={confirmCriticalAction}>
                Confirmar e registrar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

function ProductForm({ notify }: { notify: (message: string) => void }) {
  return (
    <form
      className="admin-form"
      onSubmit={(event) => {
        event.preventDefault()
        notify('Produto validado e salvo com historico de alteracoes.')
      }}
    >
      <h3>Cadastro rapido de produto</h3>
      <div>
        <label>
          Nome da camisa
          <input minLength={3} placeholder="Flamengo 2025 Legitima" required />
        </label>
        <label>
          Time associado
          <input placeholder="Flamengo, Palmeiras, Brasil..." required />
        </label>
        <label>
          Categoria
          <select required>
            <option>Legitima</option>
            <option>Replica</option>
            <option>Treino</option>
            <option>Infantil</option>
            <option>Masculino</option>
            <option>Feminino</option>
          </select>
        </label>
        <label>
          Preco de venda
          <input min={0} placeholder="299,90" required type="number" />
        </label>
        <label>
          Estoque
          <input min={0} placeholder="25" required type="number" />
        </label>
        <label>
          SKU interno
          <input placeholder="BRA-FLA-2025" required />
        </label>
      </div>
      <label>
        Descricao detalhada
        <textarea placeholder="Tecido, escudo, modelagem, origem e observacoes importantes." />
      </label>
      <button type="submit">
        <CheckCircle2 aria-hidden="true" />
        Salvar produto
      </button>
    </form>
  )
}

function FormCard({
  buttonLabel,
  fields,
  onSubmit,
  title,
}: {
  buttonLabel: string
  fields: string[]
  onSubmit: () => void
  title: string
}) {
  return (
    <form
      className="admin-form compact"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <h3>{title}</h3>
      {fields.map((field) => (
        <label key={field}>
          {field}
          <input required placeholder={field} />
        </label>
      ))}
      <button type="submit">
        <CheckCircle2 aria-hidden="true" />
        {buttonLabel}
      </button>
    </form>
  )
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="checklist-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <CheckCircle2 aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function SecurityPanel({
  setStockAlert,
  stockAlert,
}: {
  setStockAlert: (value: number) => void
  stockAlert: number
}) {
  return (
    <section className="security-panel">
      <div>
        <ShieldCheck aria-hidden="true" />
        <div>
          <span className="eyebrow">Regras de seguranca</span>
          <h2>Admin exclusivo com protecoes obrigatorias</h2>
        </div>
      </div>

      <div className="security-grid">
        <label>
          Tentativas maximas
          <input readOnly value="5 tentativas" />
        </label>
        <label>
          Session timeout
          <input readOnly value="30 minutos" />
        </label>
        <label>
          Senha forte
          <input readOnly value="12+ caracteres com simbolos" />
        </label>
        <label>
          Alerta de estoque
          <input min={1} onChange={(event) => setStockAlert(Number(event.target.value))} type="number" value={stockAlert} />
        </label>
      </div>
    </section>
  )
}

function SettingsGroup({
  icon: Icon,
  items,
  title,
}: {
  icon: typeof LayoutDashboard
  items: string[]
  title: string
}) {
  return (
    <article className="settings-card">
      <Icon aria-hidden="true" />
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

function SimpleTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="simple-table" role="table">
      <div className="simple-table__row simple-table__head" role="row">
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {rows.map((row, index) => (
        <div className="simple-table__row" key={`${row[0]}-${index}`} role="row">
          {row.map((cell, cellIndex) => (
            <span key={`${cell}-${cellIndex}`}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  )
}
