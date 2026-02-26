import { useState, useEffect } from 'react';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '@/utils/db';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const SettingsPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', cost: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const allProducts = await getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Errore caricamento prodotti:', error);
      toast.error('Errore nel caricamento dei prodotti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.cost) {
      toast.error('Compila tutti i campi');
      return;
    }

    const product = {
      id: uuidv4(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      cost: parseFloat(newProduct.cost)
    };

    try {
      await addProduct(product);
      toast.success('Prodotto aggiunto');
      setNewProduct({ name: '', price: '', cost: '' });
      loadProducts();
    } catch (error) {
      console.error('Errore aggiunta prodotto:', error);
      toast.error('Errore nell\'aggiunta del prodotto');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.cost) {
      toast.error('Compila tutti i campi');
      return;
    }

    const product = {
      ...editingProduct,
      price: parseFloat(editingProduct.price),
      cost: parseFloat(editingProduct.cost)
    };

    try {
      await updateProduct(product);
      toast.success('Prodotto aggiornato');
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Errore aggiornamento prodotto:', error);
      toast.error('Errore nell\'aggiornamento del prodotto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      return;
    }

    try {
      await deleteProduct(productId);
      toast.success('Prodotto eliminato');
      loadProducts();
    } catch (error) {
      console.error('Errore eliminazione prodotto:', error);
      toast.error('Errore nell\'eliminazione del prodotto');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-lg font-medium text-stone-600">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-2">
          Impostazioni
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-medium text-stone-600">
          Gestisci i tuoi prodotti e i loro prezzi
        </p>
      </div>

      {/* Add new product */}
      <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-extrabold text-stone-900 mb-4">Aggiungi Prodotto</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">Nome Prodotto</label>
            <input
              type="text"
              data-testid="new-product-name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
              placeholder="Es. Bicchiere"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">Prezzo (€)</label>
            <input
              type="number"
              data-testid="new-product-price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
              placeholder="10.00"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">Costo (€)</label>
            <input
              type="number"
              data-testid="new-product-cost"
              value={newProduct.cost}
              onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
              className="w-full px-4 py-3 border-2 border-stone-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
              placeholder="5.00"
              step="0.01"
            />
          </div>
        </div>
        <button
          data-testid="add-product-btn"
          onClick={handleAddProduct}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl border-2 border-stone-900 font-bold uppercase tracking-wide neo-button flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Aggiungi</span>
        </button>
      </div>

      {/* Products list */}
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold text-stone-900 mb-4">I Tuoi Prodotti</h2>
        
        {products.length === 0 ? (
          <div className="bg-white border-2 border-stone-900 rounded-2xl p-12 text-center">
            <p className="text-lg font-medium text-stone-600">Nessun prodotto configurato</p>
            <p className="text-sm text-stone-500 mt-2">Aggiungi il tuo primo prodotto sopra</p>
          </div>
        ) : (
          products.map(product => (
            <div
              key={product.id}
              data-testid={`product-item-${product.id}`}
              className="bg-white border-2 border-stone-900 rounded-2xl p-6"
            >
              {editingProduct?.id === product.id ? (
                // Edit mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Nome</label>
                      <input
                        type="text"
                        data-testid={`edit-product-name-${product.id}`}
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-stone-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Prezzo (€)</label>
                      <input
                        type="number"
                        data-testid={`edit-product-price-${product.id}`}
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-stone-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Costo (€)</label>
                      <input
                        type="number"
                        data-testid={`edit-product-cost-${product.id}`}
                        value={editingProduct.cost}
                        onChange={(e) => setEditingProduct({ ...editingProduct, cost: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-stone-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      data-testid={`save-product-${product.id}`}
                      onClick={handleUpdateProduct}
                      className="px-4 py-2 bg-green-100 rounded-xl border-2 border-stone-900 font-bold neo-button flex items-center gap-2"
                      style={{ backgroundColor: '#86EFAC' }}
                    >
                      <Save size={18} />
                      <span>Salva</span>
                    </button>
                    <button
                      data-testid={`cancel-edit-${product.id}`}
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 bg-stone-200 rounded-xl border-2 border-stone-900 font-bold neo-button flex items-center gap-2"
                    >
                      <X size={18} />
                      <span>Annulla</span>
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-extrabold text-stone-900 mb-1">{product.name}</h3>
                    <div className="flex gap-4 text-sm">
                      <span className="font-medium text-stone-700">
                        Prezzo: <span className="font-bold text-stone-900">€{product.price.toFixed(2)}</span>
                      </span>
                      <span className="font-medium text-stone-700">
                        Costo: <span className="font-bold text-stone-900">€{product.cost.toFixed(2)}</span>
                      </span>
                      <span className="font-medium text-stone-700">
                        Margine: <span className="font-bold text-green-600">€{(product.price - product.cost).toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      data-testid={`edit-product-${product.id}`}
                      onClick={() => setEditingProduct({ ...product })}
                      className="p-3 rounded-xl border-2 border-stone-900 bg-blue-100 hover:bg-blue-200 neo-button"
                      style={{ backgroundColor: '#BAE6FD' }}
                    >
                      <Edit2 size={18} className="text-stone-900" />
                    </button>
                    <button
                      data-testid={`delete-product-${product.id}`}
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-3 rounded-xl border-2 border-stone-900 bg-red-100 hover:bg-red-200 neo-button"
                      style={{ backgroundColor: '#FDA4AF' }}
                    >
                      <Trash2 size={18} className="text-stone-900" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SettingsPage;