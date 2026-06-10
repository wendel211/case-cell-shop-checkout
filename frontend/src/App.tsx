import { useState } from 'react'
import './App.css'
import { products } from './data/products'

function formatCurrency(valueInCents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInCents / 100)
}

function App() {
  const [selectedProductId, setSelectedProductId] = useState(products[0].id)
  const [quantity, setQuantity] = useState(1)

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? products[0]

  const totalInCents = selectedProduct.priceInCents * quantity
  const canDecrease = quantity > 1
  const canIncrease = quantity < selectedProduct.stock

  function handleSelectProduct(productId: string) {
    setSelectedProductId(productId)
    setQuantity(1)
  }

  return (
    <main className="app-shell">
      <section className="checkout-page" aria-labelledby="page-title">
        <header className="intro">
          <span className="eyebrow">CaseCellShop</span>
          <h1 id="page-title">Checkout de capinhas</h1>
          <p>
            Escolha uma capinha disponível e confira as informações principais
            antes de finalizar a compra.
          </p>
        </header>

        <div className="checkout-grid">
          <section className="product-section" aria-labelledby="products-title">
            <div className="section-heading">
              <h2 id="products-title">Produtos disponíveis</h2>
              <span>{products.length} modelos</span>
            </div>

            <div className="product-list">
              {products.map((product) => {
                const isSelected = product.id === selectedProductId

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`product-card ${isSelected ? 'selected' : ''}`}
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    type="button"
                  >
                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.model}</p>
                    </div>

                    <dl>
                      <div>
                        <dt>Preço</dt>
                        <dd>{formatCurrency(product.priceInCents)}</dd>
                      </div>
                      <div>
                        <dt>Estoque</dt>
                        <dd>{product.stock} unidades</dd>
                      </div>
                    </dl>
                  </button>
                )
              })}
            </div>
          </section>

          <aside className="summary-section" aria-labelledby="summary-title">
            <div className="section-heading">
              <h2 id="summary-title">Resumo</h2>
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
                  -
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
              <div className="total-row">
                <dt>Total</dt>
                <dd>{formatCurrency(totalInCents)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default App
