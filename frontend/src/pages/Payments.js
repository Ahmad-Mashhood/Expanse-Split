import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { FiCheck } from 'react-icons/fi';

const Payments = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPendingPayments();
      setPendingPayments(response.data.payments || []);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load payments'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettlePayment = async (paymentId) => {
    try {
      await paymentService.settlePayment(paymentId);
      setAlert({ type: 'success', message: 'Payment settled successfully' });
      fetchPendingPayments();
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to settle payment'
      });
    }
  };

  return (
    <div className="min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Payments</h1>

        {alert && (
          <Alert 
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <Card>
          <h2 className="text-2xl font-bold mb-6">Pending Payments</h2>
          {loading ? (
            <p className="text-gray-600">Loading payments...</p>
          ) : pendingPayments.length === 0 ? (
            <p className="text-gray-600">No pending payments</p>
          ) : (
            <div className="space-y-4">
              {pendingPayments.map(payment => (
                <div 
                  key={payment._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold">
                      You owe {payment.amount}Rs to {payment.to?.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Group: {payment.group?.name}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleSettlePayment(payment._id)}
                    className="flex items-center gap-2"
                  >
                    <FiCheck /> Settle
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Payments;
