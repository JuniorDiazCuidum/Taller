import { ColorSelector, SizeSelector, GenSelector } from './components/SizeSelecetor'
import { ProductCarousel } from './components/ProductCarousel'
import { useState } from 'react'
import './App.css'

function App() {

  const [currentSize, setCurrentSize] = useState('none')
  const [currentColor, setCurrentColor] = useState('none')
  const [currentGen, setCurrentGen] = useState('none')

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
          <h2 className="options-title">Elige camiseta</h2>
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
        </div>

      </div>
    </div>
  )
}

export default App
