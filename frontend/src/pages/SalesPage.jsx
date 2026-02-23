import { useState, useEffect } from 'react';
import { Plus, Minus, Check, Calendar, MapPin } from 'lucide-react';
import { getAllProducts, addSale, getAllSales } from '@/utils/db';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [marketCost, setMarketCost] = useState(0);
  const [marketName, setMarketName] = useState(() => {
    return localStorage.getItem('lastMarketName') || '';
  });
  const [saleDate, setSaleDate] = useState(() => {
    return localStorage.getItem('lastSaleDate') || new Date().toISOString().split('T')[0];
  });
  const [suggestedMarkets, setSuggestedMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // When date changes, find markets already done on that date
    findMarketsForDate(saleDate);
  }, [saleDate]);

  const findMarketsForDate = async (date) => {
    try {
      const allSales = await getAllSales();
      const marketsOnDate = allSales
        .filter(sale => sale.date === date)
        .map(sale => sale.marketName)
        .filter((name, index, self) => name && self.indexOf(name) === index); // unique
      
      setSuggestedMarkets(marketsOnDate);
    } catch (error) {
      console.error('Errore ricerca mercati:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const allProducts = await getAllProducts();
      setProducts(allProducts);
      
      const initialCart = {};
      allProducts.forEach(product => {
        initialCart[product.id] = 0;
      });
      setCart(initialCart);
    } catch (error) {
      console.error('Errore caricamento prodotti:', error);
      toast.error('Errore nel caricamento dei prodotti');
    } finally {
      setLoading(false);
    }
  };

  const incrementProduct = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const decrementProduct = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1)
    }));
  };

  const calculateTotals = () => {
    let totalRevenue = 0;
    let totalCost = 0;

    Object.entries(cart).forEach(([productId, quantity]) => {
      if (quantity > 0) {
        const product = products.find(p => p.id === productId);
        if (product) {
          totalRevenue += product.price * quantity;
          totalCost += product.cost * quantity;
        }
      }
    });

    totalCost += marketCost;
    const profit = totalRevenue - totalCost;

    return { totalRevenue, totalCost, profit };
  };

  const handleCompleteSale = async () => {
    const items = Object.entries(cart)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return {
          productId,
          productName: product.name,
          quantity,
          priceAtSale: product.price,  // Salva il prezzo al momento della vendita
          costAtSale: product.cost      // Salva il costo al momento della vendita
        };
      });

    if (items.length === 0) {
      toast.error('Aggiungi almeno un prodotto alla vendita');
      return;
    }

    if (!marketName.trim()) {
      toast.error('Inserisci il nome del mercato');
      return;
    }

    const { totalRevenue, totalCost, profit } = calculateTotals();

    const sale = {
      id: uuidv4(),
      date: saleDate,
      timestamp: new Date(saleDate + 'T' + new Date().toTimeString().split(' ')[0]).toISOString(),
      marketName: marketName.trim(),
      items,
      marketCost,
      totalRevenue,
      totalCost,
      profit
    };

    try {
      await addSale(sale);
      
      // Salva data e nome mercato in localStorage per persistenza
      localStorage.setItem('lastMarketName', marketName.trim());
      localStorage.setItem('lastSaleDate', saleDate);
      
      toast.success('Vendita registrata con successo!', {
        description: `${format(new Date(saleDate), 'dd/MM/yyyy', { locale: it })} | Profitto: €${profit.toFixed(2)}`
      });
      
      // Reset solo il carrello e costo mercato, mantieni data e nome
      const resetCart = {};
      products.forEach(product => {
        resetCart[product.id] = 0;
      });
      setCart(resetCart);
      setMarketCost(0);
    } catch (error) {
      console.error('Errore salvataggio vendita:', error);
      toast.error('Errore nel salvataggio della vendita');
    }
  };

  const handleDateChange = (newDate) => {
    setSaleDate(newDate);
    localStorage.setItem('lastSaleDate', newDate);
  };

  const handleMarketNameChange = (newName) => {
    setMarketName(newName);
    localStorage.setItem('lastMarketName', newName);
  };

  const { totalRevenue, profit } = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-lg font-medium text-stone-600">Caricamento...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-extrabold text-stone-900 mb-4">Nessun prodotto configurato</h2>
          <p className="text-base text-stone-600 mb-6">
            Vai su Impostazioni per aggiungere i tuoi prodotti artigianali
          </p>
          <a
            href="/settings"
            data-testid="go-to-settings-btn"
            className="inline-block px-8 py-3 bg-stone-900 text-white rounded-xl border-2 border-stone-900 font-bold uppercase tracking-wide neo-button"
          >
            Vai alle Impostazioni
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-2">
          Nuova Vendita
        </h1>
        <p className="text-base md:text-lg font-medium text-stone-600">
          Aggiungi prodotti e completa la vendita
        </p>
      </div>

      {/* Date and Market Name */}
      <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="flex items-center gap-2 mb-2">
              <Calendar size={20} className="text-stone-900" />
              <span className="text-lg font-bold text-stone-900">Data Vendita</span>
            </label>
            <input
              type="date"
              data-testid="sale-date-input"
              value={saleDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>
          <div className="flex flex-col">
            <label className="flex items-center gap-2 mb-2">
              <MapPin size={20} className="text-stone-900" />
              <span className="text-lg font-bold text-stone-900">Nome Mercato</span>
            </label>
            <input
              type="text"
              data-testid="market-name-input"
              value={marketName}
              onChange={(e) => handleMarketNameChange(e.target.value)}
              list="market-suggestions"
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-stone-900"
              placeholder="Es. Mercato Porta Palazzo"
            />
            <datalist id="market-suggestions">
              {suggestedMarkets.map((name, idx) => (
                <option key={idx} value={name} />
              ))}
            </datalist>
            {suggestedMarkets.length > 0 && (
              <p className="text-xs text-stone-500 mt-2 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                Mercato già fatto in questa data: {suggestedMarkets.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {products.map(product => (
          <div
            key={product.id}
            data-testid={`product-card-${product.id}`}
            className="bg-white border-2 border-stone-900 rounded-2xl p-4 shadow-sm"
          >
            <div className="mb-3">
              <h3 className="text-xl font-extrabold text-stone-900">{product.name}</h3>
              <p className="text-sm font-bold uppercase tracking-widest opacity-60 text-stone-700">
                €{product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                data-testid={`decrement-${product.id}`}
                onClick={() => decrementProduct(product.id)}
                className="touch-target w-14 h-14 rounded-xl border-2 border-stone-900 neo-button bg-red-100 hover:bg-red-200 flex items-center justify-center"
                style={{ backgroundColor: '#FDA4AF' }}
              >
                <Minus size={24} strokeWidth={3} className="text-stone-900" />
              </button>

              <div className="flex-1 text-center">
                <span
                  data-testid={`quantity-${product.id}`}
                  className="text-3xl font-extrabold text-stone-900"
                >
                  {cart[product.id] || 0}
                </span>
              </div>

              <button
                data-testid={`increment-${product.id}`}
                onClick={() => incrementProduct(product.id)}
                className="touch-target w-14 h-14 rounded-xl border-2 border-stone-900 neo-button bg-green-100 hover:bg-green-200 flex items-center justify-center"
                style={{ backgroundColor: '#86EFAC' }}
              >
                <Plus size={24} strokeWidth={3} className="text-stone-900" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 mb-6">
        <label className="block mb-2">
          <span className="text-lg font-bold text-stone-900">Costo Mercato (€)</span>
          <p className="text-sm text-stone-600 mb-2">Costo totale del mercato (affitto banco, trasporto, ecc.)</p>
          <input
            type="number"
            data-testid="market-cost-input"
            value={marketCost}
            onChange={(e) => setMarketCost(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border-2 border-stone-900 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-stone-900"
            placeholder="0.00"
            step="0.01"
          />
        </label>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-stone-900 p-4 shadow-lg z-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest opacity-60 text-stone-700">
                Totale Vendita
              </p>
              <p data-testid="total-revenue" className="text-2xl font-extrabold text-stone-900">
                €{totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold uppercase tracking-widest opacity-60 text-stone-700">
                Profitto
              </p>
              <p
                data-testid="total-profit"
                className={`text-2xl font-extrabold ${
                  profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                €{profit.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            data-testid="complete-sale-btn"
            onClick={handleCompleteSale}
            className="w-full touch-target py-4 bg-stone-900 text-white rounded-xl border-2 border-stone-900 font-extrabold text-lg uppercase tracking-wide neo-button flex items-center justify-center gap-2"
          >
            <Check size={24} strokeWidth={3} />
            <span>FATTO</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;