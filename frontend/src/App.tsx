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
                  onClick={() => setSelectedProductId(product.id)}
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
      </section>
    </main>
  )
}

export default App
