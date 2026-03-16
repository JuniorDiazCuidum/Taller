import { ColorSelector, SizeSelector, GenSelector } from './components/SizeSelecetor'
import { ProductCarousel } from './components/ProductCarousel'
import { useState, useEffect, useRef } from 'react'
import './App.css'

type CartItem = {
  id: string
  size: string
  color: string
  gen: string
  qty: number
  price: number
}

function App() {

  const [currentSize, setCurrentSize] = useState('none')
  const [currentColor, setCurrentColor] = useState('none')
  const [currentGen, setCurrentGen] = useState('none')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showAdContent, setShowAdContent] = useState(true)
  const [showAdMessage, setShowAdMessage] = useState(false)
  const adTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (adTimeoutRef.current) {
        window.clearTimeout(adTimeoutRef.current)
      }
    }
  }, [])

  const closeAd = () => {
    setShowAdContent(false)
    setShowAdMessage(true)
    if (adTimeoutRef.current) window.clearTimeout(adTimeoutRef.current)
    adTimeoutRef.current = window.setTimeout(() => {
      setShowAdMessage(false)
      setShowAdContent(true)
    }, 5000)
  }
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')

  return (
    <div className="page-wrapper">
      {/* ── Two-column grid ── */}
      <div className="product-layout">

        {/* LEFT — Carousel */}
        <div className="product-carousel-col">
          <ProductCarousel
            selectedSize={currentSize}
            selectedColor={currentColor}
            selectedGen={currentGen}
          />
        </div>

        {/* RIGHT — Options panel */}
        <div className="product-options-col">
          <div className="options-header">
            <h2 className="options-title">Elige camiseta</h2>
            <button
              className="cart-icon-btn"
              onClick={() => setShowCart(true)}
              aria-label="Abrir carrito"
            >
              <svg className="cart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 19a1 1 0 100 2 1 1 0 000-2zM8 19a1 1 0 100 2 1 1 0 000-2z" fill="currentColor"/>
              </svg>
              {cart.length > 0 && (
                <span className="cart-badge">{cart.reduce((s, i) => s + i.qty, 0)}</span>
              )}
            </button>
          </div>
          <p className="options-subtitle">Elige talla, color y género para ver cómo queda</p>

          <div className="selector-group">
            <span className="selector-label">Talla</span>
            <SizeSelector
              selectedSize={currentSize}
              onSizeChange={setCurrentSize}
            />
          </div>

          <div className="selector-group">
            <span className="selector-label">Color</span>
            <ColorSelector
              selectedSize={currentColor}
              onSizeChange={setCurrentColor}
            />
          </div>

          <div className="selector-group">
            <span className="selector-label">Para</span>
            <GenSelector
              selectedSize={currentGen}
              onSizeChange={setCurrentGen}
            />
          </div>

          <div style={{ width: '100%', marginTop: 8 }}>
            <button
              className="add-cart-btn"
              onClick={() => {
                const size = currentSize || 'none'
                const color = currentColor || 'none'
                const gen = currentGen || 'none'
                const unitPrice = 19.99

                // if same item exists, increment qty
                const idx = cart.findIndex(
                  (it) => it.size === size && it.color === color && it.gen === gen
                )

                if (idx >= 0) {
                  const updated = [...cart]
                  updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 }
                  setCart(updated)
                } else {
                  setCart((c) => [
                    ...c,
                    { id: Date.now().toString(), size, color, gen, qty: 1, price: unitPrice },
                  ])
                }

                setShowCart(true)
              }}
            >
              Añadir al carrito
            </button>
          </div>
        </div>

      </div>

      {/* Anuncio lateral fijo */}
      <div className="page-ad" role="complementary" aria-hidden={!(showAdContent || showAdMessage)}>
        <button className="ad-close-btn" onClick={closeAd} aria-label="Cerrar anuncio">✕</button>
        {showAdContent && (
          <div className="ad-content">
            <h4>Oferta especial</h4>
            <p>40% dto en camisetas seleccionadas</p>
            <button className="ad-cta">Ver oferta</button>
          </div>
        )}
        {showAdMessage && (
          <div className="ad-message">No se te mostrará más este anuncio</div>
        )}
      </div>

      {showCart && (
        <div className="cart-modal-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-modal-header">
              <h3>Tu carrito</h3>
              <button className="cart-close-btn" onClick={() => setShowCart(false)}>✕</button>
            </div>

            <div className="cart-modal-body">
              <div className="coupon-box">
                <h4>¿Tienes un cupón?</h4>
                <input
                  className="coupon-input"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Introduce código"
                />
                <div className="coupon-example">Ejemplo: <strong>PROMO10</strong></div>
                <button
                  className="apply-coupon-btn"
                  onClick={() => {
                    const code = coupon.trim().toUpperCase()
                    if (code === 'PROMO10' || code === 'PROMO20') {
                      setAppliedCoupon(code)
                    } else {
                      setAppliedCoupon('')
                    }
                  }}
                >Aplicar</button>
                {appliedCoupon && (
                  <div className="coupon-applied">Aplicado: {appliedCoupon}</div>
                )}
              </div>

              <div className="cart-items-wrap">
                {cart.length === 0 ? (
                  <p>El carrito está vacío</p>
                ) : (
                  <ul className="cart-items">
                    {cart.map((item) => (
                      <li className="cart-item" key={item.id}>
                        <div>
                          <div className="cart-item-title">Camiseta</div>
                          <div className="cart-item-meta">Talla: {item.size} · Color: {item.color} · Para: {item.gen}</div>
                        </div>
                        <div className="cart-item-actions">
                          <div className="cart-item-price">{(item.price).toFixed(2)}€</div>
                          <button
                            className="qty-btn"
                            onClick={() =>
                              setCart((c) =>
                                c
                                  .map((it) => (it.id === item.id ? { ...it, qty: it.qty - 1 } : it))
                                  .filter((it) => it.qty > 0)
                              )
                            }
                          >
                            -
                          </button>
                          <span className="qty">{item.qty}</span>
                          <button
                            className="qty-btn"
                            onClick={() => setCart((c) => c.map((it) => (it.id === item.id ? { ...it, qty: it.qty + 1 } : it)))}
                          >
                            +
                          </button>
                          <div className="cart-line-total">{(item.price * item.qty).toFixed(2)}€</div>
                          <button className="remove-btn" onClick={() => setCart((c) => c.filter((it) => it.id !== item.id))}>
                            Eliminar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>
                      {cart.reduce((s, it) => s + it.price * it.qty, 0).toFixed(2)}€
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Descuento</span>
                    <span>
                      {(() => {
                        const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0)
                        const pct = appliedCoupon === 'PROMO10' ? 0.1 : appliedCoupon === 'PROMO20' ? 0.2 : 0
                        return (subtotal * pct).toFixed(2) + '€'
                      })()}
                    </span>
                  </div>
                  <div className="summary-total">
                    <strong>Total</strong>
                    <strong>{(() => {
                      const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0)
                      const pct = appliedCoupon === 'PROMO10' ? 0.1 : appliedCoupon === 'PROMO20' ? 0.2 : 0
                      return (subtotal - subtotal * pct).toFixed(2) + '€'
                    })()}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="cart-modal-footer">
              <button className="btn-close" onClick={() => setShowCart(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
