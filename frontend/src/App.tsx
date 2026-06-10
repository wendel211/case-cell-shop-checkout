import { useState } from 'react'
import './App.css'
import { products as initialProducts } from './data/products'

function formatCurrency(valueInCents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInCents / 100)
}

type CheckoutResult = {
  message: string
  orderId: string
  productId: string
  quantity: number
  totalInCents: number
  remainingStock: number
}

function App() {
  const [products, setProducts] = useState(initialProducts)
  const [selectedProductId, setSelectedProductId] = useState(products[0].id)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResult | null>(null)

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? products[0]

  const totalInCents = selectedProduct.priceInCents * quantity
  const canDecrease = quantity > 1
  const canIncrease = quantity < selectedProduct.stock

  function handleSelectProduct(productId: string) {
    setSelectedProductId(productId)
    setQuantity(1)
  }

  async function handleCheckout() {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3333/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantity,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.message || 'Erro ao finalizar compra.')
        return
      }

      const result: CheckoutResult = await response.json()
      setCheckoutResult(result)

      setProducts((prev) =>
        prev.map((p) =>
          p.id === result.productId
            ? { ...p, stock: result.remainingStock }
            : p,
        ),
      )
      setQuantity(1)
    } catch {
      alert('Erro de conexão com o servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="app-shell">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">CaseCellShop</div>
        <ul className="navbar-links">
          <li><a href="#" className="active">Loja</a></li>
          <li><a href="#">Coleções</a></li>
          <li><a href="#">Suporte</a></li>
        </ul>
        <div className="navbar-icons">
          <button type="button" aria-label="Carrinho">
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
          <button type="button" aria-label="Perfil">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </nav>

      <section className="checkout-page" aria-labelledby="page-title">
        {/* Header */}
        <header className="intro animate-fade-up">
          <div>
            <h1 id="page-title">Compra de capinhas</h1>
            <p>
              Escolha o modelo, ajuste a quantidade e confirme a compra com
              as informações sempre visíveis.
            </p>
          </div>
          <span className="status-pill">Estoque validado</span>
        </header>

        <div className="checkout-grid">
          {/* Product List */}
          <section className="product-section animate-fade-up delay-1" aria-labelledby="products-title">
            <div className="section-heading">
              <h2 id="products-title">Produtos disponíveis</h2>
              <span>{products.length} modelos</span>
            </div>

            <div className="product-list">
              {products.map((product, index) => {
                const isSelected = product.id === selectedProductId

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`product-card animate-fade-up delay-${index + 1} ${isSelected ? 'selected' : ''}`}
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    type="button"
                  >
                    <span className="case-preview" aria-hidden="true" />

                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p>{product.model}</p>
                      <div className="stock-indicator">
                        <span className="stock-dot" />
                        {product.stock} em estoque
                      </div>
                    </div>

                    <dl>
                      <div>
                        <dt>Preço</dt>
                        <dd>{formatCurrency(product.priceInCents)}</dd>
                      </div>
                    </dl>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Order Summary */}
          <aside className="summary-section animate-fade-up delay-2" aria-labelledby="summary-title">
            <div className="section-heading">
              <h2 id="summary-title">Resumo do pedido</h2>
            </div>

            <div className="summary-product">
              <strong>{selectedProduct.name}</strong>
              <span>{selectedProduct.model}</span>
            </div>

            <div className="quantity-row">
              <div>
                <strong>Quantidade</strong>
                <span>Máximo: {selectedProduct.stock}</span>
              </div>

              <div className="stepper" aria-label="Controle de quantidade">
                <button
                  aria-label="Diminuir quantidade"
                  disabled={!canDecrease}
                  onClick={() => setQuantity((current) => current - 1)}
                  type="button"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  aria-label="Aumentar quantidade"
                  disabled={!canIncrease}
                  onClick={() => setQuantity((current) => current + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            <dl className="summary-totals">
              <div>
                <dt>Preço unitário</dt>
                <dd>{formatCurrency(selectedProduct.priceInCents)}</dd>
              </div>
              <div>
                <dt>Estoque após compra</dt>
                <dd>{selectedProduct.stock - quantity}</dd>
              </div>
              <div>
                <dt>Frete expresso</dt>
                <dd className="free-shipping">Grátis</dd>
              </div>
              <div className="total-row">
                <dt>Total</dt>
                <dd>{formatCurrency(totalInCents)}</dd>
              </div>
            </dl>

            <button
              className="checkout-button"
              type="button"
              onClick={handleCheckout}
              disabled={isLoading || selectedProduct.stock === 0}
            >
              {isLoading ? 'Processando...' : 'Finalizar compra'}
            </button>

            <div className="secure-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
              Pagamento 100% seguro
            </div>
          </aside>
        </div>
      </section>

      {/* Success Modal */}
      {checkoutResult && (
        <div className="toast-overlay" onClick={() => setCheckoutResult(null)}>
          <div className="toast-card" onClick={(e) => e.stopPropagation()}>
            <div className="toast-icon">✓</div>
            <h3>{checkoutResult.message}</h3>
            <p>Seu pedido foi registrado com sucesso.</p>

            <dl className="toast-details">
              <div>
                <dt>Pedido</dt>
                <dd>{checkoutResult.orderId}</dd>
              </div>
              <div>
                <dt>Produto</dt>
                <dd>{checkoutResult.productId}</dd>
              </div>
              <div>
                <dt>Quantidade</dt>
                <dd>{checkoutResult.quantity}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{formatCurrency(checkoutResult.totalInCents)}</dd>
              </div>
              <div>
                <dt>Estoque restante</dt>
                <dd>{checkoutResult.remainingStock}</dd>
              </div>
            </dl>

            <button
              className="toast-close"
              type="button"
              onClick={() => setCheckoutResult(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
