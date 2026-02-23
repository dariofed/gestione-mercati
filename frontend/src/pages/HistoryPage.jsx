import { useState, useEffect } from 'react';
import { getAllSales, getAllProducts, updateSale, deleteSale } from '@/utils/db';
import { Download, Edit2, Trash2, Calendar, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { format, startOfYear, endOfYear, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import EditSaleModal from '@/components/EditSaleModal';

const HistoryPage = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingSale, setEditingSale] = useState(null);
  const [expandedMarkets, setExpandedMarkets] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allSales, allProducts] = await Promise.all([
        getAllSales(),
        getAllProducts()
      ]);
      setSales(allSales.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setProducts(allProducts);
    } catch (error) {
      console.error('Errore caricamento dati:', error);
      toast.error('Errore nel caricamento dei dati');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSales = () => {
    if (filterType === 'all') {
      return sales;
    }

    if (filterType === 'year') {
      const now = new Date();
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);
      return sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= yearStart && saleDate <= yearEnd;
      });
    }

    if (filterType === 'custom' && startDate && endDate) {
      return sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
      });
    }

    return sales;
  };

  const calculateTotals = (salesList) => {
    const totals = salesList.reduce(
      (acc, sale) => {
        acc.revenue += sale.totalRevenue;
        acc.cost += sale.totalCost;
        acc.profit += sale.profit;
        return acc;
      },
      { revenue: 0, cost: 0, profit: 0 }
    );
    return totals;
  };

  const getMonthlyStats = (salesList) => {
    const monthlyData = {};
    
    salesList.forEach(sale => {
      const monthKey = format(new Date(sale.date), 'yyyy-MM');
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: format(new Date(sale.date), 'MMMM yyyy', { locale: it }),
          revenue: 0,
          cost: 0,
          profit: 0,
          salesCount: 0
        };
      }
      
      monthlyData[monthKey].revenue += sale.totalRevenue;
      monthlyData[monthKey].cost += sale.totalCost;
      monthlyData[monthKey].profit += sale.profit;
      monthlyData[monthKey].salesCount += 1;
    });

    return Object.values(monthlyData).sort((a, b) => b.month.localeCompare(a.month));
  };

  const handleDeleteSale = async (saleId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa vendita?')) {
      return;
    }

    try {
      await deleteSale(saleId);
      toast.success('Vendita eliminata');
      loadData();
    } catch (error) {
      console.error('Errore eliminazione vendita:', error);
      toast.error('Errore nell\'eliminazione della vendita');
    }
  };

  const exportToPDF = () => {
    const filteredSales = getFilteredSales();
    
    if (filteredSales.length === 0) {
      toast.error('Nessuna vendita da esportare');
      return;
    }

    try {
      const doc = new jsPDF();
      const totals = calculateTotals(filteredSales);
      const monthlyStats = getMonthlyStats(filteredSales);

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Report Vendite Artigianato', 14, 20);

      // Period
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      let periodText = '';
      if (filterType === 'year') {
        periodText = `Anno: ${new Date().getFullYear()}`;
      } else if (filterType === 'custom' && startDate && endDate) {
        periodText = `Periodo: ${format(new Date(startDate), 'dd/MM/yyyy', { locale: it })} - ${format(new Date(endDate), 'dd/MM/yyyy', { locale: it })}`;
      } else {
        periodText = 'Tutte le vendite';
      }
      doc.text(periodText, 14, 28);
      doc.text(`Generato il: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: it })}`, 14, 34);

      // Monthly Statistics
      if (monthlyStats.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Statistiche Mensili', 14, 45);

        const monthlyTableData = monthlyStats.map(stat => [
          stat.month,
          stat.salesCount.toString(),
          `€${stat.revenue.toFixed(2)}`,
          `€${stat.cost.toFixed(2)}`,
          `€${stat.profit.toFixed(2)}`
        ]);

        autoTable(doc, {
          startY: 50,
          head: [['Mese', 'N. Vendite', 'Incasso', 'Costi', 'Profitto']],
          body: monthlyTableData,
          theme: 'striped',
          headStyles: { fillColor: [28, 25, 23], textColor: [255, 255, 255] },
          styles: { fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 25, halign: 'center' },
            2: { cellWidth: 30, halign: 'right' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' }
          }
        });
      }

      // Sales detail table
      const startY = monthlyStats.length > 0 ? doc.lastAutoTable.finalY + 15 : 45;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Dettaglio Vendite', 14, startY);

      const tableData = filteredSales.map(sale => {
        const itemsText = sale.items.map(item => {
          const product = products.find(p => p.id === item.productId);
          return `${product?.name || 'Prodotto'} x${item.quantity}`;
        }).join(', ');

        return [
          format(new Date(sale.date), 'dd/MM/yyyy', { locale: it }),
          sale.marketName || 'Mercato',
          itemsText,
          `€${sale.totalRevenue.toFixed(2)}`,
          `€${sale.totalCost.toFixed(2)}`,
          `€${sale.profit.toFixed(2)}`
        ];
      });

      autoTable(doc, {
        startY: startY + 5,
        head: [['Data', 'Mercato', 'Prodotti', 'Incasso', 'Costi', 'Profitto']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [28, 25, 23], textColor: [255, 255, 255] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 30 },
          2: { cellWidth: 60 },
          3: { cellWidth: 22, halign: 'right' },
          4: { cellWidth: 22, halign: 'right' },
          5: { cellWidth: 22, halign: 'right' }
        }
      });

      // Totals
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Riepilogo Totali', 14, finalY);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Incasso Totale: €${totals.revenue.toFixed(2)}`, 14, finalY + 8);
      doc.text(`Costi Totali: €${totals.cost.toFixed(2)}`, 14, finalY + 15);
      doc.setFont('helvetica', 'bold');
      doc.text(`Profitto Totale: €${totals.profit.toFixed(2)}`, 14, finalY + 22);

      // Save
      const fileName = `vendite_${filterType}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);
      toast.success('PDF scaricato con successo!');
    } catch (error) {
      console.error('Errore generazione PDF:', error);
      toast.error('Errore nella generazione del PDF: ' + error.message);
    }
  };

  const filteredSales = getFilteredSales();
  const totals = calculateTotals(filteredSales);
  const monthlyStats = getMonthlyStats(filteredSales);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-lg font-medium text-stone-600">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-2">
          Storico Vendite
        </h1>
        <p className="text-base md:text-lg font-medium text-stone-600">
          Visualizza e analizza le tue vendite
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-stone-900" />
          <h2 className="text-xl font-bold text-stone-900">Filtri</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <button
            data-testid="filter-all-btn"
            onClick={() => setFilterType('all')}
            className={
              `px-4 py-3 rounded-xl border-2 border-stone-900 font-bold uppercase tracking-wide neo-button ${
                filterType === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-900'
              }`
            }
          >
            Tutte
          </button>
          <button
            data-testid="filter-year-btn"
            onClick={() => setFilterType('year')}
            className={
              `px-4 py-3 rounded-xl border-2 border-stone-900 font-bold uppercase tracking-wide neo-button ${
                filterType === 'year'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-900'
              }`
            }
          >
            Anno {new Date().getFullYear()}
          </button>
          <button
            data-testid="filter-custom-btn"
            onClick={() => setFilterType('custom')}
            className={
              `px-4 py-3 rounded-xl border-2 border-stone-900 font-bold uppercase tracking-wide neo-button ${
                filterType === 'custom'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-900'
              }`
            }
          >
            Personalizzato
          </button>
        </div>

        {filterType === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">Data inizio</label>
              <input
                type="date"
                data-testid="start-date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-stone-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">Data fine</label>
              <input
                type="date"
                data-testid="end-date-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-stone-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border-2 border-stone-900 rounded-2xl p-6" style={{ backgroundColor: '#BAE6FD' }}>
          <p className="text-sm font-bold uppercase tracking-widest opacity-60 text-stone-700 mb-1">
            Incasso Totale
          </p>
          <p data-testid="total-revenue-display" className="text-3xl font-extrabold text-stone-900">
            €{totals.revenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white border-2 border-stone-900 rounded-2xl p-6" style={{ backgroundColor: '#FDA4AF' }}>
          <p className="text-sm font-bold uppercase tracking-widest opacity-60 text-stone-700 mb-1">
            Costi Totali
          </p>
          <p data-testid="total-cost-display" className="text-3xl font-extrabold text-stone-900">
            €{totals.cost.toFixed(2)}
          </p>
        </div>

        <div className="bg-white border-2 border-stone-900 rounded-2xl p-6" style={{ backgroundColor: '#86EFAC' }}>
          <p className="text-sm font-bold uppercase tracking-widest opacity-60 text-stone-700 mb-1">
            Profitto Totale
          </p>
          <p data-testid="total-profit-display" className="text-3xl font-extrabold text-stone-900">
            €{totals.profit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Monthly Statistics */}
      {monthlyStats.length > 0 && (
        <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-stone-900" />
            <h2 className="text-xl font-bold text-stone-900">Statistiche Mensili</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="monthly-stats-table">
              <thead>
                <tr className="border-b-2 border-stone-900">
                  <th className="text-left py-3 px-2 font-bold text-sm uppercase tracking-wide text-stone-900">Mese</th>
                  <th className="text-center py-3 px-2 font-bold text-sm uppercase tracking-wide text-stone-900">Vendite</th>
                  <th className="text-right py-3 px-2 font-bold text-sm uppercase tracking-wide text-stone-900">Incasso</th>
                  <th className="text-right py-3 px-2 font-bold text-sm uppercase tracking-wide text-stone-900">Costi</th>
                  <th className="text-right py-3 px-2 font-bold text-sm uppercase tracking-wide text-stone-900">Profitto</th>
                </tr>
              </thead>
              <tbody>
                {monthlyStats.map((stat, idx) => (
                  <tr key={idx} className="border-b border-stone-200">
                    <td className="py-3 px-2 font-medium text-stone-900">{stat.month}</td>
                    <td className="py-3 px-2 text-center font-bold text-stone-900">{stat.salesCount}</td>
                    <td className="py-3 px-2 text-right font-bold text-stone-900">€{stat.revenue.toFixed(2)}</td>
                    <td className="py-3 px-2 text-right font-bold text-stone-900">€{stat.cost.toFixed(2)}</td>
                    <td className={`py-3 px-2 text-right font-bold ${
                      stat.profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      €{stat.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export button */}
      <button
        data-testid="export-pdf-btn"
        onClick={exportToPDF}
        className="w-full md:w-auto px-8 py-3 bg-stone-900 text-white rounded-xl border-2 border-stone-900 font-bold uppercase tracking-wide neo-button flex items-center justify-center gap-2 mb-6"
      >
        <Download size={20} />
        <span>Scarica PDF</span>
      </button>

      {/* Sales list */}
      {filteredSales.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-stone-600">Nessuna vendita trovata</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSales.map(sale => (
            <div
              key={sale.id}
              data-testid={`sale-item-${sale.id}`}
              className="bg-white border-2 border-stone-900 rounded-2xl p-6 receipt-border"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-60 text-stone-700">
                    {format(new Date(sale.date), 'EEEE, dd MMMM yyyy', { locale: it })}
                  </p>
                  <p className="text-sm font-medium text-stone-600">
                    {sale.marketName || 'Mercato'}
                  </p>
                  <p className="text-xs text-stone-500">
                    {format(new Date(sale.timestamp), 'HH:mm', { locale: it })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    data-testid={`delete-sale-${sale.id}`}
                    onClick={() => handleDeleteSale(sale.id)}
                    className="p-2 rounded-lg border-2 border-stone-900 bg-red-100 hover:bg-red-200 neo-button"
                  >
                    <Trash2 size={18} className="text-stone-900" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {sale.items.map((item, idx) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="font-medium text-stone-700">
                        {product?.name || 'Prodotto'} x{item.quantity}
                      </span>
                      <span className="font-bold text-stone-900">
                        €{((product?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
                {sale.marketCost > 0 && (
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="font-medium text-stone-700">Costo Mercato</span>
                    <span className="font-bold text-red-600">-€{sale.marketCost.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-dashed border-stone-300 pt-4 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60 text-stone-700">
                    Incasso
                  </span>
                  <span className="text-lg font-bold text-stone-900">
                    €{sale.totalRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60 text-stone-700">
                    Costi
                  </span>
                  <span className="text-lg font-bold text-stone-900">
                    €{sale.totalCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60 text-stone-700">
                    Profitto
                  </span>
                  <span className={`text-xl font-extrabold ${
                    sale.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    €{sale.profit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;