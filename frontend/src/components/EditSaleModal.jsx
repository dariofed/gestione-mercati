import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { toast } from 'sonner';

const EditSaleModal = ({ sale, onClose, onSave }) => {
  const [editedItems, setEditedItems] = useState([]);
  const [marketCost, setMarketCost] = useState(0);

  useEffect(() => {
    if (sale) {
      setEditedItems(sale.items.map(item => ({ ...item })));
      setMarketCost(sale.marketCost || 0);
    }
  }, [sale]);

  const updateItemQuantity = (index, quantity) => {
    const newItems = [...editedItems];
    newItems[index].quantity = Math.max(0, parseInt(quantity) || 0);
    setEditedItems(newItems);
  };

  const updateItemPrice = (index, price) => {
    const newItems = [...editedItems];
    newItems[index].priceAtSale = Math.max(0, parseFloat(price) || 0);
    setEditedItems(newItems);
  };

  const updateItemCost = (index, cost) => {
    const newItems = [...editedItems];
    newItems[index].costAtSale = Math.max(0, parseFloat(cost) || 0);
    setEditedItems(newItems);
  };

  const removeItem = (index) => {
    const newItems = editedItems.filter((_, i) => i !== index);
    setEditedItems(newItems);
  };

  const calculateTotals = () => {
    const totalRevenue = editedItems.reduce(
      (sum, item) => sum + (item.priceAtSale * item.quantity),
      0
    );
    const productCosts = editedItems.reduce(
      (sum, item) => sum + (item.costAtSale * item.quantity),
      0
    );
    const totalCost = productCosts + marketCost;
    const profit = totalRevenue - totalCost;
    return { totalRevenue, totalCost, profit };
  };

  const handleSave = () => {
    if (editedItems.length === 0) {
      toast.error('Deve esserci almeno un prodotto');
      return;
    }

    const totals = calculateTotals();
    const updatedSale = {
      ...sale,
      items: editedItems.filter(item => item.quantity > 0),
      marketCost,
      totalRevenue: totals.totalRevenue,
      totalCost: totals.totalCost,
      profit: totals.profit
    };

    onSave(updatedSale);
  };

  if (!sale) return null;

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border-2 border-stone-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-stone-900 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-stone-900">Modifica Vendita</h2>
          <button
            onClick={onClose}
            data-testid="close-edit-modal"
            className="p-2 hover:bg-stone-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-3">Prodotti</h3>
            {editedItems.map((item, index) => (
              <div
                key={index}
                className="border-2 border-stone-200 rounded-xl p-4 mb-3"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-stone-900">{item.productName}</span>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 text-sm underline"
                  >
                    Rimuovi
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Quantit&agrave;
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItemQuantity(index, e.target.value)}
                      className="w-full px-3 py-2 border-2 border-stone-900 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-900"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Prezzo (&euro;)
                    </label>
                    <input
                      type="number"
                      value={item.priceAtSale}
                      onChange={(e) => updateItemPrice(index, e.target.value)}
                      className="w-full px-3 py-2 border-2 border-stone-900 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-900"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Costo (&euro;)
                    </label>
                    <input
                      type="number"
                      value={item.costAtSale}
                      onChange={(e) => updateItemCost(index, e.target.value)}
                      className="w-full px-3 py-2 border-2 border-stone-900 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-900"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mt-2 text-right text-sm font-bold text-stone-900">
                  Totale riga: &euro;{(item.priceAtSale * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-lg font-bold text-stone-900 mb-2">
              Costo Mercato (&euro;)
            </label>
            <input
              type="number"
              value={marketCost}
              onChange={(e) => setMarketCost(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-stone-900"
              step="0.01"
              min="0"
            />
          </div>

          <div className="border-t-2 border-stone-900 pt-4 space-y-2">
            <div className="flex justify-between text-lg">
              <span className="font-bold text-stone-700">Incasso Totale:</span>
              <span className="font-extrabold text-stone-900">
                &euro;{totals.totalRevenue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-bold text-stone-700">Costi Totali:</span>
              <span className="font-extrabold text-stone-900">
                &euro;{totals.totalCost.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xl">
              <span className="font-bold text-stone-700">Profitto:</span>
              <span
                className={`font-extrabold ${
                  totals.profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                &euro;{totals.profit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t-2 border-stone-900 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-stone-200 text-stone-900 rounded-xl border-2 border-stone-900 font-bold uppercase tracking-wide neo-button"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            data-testid="save-edit-btn"
            className="flex-1 px-6 py-3 bg-stone-900 text-white rounded-xl border-2 border-stone-900 font-bold uppercase tracking-wide neo-button flex items-center justify-center gap-2"
          >
            <Save size={20} />
            <span>Salva</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSaleModal;
